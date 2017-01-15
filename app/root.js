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

    AsyncStorage,
} from 'react-native';

//import IndexPage from './pages/indexPage';
import IndexPage from './pages/uploadPage';

import UserPage from './pages/userPage';
import OrderPage from './pages/orderPage';
import MorePage from './pages/morePage';
import LoginPage from './pages/loginPage';

import TabNavigator from 'react-native-tab-navigator';
import Badge from 'react-native-smart-badge'
import navigatorStyle from './styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import { getToken, } from './lib/User'


import constants from  './constants/constant';
import TabView from './components/tabView'
let backFirstClick = 0//判断一次点击回退键

class Root extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab: '首页',
            hasBadge: false,
            //modalVisible:false,
        };
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            this.addAppEventListener(
                BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
            )
        }
        //NativeAppEventEmitter.sendEvent('getMsg_202_code_need_login')
        this.addAppEventListener(
            NativeAppEventEmitter.addListener('getMsg_202_code_need_login', () => {
                //需要登录
                AsyncStorage.removeItem('token')
                AsyncStorage.removeItem('realName')
                this._PushLogin()
            })
        )

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

    render() {
        return (
            <TabNavigator style={{flex:1,}}>
                <TabNavigator.Item
                    selected={ this.state.selectedTab === '首页' }
                    renderIcon={ () =>  <TabView
                                            name='ios-home'
                                            size={constants.IconSize}
                                            title='首页'
                                            selected={ this.state.selectedTab === '首页' }/> }
                    onPress={ () => {

                        this.setState({selectedTab: '首页',})
                         NativeAppEventEmitter.emit('setNavigationBar.index', NavigationBarRouteMapperList[0])
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
                        this._handlePressOrder()
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
                    renderBadge={ () => this.state.hasBadge?<Badge style={styles.number} />:<View/> }
                    onPress={ () => {
                       this._handlePressPerson()
                    }}>
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
                        this._handlePressMore()
                        } }>
                    <MorePage navigator={this.props.navigator}/>
                </TabNavigator.Item>
            </TabNavigator>
        );
    }

    _handlePressPerson = async () => {
        let token = await getToken()

        console.log('token', token)
        if (token && token != '') {
            this.setState({selectedTab: '我的',})
            NativeAppEventEmitter.emit('setNavigationBar.index', NavigationBarRouteMapperList[2])
        }
        else {

            console.log(`_handlePressPerson`)
            this._PushLogin()

        }
    }
    _handlePressMore = async () => {
        let token = await getToken()

        console.log('token', token)
        if (token && token != '') {
            this.setState({selectedTab: '更多',})
            NativeAppEventEmitter.emit('setNavigationBar.index', NavigationBarRouteMapperList[3])
        }
        else {

            console.log(`_handlePressPerson`)
            this._PushLogin()

        }
    }

    _handlePressOrder = async () => {
        let token = await getToken()

        console.log('token', token)
        if (token && token != '') {
            this.setState({selectedTab: '订单',})
            NativeAppEventEmitter.emit('setNavigationBar.index', NavigationBarRouteMapperList[1])
        }
        else {

            console.log(`_handlePressPerson`)
            this._PushLogin()

        }
    }

    _PushLogin() {
        this.props.navigator.push({
            title: '用户登录',
            component: LoginPage,
        });
    }
}

export default AppEventListenerEnhance(Root)


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
                    style={navigatorStyle.navBarLeftButton}>
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarButtonText]}>
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
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                        首页
                    </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
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
                    style={navigatorStyle.navBarLeftButton}>
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarButtonText]}>
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
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                        订单
                    </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
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
                    style={navigatorStyle.navBarLeftButton}>
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarButtonText]}>
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
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                        个人中心
                    </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                        个人中心
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
                    style={navigatorStyle.navBarLeftButton}>
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarButtonText]}>
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
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                        更多
                    </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                    <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                        更多
                    </Text>
                </View>
            )
        },

    },
];
