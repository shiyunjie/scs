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
} from 'react-native';

import constants from  '../constants/constant';
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';
import ItemView from '../components/orderListItemView';
import ServiceDetailPage from './serviceDetailPage';

import HeaderView from '../components/listViewheaderView';
let firstDataList = [{
    id: '1',
    commission_order_no: '888777655',
    departure_name: '日本',
    destination_name: '中国',
    create_time_str: '2017-01-01 12:00',
    order_status_name: '已下单', // 订单状态 中文名称
    order_status: 10,// 订单状态 值
    logistics_status:20,
    total_cost:3000,
}];

import XhrEnhance from '../lib/XhrEnhance' //http
//import { serviceOrder_serviceOrderList,errorXhrMock } from '../mock/xhr-mock'   //mock data

let pageIndex=1;//当前页码

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
            dataSource:  this._dataSource.cloneWithRows(firstDataList),
        }
    }


    componentDidMount() {
        this._pullToRefreshServiceListView.beginRefresh()
    }

    render() {
        return (

            <PullToRefreshListView
                onLoadMore={this._onLoadMore}
                style={styles.container}
                ref={ (component) => this._pullToRefreshServiceListView = component }
                viewType={PullToRefreshListView.constants.viewType.listView}
                contentContainerStyle={{backgroundColor: 'transparent', }}
                initialListSize={10}
                pageSize={10}
                dataSource={this.state.dataSource}
                renderHeader={this._renderHeader}
                renderFooter={this._renderFooter}
                renderRow={this._renderRow}
                onRefresh={this._onRefresh}
                pullUpDistance={100}
                pullUpStayDistance={constants.pullDownStayDistance}
                pullDownDistance={100}
                pullDownStayDistance={constants.pullDownStayDistance}>

            </PullToRefreshListView>

        );
    }
    /**
     * {
    id: '1',
    commission_order_no: '888777655',
    departure_name: '日本',
    destination_name: '中国',
    create_time_str: '2017-01-01 12:00',
    order_status_name: '已下单', // 订单状态 中文名称
    order_status: 10,// 订单状态 值
    logistics_status:20,
    total_cost:3000,
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
                            passProps: rowData,
                            });
                            } }>
                <ItemView
                    orderNum={rowData.commission_order_no}
                    time={rowData.create_time_str}
                    rightText={rowData.order_status_name}
                    logistics={rowData.logistics_status}
                    cost={rowData.total_cost}
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
                                degree={degree}/>
                )
            case load_more_idle:
                return (
                    <HeaderView name='md-arrow-round-up'  // 图标
                                size={constants.IconSize}
                                title='上拉加载更多...'
                                degree={degree}/>
                )
            case will_load_more:
                return (
                    <HeaderView name='md-arrow-round-up'  // 图标
                                size={constants.IconSize}
                                title='释放加载更多...'
                                degree={degree}/>
                )
            case loading_more:
                return (
                    <HeaderView name='Circle' // spinkit
                                size={constants.IconSize}
                                title='加载中...'
                                isRefresh={true}/>
                )
            case loaded_all:
                return (
                    <View
                        style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>没有更多信息</Text>
                    </View>
                )
        }
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

        let options = {
            method:'post',
            url: constants.api.service,
            //url: constants.api.serviceOrder_serviceOrderList,
            data: {
                iType: constants.iType.serviceOrder_serviceOrderList,
                current_page: pageIndex,
            }
        }
        try {
            let result = await this.fetch(options)
            result = JSON.parse(result)
            console.log(`result list`, JSON.stringify(result.result.list));
            let dataList = result.result.list

            console.log(`dataList`, JSON.stringify(dataList));
            this.setState({
                dataList: dataList,
                dataSource: this._dataSource.cloneWithRows(dataList),
            })
            console.log('_pullToRefreshServiceListView endRefresh'+this._pullToRefreshServiceListView);
            this._pullToRefreshServiceListView.endRefresh()
        }
        catch (error) {

            //..调用toast插件, show出错误信息...
            this._pullToRefreshServiceListView.endRefresh()
        }
        finally {
            console.log('_pullToRefreshServiceListView error:'+error);
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

    }

    async _fetchData_loadMore() {
        let options = {
            //method:{'post'},
            url: constants.api.serviceOrder_serviceOrderList,
            data: {
                iType: constants.iType.serviceOrder_serviceOrderList,
                current_page: pageIndex,
            }
        }
        try {
            let result = await this.fetch(options)
            result = JSON.parse(result)
            //console.log(`fetch result -> `, typeof result)
            //console.log(`result`, result.result)
            let loadedAll
            if (result.result.list && result.result.list.length > 0) {
                loadedAll = false
                let dataList = this.state.dataList.concat(result.result.list)


                this.setState({
                    dataList: dataList,
                    dataSource: this._dataSource.cloneWithRows(dataList),
                })
                this._pullToRefreshServiceListView.endLoadMore(loadedAll)
            } else {

                loadedAll = true
                this._pullToRefreshServiceListView.endLoadMore(loadedAll)
                pageIndex--;
                if (pageIndex < 1) {
                    pageIndex = 1;
                }

            }

        }
        catch (error) {
            //console.log(error)
            //..调用toast插件, show出错误信息...

            pageIndex--;
            if (pageIndex < 1) {
                pageIndex = 1;
            }
        }
        finally {
            this._pullToRefreshServiceListView.endLoadMore()
        }

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.UIBackgroundColor,
    },

});
export default XhrEnhance(ServiceList)