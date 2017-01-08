/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Navigator,
    Text,
    TouchableOpacity,
    Platform,
    View,
    NativeAppEventEmitter,
} from 'react-native';

import Index from './root';
import constants from  './constants/constant'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'



class Root extends Component {
    constructor (props, context) {
        super(props);
        this.state={
            navigationBar:NavigationBarRouteMapper,
        }
    }

    componentDidMount () {
        NativeAppEventEmitter.addListener('setNavigationBar.index', (navigationBar) => {
            this.setState({
                navigationBar: navigationBar,
            })
        })


    }


    render () {
        return (
            <Navigator style={styles.container}
                       initialRoute={{
              component: Index,
                  title: '首页'
            }}
                       sceneStyle={styles.navigatorBg}
                       renderScene={(route, navigator) => {
              let Component = route.component;
              return (
                  <Component
                      navigator={navigator}
                      {...route.passProps}
                    />
              )}}
                       navigationBar={
                <Navigator.NavigationBar
                    ref={(navigationBar) => {
                      this.navigationBar = navigationBar
                    }}
                    routeMapper={this.state.navigationBar}
                    style={styles.navBar} /> }
            />
        )
    }
}

let NavigationBarRouteMapper = {

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
                    {route.title}
                </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                            <Text style={[styles.navBarText, styles.navBarTitleText]}>
                                {route.title}
                            </Text>
                        </View>
        )
    },

};

export default XhrEnhance(Root)

const styles = StyleSheet.create({
    navigatorBg: {
        backgroundColor: '#F4F4F4',
    },
    navBar: {
        backgroundColor: constants.UIActiveColor,
    },
    navBarText: {
        flex:1,
        fontSize: 16,
        color: 'white',
        textAlign:'center',
        textAlignVertical:'center',

    },
    navBarTitleText: {
        color: 'white',
        fontWeight: '500',
        marginVertical: 9,
    },

    navBarLeftButton: {
        paddingLeft: 10,
    },
    navBarRightButton: {
        paddingRight: 10,
    },
    navBarButtonText: {
        color: '#5890FF',
    },
})