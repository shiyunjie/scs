/**
 * Created by shiyunjie on 16/12/30.
 */
/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
    BackAndroid,
    NativeAppEventEmitter,
    DeviceEventEmitter,
    KeyboardAvoidingView,
} from 'react-native';
/**
 * md-checkmark-circle
 *
 ios-radio-button-off

 'ios-arrow-forward'
 */

import ItemView from '../components/orderItemView';
import constants from  '../constants/constant';
import Button from 'react-native-smart-button';
import Picker from 'react-native-picker';
import LoginPage from './loginPage'
import ValidatePage from './validateInputPage';
import AddOrderfinishPage from './addOrderFinishPage'

import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

import {getDeviceID,getToken,getPhone,getRealName} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import ProgressView from '../components/modalProgress'
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'

import items from '../constants/serviceItem'
import pay  from '../constants/pay'
import typeData from '../constants/mode'


import countryData from '../constants/country'


let selectedItems = ['信用证',];

/*
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

 commission_content: '',//委托内容*/

class AddOrder extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            keyboardSpace: 0,//键盘弹出时滑动的距离
            showProgress: true,//显示加载
            showReload: false,//显示加载更多
            phone: '',
            realName: '',
            commission_content: this.props.commission_content ? this.props.commission_content : '',
            id: this.props.id ? this.props.id : '',
            items: items,
            pay: this.props.credit_letter ? this.props.credit_letter : 1,
            selectedItems: selectedItems,
            type: this.props.trade_terms ? this.props.trade_terms : typeData[0].value,
            start: this.props.departure_name ? this.props.departure_name : countryData[0].name,
            reach: this.props.destination_name ? this.props.destination_name : countryData[0].name,
            clearance: this.props.import_clearance ? this.props.import_clearance : 1,//进口清关
            logistics: this.props.international_logistics ? this.props.international_logistics : 1,//需求国际物流
            land: this.props.export_country_land ? this.props.export_country_land : 1,//出口国陆运
            sea_air: this.props.booking_service_name ? this.props.booking_service_name : 0,//海运
            internal: this.props.domestic_logistics ? this.props.domestic_logistics : 1//国内物流
        }
        this._realName = /^[A-Za-z]{2,20}$|^[\u4E00-\u9FA5]{2,8}$/

        this._phoneReg = /^1[34578]\d{9}$/;//手机号码

        this._scrollY = 0
        this._showKeyboard = true;

        this.typeShow = []
        this.countryShow = []
        this.countryEnd = []
    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                //console.log(`orderPage willfocus...`)
                //console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (event && currentRoute === event.data.route) {
                    //console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    //console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
        this.addAppEventListener(
            NativeAppEventEmitter.addListener('validatepage_send_value', (context, label) => {
                if (label == '委托人') {
                    this.setState({realName: context})
                } else if (label == '联系电话') {

                    this.setState({phone: context})
                }
            })
        )
        this.addAppEventListener(
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
        )


    }


    onKeyboardWillShow(frames) {

        const keyboardSpace = frames.endCoordinates.height//获取键盘高度
        //console.log('Keyboard is shown', keyboardSpace);
        if (this._showKeyboard) {
            this.setState({
                keyboardSpace: keyboardSpace,
            })
            this._scrollView.scrollTo({y: this._scrollY + this.state.keyboardSpace, animated: true})
            this._showKeyboard = false;
        }
    }

    onKeyboardWillHide() {
        //console.log('Keyboard is hide');

        this._scrollView.scrollTo({y: this._scrollY, animated: true});

        this.setState({
            keyboardSpace: 0,
        })
        this._showKeyboard = true;
    }


    async _getPhoneAndName() {
        let phone = await getPhone();
        let realName = await getRealName();
        phone = this.props.client_phone ? this.props.client_phone : phone
        realName = this.props.client_name ? this.props.client_name : realName
        setTimeout(()=>this.setState({
            phone: phone,
            realName: realName,
            showProgress: false,//显示加载
        }), 510);

    }

    componentDidMount() {
        //console.log('items:' + this.state.items.length)
        if (this.typeShow.length == 0) {
            for (type of typeData) {
                this.typeShow.push(type.value)
            }
        }
        if (this.countryShow.length == 0) {
            for (data of countryData) {
                this.countryShow.push(data.name)
            }
        }
        if (this.countryEnd.length == 0) {
            for (data of countryData) {
                this.countryEnd.push(data.name)
            }
        }

        this._getPhoneAndName()
    }

    componentWillUnmount() {
        if (Picker.isPickerShow) {
            Picker.hide()
        }
    }

    _onScroll(e) {
        this._scrollY = e.nativeEvent.contentOffset.y
        //console.log(`this._scrollY = ${this._scrollY}`)
    }


    /*{this.state.items.map((item, index) => {
     let icon = 'md-checkmark-circle'
     let color = constants.UIActiveColor
     /!* if (this.state.selectedItems.indexOf(item.name) == -1) {
     icon = 'ios-radio-button-off-outline'
     color = constants.UIInActiveColor
     } *!/
     if (item.select==0) {
     icon = 'ios-radio-button-off-outline'
     color = constants.UIInActiveColor
     }
     console.log(item.name + ",icon:" + icon);
     return (
     <TouchableOpacity
     key={`item-${index}`} style={{height:50,}}
     onPress={()=>{
     if (this.state.selectedItems.indexOf(item.name) == -1) {
     selectedItems.push(item.name)
     }else{
     let deletIndex=this.state.selectedItems.indexOf(item.name)
     selectedItems.splice(deletIndex,1);
     }
     this.setState({selectedItems:selectedItems});
     }}>
     <ItemView
     name={icon}
     color={color}
     title={item.name}
     rightText=''/>
     </TouchableOpacity>
     )
     })}*/


    render() {
        return (
            <View style={{flex:1}}>
                {this.state.showProgress || this.state.showReload ?
                    <ProgressView
                        showProgress={this.state.showProgress}
                        showReload={this.state.showReload}
                        fetchData={()=>{}}/> :

                    <ScrollView
                        ref={ (component) => this._scrollView = component}
                        style={styles.container}
                        showsVerticalScrollIndicator={false}
                        onKeyboardWillShow={this.onKeyboardWillShow.bind(this)}
                        onKeyboardWillHide={this.onKeyboardWillHide.bind(this)}
                        onScroll={this._onScroll.bind(this)}
                        scrollEventThrottle={100}>
                        <TouchableOpacity
                            style={[{marginTop:10,height:50,}]}
                            onPress={()=>{
                             //查找下标
                             console.log(`this.state.type:`,this.state.type);
                            let index=0;

                             for(let i=0;i<this.typeShow.length;i++){
                             if(this.typeShow[i]==this.state.type){

                                 index=i;
                                  console.log(`index:`,index);
                                 break;
                                 }
                             }


                          Picker.init({
                          pickerData: this.typeShow ,
                          pickerConfirmBtnText:'确定',
                          pickerCancelBtnText:'取消',
                          pickerTitleText:'选择贸易条款',
                          selectedValue: [this.typeShow[index]],
                          onPickerConfirm: data => {

                              this.setState({type:data+''})
                          },
                          onPickerCancel: data => {
                          },
                          onPickerSelect: data => {

                              this.setState({type:data+''})
                          }
                            });
                           Picker.show();
                          }}>
                            <ItemView
                                name='ios-arrow-forward'
                                title='贸易条款'
                                rightText={this.state.type}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[{height:50,}]}
                            onPress={ ()=>{
                         this.props.navigator.push({
                            title: '委托人',
                            component: ValidatePage,
                            passProps:{
                            context:this.state.realName,
                            label:'委托人',
                            reg:this._realName
                                }
                            });
                            } }>
                            <ItemView
                                ref={ component => this._input_realName = component }
                                name='ios-arrow-forward'
                                title='委托人'
                                rightText={this.state.realName}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[{height:50,}]}
                            onPress={ ()=>{
                         this.props.navigator.push({
                            title: '联系电话',
                            component: ValidatePage,
                            passProps:{
                            context:this.state.phone,
                            label:'联系电话',
                            reg:this._phoneReg
                                }
                            });
                            } }>
                            <ItemView
                                ref={ component => this._input_phone = component }
                                name='ios-arrow-forward'
                                title='联系电话'
                                rightText={this.state.phone}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[{height:50,}]}

                            onPress={()=>{
                            let index=0;

                             for(let i=0;i<this.countryShow.length;i++){
                             if(this.countryShow[i]==this.state.start){

                                 index=i;
                                  console.log(`index:`,index);
                                 break;
                                 }
                             }

                             Picker.init({
                                    pickerData: this.countryShow,
                                    pickerConfirmBtnText:'确定',
                                    pickerCancelBtnText:'取消',
                                    pickerTitleText:'出发国家',
                                    selectedValue: [this.countryShow[index]],
                                    onPickerConfirm: data => {
                                        this.setState({start:data+''})
                                    },
                                    onPickerCancel: data => {
                                        //console.log(data);
                                    },
                                    onPickerSelect: data => {
                                        this.setState({start:data+''})
                                    }
                                });
                                Picker.show();
                                  }}>
                            <ItemView

                                name='ios-arrow-forward'
                                title='出发国家'
                                rightText={this.state.start}/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{height:50,}}
                            onPress={()=>{
                            let index=0;

                             for(let i=0;i<this.countryEnd.length;i++){
                             if(this.countryEnd[i]==this.state.reach){

                                 index=i;
                                  console.log(`index:`,index);
                                 break;
                                 }
                             }
                                    Picker.init({
                                    pickerData: this.countryEnd,
                                    pickerConfirmBtnText:'确定',
                                    pickerCancelBtnText:'取消',
                                    pickerTitleText:'目的国家',
                                    selectedValue: [this.countryEnd[index]],
                                    onPickerConfirm: data => {
                                        this.setState({reach:data+''})
                                    },
                                    onPickerCancel: data => {
                                        //console.log(data);
                                    },
                                    onPickerSelect: data => {
                                        this.setState({reach:data+''})
                                    }
                                });
                                Picker.show();
                                  }}>
                            <ItemView
                                name='ios-arrow-forward'
                                title='目的国家'
                                rightText={this.state.reach}
                                hasLine={false}/>
                        </TouchableOpacity>
                        <Text
                            style={[styles.labelText,{marginLeft:constants.MarginLeftRight,paddingTop:5,paddingBottom:5,}]}>货代服务</Text>
                        <TouchableOpacity
                            style={{height:50,}}
                            onPress={()=>{
                        let select
                                 if (this.state.clearance==1) {

                                        select=0
                                 }else{

                                        select=1
                                 }
                                 this.setState({clearance:select});
                                  }}>
                            <ItemView
                                color={this.state.clearance==1?constants.UIActiveColor:constants.UIInActiveColor}
                                name={this.state.clearance==1?'md-checkmark-circle':'ios-radio-button-off-outline'}
                                title='进口清关'
                                rightText=''
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{height:50,}}
                            onPress={()=>{
                                 let select
                                 if (this.state.logistics==1) {
                                         //取消国际物流
                                        select=0
                                         this.setState({logistics:select,land:0,sea_air:0});
                                 }else{
                                       //需求国际物流选中了
                                        select=1
                                         this.setState({logistics:select,land:1,sea_air:0});
                                 }

                                  }}>
                            <ItemView
                                color={this.state.logistics==1?constants.UIActiveColor:constants.UIInActiveColor}
                                name={this.state.logistics==1?'md-checkmark-circle':'ios-radio-button-off-outline'}
                                title='国际物流'
                                rightText=''
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={this.state.logistics==1?{height:50,}:{height:0,}}
                            onPress={()=>{
                                 let select
                                 if (this.state.land==1) {
                                       //取消
                                        select=0
                                 }else{
                                         //出口国陆运选中
                                        select=1
                                 }
                                 this.setState({land:select});
                                  }}>
                            <ItemView
                                color={this.state.land==1?constants.UIActiveColor:constants.UIInActiveColor}
                                name={this.state.land==1?'md-checkmark-circle':'ios-radio-button-off-outline'}
                                title='出口国陆运'
                                rightText=''
                            />
                        </TouchableOpacity>
                        <View style={[this.state.logistics==1?{height:50,}:{height:0,},{flexDirection:'row',alignItems:'stretch',
                            paddingLeft:constants.MarginLeftRight,backgroundColor:'white',}]}>
                            <View style={{flexDirection:'row',backgroundColor:'white',alignItems:'center',
                        borderColor: constants.UIInActiveColor,borderBottomWidth:StyleSheet.hairlineWidth,}}>
                                <Text
                                    style={[styles.labelText,{textAlignVertical:'center',color:constants.PointColor}]}>订舱服务</Text>
                            </View>
                            <TouchableOpacity
                                style={{flex:1,borderColor: constants.UIInActiveColor,borderBottomWidth:StyleSheet.hairlineWidth,}}
                                onPress={()=>{
                                 let select
                                 let airSelect
                                 if (this.state.sea_air==0) {

                                        select=0

                                 }else{

                                        select=0

                                 }
                                 this.setState({sea_air:select,});
                                  }}>
                                <ItemView
                                    color={this.state.sea_air==0?constants.UIActiveColor:constants.UIInActiveColor}
                                    name={this.state.sea_air==0?'md-checkmark-circle':'ios-radio-button-off-outline'}
                                    hasLine={false}
                                    showRightText={false}
                                    title='海运'
                                    rightText=''
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{flex:1,borderColor: constants.UIInActiveColor,borderBottomWidth:StyleSheet.hairlineWidth,}}
                                onPress={()=>{
                                /* let select
                                 if (this.state.sea_air==1) {
                                       //取消
                                        select=1
                                 }else{
                                         //出口国陆运选中
                                        select=1
                                 }
                                 this.setState({sea_air:select});*/
                                  }}>
                                <ItemView
                                    color={this.state.sea_air==1?constants.UIActiveColor:constants.UIBackgroundColor}
                                    name={this.state.sea_air==1?'md-checkmark-circle':'ios-radio-button-off-outline'}
                                    hasLine={false}
                                    showRightText={false}
                                    title='空运'
                                    titleColor={constants.UIBackgroundColor}
                                    rightText=''
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{height:50,}}
                            onPress={()=>{
                                let select
                                 if (this.state.internal==1) {


                                        select=0
                                 }else{

                                        select=1
                                 }
                                 this.setState({internal:select});
                                  }}>
                            <ItemView
                                color={this.state.internal==1?constants.UIActiveColor:constants.UIInActiveColor}
                                name={this.state.internal==1?'md-checkmark-circle':'ios-radio-button-off-outline'}
                                title='国内物流'

                                rightText=''
                                hasLine={false}
                            />
                        </TouchableOpacity>
                        <Text
                            style={[styles.labelText,{marginLeft:constants.MarginLeftRight,paddingTop:5,paddingBottom:5,}]}>支付方式</Text>
                        <TouchableOpacity
                            style={{height:50,}}
                            onPress={()=>{
                                 let select
                                 if (this.state.pay==1) {
                                        select=0
                                 }else{
                                        select=1
                                 }
                                 this.setState({pay:select});
                                  }}>
                            <ItemView
                                color={this.state.pay==1?constants.UIActiveColor:constants.UIInActiveColor}
                                name={this.state.pay==1?'md-checkmark-circle':'ios-radio-button-off-outline'}
                                title='信用证'
                                rightText=''
                                hasLine={false}
                            />
                        </TouchableOpacity>

                        <Text
                            style={[styles.labelText,{marginLeft:constants.MarginLeftRight,paddingTop:5,paddingBottom:5,}]}>委托内容</Text>

                        <View style={{height:150,}}>
                            <TextInput
                                style={[styles.labelText,{flex:1,
                                    fontSize:14,
                                    backgroundColor:'white',
                                    textAlignVertical:'top',
                                    padding:constants.MarginLeftRight,
                                    borderColor: constants.UIInActiveColor,
                                    justifyContent:'flex-start',
                                    }]}
                                clearButtonMode="while-editing"
                                //placeholder='委托内容'
                                maxLength={300}
                                underlineColorAndroid='transparent'
                                multiline={true}//多行输入
                                numberOfLines={6}
                                editable={true}
                                value={this.state.commission_content}
                                onChangeText={(text) => this.setState({commission_content:text})}/>
                            <Text
                                style={{color:constants.UIInActiveColor,position:'absolute',bottom:5,right:5,backgroundColor:'transparent'}}>300字以内</Text>
                        </View>

                        <View style={[{flex:1,paddingTop:10,paddingBottom:10,paddingLeft:constants.MarginLeftRight,paddingRight:constants.MarginLeftRight},
                        this.state.keyboardSpace?{paddingBottom:this.state.keyboardSpace}:{}]}>
                            <Button
                                ref={ component => this.button2 = component }
                                touchableType={Button.constants.touchableTypes.fadeContent}
                                style={styles.button}
                                textStyle={{fontSize: 17, color: 'white'}}
                                loadingComponent={
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        {
                                //this._renderActivityIndicator()
                                }
                                        <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>委托中...</Text>
                                        </View>
                                        }
                                onPress={ () => {
                                        if(!this._phoneReg.test(this.state.phone)){

                                         this._toast.show({
                                            position: Toast.constants.gravity.center,
                                            duration: 255,
                                            children: '联系电话格式不正确'
                                        })
                                        return
                                        }
                                        if(!this._realName.test(this.state.realName)){

                                         this._toast.show({
                                            position: Toast.constants.gravity.center,
                                            duration: 255,
                                            children: '委托人格式不正确'
                                        })
                                        return
                                        }


                                          /*  this.button2.setState({

                                                loading: true,
                                                //disabled: true,
                                            });*/
                                            this._modalLoadingSpinnerOverLay.show()

                                            if(this.state.id==''){
                                                this._fetchData()
                                            }else{
                                                this._fetchData_update()
                                            }

                                                 /* setTimeout( () => {
                                                    this.button2.setState({
                                                        loading: false,
                                                        //disabled: false
                                                    })

                                                    /!**
                                                    * 提交订单数据
                                                    *!/
                                                    this.props.navigator.pop();
                                                }, 3000)*/
                                        }}>
                                发起委托
                            </Button>
                        </View>


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

    onBackAndroid = () => {
        const routers = this.props.navigator.getCurrentRoutes();
        if (routers.length > 1) {
            /* Alert.alert('温馨提醒','确定退出吗?',[
             {text:'取消',onPress:()=>{}},
             {text:'确定',onPress:()=>this.props.navigator.popToTop()}
             ])*/
            this.props.navigator.popToTop()
            return true;
        }

    };

    async _fetchData() {
        //console.log(`_fetchData`)
        try {
            let departure = countryData[this.countryShow.indexOf(this.state.start)]
            //console.log(`departure_id_start`, departure)
            let departure_id = departure.id
            let destination = countryData[this.countryEnd.indexOf(this.state.reach)]
            //console.log(`destination_id_reach`, destination)
            let destination_id = destination.id


            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.commissionOrderStart,
                    import_clearance: this.state.clearance,
                    international_logistics: this.state.logistics,
                    export_country_land: this.state.land,
                    booking_service: this.state.sea_air,
                    domestic_logistics: this.state.internal,
                    credit_letter: this.state.pay,
                    trade_terms: this.state.type,
                    departure_id: departure_id,
                    departure_name: this.state.start,
                    destination_id: destination_id,
                    destination_name: this.state.reach,
                    client_name: this.state.realName,
                    client_phone: this.state.phone,
                    commission_content: this.state.commission_content,
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
            console.log('gunZip:', result)

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
            }
            if (result.code && result.code == 10) {

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '发送成功'
                })
                this.props.navigator.push({
                    title: '发起委托',
                    component: AddOrderfinishPage,
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
            /*this.button2.setState({
             loading: false,
             //disabled: false
             })*/
            if (this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

    async _fetchData_update() {
        //console.log(`_fetchData_update`)
        try {
            let departure = countryData[this.countryShow.indexOf(this.state.start)]
            //console.log(`departure_id_start`, departure)
            let departure_id = departure.id
            let destination = countryData[this.countryEnd.indexOf(this.state.reach)]
            //console.log(`destination_id_reach`, destination)
            let destination_id = destination.id


            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.commissionOrder_commissionOrderEditSave,
                    id: this.state.id,
                    import_clearance: this.state.clearance,
                    international_logistics: this.state.logistics,
                    export_country_land: this.state.land,
                    booking_service: this.state.sea_air,
                    domestic_logistics: this.state.internal,
                    credit_letter: this.state.pay,
                    trade_terms: this.state.type,
                    departure_id: departure_id,
                    departure_name: this.state.start,
                    destination_id: destination_id,
                    destination_name: this.state.reach,
                    client_name: this.state.realName,
                    client_phone: this.state.phone,
                    commission_content: this.state.commission_content,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)

            console.log(`_fetch_sendCode options:`, options)

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
            if (this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            console.log('gunZip:', result)
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
            }
            if (result.code && result.code == 10) {

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '发送成功'
                })
                //修改订单状态
                NativeAppEventEmitter.emit('orderDetail_hasUpdate_should_resetState', this.state.id)

                setTimeout(()=>this.props.navigator.popToTop(), 1000)


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
            /*this.button2.setState({
             loading: false,
             //disabled: false
             })*/
            if (this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

    _renderActivityIndicator() {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{margin: 10,}}
                    color={'#fff'}
                    styleAttr={'Small'}/>

            ) : (
            <ActivityIndicatorIOS
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        )


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
        flexDirection: 'column',
    },
    labelText: {
        fontSize: 14,
        color: constants.LabelColor,
    },
    button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center',
        borderRadius: 30,
    },
    textInput: {
        flex: 1,
        alignSelf: 'stretch',
        marginRight: 10,

    },
    textLine: {
        flex: 1, justifyContent: 'center', backgroundColor: 'white',
        marginLeft: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    inputView: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'white',
    },


});

