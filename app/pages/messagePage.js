/**
 * Created by shiyunjie on 16/12/31.
 */
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
    NativeAppEventEmitter,
    SwipeableRow,
} from 'react-native';

import constants from  '../constants/constant';
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';
import ItemView from '../components/messageViewItem'
import HeaderView from '../components/listViewheaderView';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';

import SwipeRow from '../components/SwipeRow'
//import Swipeable from '../components/swipeable'

import {getDeviceID,getToken} from '../lib/User'
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import MessageDetail from './messageDetail'
//import Swipeout from 'react-native-swipeout';

import XhrEnhance from '../lib/XhrEnhance' //http


let pageIndex = 1;//当前页码
let pageLength=20;//每页条数
let firstDataList = [];

class MessageList extends Component {
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
        this.firstFetch = true;
    }


    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                //console.log(`OrderDetail willfocus...`)
                //console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (currentRoute === event.data.route) {
                    //console.log("OrderDetail willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    //console.log("OrderDetail willDisappear, other willAppear")
                }
                //
            })
        )

        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('didfocus', (event) => {
                //console.log(`payPage didfocus...`)
                if (event && currentRoute === event.data.route) {
                    console.log("upload didAppear")
                    if (this.firstFetch) {
                        this._PullToRefreshListView.beginRefresh()
                        this.firstFetch = false;
                    }

                }else {
                    //console.log("orderPage willDisappear, other willAppear")
                }


            })
        )


    }

    componentDidMount(){
        //this._PullToRefreshListView.beginRefresh()
    }




    render() {
        return (
            <View style={{flex:1}}>
                <PullToRefreshListView
                    onLoadMore={this._onLoadMore}
                    style={styles.container}
                    ref={ (component) => this._PullToRefreshListView = component }
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

    /*
     <Swipeable
     style={{flex:1}}
     rightActionActivationDistance={50}
     rightButtons={[
     <TouchableOpacity
     onPress={()=>{this.setState({ rightActionActivated: false,})
     this._fetchData_delete(rowData.id)}}
     style={{flex:1,justifyContent:'center',flexDirection:'column',
     alignItems:'flex-start',backgroundColor:'red'}}>
     <Text style={{color:'white',textAlign:'center',
     textAlignVertical:'center',marginLeft:27}}>删除</Text>
     </TouchableOpacity>
     ]}>

     <TouchableOpacity style={{flex:1}}
     onPress={ ()=>{
     //已读
     rowData.do_ret=true
     this._fetchData_read(rowData.id)
     this.props.navigator.push({
     title: '消息',
     component: MessageDetail,
     passProps: rowData,
     });
     } }>
     <ItemView
     style={[{overflow: 'hidden',}]}
     size={constants.IconSize}
     title={rowData.title}
     time={rowData.send_time}
     content={rowData.content}
     do_ret={rowData.do_ret}/>
     </TouchableOpacity>
     </Swipeable>
     */
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            rowData.id == 0 ? <View style={{height:0}}/> :
                    <SwipeRow
                        style={{flex:1}}
                        onRowPress={ ()=>{
                         this.props.navigator.push({
                         title: '消息',
                         component: MessageDetail,
                         passProps: rowData,
                         });
                                        //已读
                         //this._fetchData_read(rowData.id)
                         rowData.do_ret = true

                       /* let dataList = this.state.dataList
                        for (let index = 0; index < dataList.length; index++) {
                            if (dataList[index].id == rowData.id) {
                                dataList[index].do_ret = true
                                break;
                            }

                        }*/
                        //console.log(`dataList`, dataList);

                        this.setState({
                            dataSource: this._dataSource.cloneWithRows(this.state.dataList),
                        })

                         } }
                        stopRightSwipe={-100}
                        rightOpenValue={-70}
                        disableRightSwipe={true}
                        tension={10}
                        preview={false}>
                        <View style={{flex:1,flexDirection:'row',alignItems:'stretch'}}>
                            <View style={{flex:1}}/>
                            <TouchableOpacity
                                onPress={ ()=>{

                                this._fetchData_delete(rowData.id)
                                } }
                                style={{width:100,justifyContent:'center',
                                alignItems:'stretch',backgroundColor:'red',}}>
                                <Text style={{color:'white',marginLeft:30,textAlign:'center',fontSize:14}}>删除</Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{flex:1}}>
                            <ItemView
                                size={constants.IconSize}
                                title={rowData.title}
                                //time={rowData.send_time}
                                content={rowData.content}
                                do_ret={rowData.do_ret}/>
                        </View>
                    </SwipeRow>





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

    _onRefresh = () => {
        //console.log('outside _onRefresh start...')

        //simulate request data
        pageIndex = 1;
        this._fetchData_refresh()

    }

    _onLoadMore = () => {
        //console.log('outside _onLoadMore start...')
        pageIndex++;
        this._fetchData_loadMore()

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
                    iType: constants.iType.findSysInfoShow,
                    current_page: pageIndex,
                    deviceId: deviceID,
                    length:pageLength,
                    token: token,
                    start:start,
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

                //console.log(`result list`, result.result);
                let dataList = result.result

                //console.log(`dataList`, dataList);

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
            this._PullToRefreshListView.endRefresh()
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

    }

    async _fetchData_loadMore() {
        let loadedAll = false
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let start=0;
            if(pageIndex==1){
                start=pageLength
            }else if(pageIndex==2){
                start=pageLength
            }else{
                start=(pageIndex-1)*pageLength+1
            }
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.findSysInfoShow,
                    current_page: pageIndex,
                    deviceId: deviceID,
                    length:pageLength,
                    token: token,
                    start:start,
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
            //console.log(`fetch result -> `, typeof result)
            //console.log(`result`, result.result)
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
                } else {

                    loadedAll = true

                    pageIndex--;
                    if (pageIndex < 1) {
                        pageIndex = 1;
                        0
                    }

                }
            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
                pageIndex--;
                if (pageIndex < 1) {
                    pageIndex = 1;
                }
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
            this._PullToRefreshListView.endLoadMore(loadedAll)
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

    }

    async _fetchData_delete(id) {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()

            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.delSysInfo,
                    id: id,
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

                /**
                 * dataList中删除消息
                 * @type {*[]}
                 */
                let dataList = this.state.dataList
                for (let index = 0; index < dataList.length; index++) {
                    if (dataList[index].id == id) {
                        dataList.splice(index, 1);
                        //dataList[index].id=0
                        break;
                    }

                }
                //console.log(`dataList`, dataList);
                this.setState({

                    dataSource: new ListView.DataSource({
                        rowHasChanged: (r1, r2) => r1 !== r2,
                    })
                })


                this.setState({
                    dataList: dataList,
                    dataSource: this._dataSource.cloneWithRows(dataList),
                })
                this._PullToRefreshListView.endLoadMore(true)


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

    }

    async _fetchData_read(id) {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()

            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.infoDetail,
                    id: id,
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
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',

    },

});


import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar
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
//
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

export default AppEventListenerEnhance(XhrEnhance(MessageList))
