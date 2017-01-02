/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    ListView,
    Image,
    TouchableOpacity,
} from 'react-native';

import constants from  '../constants/constant';
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';
import ItemView from '../components/orderListItemView';

import HeaderView from '../components/listViewheaderView';
import OrderDetailPage from './orderDetailPage';

let refreshedDataSource = [{
    id: '1',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
}, {
    id: '2',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
}, {
    id: '3',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
}, {
    id: '4',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
}, {
    id: '5',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
}, {
    id: '6',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
}, {
    id: '7',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
}, {
    id: '8',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
}, {
    id: '9',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
}, {
    id: '10',
    orderNum: '23366555',
    time: '2017-01-01 12:00',
    rightText: '已报价',
    logistics: '已抵达',
    cost: '￥3000.00',
    route: '日本----中国'
},]

export default class OrderList extends Component {
    // 构造
    constructor(props) {
        super(props);

        this.state = {
            dataSource: []
        }
    }

    componentDidMount() {
        this._pullToRefreshListView.beginRefresh()
    }

    render() {
        return (

            <PullToRefreshListView
                style={styles.container}
                ref={ (component) => this._pullToRefreshListView = component }
                contentContainerStyle={{backgroundColor: 'transparent', }}
                renderHeader={this._renderHeader}
                renderFooter={this._renderFooter}
                onRefresh={this._onRefresh}
                onLoadMore={this._onLoadMore}
                autoLoad={true}
                onEndReachedThreshold={15}

            >
                {
                    this.state.dataSource.map((item, index) => {
                        return (
                            <TouchableOpacity key={`item-${index}`} style={{flex:1,}}
                                              onPress={()=>{
                                                    this.props.navigator.push({
                                                title: '委托单',
                                                component: OrderDetailPage,
                                                passProps: item,
                                            });
                                                   }}
                            >
                                <ItemView
                                    orderNum={item.orderNum}
                                    time={item.time}
                                    rightText={item.rightText}
                                    logistics={item.logistics}
                                    cost={item.cost}
                                    route={item.route}
                                    style={[{overflow: 'hidden',}]}

                                />
                            </TouchableOpacity>

                        )
                    })
                }
            </PullToRefreshListView>

        );
    }


    _renderHeader = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {refresh_none, refresh_idle, will_refresh, refreshing,} = PullToRefreshListView.constants.viewState
        //pullDistancePercent = Math.round(pullDistancePercent * 100)

        let indeterminate = false;
        switch (pullState) {
            case refresh_none:
                return (
                    <HeaderView name='md-arrow-round-down'  // 图标
                                size={constants.IconSize}
                                title='下拉即可刷新...'
                    />
                )
            case refresh_idle:
                return (
                    <HeaderView name='md-arrow-round-down'  // 图标
                                size={constants.IconSize}
                                title='下拉即可刷新...'
                    />
                )
            case will_refresh:
                return (
                    <HeaderView name='md-arrow-round-up'  // 图标
                                size={constants.IconSize}
                                title='释放即可刷新...'
                    />
                )
            case refreshing:

                indeterminate = true;
                return (

                    <HeaderView name='Circle' // spinkit
                                size={constants.IconSize}
                                title='刷新中...'
                                isRefresh={true}
                    />

                )
        }
    }

    _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch (pullState) {
            case load_more_none:
                return (
                    <View
                        style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>加载更多</Text>
                    </View>
                )
            case load_more_idle:
                return (
                    <View
                        style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>加载更多</Text>
                    </View>
                )
            case will_load_more:
                return (
                    <View
                        style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>释放即可加载</Text>
                    </View>
                )
            case loading_more:
                return (
                    <View
                        style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>加载中</Text>
                    </View>
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
        setTimeout(() => {

            //console.log('outside _onRefresh end...')


            this.setState({
                dataSource: refreshedDataSource,
            })
            this._pullToRefreshListView.endRefresh()

        }, 3000)
    }

    _onLoadMore = () => {
        //console.log('outside _onLoadMore start...')

        setTimeout(() => {

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
            },
                {
                    id: (length + 2) + '',
                    orderNum: '23366555',
                    time: '2017-01-01 12:00',
                    rightText: '已报价',
                    logistics: '已抵达',
                    cost: '￥3000.00',
                    route: '日本----中国'
                },
                {
                    id: (length + 3) + '',
                    orderNum: '23366555',
                    time: '2017-01-01 12:00',
                    rightText: '已报价',
                    logistics: '已抵达',
                    cost: '￥3000.00',
                    route: '日本----中国'
                }, {
                    id: (length + 4) + '',
                    orderNum: '23366555',
                    time: '2017-01-01 12:00',
                    rightText: '已报价',
                    logistics: '已抵达',
                    cost: '￥3000.00',
                    route: '日本----中国'
                },]

            this.setState({
                dataSource: this.state.dataSource.concat(addedDataSource),
            })

            let loadedAll
            if (length >= 30) {
                loadedAll = true
                this._pullToRefreshListView.endLoadMore(loadedAll)
            }
            else {
                loadedAll = false
                this._pullToRefreshListView.endLoadMore(loadedAll)
            }

        }, 3000)
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.UIBackgroundColor,

    },

});
