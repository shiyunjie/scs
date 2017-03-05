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
    NativeAppEventEmitter,
} from 'react-native';

import SplashScreen from 'react-native-smart-splash-screen'
import Swiper from '../components/indexSwiper'
import constants from  '../constants/constant'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
import ItemView from '../components/UserViewItem'
import HeaderView from '../components/listViewheaderView'
import addOrderPage from './addOrderPage'
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import XhrEnhance from '../lib/XhrEnhance'
import LoginPage from './loginPage'
import Button from 'react-native-smart-button';

import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-smart-toast'

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'


import image_banner from '../images/banner.png'
import image_button from '../images/button.png'
import image_logo from '../images/horse.png'
import {getDeviceID,getToken} from '../lib/User'


//import { index_showPicture, } from '../mock/xhr-mock'   //mock data


const { width: deviceWidth,height:deviceHeight} = Dimensions.get('window');
let refreshedDataSource = [{
    file_url: 'http://www.doorto.cn/images/banner-03.jpg',
    big_url: 'http://www.doorto.cn/images/banner-03.jpg',
    id: '2',
}, {
    file_url: 'http://www.doorto.cn/images/banner-01.jpg',
    big_url: 'http://www.doorto.cn/images/banner-01.jpg',
    id: '1',
}]

let advertisementDataSource = [
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
            {buttonImage: image_button, buttonText: "发起委托单"},
            advertisementDataSource,
        ]

        this.state = {
            count: 0,
            dataList: dataList,
            dataSource: this._dataSource.cloneWithRows(dataList),

        }
        if(constants.development){

        }
    }

    componentWillMount() {
        //NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        //let currentRoute = this.props.navigator.navigationContext.currentRoute
        //this.addAppEventListener(
        //    this.props.navigator.navigationContext.addListener('willfocus', (event) => {
        //        //console.log(`indexPage willfocus...`)
        //        //console.log(`currentRoute`, currentRoute)
        //        //console.log(`event.data.route`, event.data.route)
        //        if (currentRoute === event.data.route) {
        //            //console.log("indexPage willAppear")
        //            //this._pullToRefreshListView.beginRefresh()
        //            let { refreshBackAnimating, loadMoreBackAnimating, _scrollView, _scrollY, } = this._pullToRefreshListView
        //            if (!refreshBackAnimating && !loadMoreBackAnimating) {
        //                _scrollView.scrollTo({y: _scrollY - 5, animated: true,})
        //                _scrollView.scrollTo({y: _scrollY + 5, animated: true,})
        //                //console.log(`_scrollY + StyleSheet.hairlineWidth`, _scrollY + StyleSheet.hairlineWidth)
        //            }
        //            //NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        //            NativeAppEventEmitter.emit('setRootPageNavigationBar.index')
        //        } else {
        //            //console.log("indexPage willDisappear, other willAppear")
        //        }
        //        //
        //    })
        //)

    }

    componentDidMount() {

        //console.log(`this._pullToRefreshListView.beginRefresh()`)
        this._pullToRefreshListView.beginRefresh()

    }

    render() {

        return (
            <View style={{flex:1}}>
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
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                    renderRow={this._renderRow}
                    onRefresh={this._onRefresh}
                    //pullUpDistance={70}
                    //pullUpStayDistance={100}
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

    _addOrder = ()=> {
        getToken().then((token)=>{
            //console.log('token', token)
            if (token && token != '') {

                this.props.navigator.push({
                    title: '发起委托',
                    component: addOrderPage,
                    passProps: {
                        action: 'add'
                    }
                });
            }else{
                this.props.navigator.push({
                    title: '用户登录',
                    component: LoginPage,
                });
            }
        })


    }


    async _fetchData() {
        let token = await getToken()
        let deviceID = await getDeviceID()
        let options = {
            method: 'post',
            url: constants.api.service,
            //url: constants.api.indexShowPicture,
            data: {
                iType: constants.iType.indexShowPicture,
                deviceId: deviceID,
                token: token,
            }
        }
        options.data = await this.gZip(options)

        try {

            let resultData = await this.fetch(options)
            //console.log('resultData:', resultData)
            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            //console.log('gunZip:', result)
            result = JSON.parse(result)

            if(!result){
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }



            if (result.code && result.code == 10) {
                let dataList = [
                    result.result == null || result.result.length == 0 ? refreshedDataSource : result.result,
                    {buttonImage: image_button, buttonText: "发起委托单"},
                    advertisementDataSource,
                ]
                this.setState({
                    dataList: dataList,
                    dataSource: this._dataSource.cloneWithRows(dataList),
                })
            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
                //..调用toast插件, show出错误信息...
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
            this._pullToRefreshListView.endRefresh()
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

    }


    _renderHeader = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {refresh_none, refresh_idle, will_refresh, refreshing,} = PullToRefreshListView.constants.viewState
        //pullDistancePercent = Math.round(pullDistancePercent * 100)
        if (pullDistancePercent > 1) {
            pullDistancePercent = 1
        }
        let degree = 180 * pullDistancePercent
        //console.log(`degree -> `, degree)

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
        return (
            <View
                style={{flexDirection: 'column',height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                <Image source={image_logo} style={{width:30,height:30}}/>
                <Text style={{color:constants.PointColor,fontSize:constants.DefaultFontSize}}>胖马贸服</Text>
            </View>
        )
    }

    _renderRow = (rowData, sectionID, rowID) => {
        //console.log(`rowData`, rowData)
        //console.log(`rowID`, rowID)
        if (rowID == 0) {
            return (
                <Swiper
                    autoplay={true}
                    width={deviceWidth}
                    dataSource={rowData}/>

            )
        }
        else if (rowID == 1) {
            return (
                <View style={styles.swiper}>
                        <Button
                            touchableType={Button.constants.touchableTypes.fadeContent}
                            style={{flex:1,}}
                            textStyle={{fontSize: 14, color: 'white'}}
                            onPress={this._addOrder}
                        >
                        <Image source={rowData.buttonImage}
                               style={{width:150,height:95,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'white'}}>{rowData.buttonText}</Text>
                        </Image>
                       </Button>

                </View>
            )
        }
        else if (rowID == 2) {
            return (
                <View>
                    {
                        rowData.map((item, index) => {
                            return (
                                <View key={`item-${index}`}
                                      style={{overflow: 'hidden',borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc',marginBottom:10,}}>
                                    <Image source={item} style={{height:200,width:deviceWidth}}/>
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

        //setTimeout(() => {
        this._fetchData()

        //}, 1000)

    }
}

export default AppEventListenerEnhance(XhrEnhance(Index))

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

/*const navigationBarRouteMapper = {

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
                    首页
                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    首页
                </Text>
            </View>
        )
    },

}*/
