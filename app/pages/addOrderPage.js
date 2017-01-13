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
    NativeAppEventEmitter,
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

import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

import {getDeviceID,getToken,getPhone,getRealName} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'

import items from '../constants/serviceItem'

import pay  from '../constants/pay'

import typeData from '../constants/mode'
let typeShow = []


import countryData from '../constants/country'
let countryShow = []

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
            phone: '',
            realName:'',
            commission_content: this.props.commission_content?this.props.commission_content: '',
            id:this.props.id?this.props.id:'',
            items: items,
            pay:this.props.credit_letter?this.props.credit_letter:1,
            selectedItems: selectedItems,
            type: this.props.trade_terms?this.props.trade_terms:'',
            start: this.props.departure_name?this.props.departure_name:'',
            reach: this.props.destination_name?this.props.destination_name:'',
            clearance: this.props.import_clearance?this.props.import_clearance:1,//进口清关
            logistics: this.props.international_logistics?this.props.international_logistics:1,//需求国际物流
            land: this.props.export_country_land?this.props.export_country_land:1,//出口国陆运
            sea_air: this.props.booking_service_name?this.props.booking_service_name:0,//海运
            internal: this.props.domestic_logistics?this.props.domestic_logistics:1//国内物流


        }
    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                console.log(`orderPage willfocus...`)
                console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (event && currentRoute === event.data.route) {
                    console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
        this._getPhoneAndName()
    }

    async _getPhoneAndName() {
        let phone = await getPhone();
        let realName = await getRealName();
        phone = this.props.client_phone?this.props.client_phone: phone
        realName =  this.props.client_name?this.props.client_name : realName
        this.setState({phone: phone, realName: realName})
    }

    componentDidMount() {
        //console.log('items:' + this.state.items.length)
        if (typeShow.length == 0) {
            for (type of typeData) {
                typeShow.push(type.value)
            }
        }
        if (countryShow.length == 0) {
            for (data of countryData) {
                countryShow.push(data.name)
            }
        }
    }

    componentWillUnmount() {
        if (Picker.isPickerShow) {
            Picker.hide()
        }
    }

    /*{this.state.items.map((item, index) => {
     let icon = 'md-checkmark-circle'
     let color = constants.UIActiveColor
     /!* if (this.state.selectedItems.indexOf(item.name) == -1) {
     icon = 'ios-close-circle-outline'
     color = constants.UIInActiveColor
     } *!/
     if (item.select==0) {
     icon = 'ios-close-circle-outline'
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
                <ScrollView style={styles.container}>
                    <TouchableOpacity
                        style={[{height:50,},{marginTop:10}]}
                        onPress={()=>{
                          Picker.init({
                          pickerData: typeShow,
                          pickerConfirmBtnText:'确定',
                          pickerCancelBtnText:'取消',
                          pickerTitleText:'选择贸易条款',
                          selectedValue: [0],
                          onPickerConfirm: data => {
                              this.setState({type:data+''})
                          },
                          onPickerCancel: data => {
                              //console.log(data);
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
                    <View
                        style={styles.inputView}>
                        <View
                            style={ styles.textLine}>
                            <Text>委托人</Text>
                        </View>
                        <TextInput
                            style={styles.textInput}
                            clearButtonMode="while-editing"
                            textAlign='right'
                            maxLength={80}
                            underlineColorAndroid='transparent'
                            value={this.state.realName}
                            editable={true}
                            onChangeText={(text) => this.setState({realName:text})}/>
                    </View>
                    <TouchableOpacity style={{height:50,}}>
                        <ItemView
                            title='联系电话'
                            show={false}
                            rightText='13131313113'/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{height:50,}}
                        onPress={()=>{
                             Picker.init({
                                    pickerData: countryShow,
                                    pickerConfirmBtnText:'确定',
                                    pickerCancelBtnText:'取消',
                                    pickerTitleText:'出发国家',
                                    selectedValue: [0],
                                    onPickerConfirm: data => {
                                        this.setState({start:data+''})
                                    },
                                    onPickerCancel: data => {
                                        console.log(data);
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
                                    Picker.init({
                                    pickerData: countryShow,
                                     pickerConfirmBtnText:'确定',
                                    pickerCancelBtnText:'取消',
                                    pickerTitleText:'目的国家',
                                    selectedValue: [0],
                                    onPickerConfirm: data => {
                                        this.setState({reach:data+''})
                                    },
                                    onPickerCancel: data => {
                                        console.log(data);
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
                            rightText={this.state.reach}/>
                    </TouchableOpacity>
                    <Text style={{marginLeft:constants.MarginLeftRight}}>货代服务</Text>
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
                            name={this.state.clearance==1?'md-checkmark-circle':'ios-close-circle-outline'}
                            title='进口清关'
                            rightText=''/>
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
                            name={this.state.logistics==1?'md-checkmark-circle':'ios-close-circle-outline'}
                            title='需求国际物流'
                            rightText=''/>
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
                            name={this.state.land==1?'md-checkmark-circle':'ios-close-circle-outline'}
                            title='出口国陆运'
                            rightText=''/>
                    </TouchableOpacity>
                    <View style={[this.state.logistics==1?{height:50,}:{height:0,},{flexDirection:'row',alignItems:'stretch',borderColor: constants.UIInActiveColor,
                            marginLeft:constants.MarginLeftRight,borderBottomWidth:StyleSheet.hairlineWidth,}]}>
                        <View style={{flexDirection:'row',backgroundColor:'white',alignItems:'center',}}>
                            <Text style={{textAlignVertical:'center'}}>订舱服务</Text>
                        </View>
                        <TouchableOpacity
                            style={{flex:1,}}
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
                                name={this.state.sea_air==0?'md-checkmark-circle':'ios-close-circle-outline'}
                                hasLine={false}
                                title='海运'
                                rightText=''/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{flex:1,}}
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
                                color={this.state.sea_air==1?constants.UIActiveColor:constants.UIInActiveColor}
                                name={this.state.sea_air==1?'md-checkmark-circle':'ios-close-circle-outline'}
                                hasLine={false}
                                title='空运'
                                rightText=''/>
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
                            name={this.state.internal==1?'md-checkmark-circle':'ios-close-circle-outline'}
                            title='国内物流'
                            rightText=''/>
                    </TouchableOpacity>
                    <Text style={{marginLeft:constants.MarginLeftRight}}>支付方式</Text>
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
                            name={this.state.pay==1?'md-checkmark-circle':'ios-close-circle-outline'}
                            title='信用证'
                            rightText=''/>
                    </TouchableOpacity>

                    <View style={{flex:1,backgroundColor:constants.UIBackgroundColor}}>
                        <TextInput
                            style={{flex:1,fontSize:15,textAlignVertical:'top',
                        margin:3,

                      borderColor: constants.UIInActiveColor,
                      justifyContent:'flex-start'
                      }}
                            clearButtonMode="while-editing"
                            placeholder='委托内容'
                            maxLength={300}
                            underlineColorAndroid='transparent'
                            multiline={true}//多行输入
                            numberOfLines={6}
                            value={this.state.commission_content}
                            onChangeText={(text) => this.setState({commission_content:text})}/>
                        <Text
                            style={{color:constants.UIInActiveColor,position:'absolute',bottom:5,right:5,}}>300字以内</Text>
                    </View>
                    <View style={{flex:1,padding:10}}>
                        <Button
                            ref={ component => this.button2 = component }
                            touchableType={Button.constants.touchableTypes.fadeContent}
                            style={styles.button}
                            textStyle={{fontSize: 17, color: 'white'}}
                            loadingComponent={
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        {this._renderActivityIndicator()}
                                        <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>委托中...</Text>
                                        </View>
                                        }
                            onPress={ () => {
                                            this.button2.setState({

                                                loading: true,
                                                //disabled: true,
                                            });
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
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>
                </Toast>
            </View>
        );
    }

    async _fetchData() {
        console.log(`_fetchData`)
        try {
            let departure=countryData[countryShow.indexOf(this.state.start)]
            console.log(`departure_id_start`,departure)
            let departure_id = departure.id
            let destination= countryData[countryShow.indexOf(this.state.reach)]
            console.log(`destination_id_reach`,destination)
            let destination_id =destination.id


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

            console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)

            result = JSON.parse(result)
            console.log('gunZip:', result)
            if (result.code && result.code == -54) {
                /**
                 * 发送事件去登录
                 */
                AsyncStorage.removeItem('token')
                AsyncStorage.removeItem('realName')
                this.props.navigator.replace({
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
                this.props.navigator.pop()

            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            console.log(error)

        }
        finally {
            this.button2.setState({
                loading: false,
                //disabled: false
            })
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

    async _fetchData_update() {
        console.log(`_fetchData_update`)
        try {
            let departure=countryData[countryShow.indexOf(this.state.start)]
            console.log(`departure_id_start`,departure)
            let departure_id = departure.id
            let destination= countryData[countryShow.indexOf(this.state.reach)]
            console.log(`destination_id_reach`,destination)
            let destination_id =destination.id


            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.commissionOrder_commissionOrderEditSave,
                    id:this.state.id,
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

            result = JSON.parse(result)
            console.log('gunZip:', result)
            if (result.code && result.code == -54) {
                /**
                 * 发送事件去登录
                 */
                AsyncStorage.removeItem('token')
                AsyncStorage.removeItem('realName')
                this.props.navigator.replace({
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
                this.props.navigator.pop()

            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            console.log(error)

        }
        finally {
            this.button2.setState({
                loading: false,
                //disabled: false
            })
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
    button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3, borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30,
    },
    textInput: {
        flex: 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
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

const navigationBarRouteMapper = {
    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[index - 1];
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
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

}