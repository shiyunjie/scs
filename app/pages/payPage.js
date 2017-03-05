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

import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'

import {getDeviceID,getToken} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import ProgressView from '../components/modalProgress'
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
let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => {
        return r1 !== r2
    },

})

class PayPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            DataSource: dataSource.cloneWithRows(firstDataList),
            showProgress: true,//显示加载
            showReload: false,//显示加载更多
            pageType: this.props.pageType,//判断显示 还是支付
            service_id: this.props.id,//服务单 id
            //dataList: firstDataList,
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
                console.log(`PayPage willfocus...`)
                console.log(`currentRoute`, currentRoute)
                console.log(`event.data.route`, event.data.route)
                if (currentRoute === event.data.route) {
                    console.log("PayPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    console.log("PayPage willDisappear, other willAppear")
                }
                //
            })
        )

        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('didfocus', (event) => {
                //console.log(`payPage didfocus...`)
                if (event && currentRoute === event.data.route) {
                    console.log("upload didAppear")
                        this.setState({ showProgress: true,//显示加载
                             })
                        this._fetchData()

                }else {
                    //console.log("orderPage willDisappear, other willAppear")
                }


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
                    this.setState({
                        total: total,
                        payList: payList,
                        DataSource: dataSource.cloneWithRows(firstDataList),
                    })

                } else {
                    //计算总价
                    for (let data of firstDataList) {
                        for (let item of data) {
                            if (item.is_pay == 0 && payList.indexOf(item.id) != -1) {
                                total += item.cost
                            }
                        }
                    }
                    this.setState({
                        total: total,
                    })
                }


            })
        )

        firstDataList = []
        /*        payList=[]
         hasPayList=[]
         this.setState({payList:payList})*/
        //if (firstDataList.length == 0) {


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

                let dataList = result.result
                let serviceTotal = 0
                let fax = 0
                let serviceTotalAndFax = 0
                let total = 0
                //开始循环收到数据
                console.log(`dataList:`,dataList.length)
                for (let data of dataList) {
                    //console.log(`first_cost_name:`,data)
                    //console.log(`pageType:`,pageType)

                    if (data.first_cost_name == '服务费总金额') {
                        console.log(`first_cost_name:`,data)
                        serviceTotal = pageType == 'pay' ? data.cost : data.estimate_cost
                        continue
                    } else if (data.first_cost_name == '服务费税额') {
                        console.log(`first_cost_name:`,data)

                        fax = pageType == 'pay' ? data.cost : data.estimate_cost
                        continue
                    } else if (data.first_cost_name == '服务费价税合计') {
                        console.log(`first_cost_name:`,data)
                        serviceTotalAndFax = pageType == 'pay' ? data.cost : data.estimate_cost
                        continue
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
                //console.log(`payList:`, payList.length)
                firstDataList
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
                    //dataList: firstDataList,
                    DataSource: dataSource.cloneWithRows(firstDataList),
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
            //console.log(error)
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

    }



    _renderRow = (data, sectionID, rowID) => {
        //console.log('sectionID = ' + sectionID + ' | rowID = ' + rowID)
        //console.log(rowData)

        let select = false
        for (let cost of data) {
            if (this.state.payList.indexOf(cost.id) != -1 && !cost.is_pay) {
                select = true
                break
            }
        }
        return (
            <PayItem
                key={`key${rowID}`}
                child={data}
                payList={this.state.payList}
                //showIcon={true}
                showChild={false}
                selected={select}
                pageType={pageType}
                selectedAll={this.state.selectedAll}/>
        )

    }

    /**
     *<ScrollView
     style={styles.container}
     showsVerticalScrollIndicator={false}>
     {this.state.dataList.map((data, index) => {
         let select = false
         for (let cost of data) {
             if (this.state.payList.indexOf(cost.id) != -1 && !cost.is_pay) {
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

                    <View style={{flex:1,flexDirection:'column'}}>
                        <View style={[{marginTop: Platform.OS == 'ios' ? 64 : 56,flexDirection:'row',alignItems:'center',
                             backgroundColor:'white'}]}>

                            <View style={[{flex: 1,justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        paddingTop: 10,
                                        paddingBottom: 10,flexDirection:'column'}]}>

                                <View style={{flexDirection:'row'}}>
                                    <Text
                                        style={[styles.contentText,{flex:1,fontSize:12,},]}>服务费总金额￥{this.state.serviceTotal}</Text>
                                    <Text
                                        style={[{flex:1,textAlign:'right',paddingRight:constants.MarginLeftRight,},
                                    styles.contentText,{fontSize:12,}]}>税额￥{this.state.fax}</Text>
                                </View>
                                <View style={{flexDirection:'row',marginTop:5,}}>
                                    <Text
                                        style={[styles.contentText,{flex:1,},]}>
                                        总计￥{this.state.serviceTotalAndFax}</Text>

                                </View>

                            </View>
                        </View>
                        <Text
                            style={[styles.contentText,{paddingTop:5,paddingBottom:5,fontSize:12}]}>明细</Text>


                        <ListView
                            automaticallyAdjustContentInsets={false}
                            dataSource={this.state.DataSource}
                            renderRow={this._renderRow}
                            style={styles.container}
                            showsVerticalScrollIndicator={false}
                            initialListSize={15}
                            onEndReachedThreshold={30}
                            pageSize={15}
                        />
                        <View style={styles.line}/>

                        <View style={{height:40,flexDirection:'row',backgroundColor:'white',alignItems:'center'}}>
                            <Text
                                style={[styles.contentText,{flex:2,fontSize:12,}]}>
                                由于不可估计因素,预估和实际价格可能略有出入,请以实际价格为准</Text>
                            {this.state.order_status==10||this.state.order_status==30
                            ||this.state.order_status==70||this.state.order_status==100?null:
                            <Button
                                ref={ component => this.button2 = component }
                                touchableType={Button.constants.touchableTypes.fadeContent}
                                style={[styles.button,{height:40}]}
                                textStyle={{fontSize: 12, color: 'white'}}
                                loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {
                                //this._renderActivityIndicator()
                                }
                                <Text style={{fontSize: 12, color: 'white', fontWeight: 'bold',
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
                         if(this.state.total<=0){
                         this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: '支付金额为0'
                            })
                            this.button2.setState({
                                loading: false,
                                //disabled: false
                            })
                         return;
                         }
                         this.props.navigator.push({
                            title: '在线支付',
                            component: OnlinePayPage,
                            passProps: {
                            id:this.state.service_id,
                            payList:payList,
                            hasPayList:hasPayList,
                            total:this._toDecimal(this.state.total),
                            },
                            });
                            this.button2.setState({
                                loading: false,
                                //disabled: false
                            })
                         }else{
                          this.button2.setState({
                                loading: false,
                                //disabled: false
                            })
                         }
                        /* setTimeout( () => {
                            this.button2.setState({
                                loading: false,
                                //disabled: false
                            })
                        }, 3000)*/
                    }}>
                                {pageType == 'show' ? `确认报价` : `支付￥${this._toDecimal(this.state.total)}`}
                            </Button>
                            }
                        </View>
                    </View>
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

    _toDecimal(x) {

        let f = Math.round(x*100)/100;
        let s = f.toString();
        let rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
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
                    iType: constants.iType.serviceOrder_confirmServiceOrder,
                    id: this.state.service_id,
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
                    children: '账单已确认'
                })

                setTimeout(()=>{
                    //确认账单
                    NativeAppEventEmitter.emit('bill_has_be_conform_should_refresh', this.state.service_id)
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
            this.button2.setState({
                loading: false,
                //disabled: false
            })
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

}


export default AppEventListenerEnhance(XhrEnhance(PayPage))

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: constants.UIBackgroundColor,
    },
    line: {
        //marginLeft: constants.MarginLeftRight,
        //marginRight: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    button: {

        flex: 1,
        backgroundColor: constants.UIActiveColor,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center',
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
        borderColor: constants.UIInActiveColor,
    },
    contentText: {
        fontSize: 14,
        color: constants.PointColor,
        paddingLeft: constants.MarginLeftRight,
    },

});

import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar,
    RightButton: function (route, navigator, index, navState) {
        if (pageType == 'pay') {
            return (
                <TouchableOpacity
                    onPress={ ()=> {
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
                    } }
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
//        if (pageType == 'pay') {
//            return (
//                <TouchableOpacity
//                    onPress={ ()=> {
//                    //全选逻辑
//                    for(data of firstDataList){
//                        for(item of data){
//                            if(payList.indexOf(item.id)==-1){
//                                payList.push(item.id)
//                                }
//                            }
//                        }
//                        //统计总价
//                         NativeAppEventEmitter.emit('in_payPage_need_set_total',true)
//                    } }
//                    style={navigatorStyle.navBarRightButton}>
//                    <View style={navigatorStyle.navBarLeftButtonAndroid}>
//                        <Text
//                            style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 14,}]}
//                            color={'white'}>全选
//                        </Text>
//                    </View>
//                </TouchableOpacity>
//            )
//        }
//    },
//
//    Title: function (route, navigator, index, navState) {
//        return (
//            Platform.OS == 'ios' ?
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    {route.title}
//                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    {route.title}
//                </Text>
//            </View>
//        )
//    },
//
//}