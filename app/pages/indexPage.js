/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ListView,
    Image,
    ActivityIndicator,
    ProgressBarAndroid,
    ActivityIndicatorIOS,
    Platform,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import Swiper from '../components/indexSwiper';
import constants from  '../constants/constant';
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';
import ItemView from '../components/UserViewItem';
import HeaderView from '../components/listViewheaderView';
import addOrderPage from './addOrderPage';

import image_banner from '../images/banner.png';
import image_button from '../images/button.png';

const { width: deviceWidth } = Dimensions.get('window');
let refreshedDataSource = [{path: 'http://www.doorto.cn/images/banner-03.jpg'}, {path: 'http://www.doorto.cn/images/banner-02.jpg'},
    {path: 'http://www.doorto.cn/images/banner-01.jpg'},];
let advertisementDataSource = [{path: ''}, {path: ''}, {path: ''},{path: ''},];

export default class Index extends Component {
    // 构造
    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            advDataSource: [],
            autoplay: false,
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
                //removeClippedSubviews={false}
                renderHeader={this._renderHeader}
                renderFooter={this._renderFooter}
                onRefresh={this._onRefresh}
                onLoadMore={this._onLoadMore}
                autoLoadMore={true}
                onEndReachedThreshold={15}
            >
                <Swiper
                    autoplay={this.state.autoplay}
                    width={deviceWidth}
                    dataSource={this.state.dataSource}/>

                <View style={styles.swiper}>
                    <TouchableOpacity onPress={this._addOrder}>
                    <Image source={image_button}
                           style={{width:150,height:95,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'white'}}>发起委托单</Text>
                    </Image>
                    </TouchableOpacity>
                </View>

                {
                    this.state.advDataSource.map((item, index) => {
                        return (
                            <View key={`item-${index}`}
                                  style={{overflow: 'hidden',borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc',marginBottom:10,}}>
                                <Image source={image_banner} style={{height:100}}/>
                            </View>
                        )
                    })

                }
            </PullToRefreshListView>

        );
    }
    _addOrder=()=>{
        this.props.navigator.push({
            title: '发起委托',
            component: addOrderPage,
            passProps: {
                action:'add'
            }
        });
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
                indeterminate = true;
                return (<HeaderView name='Circle' // spinkit
                                    size={constants.IconSize}
                                    title='刷新中...'
                                    isRefresh={true}
                />)
        }
    }

    _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
/*        switch (pullState) {
            case load_more_none:
                return (
                    <View
                        style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>没有更多信息</Text>
                    </View>
                )
            case loading_more:
                return (
                    <View
                        style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>没有更多信息</Text>
                    </View>
                )
            case loaded_all:
                return (
                    <View
                        style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>没有更多信息</Text>
                    </View>
                )
        }*/
    }

    _onRefresh = () => {
        //console.log('outside _onRefresh start...')

        //simulate request data
        setTimeout(() => {

            //console.log('outside _onRefresh end...')

            this.setState({
                dataSource: refreshedDataSource,
                advDataSource: advertisementDataSource,
            })
            this._pullToRefreshListView.endRefresh()


            this.setState({
                autoplay: true,
            })
        }, 3000)
    }

    _onLoadMore = () => {
        console.log('outside _onLoadMore start...')

      let loadedAll = true;
        this._pullToRefreshListView.endLoadMore(loadedAll)

        /* this.setTimeout(() => {

         //console.log('outside _onLoadMore end...')

         let length = this.state.dataSource.length

         let addedDataSource = []

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

         }, 3000)*/
    }


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

        justifyContent: 'center',
        alignItems: 'stretch',


    },
    swiper: {
        flex: 1,
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,

    },
    Myslide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',


    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
});
