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

class OrderDetail extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
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
    }


    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                console.log(`OrderDetail willfocus...`)
                console.log(`currentRoute`, currentRoute)
                console.log(`event.data.route`, event.data.route)
                if (currentRoute === event.data.route) {
                    console.log("OrderDetail willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    console.log("OrderDetail willDisappear, other willAppear")
                }
                //
            })
        )
    }

    componentDidMount() {
        this._fetchData()

    }

    render() {

        console.log(`this.state.order_status`,this.state.order_status)
        return (
            <View style={{flex:1}}>
                <ScrollView style={styles.container}>
                    <View style={styles.viewItem}>

                            <Text style={{flex:1}}>单号:</Text>
                            <Text style={{flex:2}}>{this.state.service_no}</Text>

                        <View
                            style={{flex:1,justifyContent:'flex-end',paddingRight:constants.MarginLeftRight,}}>
                            <Text style={{color:constants.UIActiveColor}}>{this.state.order_status_name}</Text>
                        </View>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>发布时间:</Text>
                        <Text style={{flex:3}}>{this.state.create_time_str}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>贸易条款:</Text>
                        <Text style={{flex:3}}>{this.state.trade_terms}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>委托人:</Text>
                        <Text style={{flex:3}}>{this.state.client_name}</Text>
                    </View>

                    <View style={[styles.line,{height:10}]}/>
                    <View style={[styles.viewItem,{paddingRight:constants.MarginLeftRight},
                                {height:50}]}>
                        <TouchableOpacity
                            style={[{justifyContent:'center',alignItems:'center',},
                            this.state.order_status==30?{flex:1}:{width:0,}]}
                            onPress={()=>{
                            //修改订单
                             if(this.state.order_status_name){
                             this.props.navigator.replace({
                                                title: '修改委托',
                                                component: AddOrderPage,
                                                passProps:this.state,
                                            })
                           } }}>
                            <Text style={{color:constants.UIActiveColor,
                            fontSize:17,textAlignVertical:'center',textAlign:'center',}}>修改</Text>

                        </TouchableOpacity>
                        <View
                            style={[{height:30,backgroundColor:constants.UIInActiveColor},
                            this.state.order_status==30?
                            {width:StyleSheet.hairlineWidth,}:{width:0}]}/>
                        <TouchableOpacity
                            style={[{justifyContent:'center',alignItems:'center',},
                             (this.state.order_status==0||this.state.order_status==30)?{flex:1,}:{width:0,height:0,}]}
                            onPress={()=>{
                            //取消订单
                            if(this.state.order_status_name){
                            this._fetchData_cancel()
                            }
                            }}>
                            <Text style={{color:constants.UIActiveColor,
                            fontSize:17,textAlignVertical:'center',textAlign:'center'}}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.line,{height:10}]}/>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>联系方式:</Text>
                        <Text style={{flex:3}}>{this.state.client_phone}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>出发国家:</Text>
                        <Text style={{flex:3}}>{this.state.departure_name}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>目的国家:</Text>
                        <Text style={{flex:3}}>{this.state.destination_name}</Text>
                    </View>

                    <View style={[{flex:1, flexDirection: 'row',
                                   justifyContent: 'flex-start',
                                   alignItems: 'center',
                                   paddingLeft: constants.MarginLeftRight,
                                   backgroundColor:'white',},]}>
                        <View style={{flex:1}}>
                        <Text style={{flex:1}}>货代服务:</Text>
                        </View>
                        <View style={{flex:3}}>
                        <Text style={{flex:1}}>
                            {this.state.import_clearance==1?'进口清关、'　:``}
                            {this.state.international_logistics==1?'国际物流、'　:``}
                            {this.state.export_country_land==1?'出口国陆运、'　:``}
                            {this.state.booking_service_name==0?'订舱服务海运、'　:``}
                            {this.state.domestic_logistics==1?'国内物流、'　:``}
                        </Text>
                        </View>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>支付方式:</Text>
                        <Text style={{flex:3}}>{this.state.credit_letter==1?'信用证'　:``}</Text>
                    </View>

                    <View style={[styles.viewItem,{flex:1,}]}>
                        <Text style={{flex:1}}>委托内容:</Text>
                        <Text style={{flex:3,}}>
                            {this.state.commission_content}
                        </Text>
                    </View>
                    <View style={this.state.order_status==30?{height:10}:{height:0}}/>
                    <TextInput
                        style={[{fontSize:15,textAlignVertical:'top',
                              margin:3,
                              borderColor: constants.UIInActiveColor,
                              justifyContent:'flex-start',

                                },this.state.order_status==30?{flex:1}:{height:0}]}
                        clearButtonMode="while-editing"
                        placeholder='拒绝原因'
                        maxLength={300}
                        underlineColorAndroid='transparent'
                        multiline={true}//多行输入
                        numberOfLines={8}
                        editable={false}
                        value={this.state.remark}/>
                    <View style={this.state.order_status==30?{height:10}:{height:0}}/>
                    <View style={[styles.viewItem]}>
                        <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',}}
                                          onPress={()=>{
                                        //打电话
                                        return Linking.openURL(constants.Tel);
                                        }}>
                            <Text style={{color:constants.UIActiveColor}}>联系客服</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{height:30}}/>
                </ScrollView>
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>
                </Toast>
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

                this.setState(
                    {
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

                        booking_service_name:result.result.booking_service_name,// 订舱服务,0海运，1空运

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
            console.log(error)

        }
        finally {

            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

async _fetchData_cancel() {
        try {

            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.cancelCommissionOrder,
                    id: this.state.id,
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
                //统计总价
                NativeAppEventEmitter.emit('orderDetail_hasCancel_should_resetState',this.state.id)
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
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: constants.MarginLeftRight,
        backgroundColor:'white',
    },
    line: {
        //marginLeft: constants.MarginLeftRight,
        //marginRight: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    }

});

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

export default AppEventListenerEnhance(XhrEnhance(OrderDetail))