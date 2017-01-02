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

} from 'react-native';

import Index from './root';
import SplashScreen from 'react-native-smart-splash-screen'
import constants from  './constants/constant';

export default class Root extends Component {

    constructor (props, context) {
        super(props);
    }

    componentDidMount () {
        SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
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
                    routeMapper={NavigationBarRouteMapper}
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
        return null
    },

    Title: function (route, navigator, index, navState) {
        return (
            <Text style={[styles.navBarText, styles.navBarTitleText]}>
                {route.title}
            </Text>
        )
    },

};

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