/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Linking,
    NativeAppEventEmitter,
    Alert,
} from 'react-native';


import LoginPage from './loginPage'
import AddOrderPage from './addOrderPage'
import constants from  '../constants/constant';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

import {getDeviceID,getToken,getPhone,getRealName} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'

import ProgressView from '../components/modalProgress'
import ModalDialog from '../components/modalDialog'
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'
import { tabBarConfig } from '../constants/sharedConfig'

import UploadPage from '../pages/uploadPage'
import ImageZoomModal from '../components/ImageZoomModal'
import ShowPhotoView from '../components/showPhotoView'

import OrderPhotoPage from './orderPhotoPage'

class OrderDetail extends Component {
    // 构造
    constructor(props) {
        super(props);

        // 初始状态
        this.state = {
            showProgress: true,//显示加载
            showReload: false,//显示加载更多
            showDialog: false,//显示确认框

            id: this.props.id, //委托单id
            service_no: '',// 委托单号

            order_status_name: '',// 订单状态

            create_time_str: '',// 发布时间

            remark: '',// 备注

            trade_terms: '',// 贸易条款

            departure_name: '',// 起运国

            destination_name: '',// 目的国

            import_clearance: '',// 进口清关,0否，1是

            international_logistics: '',// 国际物流,0否，1是

            export_country_land: '',// 出口国陆运,0否，1是

            booking_service_name: '',// 订舱服务,0海运，1空运

            domestic_logistics: '',// 国内物流,0否，1是

            credit_letter: '',// 信用证,0否，1是

            client_name: '',// 委托人名称

            client_phone: '',// 委托人电话

            order_status: '',// 订单状态 值

            commission_content: '',//委托内容

            cash: 0,// 现金 ,0否，1是
            trans: 0,// 转账 ,0否，1是
            aliPay: 0,// 支付宝 ,0否，1是
            receiving_address: '',// 收货地址

            photoList: [],
        };
        this.firstFetch = true;
    }


    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                //console.log(`OrderDetail willfocus...`)
                //console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (currentRoute === event.data.route) {
                    //console.log("OrderDetail willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    //console.log("OrderDetail willDisappear, other willAppear")
                }
                //
            })
        )
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('didfocus', (event) => {
                //console.log(`payPage didfocus...`)
                if (event && currentRoute === event.data.route) {
                    //console.log("upload didAppear")

                    if (this.firstFetch) {
                        this._fetchData()
                        this.firstFetch = false;
                    }
                } else {
                    //console.log("orderPage willDisappear, other willAppear")
                }


            })
        )

    }


    render() {
        let payText = ''
        if (this.state.cash == 1 && this.state.trans == 0 && this.state.aliPay == 0) {
            payText = '现金'
        } else if (this.state.cash == 0 && this.state.trans == 1 && this.state.aliPay == 0) {
            payText = '转账'
        } else if (this.state.cash == 0 && this.state.trans == 0 && this.state.aliPay == 1) {
            payText = '支付宝'
        }

        return (
            <View style={{flex:1}}>

                {this.state.showProgress || this.state.showReload ?
                    <ProgressView
                        showProgress={this.state.showProgress}
                        showReload={this.state.showReload}
                        fetchData={()=>{
                        this.setState({
                        showProgress:true,//显示加载
                        showReload:false,//显示加载更多
                         })
                        this._fetchData()
                        }}/> :
                    <ScrollView style={styles.container}
                                showsVerticalScrollIndicator={false}>
                        <View style={[{marginTop:10,flexDirection:'row',alignItems:'center',
                        paddingLeft:constants.MarginLeftRight,backgroundColor:'white'}]}>
                            <Icon
                                name={'ios-globe'}
                                size={constants.IconSize}
                                color={constants.UIActiveColor}
                            />
                            <View style={[styles.viewItem,{flexDirection:'column'}]}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={[{flex:1},styles.labelText]}>订单{this.state.order_status_name}</Text>
                                    <Text
                                        style={[{flex:1,textAlign:'right',paddingRight:constants.MarginLeftRight,},
                                    styles.contentText,{fontSize:12,}]}>{this.state.create_time_str}</Text>
                                </View>
                                <View style={{flexDirection:'row',marginTop:5,}}>
                                    <Text
                                        style={[styles.contentText,{flex:1,paddingLeft:0,fontSize:12,},]}>{this.state.service_no}</Text>
                                </View>
                                {this.state.order_status == 40 ?
                                    <View style={{flexDirection:'row',marginTop:5,}}>
                                        <Text
                                            style={[{flex:1,paddingLeft:0,fontSize:12,color:constants.UIActiveColor},]}>请按分类补充材料</Text>
                                    </View> : null
                                }
                            </View>
                        </View>

                        <View style={[{flex:1,flexDirection:'row',backgroundColor:'white',},]}>
                            {this.state.order_status == 30 ?
                                <TouchableOpacity
                                    style={[styles.line,{justifyContent:'center',alignItems:'center',paddingTop:10,paddingBottom:10,},
                                {flex:1}]}
                                    onPress={()=>{
                            //修改订单
                             if(this.state.order_status_name){
                             this.props.navigator.push({
                                                title: '修改委托',
                                                component: AddOrderPage,
                                                passProps:this.state,
                                            })
                                } }}>
                                    <Text style={{color:constants.UIActiveColor,fontSize:12,}}>修改</Text>

                                </TouchableOpacity> : null
                            }

                            {this.state.order_status == 0 || this.state.order_status == 30 ?
                                <TouchableOpacity
                                    style={[styles.line,{justifyContent:'center',alignItems:'center',paddingTop:10,paddingBottom:10,},
                                        {flex:1}]}
                                    onPress={ ()=>{
                                //弹窗取消订单
                                //this.setState({showDialog:true,})
                                Alert.alert('温馨提醒','确定取消订单吗?',[
                                 {text:'确定',onPress:()=>this._fetchData_cancel()},
                                {text:'取消',onPress:()=>{}},

                                ])
                                } }>
                                    <Text style={{color:constants.UIActiveColor,fontSize:12,}}>取消</Text>
                                </TouchableOpacity> : null
                            }
                            {this.state.order_status == 40 || this.state.order_status == 30 ?
                                <TouchableOpacity
                                    style={[styles.line,{justifyContent:'center',alignItems:'center',paddingTop:10,paddingBottom:10,},
                                        {flex:1}]}
                                    onPress={ ()=>this._fetchReCommission()}
                                >
                                    <Text style={{color:constants.UIActiveColor,fontSize:12,}}>重新委托</Text>
                                </TouchableOpacity> : null
                            }
                            <TouchableOpacity
                                style={[styles.line,{flex:1,justifyContent:'center',alignItems:'center',paddingTop:10,paddingBottom:10,}]}
                                onPress={ ()=>{
                                        //打电话
                                        return Linking.openURL(constants.Tel);
                                 } }>
                                <Text style={{color:constants.UIActiveColor,fontSize:12,}}>联系客服</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={[styles.contentText,{paddingTop:5,paddingBottom:5,fontSize:12}]}>订单详情</Text>


                        <View style={styles.viewItem}>
                            <Text style={[{flex:1},styles.labelText]}>贸易条款</Text>
                            <Text style={[{flex:4},styles.contentText]}>{this.state.trade_terms}</Text>
                        </View>

                        <View style={styles.viewItem}>
                            <Text style={[{flex:1},styles.labelText]}>委托人</Text>
                            <Text style={[{flex:4},styles.contentText]}>{this.state.client_name}</Text>
                        </View>


                        <View style={styles.viewItem}>
                            <Text style={[{flex:1},styles.labelText]}>联系方式</Text>
                            <Text style={[{flex:4},styles.contentText]}>{this.state.client_phone}</Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text style={[{flex:1},styles.labelText]}>收货地址</Text>
                            <Text style={[{flex:4},styles.contentText]}>{this.state.receiving_address}</Text>
                        </View>

                        <View style={styles.viewItem}>
                            <Text style={[{flex:1},styles.labelText]}>出发国家</Text>
                            <Text style={[{flex:4},styles.contentText]}>{this.state.departure_name}</Text>
                        </View>

                        <View style={styles.viewItem}>
                            <Text style={[{flex:1},styles.labelText]}>目的国家</Text>
                            <Text style={[{flex:4},styles.contentText]}>{this.state.destination_name}</Text>
                        </View>
                        {this.state.order_status != 40 ?
                            <View
                                style={{flex:1}}>
                                <Text
                                    style={[styles.labelText,{marginLeft:constants.MarginLeftRight,paddingTop:5,paddingBottom:5,}]}>上传资料</Text>

                                <ShowPhotoView
                                    style={{flex:1,backgroundColor:'white',
                                    paddingLeft:constants.MarginLeftRight,paddingRight:constants.MarginLeftRight,}}
                                    navigator={this.props.navigator}
                                    photoList={this.state.photoList}
                                    showPhoto={this._ImageZoomModal.ShowPhoto}
                                    UploadPage={UploadPage}
                                    showUpload={false}
                                />
                            </View> : this.state.photoList.map((item, index) => {
                            return (

                                <View
                                    key={`photoLis_${index}`}
                                    style={{flex:1,flexDirection:'column', overflow: 'hidden',}}>
                                    <Text
                                        style={[styles.contentText,{paddingTop:5,paddingBottom:5,fontSize:12}]}>{item.title}</Text>
                                    <ShowPhotoView
                                        style={{flex:1,backgroundColor:'white',
                                                paddingLeft:constants.MarginLeftRight,paddingRight:constants.MarginLeftRight,}}
                                        navigator={this.props.navigator}
                                        photoList={item.list}
                                        UploadPage={UploadPage}
                                    />
                                </View> )
                        })
                        }
                        {this.state.order_status == 40 ?
                            <View style={[{flex:1,flexDirection:'row',backgroundColor:'white',},]}>
                                <TouchableOpacity
                                    style={[styles.line,{justifyContent:'center',alignItems:'center',
                                    paddingTop:10,paddingBottom:10,},{flex:1}]}
                                    onPress={()=>{
                                    //this.props.navigator.push({
                                    //            title: '上传资料',
                                    //            component: UploadPage,
                                    //            passProps: {
                                    //                id:service_id,
                                    //            }
                                    //        });

                                    /* this.props.navigator.push({
                                                title: '委托单资料',
                                                component: OrderPhotoPage,
                                                passProps: {
                                                    id:this.state.id,
                                                    type:'order'
                                                }
                                            });*/
                                            this._fetch_photoList_finish()
                                    } }
                                >
                                    <Text style={{color:constants.UIActiveColor,fontSize:12,}}>保存上传</Text>

                                </TouchableOpacity>
                            </View>:null
                        }
                        <Text
                            style={[styles.contentText,{paddingTop:5,paddingBottom:5,fontSize:12}]}>支付</Text>

                        <View style={styles.viewItem}>
                            <Text style={[{flex:1},styles.labelText]}>支付方式</Text>

                            <Text
                                style={[{flex:4},styles.contentText]}>{payText}</Text>
                        </View>

                        <Text
                            style={[styles.contentText,{paddingTop:5,paddingBottom:5,fontSize:12}]}>货代服务</Text>


                        <View style={[styles.viewItem,{flex:1, flexDirection: 'row',
                                   justifyContent: 'flex-start',
                                   alignItems: 'center',
                                   paddingLeft: constants.MarginLeftRight,
                                   backgroundColor:'white',},]}>
                            <View style={{flex:1}}>
                                <Text style={[{flex:1},styles.labelText]}>服务内容</Text>
                            </View>
                            <View style={{flex:4,marginRight:constants.MarginLeftRight}}>
                                <Text style={[{flex:1},styles.contentText,]}>
                                    {this.state.import_clearance == 1 ? '进口清关、' : ``}
                                    {this.state.international_logistics == 1 ? '国际物流、' : ``}
                                    {this.state.export_country_land == 1 ? '出口国陆运、' : ``}
                                    {this.state.booking_service_name == 0 ? '订舱服务海运、' : ``}
                                    {this.state.domestic_logistics == 1 ? '国内物流、' : ``}
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={[styles.contentText,{paddingTop:5,paddingBottom:5,fontSize:12}]}>委托内容</Text>

                        <View style={[styles.viewItem,{flex:1,}]}>
                            <Text style={[{height:100},styles.contentText,{paddingLeft:0}]}
                                  multiline={true}//多行输入
                                  numberOfLines={8}>
                                {this.state.commission_content}
                            </Text>
                        </View>

                        {this.state.order_status == 30 ?
                            <Text
                                style={[styles.contentText,{
                            paddingTop:5,paddingBottom:5,fontSize:12},
                            ]}>拒绝原因</Text> : null
                        }
                        {this.state.order_status == 30 ?
                            <View style={[styles.viewItem,{flex:1}]}>
                                <Text style={[{height:100},styles.contentText,{paddingLeft:0}]}
                                      multiline={true}//多行输入
                                      numberOfLines={8}>
                                    {this.state.remark}
                                </Text>

                            </View> : null
                        }

                    </ScrollView>
                }
                <ImageZoomModal
                    ref={ component => this._ImageZoomModal = component }
                />
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>
                </Toast>
                <LoadingSpinnerOverlay
                    ref={ component => this._modalLoadingSpinnerOverLay = component }/>

            </View>
        );

    }


    async _fetchData() {
        if (!this.firstFetch) {
            this._modalLoadingSpinnerOverLay.show()
        }
        try {

            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.showCommissionOrderDetail,
                    id: this.state.id,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)

            //console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log('gunZip:', result)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            if (result.code && result.code == -54) {
                /**
                 * 发送事件去登录
                 */
                AsyncStorage.removeItem('token')
                AsyncStorage.removeItem('realName')
                this.props.navigator.push({
                    title: '用户登录',
                    component: LoginPage,
                })

                this.setState({
                    showProgress: false,//显示加载
                    showReload: true,//显示加载更多
                })
                return;
            }
            if (result.code && result.code == 10) {

                this.setState(
                    {
                        showProgress: false,//显示加载
                        showReload: false,//显示加载更多

                        service_no: result.result.commissionOrder.service_no,// 委托单号

                        order_status_name: result.result.commissionOrder.order_status_name,// 订单状态

                        create_time_str: result.result.commissionOrder.create_time_str,// 发布时间

                        remark: result.result.commissionOrder.remark,// 备注

                        trade_terms: result.result.commissionOrder.trade_terms,// 贸易条款

                        departure_name: result.result.commissionOrder.departure_name,// 起运国

                        destination_name: result.result.commissionOrder.destination_name,// 目的国

                        import_clearance: result.result.commissionOrder.import_clearance,// 进口清关,0否，1是

                        international_logistics: result.result.commissionOrder.international_logistics,// 国际物流,0否，1是

                        export_country_land: result.result.commissionOrder.export_country_land,// 出口国陆运,0否，1是

                        booking_service_name: result.result.commissionOrder.booking_service_name,// 订舱服务,0海运，1空运

                        domestic_logistics: result.result.commissionOrder.domestic_logistics,// 国内物流,0否，1是

                        credit_letter: result.result.commissionOrder.credit_letter,// 信用证,0否，1是

                        client_name: result.result.commissionOrder.client_name,// 委托人名称

                        client_phone: result.result.commissionOrder.client_phone,// 委托人电话

                        order_status: result.result.commissionOrder.order_status,// 订单状态 值
                        commission_content: result.result.commissionOrder.commission_content,//委托内容
                        cash: result.result.commissionOrder.cash,// 现金 ,0否，1是
                        trans: result.result.commissionOrder.trans,// 转账 ,0否，1是
                        aliPay: result.result.commissionOrder.aliPay,// 支付宝 ,0否，1是
                        receiving_address: result.result.commissionOrder.receiving_address,// 收货地址
                        photoList: result.result.list //相关照片
                    }
                )
                if (result.result.commissionOrder.order_status == 40) {
                    this._fetchData_photoList()
                }

            } else {

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })

                this.setState({
                    showProgress: false,//显示加载
                    showReload: true,//显示加载更多
                })

            }


        }
        catch (error) {
            //console.log(`error:`, error)
            if (this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }
            this.setState({
                showProgress: false,//显示加载
                showReload: true,//显示加载更多
            })
        }
        finally {
            if (!this.firstFetch && this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide()
            }
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }


    async _fetchReCommission() {
        if (!this.firstFetch) {
            this._modalLoadingSpinnerOverLay.show()
        }
        try {

            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.commissionOrder_reCommission,
                    id: this.state.id,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)

            //console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log('gunZip:', result)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            if (result.code && result.code == -54) {
                if (!this.firstFetch && this._modalLoadingSpinnerOverLay) {
                    this._modalLoadingSpinnerOverLay.hide({duration: 0,})
                }
                /**
                 * 发送事件去登录
                 */
                AsyncStorage.removeItem('token')
                AsyncStorage.removeItem('realName')
                this.props.navigator.push({
                    title: '用户登录',
                    component: LoginPage,
                })
                return;
            }
            if (result.code && result.code == 10) {
                Alert.alert('温馨提醒', '已重新委托', [
                    {
                        text: '确定', onPress: ()=> {
                        if (!this.firstFetch && this._modalLoadingSpinnerOverLay) {
                            this._modalLoadingSpinnerOverLay.hide({duration: 0,})
                        }
                        //修改订单状态
                        NativeAppEventEmitter.emit('orderDetail_hasReCommision_should_resetState', this.state.id)

                        this.props.navigator.pop()
                    }
                    },])


            } else {
                if (!this.firstFetch && this._modalLoadingSpinnerOverLay) {
                    this._modalLoadingSpinnerOverLay.hide({duration: 0,})
                }

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })

            }


        }
        catch (error) {
            //console.log(`error:`, error)
            if (!this.firstFetch && this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }

            if (this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }

        }
        finally {

            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }


    async _fetchData_cancel() {
        if (this._modalLoadingSpinnerOverLay) {
            this._modalLoadingSpinnerOverLay.show()
        }
        try {

            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.cancelCommissionOrder,
                    id: this.props.id,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)

            //console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log('gunZip:', result)

            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            if (result.code && result.code == -54) {
                if (this._modalLoadingSpinnerOverLay) {
                    this._modalLoadingSpinnerOverLay.hide({duration: 0,})
                }
                /**
                 * 发送事件去登录
                 */
                AsyncStorage.removeItem('token')
                AsyncStorage.removeItem('realName')
                this.props.navigator.push({
                    title: '用户登录',
                    component: LoginPage,
                })
                return;
            }
            if (result.code && result.code == 10) {
                Alert.alert('温馨提醒', '订单已取消', [
                    {
                        text: '确定', onPress: ()=> {
                        //修改订单状态
                        if (this._modalLoadingSpinnerOverLay) {
                            this._modalLoadingSpinnerOverLay.hide({duration: 0,})
                        }
                        NativeAppEventEmitter.emit('orderDetail_hasCancel_should_resetState', this.state.id)

                        this.props.navigator.pop()
                    }
                    },])

            } else {
                if (this._modalLoadingSpinnerOverLay) {
                    this._modalLoadingSpinnerOverLay.hide({duration: 0,})
                }
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            //console.log(error)
            if (this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }

            if (this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
        }

        finally {

            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)

        }
    }


    async _fetchData_photoList() {
        //console.log(`fetchData_photoList`)
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()

            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.commissionOrder_missFileShow,
                    id: this.props.id,
                    deviceId: deviceID,
                    token: token,
                }
            }
            //console.log(`_fetchData options:`, options)
            options.data = await this.gZip(options)


            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log('gunZip:', result)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            if (result.code && result.code == 10) {

                //console.log('result_result:', result.result)

                //let photoList = this.state.photoList
                let photoList = []
                if(constants.development) {
                    for (let data of result.result) {
                        //console.log('data:', data)
                        let flag = true;
                        for (let item of photoList) {
                            //console.log('item:', item)

                            if (item.file_type_id == data.file_type_id) {
                                //console.log('break:', photoList)
                                item.list.push({
                                    ...data,
                                    isStored: true,
                                    uploaded: true,
                                    uploading: false,
                                })
                                flag = false;
                                break;
                            }

                            flag = true;
                        }

                        if (flag) {

                            if (data.id) {
                                photoList.push({
                                    file_type_id: data.file_type_id,
                                    title: data.file_type_name,
                                    list: [{
                                        ...data,
                                        isStored: true,
                                        uploaded: true,
                                        uploading: false,
                                    }]
                                })
                            } else {
                                photoList.push({
                                    file_type_id: data.file_type_id,
                                    title: data.file_type_name,
                                    list: []
                                })
                            }

                        }

                    }
                }else{
                    for (let data of result.result) {
                        let list=[]
                        for(let item of data.nCommisonFileVoList){
                            list.push({
                                ...item,
                                isStored: true,
                                uploaded: true,
                                uploading: false,
                            })
                        }
                        photoList.push({
                            file_type_id: data.file_type_id,
                            title: data.file_type_name,
                            list: list
                        })

                    }
                }
                //console.log(`photoList:`,photoList)

                this.setState({
                    photoList: photoList,
                })


            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            //console.log(error)
            if (this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }
        }
        finally {
            this.setState({
                showProgress: false,//显示加载
                showReload: false,//显示再次加载
            })
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

    async _fetch_photoList_finish() {

        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let ids = [];

                //委托单
                for (let data of this.state.photoList) {
                    //console.log('data:', data)
                    let fileIds = '';
                    for (let item of data.list) {
                        fileIds += item.id + ','
                    }
                    ids.push({
                        file_type_id: data.file_type_id,
                        file_ids: fileIds
                    })

                }

            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.commissionOrder_missFileSave,
                    list: ids,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)


            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log('gunZip:', result)
            if (this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            if (result.code && result.code == 10) {

                //console.log('token', result.result)
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '保存成功'
                })



            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            //console.log(error)
            if (this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }


        }
        finally {
            if (this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
    },
    viewItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: constants.MarginLeftRight,
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 10,
    },
    line: {
        //marginLeft: constants.MarginLeftRight,
        //marginRight: constants.MarginLeftRight,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.LineColor,
    },
    labelText: {
        fontSize: 14,
        color: constants.LabelColor,
    },
    contentText: {
        fontSize: 14,
        color: constants.PointColor,
        paddingLeft: constants.MarginLeftRight,
    },

});

import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar
};

//const navigationBarRouteMapper = {
//
//    LeftButton: function (route, navigator, index, navState) {
//        if (index === 0) {
//            return null;
//        }
//
//        var previousRoute = navState.routeStack[index - 1];
//        return (
//            <TouchableOpacity
//                onPress={() => navigator.pop()}
//                style={navigatorStyle.navBarLeftButton}>
//                <View style={navigatorStyle.navBarLeftButtonAndroid}>
//                    <Icon
//                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
//                        name={'ios-arrow-back'}
//                        size={constants.IconSize}
//                        color={'white'}/>
//                </View>
//            </TouchableOpacity>
//
//        );
//    },
//
//    RightButton: function (route, navigator, index, navState) {
//
//    },
//
//    Title: function (route, navigator, index, navState) {
//        let routeTitle = route.title
//        if (routeTitle == '首页') {
//            routeTitle = tabBarConfig.selectedTab
//        }
//        return (
//            Platform.OS == 'ios' ?
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    {routeTitle}
//                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    {routeTitle}
//                </Text>
//            </View>
//        )
//    },
//
//}

export default AppEventListenerEnhance(XhrEnhance(OrderDetail))