export default AppEventListenerEnhance(XhrEnhance(AddOrder))


import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar, LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[index - 1];
        return (
            <TouchableOpacity
                onPress={() => navigator.popToTop()}
                style={navigatorStyle.navBarLeftButton}>
                <View style={navigatorStyle.navBarLeftButtonAndroid}>
                    <Icon
                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
                        name={'ios-arrow-back'}
                        size={constants.IconSize}
                        color={'white'}/>
                </View>
            </TouchableOpacity>

        );
    },
}

/*
 const navigationBarRouteMapper = {
 LeftButton: function (route, navigator, index, navState) {
 if (index === 0) {
 return null;
 }

 var previousRoute = navState.routeStack[index - 1];
 return (
 <TouchableOpacity
 onPress={() => navigator.popToTop()}
 style={navigatorStyle.navBarLeftButton}>
 <View style={navigatorStyle.navBarLeftButtonAndroid}>
 <Icon
 style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
 name={'ios-arrow-back'}
 size={constants.IconSize}
 color={'white'}/>
 </View>
 </TouchableOpacity>

 );
 },

 RightButton: function (route, navigator, index, navState) {

 },

 Title: function (route, navigator, index, navState) {
 return (
 Platform.OS == 'ios' ?
 <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
 {route.title}
 </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
 <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
 {route.title}
 </Text>
 </View>
 )
 },

 }*/
