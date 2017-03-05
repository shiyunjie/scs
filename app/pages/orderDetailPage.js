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
                    console.log("upload didAppear")

                    if (this.firstFetch) {
                        this._fetchData()
                        this.firstFetch = false;
                    }
                }else {
                    //console.log("orderPage willDisappear, other willAppear")
                }


            })
        )

    }




    render() {
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
                            </View>
                        </View>

                        <View style={[{flex:1,flexDirection:'row',backgroundColor:'white',},]}>
                            <TouchableOpacity
                                style={[styles.line,{justifyContent:'center',alignItems:'center',paddingTop:10,paddingBottom:10,},
                            this.state.order_status==30?{flex:1}:{width:0,}]}
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

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.line,{justifyContent:'center',alignItems:'center',paddingTop:10,paddingBottom:10,},
                                        (this.state.order_status==0||this.state.order_status==30)?{flex:1,}:{width:0,height:0,}]}
                                onPress={ ()=>{
                                //弹窗取消订单
                                //this.setState({showDialog:true,})
                                Alert.alert('温馨提醒','确定取消订单吗?',[
                                 {text:'确定',onPress:()=>this._fetchData_cancel()},
                                {text:'取消',onPress:()=>{}},

                                ])
                                } }>
                                <Text style={{color:constants.UIActiveColor,fontSize:12,}}>取消</Text>
                            </TouchableOpacity>
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
                            <Text style={[{flex:1},styles.labelText]}>出发国家</Text>
                            <Text style={[{flex:4},styles.contentText]}>{this.state.departure_name}</Text>
                        </View>

                        <View style={styles.viewItem}>
                            <Text style={[{flex:1},styles.labelText]}>目的国家</Text>
                            <Text style={[{flex:4},styles.contentText]}>{this.state.destination_name}</Text>
                        </View>

                        <Text
                            style={[styles.contentText,{paddingTop:5,paddingBottom:5,fontSize:12}]}>贸易支付</Text>

                        <View style={styles.viewItem}>
                            <Text style={[{flex:1},styles.labelText]}>支付方式</Text>
                            <Text
                                style={[{flex:4},styles.contentText]}>{this.state.credit_letter == 1 ? '信用证' : ``}</Text>
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
                                <Text style={[{flex:1},styles.contentText]}>
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
                            <Text style={[{height:100},styles.contentText]}
                                  multiline={true}//多行输入
                                  numberOfLines={8}>
                                {this.state.commission_content}
                            </Text>
                        </View>

                        {this.state.order_status == 30 ?
                            <Text
                                style={[styles.contentText,{
                            paddingTop:5,paddingBottom:5,fontSize:12},
                            ]}>拒绝原因</Text>:null
                        }
                        {this.state.order_status == 30 ?
                            <View style={[styles.viewItem,{flex:1}]}>
                                <Text style={[{height:100},styles.contentText]}
                                      multiline={true}//多行输入
                                      numberOfLines={8}>
                                    {this.state.remark}
                                </Text>

                            </View>:null
                        }

                    </ScrollView>
                }

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
            if(!result){
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
            }
            if (result.code && result.code == 10) {

                this.setState(
                    {
                        showProgress: false,//显示加载
                        showReload: false,//显示加载更多

                        service_no: result.result.service_no,// 委托单号

                        order_status_name: result.result.order_status_name,// 订单状态

                        create_time_str: result.result.create_time_str,// 发布时间

                        remark: result.result.remark,// 备注

                        trade_terms: result.result.trade_terms,// 贸易条款

                        departure_name: result.result.departure_name,// 起运国

                        destination_name: result.result.destination_name,// 目的国

                        import_clearance: result.result.import_clearance,// 进口清关,0否，1是

                        international_logistics: result.result.international_logistics,// 国际物流,0否，1是

                        export_country_land: result.result.export_country_land,// 出口国陆运,0否，1是

                        booking_service_name: result.result.booking_service_name,// 订舱服务,0海运，1空运

                        domestic_logistics: result.result.domestic_logistics,// 国内物流,0否，1是

                        credit_letter: result.result.credit_letter,// 信用证,0否，1是

                        client_name: result.result.client_name,// 委托人名称

                        client_phone: result.result.client_phone,// 委托人电话

                        order_status: result.result.order_status,// 订单状态 值
                        commission_content: result.result.commission_content,//委托内容
                    }
                )

            } else {

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })

            }


        }
        catch (error) {
            //console.log(`error:`, error)
            if(this._toast) {
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

            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

    async _fetchData_cancel() {
        if(this._modalLoadingSpinnerOverLay) {
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
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            if(!result){
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
            }
            if (result.code && result.code == 10) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '取消订单成功'
                })

                setTimeout(()=>{
                    //修改订单状态
                    NativeAppEventEmitter.emit('orderDetail_hasCancel_should_resetState', this.state.id)
                    this.props.navigator.pop()

                },1000)

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
            if(this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }
        }
        finally {
            if(this._modalLoadingSpinnerOverLay) {
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