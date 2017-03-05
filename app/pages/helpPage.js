/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { PropTypes,Component } from 'react';
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
} from 'react-native';

import constants from  '../constants/constant'
import firstDataList from '../constants/helpData'

//import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
//import ItemView from '../components/orderItemView'
import HeaderView from '../components/listViewheaderView'
import MessageDetail from './messageDetail'
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons'


//import XhrEnhance from '../lib/XhrEnhance' //http
//import { sysInfo_helpCenter,errorXhrMock } from '../mock/xhr-mock'   //mock data


import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import ItemView from '../components/helpItemView'

let pageIndex = 1;//当前页码
let dataList=[]





class Help extends Component {
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


    }


    componentDidMount() {
        //this._pullToRefreshListView.beginRefresh()
    }

    /*<PullToRefreshListView
     onLoadMore={this._onLoadMore}
     style={styles.container}
     ref={ (component) => this._PullToRefreshListView= component }
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

     </PullToRefreshListView>*/

    render() {
        return (
            <ListView
                style={styles.container}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                contentContainerStyle={styles.listStyle}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}/>
        );
    }

    /**
     *  <TouchableOpacity
     key={`item-${rowID}`}
     style={{height:50,}}
     onPress={()=>{
                    this.props.navigator.push({
                    title: '帮助中心',
                    component: MessageDetail,
                    passProps: {
                        title:rowData.title,
                        brief:rowData.id,
                        child:rowData.child,
                        }
                        });
                        }}>
     <ItemView
     style={[{overflow: 'hidden',borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc',}]}
     name='ios-arrow-forward'
     size={constants.IconSize}
     title={rowData.title}/>
     </TouchableOpacity>
     * @param rowData
     * @param sectionID
     * @param rowID
     * @private
     */
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <ItemView
                key={`key${rowID}`}
                show={false}
                data={rowData}
                index={rowID}/>
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

        let options = {
            //method:{'post'},
            url: constants.api.sysInfo_helpCenter,
            data: {
                iType: constants.iType.sysInfo_helpCenter,
                current_page: pageIndex,
                memberId: this.props.memberId,
            }
        }
        try {
            let result = await this.fetch(options)
            result = JSON.parse(result)

            //console.log(`result list`, JSON.stringify(result.result.list));
            let dataList = result.result.list

            //console.log(`dataList`, JSON.stringify(dataList));
            this.setState({
                dataList: dataList,
                dataSource: this._dataSource.cloneWithRows(dataList),
            })

        }
        catch (error) {
            //console.log(error)


        }
        finally {
            this._PullToRefreshListView.endRefresh()
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

    }

    async _fetchData_loadMore() {
        let options = {
            //method:{'post'},
            //url: constants.api.service,
            url: constants.api.sysInfo_helpCenter,
            data: {
                iType: constants.iType.sysInfo_helpCenter,
                current_page: pageIndex,
                memberId: this.props.memberId,
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

            } else {

                loadedAll = true

                pageIndex--;
                if (pageIndex < 1) {
                    pageIndex = 1;
                }

            }

        }
        catch (error) {
            //console.log(error)


            pageIndex--;
            if (pageIndex < 1) {
                pageIndex = 1;
            }
        }
        finally {
            this._PullToRefreshListView.endLoadMore(false)
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        //backgroundColor: constants.UIBackgroundColor,
        backgroundColor: 'white',
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

export default AppEventListenerEnhance(Help)