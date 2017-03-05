/**
 * Created by shiyunjie on 17/2/28.
 */
import React from 'react';
import {
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


import navigatorStyle from '../styles/navigatorStyle';       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';



export let navigationBar = {
    selectedTab: '',

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
        let routeTitle = route.title
        if (routeTitle == '首页') {
            routeTitle = this.selectedTab
        }
        return (
            Platform.OS == 'ios' ?
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {routeTitle}
                </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {routeTitle}
                </Text>
            </View>
        )
    },

}