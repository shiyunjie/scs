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
    Linking,
    NativeAppEventEmitter,
} from 'react-native';


import constants from  '../constants/constant';

import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

class ItemView extends Component {


    render() {
        return (
            <View style={styles.itemView}><View style={styles.itemTitle}>
                <Text style={[styles.TabText,]}>{this.props.title}</Text>
            </View>
                <View style={styles.itemText}>
                    <Text style={[styles.TabText,this.props.color?{color:this.props.color}:
                    {color:constants.PointColor}]}>{this.props.text}</Text>
                </View>

            </View>
        )
    }
}



class Contact extends Component {
    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                //console.log(`orderPage willfocus...`)
                //console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (event && currentRoute === event.data.route) {
                    //console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    //console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <ItemView title='公司名字' text={constants.CompName}/>
                <TouchableOpacity onPress={this._onCall}>
                <ItemView title='联系电话' text={constants.CompTel} color={constants.UIActiveColor}/>
                </TouchableOpacity><ItemView title='传真' text={constants.CompFax}/>
                <ItemView title='邮箱' text={constants.CompEmail}/>
                <ItemView title='公司地址' text={constants.CompAddress}/>
            </View>
        )
    }


    _onCall() {
        //打电话
        return Linking.openURL(constants.Tel);
    }

}

export default AppEventListenerEnhance(Contact)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: constants.UIBackgroundColor,
    },
    itemView: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginLeft: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,

    },
    itemTitle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,


    },
    itemText: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 0,


    },
    TabText: {
        marginRight: 10,
        fontSize: 14,
        color:constants.LabelColor,
    },

});


import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar,
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