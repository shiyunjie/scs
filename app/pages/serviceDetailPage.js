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


import UploadPage from './uploadPage'
import LogisticsPage from './logisticsPage'
import LoginPage from './loginPage'
import PayPage from './payPage'
import AddOrderPage from './addOrderPage'
import constants from  '../constants/constant'
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

import {getDeviceID,getToken} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import ModalProgress from '../components/modalProgress'
import ModalDialog from '../components/modalDialog'

let service_id
class ServiceDetail extends Component {
    // 构造
    constructor(props) {
        super(props);

        // 初始状态
        this.state = {
            showProgress: true,//显示加载
            showReload: false,//显示加载更多
            showDialog:false,//显示确认框

            service_no: '',// 服务单号

            order_status_name: '',// 服务单状态名称

            order_status: '',// 服务单状态

            remark: '',// 备注

            trade_terms: '',// 贸易条款

            country_name: '',// 起运国

            destination_name: '',// 目的国

            logistics_status_name: '',// 物流状态名称

            time_name: '',// 接单时间

            id: this.props.id,// 服务单id

            import_clearance: '',// 进口清关,0否，1是

            international_logistics: '',// 国际物流,0否，1是

            export_country_land: '',// 出口国陆运,0否，1是

            booking_service_name: '',// 订舱服务,0海运，1空运

            domestic_logistics: '',// 国内物流,0否，1是

            credit_letter: '',// 信用证0否，1是

            client_name: '',// 委托人

            client_phone: '',// 联系电话

            commission_content: '',// 委托内容

            ship_company_code: '',// 船公司代码

            ship_company_name: '',// 船公司名称

            potcd:'', //申报口岸

            ship_name_english: '',// 英文船名

            voyage: '',// 航次

            bill_num: '',// 提单号

            destination_port_name: '',// 目的港

            box_quantity_information: '',// 箱型数量信息

            suitcase_yard: '',// 提箱堆场

            packing_place: '',// 装箱地点

            number: '',// 件数

            weight: '',// 毛重

            volume: '',// 体积

            contract_number: '',// 合同号

            billing_number: '',// 发票号

            consignee_name: '',// 收货人

            consignor_name: '',// 发货人
            logistics_status_name: '',//物流状态
        }
        service_id=this.props.id
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

        this.addAppEventListener(
            NativeAppEventEmitter.addListener('bill_has_be_conform_should_refresh',(event)=>{
                if(event) {
                    this._fetchData()
                }
            })
        )
    }

    componentDidMount() {
        this._fetchData()

    }

