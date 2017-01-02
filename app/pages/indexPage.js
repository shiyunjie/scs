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

import SplashScreen from 'react-native-smart-splash-screen'
import Swiper from '../components/indexSwiper'
import constants from  '../constants/constant'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
import ItemView from '../components/UserViewItem'
import HeaderView from '../components/listViewheaderView'
import addOrderPage from './addOrderPage'
import XhrEnhance from '../lib/XhrEnhance'

import image_banner from '../images/banner.png'
import image_button from '../images/button.png'


import { index_showPicture, } from '../mock/xhr-mock'   //mock data



const { width: deviceWidth } = Dimensions.get('window');
let refreshedDataSource =[{
        file_url: '',
        big_url: 'http://www.doorto.cn/images/banner-01.jpg',
        id: '1',
    }, {
        file_url: '',
        big_url: 'http://www.doorto.cn/images/banner-02.jpg',
        id: '1',
    }, {
        file_url: '',
        big_url: 'http://www.doorto.cn/images/banner-03.jpg',
        id: '1',
    }, ]
let advertisementDataSource = [
    image_banner,
    image_banner,
    image_banner,
    image_banner,
]

class Index extends Component {
    // 构造
    constructor(props) {
        super(props);

        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        let dataList = [
            refreshedDataSource,
            { buttonImage: image_button, buttonText: "发起委托单" },
            advertisementDataSource,
        ]

        this.state = {
            dataList: dataList,
            dataSource: this._dataSource.cloneWithRows(dataList),
        }
    }

    componentDidMount() {
        this.props.navigator.navigationContext.addListener('willfocus', () => {

        })
        console.log(`this._pullToRefreshListView.beginRefresh()`)
        this._pullToRefreshListView.beginRefresh()
    }

    render() {

        return (

            <PullToRefreshListView
                style={styles.container}
                ref={ (component) => this._pullToRefreshListView = component }
                viewType={PullToRefreshListView.constants.viewType.listView}
                contentContainerStyle={{backgroundColor: 'transparent', }}
                initialListSize={3}
                pageSize={3}
                dataSource={this.state.dataSource}
                renderHeader={this._renderHeader}
                renderFooter={this._renderFooter}
                enabledPullUp={false}
                renderRow={this._renderRow}
                onRefresh={this._onRefresh}
            >

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

    async _fetchData () {
        let options = {
            url: constants.api.indexShowPicture,
            data: {
                iType: constants.iType.indexShowPicture,
            }
        }
        try {
            let result = await this.fetch(options)
            result = JSON.parse(result)
            //console.log(`fetch result -> `, typeof result)
            //console.log(`result`, result.result)
            let dataList = [
                result.result.list,
                { buttonImage: image_button, buttonText: "发起委托单" },
                advertisementDataSource,
            ]

            this.setState({
                dataList: dataList,
                dataSource: this._dataSource.cloneWithRows(dataList),
            })
            this._pullToRefreshListView.endRefresh()
        }
        catch(error) {
            //console.log(error)
            //..调用toast插件, show出错误信息...
            this._pullToRefreshListView.endRefresh()
        }
        finally {
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

    }
    
    _renderHeader = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {refresh_none, refresh_idle, will_refresh, refreshing,} = PullToRefreshListView.constants.viewState
        //pullDistancePercent = Math.round(pullDistancePercent * 100)
        if(pullDistancePercent > 1) {
            pullDistancePercent = 1
        }
        let degree = 180 * pullDistancePercent
        //console.log(`degree -> `, degree)

        let indeterminate = false;
        switch (pullState) {
            case refresh_none:
                return (
                    <HeaderView name='md-arrow-round-down'  // 图标
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
                return (<HeaderView name='Circle' // spinkit
                                    size={constants.IconSize}
                                    title='刷新中...'
                                    isRefresh={true}
                />)
        }
    }

    _renderFooter = (viewState) => {
        return (
            <View
                style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                <Text>[logo]胖马贸服</Text>
            </View>
        )
    }

    _renderRow = (rowData, sectionID, rowID) => {
        //console.log(`rowData`, rowData)
        //console.log(`rowID`, rowID)
        if(rowID == 0) {
            //return (
            //    <Swiper
            //        autoplay={false}
            //        width={deviceWidth}
            //        dataSource={rowData}/>
            //)
            return (
                <View>
                    <Swiper
                            autoplay={true}
                            width={deviceWidth}
                            dataSource={rowData}/>
                </View>
            )


        }
        else if(rowID == 1) {
            return (
                <View style={styles.swiper}>
                    <TouchableOpacity onPress={this._addOrder}>
                        <Image source={rowData.buttonImage}
                               style={{width:150,height:95,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'white'}}>{rowData.buttonText}</Text>
                        </Image>
                    </TouchableOpacity>
                </View>
            )
        }
        else if(rowID == 2) {
            return (
                <View>
                    {
                        rowData.map((item, index) => {
                            return (
                                <View key={`item-${index}`}
                                      style={{overflow: 'hidden',borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc',marginBottom:10,}}>
                                    <Image source={item} style={{height:100}}/>
                                </View>
                            )
                        })
                    }
                </View>
            )
        }
        else {
            return null
        }
    }

    _onRefresh = () => {
        
        setTimeout(() => {

            this._fetchData()

        }, 3000)

    }
}

export default XhrEnhance(Index)

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
