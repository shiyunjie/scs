/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Alert,
    ScrollView,
    ListView,
    Image,
    TouchableOpacity,
    NativeAppEventEmitter,
    ActivityIndicator,
    ProgressBarAndroid,
    ActivityIndicatorIOS,
} from 'react-native';

import constants from  '../constants/constant';
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';
import ItemView from '../components/orderListItemView';
import ServiceDetailPage from './serviceDetailPage';
import {getDeviceID,getToken} from '../lib/User'
import HeaderView from '../components/listViewheaderView';
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'


let firstDataList = [];

import XhrEnhance from '../lib/XhrEnhance' //http
//import { serviceOrder_serviceOrderList,errorXhrMock } from '../mock/xhr-mock'   //mock data

let pageIndex = 1;//当前页码
let pageLength=10;//每页条数

class ServiceList extends Component {
    // 构造
    constructor(props) {
        super(props);
        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataList: firstDataList,
            dataSource: this._dataSource.cloneWithRows(firstDataList),
        }
    }

    componentWillMount() {

        this.addAppEventListener(
            NativeAppEventEmitter.addListener('user_login_out_serviceList_need_reset', () => {

                this.setState({
                    dataList: firstDataList,
                    dataSource: this._dataSource.cloneWithRows(firstDataList),
                })
            })
        )

        this.addAppEventListener(
            NativeAppEventEmitter.addListener('serviceDetail_hasCancel_should_resetState', (event) => {
                let DataList = this.state.dataList
                for (let data of DataList) {
                    if (data.id == event) {
                        data.order_status = 100
                        data.order_status_name = '已取消'
                        break
                    }
                }
                this.setState({
                    dataList: DataList,
                    dataSource: this._dataSource.cloneWithRows(DataList),
                })
            })
        )

        this.addAppEventListener(
            NativeAppEventEmitter.addListener('bill_has_be_conform_should_refresh', (event)=> {
                let DataList = this.state.dataList
                for (let data of DataList) {
                    if (data.id == event) {
                        data.order_status = 40
                        data.order_status_name = '待审核'
                        break
                    }
                }
                this.setState({
                    dataList: DataList,
                    dataSource: this._dataSource.cloneWithRows(DataList),
                })

            })
        )
    }


    componentDidMount() {
        if (firstDataList.length == 0 || firstDataList.length == 1) {
            this._pullToRefreshServiceListView.beginRefresh()
        }
    }

    render() {
        return (
            <View style={{flex:1}}>
                <PullToRefreshListView
                    onLoadMore={this._onLoadMore}
                    style={styles.container}
                    ref={ (component) => this._pullToRefreshServiceListView = component }
                    viewType={PullToRefreshListView.constants.viewType.listView}
                    contentContainerStyle={{backgroundColor: 'transparent', }}
                    initialListSize={10}
                    pageSize={10}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.dataSource}
                    renderHeader={this._renderHeader}
                    renderFooter={this._renderFooter}
                    renderRow={this._renderRow}
                    onRefresh={this._onRefresh}
                    //autoLoadMore={true}
                    pullUpDistance={100}
                    pullUpStayDistance={constants.pullDownStayDistance}
                    pullDownDistance={100}
                    pullDownStayDistance={constants.pullDownStayDistance}>

                </PullToRefreshListView>
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>
                </Toast>
            </View>

        );
    }

    /**
     * {
id 服务单id

commission_order_no 服务单号

departure_name 起运国

destination_name 目的国

create_time_str 生成时间

order_status_name 订单状态 中文名称

order_status 订单状态 值

logistics_status 物流状态 值

total_cost 服务费总计
}
     */
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <TouchableOpacity
                ref={`ref-${rowID}`}
                key={`item-${rowID}`}
                style={{flex:1}}
                onPress={ ()=>{
                            this.props.navigator.push({
                            title: '服务单',
                            component: ServiceDetailPage,
                            passProps: {
                            id:rowData.id,
                            },
                            });
                            } }>
                <ItemView
                    orderNum={rowData.commission_order_no}
                    time={rowData.create_time_str}
                    rightText={rowData.order_status_name}
                    logistics={rowData.logistics_status_str}
                    cost={rowData.total_cost}
                    showCost={true}
                    route={`${rowData.departure_name} -- -- ${rowData.destination_name}`}
                    style={[{overflow: 'hidden'}]}/>
            </TouchableOpacity>

        )
    }


    _renderHeader = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {refresh_none, refresh_idle, will_refresh, refreshing,} = PullToRefreshListView.constants.viewState
        //pullDistancePercent = Math.round(pullDistancePercent * 100)
        if (pullDistancePercent > 1) {
            pullDistancePercent = 1
        }
        let degree = 180 * pullDistancePercent

        let indeterminate = false;
        switch (pullState) {
            case refresh_none:
                return (
                    <HeaderView name='md-arrow-round-up'  // 图标
                                size={constants.IconSize}
                                title='下拉即可刷新...'
                                degree={degree}/>
                )
            case refresh_idle:
                return (
                    <HeaderView name='md-arrow-round-down'  // 图标
                                size={constants.IconSize}
                                title='下拉即可刷新...'
                                degree={degree}/>
                )
            case will_refresh:
                return (
                    <HeaderView name='md-arrow-round-down'  // 图标
                                size={constants.IconSize}
                                title='释放即可刷新...'
                                degree={degree}/>
                )
            case refreshing:
                /*{this._renderActivityIndicator()}*/
                indeterminate = true;
                return (
                    <HeaderView name='Circle' // spinkit
                                size={constants.IconSize}
                                title='刷新中...'
                                isRefresh={true}/>
                )
        }
    }

    _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        //pullDistancePercent = Math.round(pullDistancePercent * 100)

        if (pullDistancePercent > 1) {
            pullDistancePercent = 1
        }
        let degree = 180 * pullDistancePercent

        switch (pullState) {
            case load_more_none:
                return (
                    <HeaderView name='md-arrow-round-down'  // 图标
                                size={constants.IconSize}
                                title='上拉加载更多...'
                                degree={degree}
                                isFoot={true}/>
                )
            case load_more_idle:
                return (
                    <HeaderView name='md-arrow-round-up'  // 图标
                                size={constants.IconSize}
                                title='上拉加载更多...'
                                degree={degree}
                                isFoot={true}/>
                )
            case will_load_more:
                return (
                    <HeaderView name='md-arrow-round-up'  // 图标
                                size={constants.IconSize}
                                title='释放加载更多...'
                                degree={degree}
                                isFoot={true}/>
                )
            case loading_more:
                return (
                    <HeaderView name='Circle' // spinkit
                                size={constants.IconSize}
                                title='加载中...'
                                isRefresh={true}
                                isFoot={true}/>
                )
            case loaded_all:
                return (
                    <View
                        style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text style={{color:constants.PointColor,fontSize:constants.DefaultFontSize}}>没有更多信息</Text>
                    </View>
                )
        }
    }

 /*   _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch (pullState) {
            case load_more_none:
                return (
                    <View
                        style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text style={{color:constants.PointColor,fontSize:constants.DefaultFontSize}}>上拉加载更多...</Text>
                    </View>
                )
            case loading_more:
                return (
                    <View
                        style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        {this._renderActivityIndicator()}<Text style={{color:constants.PointColor,fontSize:constants.DefaultFontSize}}>加载中...</Text>
                    </View>
                )
            case loaded_all:
                return (
                    <View
                        style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text style={{color:constants.PointColor,fontSize:constants.DefaultFontSize}}>没有更多信息</Text>
                    </View>
                )
        }
    }*/

    _renderActivityIndicator () {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{marginRight: 10,}}
                animating={true}
                color={'#ff0000'}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{marginRight: 10,}}
                    color={'#ff0000'}
                    styleAttr={'Small'}/>

            ) : (
            <ActivityIndicatorIOS
                style={{marginRight: 10,}}
                animating={true}
                color={'#ff0000'}
                size={'small'}/>
        )
    }

    _onRefresh = () => {
        //console.log('outside _onRefresh start...')

        //simulate request data
        pageIndex = 1;
        this._fetchData_refresh()
        /* setTimeout(() => {

         //console.log('outside _onRefresh end...')


         this.setState({
         dataSource: refreshedDataSource,
         })
         this._pullToRefreshServiceListView.endRefresh()

         }, 3000)*/
    }

    _onLoadMore = () => {
        //console.log('outside _onLoadMore start...')
        pageIndex++;
        this._fetchData_loadMore()
        /*    setTimeout(() => {

         //console.log('outside _onLoadMore end...')

         let length = this.state.dataSource.length

         let addedDataSource = [{
         id: (length + 1) + '',
         orderNum: '23366555',
         time: '2017-01-01 12:00',
         rightText: '已报价',
         logistics: '已抵达',
         cost: '￥3000.00',
         route: '日本----中国'
         }]

         this.setState({
         dataSource: this.state.dataSource.concat(addedDataSource),
         })

         let loadedAll
         if (length >= 30) {
         loadedAll = true
         this._pullToRefreshServiceListView.endLoadMore(loadedAll)
         }
         else {
         loadedAll = false
         this._pullToRefreshServiceListView.endLoadMore(loadedAll)
         }

         }, 3000)*/
    }

    async _fetchData_refresh() {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let start=0;
            if(pageIndex==1){
                start=0
            }else if(pageIndex==2){
                start=pageLength
            }else{
                start=(pageIndex-1)*pageLength+1
            }
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.serviceOrderList,
                    current_page: pageIndex,
                    deviceId: deviceID,
                    length:pageLength,
                    token: token,
                    start:start,
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
                NativeAppEventEmitter.emit('getMsg_202_code_need_login');
                return
            }
            if (result.code && result.code == 10) {
                this.setState({
                    dataList: result.result,
                    dataSource: this._dataSource.cloneWithRows(result.result),
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
            //console.log('_pullToRefreshServiceListView error:' + error);
            if(this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }

        }
        finally {

            this._pullToRefreshServiceListView.endRefresh()
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

    }

    async _fetchData_loadMore() {
        let loadedAll = false;
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let start=0;
            if(pageIndex==1){
                start=0
            }else if(pageIndex==2){
                start=pageLength
            }else{
                start=(pageIndex-1)*pageLength+1
            }
            let options = {
                method:'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.serviceOrderList,
                    current_page: pageIndex,
                    deviceId: deviceID,
                    length:pageLength,
                    token: token,
                    start:start,
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
                NativeAppEventEmitter.emit('getMsg_202_code_need_login');
                return
            }
            if (result.code && result.code == 10) {

                if (result.result && result.result.length > 0) {
                    loadedAll = false
                    let dataList = this.state.dataList.concat(result.result)


                    this.setState({
                        dataList: dataList,
                        dataSource: this._dataSource.cloneWithRows(dataList),
                    })
                    //this._pullToRefreshServiceListView.endLoadMore(loadedAll)
                } else {

                    loadedAll = true
                    //this._pullToRefreshServiceListView.endLoadMore(loadedAll)
                    pageIndex--;
                    if (pageIndex < 1) {
                        pageIndex = 1;
                    }

                }
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

            pageIndex--;
            if (pageIndex < 1) {
                pageIndex = 1;
            }
        }
        finally {
            this._pullToRefreshServiceListView.endLoadMore(loadedAll)
        }

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.UIBackgroundColor,
        //backgroundColor: 'red',
    },

});
export default AppEventListenerEnhance(XhrEnhance(ServiceList))