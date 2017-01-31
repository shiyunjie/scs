/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    TouchableOpacity,
    ScrollView,
    ListView,
    TextInput,
    Linking,
    NativeAppEventEmitter,
} from 'react-native';

import Button from 'react-native-smart-button';
import OnlinePayPage from './onlinePayPage';
import PayItem from '../components/payItemView'
import LoginPage from './loginPage'
import AddOrderPage from './addOrderPage'
import constants from  '../constants/constant';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

import {getDeviceID,getToken} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import ModalProgress from '../components/modalProgress'
let firstDataList = []
/*let firstDataList = [[{
 first_cost_name: '一级费用名称',

 cost_name: '二级费用名称',

 estimate_cost: 800,

 cost: 900,

 id: '998773',

 is_cal: 0,

 is_pay: 0,
 },{
 first_cost_name: '一级费用名称',

 cost_name: '二级费用名称2',

 estimate_cost: 801,

 cost: 902,

 id: '998779',

 is_cal: 0,

 is_pay: 0,
 }],
 [{
 first_cost_name: '一级费用名称2',

 cost_name: '二级费用名称22',

 estimate_cost: 1600,

 cost: 9000,

 id: '998776',

 is_cal: 0,

 is_pay: 1,
 }]]*/

let payList = [];
let hasPayList = [];
let pageType

class PayPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showProgress: true,//显示加载
            showReload: false,//显示加载更多
            pageType: this.props.pageType,//判断显示 还是支付
            service_id: this.props.id,//服务单 id
            dataList: firstDataList,
            payList: payList,
            total: 0,
            serviceTotal: 0,
            fax: 0,
            serviceTotalAndFax: 0,
            selectedAll: false,
            order_status: this.props.order_status// 确认按钮是否显示
        }

        pageType = this.props.pageType

    }

    _selectAllTab(event) {
        this.setState({selectedAll: event})
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
            NativeAppEventEmitter.addListener('in_payPage_need_set_total', (event)=> {
                if (pageType == 'show') {
                    return
                }

                let total = 0
                if (event) {
                    //全选
                    for (let data of firstDataList) {
                        for (let item of data) {
                            if (item.is_pay == 0 && payList.indexOf(item.id) == -1) {
                                payList.push(item.id)
                            }
                        }
                    }
                    this._selectAllTab(true)

                    //计算总价
                    for (let data of firstDataList) {
                        for (let item of data) {
                            if (item.is_pay == 0 && payList.indexOf(item.id) != -1) {
                                total += item.cost
                            }
                        }
                    }
                    this.setState({total: total, payList: payList})

                } else {
                    //计算总价
                    for (let data of firstDataList) {
                        for (let item of data) {
                            if (item.is_pay == 0 && payList.indexOf(item.id) != -1) {
                                total += item.cost
                            }
                        }
                    }
                    this.setState({total: total})
                }


            })
            //NativeAppEventEmitter.emit('in_payPage_need_set_total')
        )
    }

    componentDidMount() {
        firstDataList = []
        /*        payList=[]
         hasPayList=[]
         this.setState({payList:payList})*/
        //if (firstDataList.length == 0) {
        this._fetchData()
        //}


    }

    async _fetchData() {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.serviceCost_findServiceCost,
                    id: this.state.service_id,
                    deviceId: deviceID,
                    token: token,

                }
            }

            options.data = await this.gZip(options)


            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)

            result = JSON.parse(result)
            //console.log('gunZip:', result)
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

                let dataList = result.result
                let serviceTotal = 0
                let fax = 0
                let serviceTotalAndFax = 0
                let total = 0
                //开始循环收到数据
                for (let data of dataList) {
                    if (data.first_cost_name == '服务费总金额') {
                        serviceTotal = pageType == 'pay' ? data.cost : data.estimate_cost
                        break
                    } else if (data.first_cost_name == '服务费税额') {
                        fax = pageType == 'pay' ? data.cost : data.estimate_cost
                        break
                    } else if (data.first_cost_name == '服务费价税合计') {
                        serviceTotalAndFax = pageType == 'pay' ? data.cost : data.estimate_cost
                        break
                    }

                    if (data.is_pay == 1 && payList.indexOf(data.id) == -1) {
                        //已经支付到加入已支付集合
                        payList.push(data.id)
                        hasPayList.push(data.id)
                    }

                    if (firstDataList.length > 0) {
                        let flag = true;
                        for (let index = firstDataList.length - 1; index >= 0; index--) {
                            let content = firstDataList[index]
                            //属于已经存在的集合项目
                            let item = content[0]
                            if (item.first_cost_name == data.first_cost_name) {
                                content.push(data)
                                flag = false;
                                break
                            }

                        }
                        if (flag) {
                            //到这里说明数据源不包含
                            let content = []
                            content.push(data)
                            firstDataList.push(content)
                        }
                    } else {
                        //数据源为空
                        let content = []
                        content.push(data)
                        firstDataList.push(content)
                    }
                }
                //console.log(`firstData:`, firstDataList)
                console.log(`payList:`, payList.length)

                //计算总价
                for (let data of firstDataList) {
                    for (let item of data) {
                        if (item.is_pay == 0 && payList.indexOf(item.id) != -1) {
                            total += item.cost
                        }
                    }
                }
                //this.setState({total:total})
                this.setState({
                    showProgress: false,//显示加载
                    showReload: false,//显示加载更多
                    payList: payList,
                    dataList: firstDataList,
                    serviceTotal: serviceTotal,
                    fax: fax,
                    serviceTotalAndFax: serviceTotalAndFax,
                    total: total,

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
            console.log(error)
            this.setState({
                showProgress: false,//显示加载
                showReload: true,//显示加载更多
            })
        }

    }

    _onRequestClose(){
        this.props.navigator.pop()
    }

    /**
     *
     first_cost_name 一级费用名称

     cost_name 二级费用名称

     estimate_cost 预估费用

     cost 实际费用

     id id

     is_cal 是否计算，0否，1是`

     is_pay 是否支付，0否，1是`
     * @returns {XML}
     */
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
                {this.state.showProgress || this.state.showReload ? null : (
                    <View style={{flex:1,flexDirection:'column'}}>
                        <ScrollView
                            style={styles.container}>
                            {this.state.dataList.map((data, index) => {
                                let select = false
                                for (let cost of data) {
                                    if (this.state.payList.indexOf(cost.id) != -1) {
                                        select = true
                                        break
                                    }
                                }
                                return (
                                    <PayItem
                                        key={`key${index}`}
                                        child={data}
                                        payList={this.state.payList}
                                        //showIcon={true}
                                        showChild={false}
                                        selected={select}
                                        pageType={pageType}
                                        selectedAll={this.state.selectedAll}/>
                                )
                            })
                            }
                        </ScrollView>
                        <View style={styles.viewItem}>
                            <View style={{flex:1,marginLeft:15,flexDirection:'row'}}>
                                <Text >服务费总金额</Text>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginRight:5,}}>
                                    <Text
                                        style={{color:constants.UIActiveColor,marginRight:5}}>￥{this.state.serviceTotal}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.viewItem}>
                            <View style={{flex:1,marginLeft:15,flexDirection:'row'}}>
                                <Text >服务费税额</Text>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginRight:5,}}>
                                    <Text style={{color:constants.UIActiveColor,marginRight:5}}>￥{this.state.fax}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.viewItem}>
                            <View style={{flex:1,marginLeft:15,flexDirection:'row'}}>
                                <Text >服务费价税合计</Text>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginRight:5,}}>
                                    <Text
                                        style={{color:constants.UIActiveColor,marginRight:5}}>￥{this.state.serviceTotalAndFax}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height:50,justifyContent:'center',alignItems:'center',
                            marginLeft:constants.MarginLeftRight,marginRight:constants.MarginLeftRight,}}>
                            <Text>由于不可估计因素,预估和实际价格可能略有出入,具体账单请以实际价格为准</Text>
                        </View>
                        <Button
                            ref={ component => this.button2 = component }
                            touchableType={Button.constants.touchableTypes.fadeContent}
                            style={[styles.button,this.state.order_status==10||this.state.order_status==30
                            ||this.state.order_status==70||this.state.order_status==100?{height:0}:{height:40}]}
                            textStyle={{fontSize: 17, color: 'white'}}
                            loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold',
                                fontFamily: '.HelveticaNeueInterface-MediumP4',}}>确认中...</Text>
                            </View>
                    }
                            onPress={ () => {
                        this.button2.setState({

                            loading: true,
                            //disabled: true,
                        });
                        if(pageType=='show'&&this.props.order_status==20){

                         this._fetch_confirm()

                         }else if(pageType=='pay'){
                         this.props.navigator.push({
                            title: '在线支付',
                            component: OnlinePayPage,
                            passProps: {
                            id:this.state.service_id,
                            payList:payList,
                            hasPayList:hasPayList,
                            total:this.state.total,
                            },
                            });
                         }else{
                          this.button2.setState({
                                loading: false,
                                //disabled: false
                            })
                         }
                        /*
                        setTimeout( () => {
                            this.button2.setState({
                                loading: false,
                                //disabled: false
                            })
                        }, 3000)*/
                    }}>
                            {pageType == 'show' ? `确认报价` : `确认支付￥${this.state.total}`}
                        </Button>
                    </View>
                )}

                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>
                </Toast>
            </View>
        );
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


    async _fetch_confirm() {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.serviceOrder_confirmServiceOrder,
                    id: this.state.service_id,
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
                //确认账单
                NativeAppEventEmitter.emit('bill_has_be_conform_should_refresh', this.state.service_id)
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

}


export default AppEventListenerEnhance(XhrEnhance(PayPage))

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
        paddingLeft: 10,
        backgroundColor: 'white',
    },
    line: {
        //marginLeft: constants.MarginLeftRight,
        //marginRight: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    button: {

        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3, borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30,
        marginLeft: constants.MarginLeftRight,
        marginRight: constants.MarginLeftRight,
    },
    viewItem: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: constants.MarginLeftRight,
        paddingRight: constants.MarginLeftRight,

        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor
    },

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
        if (pageType == 'pay') {
            return (
                <TouchableOpacity
                    onPress={() => {
                    //全选逻辑
                    for(data of firstDataList){
                        for(item of data){
                            if(payList.indexOf(item.id)==-1){
                                payList.push(item.id)
                                }
                            }
                        }
                        //统计总价
                         NativeAppEventEmitter.emit('in_payPage_need_set_total',true)
                    }
                    }
                    style={navigatorStyle.navBarRightButton}>
                    <View style={navigatorStyle.navBarLeftButtonAndroid}>
                        <Text
                            style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 14,}]}
                            color={'white'}>全选
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }
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