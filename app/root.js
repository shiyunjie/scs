/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    BackAndroid,
    Platform,
    NativeAppEventEmitter,
    TouchableOpacity,
} from 'react-native';

import IndexPage from './pages/indexPage';
import UserPage from './pages/userPage';
import OrderPage from './pages/orderPage';
import MorePage from './pages/morePage';
import LoginPage from './pages/loginPage';

import TabNavigator from 'react-native-tab-navigator';
import Badge from 'react-native-smart-badge'
/**
 * FontAwesome 4.2 Contains 479 icons

 Ionicons 2.0.0 Contains 733 icons, lots of iOS 7 style outlined icons.

 Foundation icons Contains 283 icons.

 Zocial Contains 99 social icons.
 */
import Icon from 'react-native-vector-icons/Ionicons';

import constants from  './constants/constant';
import TabView from './components/tabView'
let backFirstClick = 0//判断一次点击回退键

export default class Root extends Component {
    // 构造
    constructor (props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab: '首页',
        };
    }

    componentWillMount () {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount () {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    onBackAndroid = () => {
        const routers = this.props.navigator.getCurrentRoutes();
        if (routers.length > 1) {
            this.props.navigator.pop();
            return true;
        } else {
            let timestamp = (new Date()).valueOf();
            if (timestamp - backFirstClick > 2000) {
                backFirstClick = timestamp;

                return true;
            } else {
                return false;
            }
        }

    };

    /*
     <View style={styles.tabView}><Icon
     name='ios-home'  // 图标
     size={constants.IconSize}
     color={constants.UIInActiveColor}/><Text style={styles.tabText}>首页</Text>
     </View>*/

    render () {
        return (
            <TabNavigator >
                <TabNavigator.Item
                    selected={ this.state.selectedTab === '首页' }
                    renderIcon={ () =>  <TabView
                                            name='ios-home'
                                            size={constants.IconSize}
                                            title='首页'
                                            selected={ this.state.selectedTab === '首页' }/> }
                    onPress={ () => {

                        this.setState({selectedTab: '首页',})
                         //NativeAppEventEmitter.emit('setNavigationBar.index', NavigationBarRouteMapperList[0])
                    } }>
                    <IndexPage navigator={this.props.navigator}/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === '订单'}
                    renderIcon={ () =>  <TabView
                                            name='ios-paper'
                                            size={constants.IconSize}
                                            title='订单'
                                            selected={this.state.selectedTab === '订单'}/> }
                    onPress={ () => {
                        this.setState({selectedTab: '订单',})
                         //NativeAppEventEmitter.emit('setNavigationBar.index', NavigationBarRouteMapperList[1])
                    } }>
                    <OrderPage navigator={this.props.navigator}/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === '我的'}
                    renderIcon={ () =>  <TabView
                                            name='ios-person'
                                            size={constants.IconSize}
                                            title='我的'
                                            selected={this.state.selectedTab === '我的'}/> }
                    renderBadge={ () => <Badge style={styles.number} /> }
                    onPress={ () => {
                            this.props.navigator.push({
                                title: '胖马贸服',
                                component: LoginPage,
                            });
                            this.setState({selectedTab: '我的',})
                             //NativeAppEventEmitter.emit('setNavigationBar.index', NavigationBarRouteMapperList[2])
                        }
                    }>
                    <UserPage navigator={this.props.navigator}/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === '更多'}
                    renderIcon={ () =>  <TabView
                                            name='ios-more'
                                            size={constants.IconSize}
                                            title='更多'
                                            selected={this.state.selectedTab === '更多'}/> }
                    onPress={ () => {
                        this.setState({ selectedTab: '更多',})
                         //NativeAppEventEmitter.emit('setNavigationBar.index', NavigationBarRouteMapperList[3])
                    } }>
                    <MorePage navigator={this.props.navigator}/>
                </TabNavigator.Item>
            </TabNavigator>
        );
    }
}

let NavigationBarRouteMapperList = [
    {

    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[ index - 1 ];
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarLeftButton}>
                <Text style={[styles.navBarText, styles.navBarButtonText]}>
                    back
                </Text>
            </TouchableOpacity>
        );
    },

    RightButton: function (route, navigator, index, navState) {

    },

    Title: function (route, navigator, index, navState) {
        return (
            Platform.OS == 'ios' ?
                <Text style={[styles.navBarText, styles.navBarTitleText]}>
                    首页
                </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                <Text style={[styles.navBarText, styles.navBarTitleText]}>
                   首页
                </Text>
            </View>
        )
    },

},
    {

        LeftButton: function (route, navigator, index, navState) {
            if (index === 0) {
                return null;
            }

            var previousRoute = navState.routeStack[ index - 1 ];
            return (
                <TouchableOpacity
                    onPress={() => navigator.pop()}
                    style={styles.navBarLeftButton}>
                    <Text style={[styles.navBarText, styles.navBarButtonText]}>
                        back
                    </Text>
                </TouchableOpacity>
            );
        },

        RightButton: function (route, navigator, index, navState) {

        },

        Title: function (route, navigator, index, navState) {
            return (
                Platform.OS == 'ios' ?
                    <Text style={[styles.navBarText, styles.navBarTitleText]}>
                        订单
                    </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                    <Text style={[styles.navBarText, styles.navBarTitleText]}>
                        订单
                    </Text>
                </View>
            )
        },

    },
    {

        LeftButton: function (route, navigator, index, navState) {
            if (index === 0) {
                return null;
            }

            var previousRoute = navState.routeStack[ index - 1 ];
            return (
                <TouchableOpacity
                    onPress={() => navigator.pop()}
                    style={styles.navBarLeftButton}>
                    <Text style={[styles.navBarText, styles.navBarButtonText]}>
                        back
                    </Text>
                </TouchableOpacity>
            );
        },

        RightButton: function (route, navigator, index, navState) {

        },

        Title: function (route, navigator, index, navState) {
            return (
                Platform.OS == 'ios' ?
                    <Text style={[styles.navBarText, styles.navBarTitleText]}>
                        我的
                    </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                    <Text style={[styles.navBarText, styles.navBarTitleText]}>
                        我的
                    </Text>
                </View>
            )
        },

    },
    {

        LeftButton: function (route, navigator, index, navState) {
            if (index === 0) {
                return null;
            }

            var previousRoute = navState.routeStack[ index - 1 ];
            return (
                <TouchableOpacity
                    onPress={() => navigator.pop()}
                    style={styles.navBarLeftButton}>
                    <Text style={[styles.navBarText, styles.navBarButtonText]}>
                        back
                    </Text>
                </TouchableOpacity>
            );
        },

        RightButton: function (route, navigator, index, navState) {

        },

        Title: function (route, navigator, index, navState) {
            return (
                Platform.OS == 'ios' ?
                    <Text style={[styles.navBarText, styles.navBarTitleText]}>
                        更多
                    </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                    <Text style={[styles.navBarText, styles.navBarTitleText]}>
                        更多
                    </Text>
                </View>
            )
        },

    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },

    tabs: {
        height: 46,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {

        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,

    },
    number: {
        borderRadius: 3, width: 6, height: 6, backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        right: 0,

    }

});
