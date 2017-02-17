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
    Platform,
    TouchableOpacity,
    NativeAppEventEmitter,
} from 'react-native';


import constants from  '../constants/constant';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'


class MessageDetail extends Component {

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


    render() {
       /* return (
            <View style={styles.container}>
                <View style={styles.itemView}>
                    <View style={{flex:3,}}>
                        <Text style={{fontSize:17,marginLeft:constants.MarginLeftRight}} numberOfLines={1}>{this.props.title}</Text>
                    </View>
                    <View style={{flex:2,justifyContent:'flex-end',marginRight:constants.MarginLeftRight}}>
                        <Text style={{flex:1,color:constants.UIInActiveColor}}>{this.props.send_time}</Text>
                    </View>
                </View>
                <View
                    style={{flex:1,marginTop:10,marginLeft:constants.MarginLeftRight,marginRight:constants.MarginLeftRight}}>
                    <Text numberOfLines={5}>{this.props.content}</Text>
                </View>
            </View>
        );*/
        return (
            <View style={styles.container}>
                <View style={styles.itemView}>

                        <Text style={{fontSize:17,color:constants.LabelColor,}} numberOfLines={1}>{this.props.title}</Text>


                        <Text style={{fontSize:12,marginTop:5,color:constants.UIInActiveColor}}>{this.props.send_time}</Text>

                </View>
                <View style={{height:1,borderBottomWidth: StyleSheet.hairlineWidth,borderColor:constants.LineColor,
                marginLeft:constants.MarginLeftRight,marginRight:constants.MarginLeftRight}}/>
                <View
                    style={{flex:1,marginTop:10,marginLeft:constants.MarginLeftRight,marginRight:constants.MarginLeftRight}}>
                    <Text numberOfLines={5} style={{fontSize:14,color:constants.PointColor}}>{this.props.content}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',

        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: 'white',
    },
    itemView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,

    },

});

const navigationBarRouteMapper = {

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
                    {route.title}
                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {route.title}
                </Text>
            </View>
        )
    },

}

export default AppEventListenerEnhance(MessageDetail)