    async _fetchData() {
        try {

            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.serviceOrderDetail,
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
                        showProgress: false,//显示加载
                        showReload: false,//显示加载更多

                        service_no: result.result.service_no,// 服务单号

                        order_status_name: result.result.order_status_name,// 服务单状态名称

                        order_status: result.result.order_status,// 服务单状态

                        remark: result.result.remark,// 备注

                        trade_terms: result.result.trade_terms,// 贸易条款

                        country_name: result.result.country_name,// 起运国

                        destination_name: result.result.destination_name,// 目的国

                        logistics_status_name: result.result.logistics_status_name,// 物流状态名称

                        time_name: result.result.time_name,// 接单时间


                        import_clearance: result.result.import_clearance,// 进口清关,0否，1是

                        international_logistics: result.result.international_logistics,// 国际物流,0否，1是

                        export_country_land: result.result.export_country_land,// 出口国陆运,0否，1是

                        booking_service_name: result.result.booking_service_name,// 订舱服务,0海运，1空运

                        domestic_logistics: result.result.domestic_logistics,// 国内物流,0否，1是

                        credit_letter: result.result.credit_letter,// 信用证0否，1是

                        client_name: result.result.client_name,// 委托人

                        client_phone: result.result.client_phone,// 联系电话

                        commission_content: result.result.commission_content,// 委托内容

                        ship_company_code: result.result.ship_company_code,// 船公司代码

                        ship_company_name: result.result.ship_company_name,// 船公司名称
                        potcd: result.result.potcd,// 申报口岸

                        ship_name_english: result.result.ship_name_english,// 英文船名

                        voyage: result.result.voyage,// 航次

                        bill_num: result.result.bill_num,// 提单号

                        destination_port_name: result.result.destination_port_name,// 目的港

                        box_quantity_information: result.result.box_quantity_information,// 箱型数量信息

                        suitcase_yard: result.result.suitcase_yard,// 提箱堆场

                        packing_place: result.result.packing_place,// 装箱地点

                        number: result.result.number,// 件数

                        weight: result.result.weight,// 毛重

                        volume: result.result.volume,// 体积

                        contract_number: result.result.contract_number,// 合同号

                        billing_number: result.result.billing_number,// 发票号

                        consignee_name: result.result.consignee_name,// 收货人

                        consignor_name: result.result.consignor_name,// 发货人

                        logistics_status_name: result.result.logistics_status_name,// 物流状态
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

    async _fetch_cancel() {
        try {

            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.serviceOrder_cancelServiceOrder,
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
                NativeAppEventEmitter.emit('serviceDetail_hasCancel_should_resetState',this.state.id)

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
    _onRequestClose(){
        this.props.navigator.pop()
    }

    render() {
        return (
            <View style={{flex:1}}>
                <ModalProgress
                    showProgress={this.state.showProgress}
                    showReload={this.state.showReload}
                    fetchData={()=>{
                    this.setState({
                    showProgress:true,//显示加载
                    showReload:false,//显示加载更多
                     })
                    this._fetchData()
                    }}
                    onRequestClose={this._onRequestClose.bind(this)}/>
                <ModalDialog
                    showDialog={this.state.showDialog}
                    title='确认要取消订单吗'
                    fetchData={()=>{
                    this.setState({
                    showDialog:false,
                     })
                     //取消订单
                        this._fetch_cancel()
                    }}/>
                {this.state.showProgress||this.state.showReload?null:(
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
                        <Text style={{flex:3}}>{this.state.time_name}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>贸易条款:</Text>
                        <Text style={{flex:3}}>{this.state.trade_terms}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>委托人:</Text>
                        <Text style={{flex:3}}>{this.state.client_name}</Text>
                    </View>

                    <View style={styles.line}/>
                    <View style={[styles.viewItem]}>
                        <TouchableOpacity style={[{justifyContent:'center',alignItems:'center',},
                                        this.state.order_status==10?{width:0}:{flex:1}]}
                                          onPress={()=>{
                                          let type='pay'
                                          if(this.state.order_status==20||this.state.order_status==30||
                                          this.state.order_status==70||this.state.order_status==100){
                                            type='show'
                                          }

                                        if(this.state.order_status!=10){

                                           this.props.navigator.push({
                                            title: '账单',
                                            component: PayPage,
                                            passProps: {
                                            id:this.state.id,
                                            pageType:type,
                                             order_status: this.state.order_status,
                                            }
                                        });
                                        }

                                        }}>
                            <Text style={{color:constants.UIActiveColor}}>账单</Text>

                        </TouchableOpacity>
                        <View
                            style={[{height:30,backgroundColor:constants.UIInActiveColor},
                             this.state.order_status==30||this.state.order_status==80||this.state.order_status==90||
                            this.state.order_status==100||this.state.order_status==10?
                            {width:0}:{width:StyleSheet.hairlineWidth,}]}/>
                        <TouchableOpacity style={[{justifyContent:'center',alignItems:'center',},
                            this.state.order_status==30||this.state.order_status==80||this.state.order_status==90||
                            this.state.order_status==100?
                            {width:0}:{flex:1}]} onPress={()=>{
                            this.props.navigator.push({
                                        title: '上传资料',
                                        component: UploadPage,
                                        passProps: {
                                            id:service_id,
                                        }
                                    });
                            }}>
                            <Text style={{color:constants.UIActiveColor}}>上传</Text>

                        </TouchableOpacity>
                        <View
                            style={[{height:30,backgroundColor:constants.UIInActiveColor},
                            this.state.order_status==10||this.state.order_status==20||this.state.order_status==40||
                            this.state.order_status==70?
                            {width:StyleSheet.hairlineWidth,}:{width:0}]}/>
                        <TouchableOpacity style={[{justifyContent:'center',alignItems:'center',},
                    this.state.order_status==10||this.state.order_status==20||this.state.order_status==40||
                            this.state.order_status==70? {flex:1,}:{width:0}]}
                                          onPress={()=>{
                                           //弹窗取消订单
                                           this.setState({showDialog:true,})


                                            }}>
                            <Text style={{color:constants.UIActiveColor}}>取消</Text>

                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}/>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>联系方式:</Text>
                        <Text style={{flex:3}}>{this.state.client_phone}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>出发国家:</Text>
                        <Text style={{flex:3}}>{this.state.country_name}</Text>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>目的国家:</Text>
                        <Text style={{flex:3}}>{this.state.destination_name}</Text>
                    </View>

                    <View style={[{flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingLeft: constants.MarginLeftRight,
                        backgroundColor: 'white',},]}>
                        <View style={{flex:1}}>
                            <Text >货代服务:</Text>
                        </View>
                        <View style={{flex:3}}>
                            <Text >{this.state.import_clearance == 1 ? '进口清关、' : ``}
                                {this.state.international_logistics == 1 ? '国际物流、' : ``}
                                {this.state.export_country_land == 1 ? '出口国陆运、' : ``}
                                {this.state.booking_service_name == 0 ? '订舱服务海运、' : ``}
                                {this.state.domestic_logistics == 1 ? '国内物流、' : ``}</Text>
                        </View>
                    </View>

                    <View style={styles.viewItem}>
                        <Text style={{flex:1}}>支付方式:</Text>
                        <Text style={{flex:3}}>{this.state.credit_letter == 1 ? '信用证' : ``}</Text>
                    </View>

                    <View style={[{flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingLeft: constants.MarginLeftRight,
                        backgroundColor: 'white',},]}>
                        <Text style={{flex:1}}>委托内容:</Text>
                        <Text style={{flex:3}}> {this.state.commission_content}</Text>
                    </View>

                    <View style={[styles.viewItem,]}>
                        <Text style={{flex:1}}>申报口岸:</Text>
                        <Text style={{flex:3}}>{this.state.potcd}</Text>
                    </View>

                    <View style={[styles.viewItem,{flex:1,}]}>
                        <Text style={{flex:1}}>船公司:</Text>
                        <Text style={{flex:3}}>{this.state.ship_company_code}</Text>
                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>公司名字:</Text>
                        <Text style={{flex:3}}>{this.state.ship_company_name}</Text>

                    </View>

                    <View style={[{flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingLeft: constants.MarginLeftRight,
                        backgroundColor: 'white',},]}>

                        <Text style={{flex:1}}>英文船名:</Text>
                        <Text style={{flex:3}}>{this.state.ship_name_english}</Text>

                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>航次:</Text>
                        <Text style={{flex:3}}>{this.state.voyage}</Text>

                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>提单号:</Text>
                        <Text style={{flex:3}}>{this.state.bill_num}</Text>

                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>目的港:</Text>
                        <Text style={{flex:3}}>{this.state.destination_port_name}</Text>

                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>箱型数量:</Text>
                        <Text style={{flex:3}}>{this.state.box_quantity_information}</Text>

                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>提箱堆场:</Text>
                        <Text style={{flex:3}}>{this.state.suitcase_yard}</Text>

                    </View>

                    <View style={[styles.viewItem,{flex:1,}]}>

                        <Text style={{flex:1}}>装箱地点:</Text>
                        <Text style={{flex:3}}>{this.state.packing_place}</Text>

                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>件数:</Text>
                        <Text style={{flex:3}}>{this.state.number}</Text>

                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>毛重:</Text>
                        <Text style={{flex:3}}>{this.state.weight}</Text>

                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>体积:</Text>
                        <Text style={{flex:3}}>{this.state.volume}</Text>

                    </View>

                    <View style={[styles.viewItem,{flex:1,}]}>

                        <Text style={{flex:1}}>合同号:</Text>
                        <Text style={{flex:3}}>{this.state.contract_number}</Text>

                    </View>

                    <View style={[styles.viewItem]}>

                        <Text style={{flex:1}}>发票号:</Text>
                        <Text style={{flex:3}}>{this.state.billing_number}</Text>

                    </View>

                    <View style={[styles.viewItem,{flex:1,}]}>

                        <Text style={{flex:1}}>收货人:</Text>
                        <Text style={{flex:3}}>{this.state.consignee_name}</Text>

                    </View>

                    <View style={[styles.viewItem,{flex:1,}]}>

                        <Text style={{flex:1}}>发货人:</Text>
                        <Text style={{flex:3}}>{this.state.consignor_name}</Text>

                    </View>
                    <View style={[styles.viewItem]}>

                        <Text style={{ flex:1}}>物流状态:</Text>
                        <Text style={{ flex:3,color:constants.UIActiveColor}}>{this.state.logistics_status_name}</Text>

                    </View>
                    <View style={[{marginBottom:10}]}/>

                    <TextInput
                        style={{flex:1,fontSize:15,textAlignVertical:'top',

                      justifyContent:'flex-start',
                        backgroundColor:'white',
                      }}
                        clearButtonMode="while-editing"
                        placeholder='拒绝原因'
                        maxLength={300}
                        underlineColorAndroid='transparent'
                        multiline={true}//多行输入
                        numberOfLines={6}
                        editable={false}
                        value={this.state.remark}/>
                    <View style={[{marginBottom:10}]}/>
                    <View style={[styles.viewItem]}>
                        <TouchableOpacity
                            style={{flex:1,justifyContent:'center',alignItems:'center',}}
                            onPress={()=>{
                        //打电话
                        return Linking.openURL(constants.Tel);
                    }}><Text style={{color:constants.UIActiveColor}}>联系客服</Text></TouchableOpacity>
                        <View style={[styles.line,{marginBottom:10}]}/>
                    </View>
                    <View style={{height:50}}/>
                </ScrollView>)}
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>
                </Toast>
            </View>
        );
    }
}


export default AppEventListenerEnhance(XhrEnhance(ServiceDetail))

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
        backgroundColor: 'white',
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
        return (
            <TouchableOpacity
                onPress={() => {
            //查看物流
               navigator.push({
            title: '查看物流',
            component: LogisticsPage,
            passProps: {
                service_id:service_id,
            }
        });
            }}
                style={navigatorStyle.navBarRightButton}>
                <View style={navigatorStyle.navBarLeftButtonAndroid}>
                    <Text
                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize:14}]}
                        color={'white'}>
                        查看物流
                    </Text>
                </View>
            </TouchableOpacity>)
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