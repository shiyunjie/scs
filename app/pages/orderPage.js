/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    NativeAppEventEmitter,
} from 'react-native';


import constants from  '../constants/constant';
import OrderListPage from './orderListPage';
import ServiceListPage from './serviceListPage';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式


import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

import ScrollableTabView  from 'react-native-scrollable-tab-view';
import MyDefaultTabBar from '../components/defaultTabBar';


class Order extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            tabNames: ['委托单', '服务单',],
            tabIconNames: ['委托单', '服务单',],
            tabNums:[1,0,],
        };
    }


    componentWillMount() {
        ////NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        //let currentRoute = this.props.navigator.navigationContext.currentRoute
        //this.addAppEventListener(
        //this.props.navigator.navigationContext.addListener('willfocus', (event) => {
        //    //console.log(`orderPage willfocus...`)
        //    //console.log(`currentRoute`, currentRoute)
        //    //console.log(`event.data.route`, event.data.route)
        //    if (currentRoute === event.data.route) {
        //        //console.log("orderPage willAppear")
        //        //NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        //        //NativeAppEventEmitter.emit('setRootPageNavigationBar.index')
        //    } else {
        //        //console.log("orderPage willDisappear, other willAppear")
        //    }
        //    //
        //})
        //)

    }

    render() {
        let tabNames = this.state.tabNames;
        let tabIconNames = this.state.tabIconNames;
        let tabNums=this.state.tabNums;
        return (
            <ScrollableTabView
            locked={true}
            renderTabBar={ ()=><MyDefaultTabBar textStyle={{fontSize:13}} tabNames={tabNames} tabIconNames={tabIconNames} tabNums={tabNums}/> }>
            <OrderListPage navigator={this.props.navigator} tabLabel="委托单" />
            <ServiceListPage navigator={this.props.navigator} tabLabel="服务单" />
            </ScrollableTabView>);
    }
}

export default AppEventListenerEnhance(Order)

const styles = StyleSheet.create({
    container: {
        height: 40,
        marginTop: Platform.OS == 'ios' ? 64 : 56,

        backgroundColor: constants.UIBackgroundColor,
        position: 'absolute',
        top: 0,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
});

//const navigationBarRouteMapper = {
//
//    LeftButton: function (route, navigator, index, navState) {
//    if (index === 0) {
//        return null;
//    }
//
//    var previousRoute = navState.routeStack[ index - 1 ];
//    return (
//        <TouchableOpacity
//            onPress={() => navigator.pop()}
//            style={navigatorStyle.navBarLeftButton}>
//            <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarButtonText]}>
//                back
//            </Text>
//        </TouchableOpacity>
//    );
//},
//
//RightButton: function (route, navigator, index, navState) {
//
//},
//
//Title: function (route, navigator, index, navState) {
//    return (
//        Platform.OS == 'ios' ?
//            <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                订单
//            </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
//            <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                订单
//            </Text>
//        </View>
//    )
//},
//
//}