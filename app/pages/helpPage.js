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
    ActivityIndicator,
    ProgressBarAndroid,
    ActivityIndicatorIOS,
    Platform,
    TouchableOpacity,
} from 'react-native';

import TimerEnhance from 'react-native-smart-timer-enhance';
import constants from  '../constants/constant';

import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';
import ItemView from '../components/orderItemView';
import HeaderView from '../components/listViewheaderView';
import MessageDetail from './messageDetail';


let refreshedDataSource = [{id: 1, title: '常见问题标题'}, {id: 2, title: '常见问题标题'}, {id: 3, title: '常见问题标题'}, {
    id: 4,
    title: '常见问题标题'
}, {id: 5, title: '常见问题标题'}, {id: 6, title: '常见问题标题'}, {id: 7, title: '常见问题标题'}, {id: 8, title: '常见问题标题'}, {id: 9, title: '常见问题标题'}, {id: 10, title: '常见问题标题'}, {id: 11, title: '常见问题标题'}, {id: 12, title: '常见问题标题'}, {id: 13, title: '常见问题标题'}, {id: 14, title: '常见问题标题'}]


class Help extends Component {
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
                autoLoadMore={true}
                onEndReachedThreshold={15}
            >
                {
                    this.state.dataSource.map((item, index) => {
                        return (
                            <TouchableOpacity key={`item-${index}`} style={{height:50,}}
                                              onPress={()=>{
                                                    this.props.navigator.push({
                                                title: '帮助中心',
                                                component: MessageDetail,
                                                passProps: {
                                                    title:item.title,
                                                    content:item.id,
                                                }
                                            });
                                                   }}
                            >
                                <ItemView

                                    style={[{overflow: 'hidden',borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc',}]}
                                    name='ios-arrow-forward'

                                    size={constants.IconSize} title={item.title}
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
                /*{this._renderActivityIndicator()}*/
                indeterminate=true;
                return (

                    <HeaderView name='Circle' // spinkit
                                size={constants.IconSize}
                                title='刷新中...'
                                isRefresh={true}
                    />
                  /*  <View style={styles.HeaderView}>
                        <Progress.CircleSnail
                            size={32}
                            style={styles.progress}
                            color={[
                          '#F44336',
                          '#2196F3',
                          '#009688',
                        ]}
                        />
                    </View>*/
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
            case loading_more:
                return (
                    <View
                        style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>加载更多</Text>
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
        this.setTimeout(() => {

            //console.log('outside _onRefresh end...')



            this.setState({
                dataSource: refreshedDataSource,
            })
            this._pullToRefreshListView.endRefresh()

        }, 3000)
    }

    _onLoadMore = () => {
        //console.log('outside _onLoadMore start...')

        this.setTimeout(() => {

            //console.log('outside _onLoadMore end...')

            let length = this.state.dataSource.length

            let addedDataSource = [ {id: length+1, title: '常见问题标题'}, {id: length+2, title: '常见问题标题'}, {id: length+3, title: '常见问题标题'}
                , {id: length+4, title: '常见问题标题'}, {id: length+5, title: '常见问题标题'}, {id: length+6, title: '常见问题标题'}]


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

/*    _renderActivityIndicator() {
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
    }*/
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
    },
    progress: {
        margin: 3,
    },
    HeaderView: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',

    },

});

export default TimerEnhance(Help);