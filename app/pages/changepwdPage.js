/**
 * Created by shiyunjie on 16/12/27.
 */
/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
    NativeAppEventEmitter,
} from 'react-native';

import Button from 'react-native-smart-button';
import constants from  '../constants/constant';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import XhrEnhance from '../lib/XhrEnhance' //http
//import { member_changePwd,errorXhrMock } from '../mock/xhr-mock'   //mock data

class SetPassword extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            oldPass:'',
            newPass:'',
            confPass:'',
        };
      }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.props.navigator.navigationContext.addListener('willfocus', (event) => {
            console.log(`orderPage willfocus...`)
            console.log(`currentRoute`, currentRoute)
            //console.log(`event.data.route`, event.data.route)
            if (event&&currentRoute === event.data.route) {
                console.log("orderPage willAppear")
                NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
            } else {
                console.log("orderPage willDisappear, other willAppear")
            }
            //
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='原密码'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable = {true}
                           value={this.state.oldPass}
                           onChangeText={(text) => this.setState({oldPass:text})}/>


                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='新密码'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable = {true}
                           value={this.state.newPass}
                           onChangeText={(text) => this.setState({newPass:text})}/>


                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='确认密码'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable = {true}
                           value={this.state.confPass}
                           onChangeText={(text) => this.setState({confPass:text})}/>




                <Button
                    ref={ component => this._button_2 = component }
                    touchableType={Button.constants.touchableTypes.fadeContent}
                    style={[styles.button,{ marginLeft: constants.MarginLeftRight,
        marginRight: constants.MarginLeftRight,
        marginTop: 20,}]}
                    textStyle={{fontSize: 17, color: 'white'}}
                    loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>
                                保存中...</Text>
                            </View>
                    }
                    onPress={ () => {
                        this._button_2.setState({
                            loading: true,
                            //disabled: true,
                        })
                       /* setTimeout( () => {
                            this._button_2.setState({
                                loading: false,
                                //disabled: false
                            })

                        }, 3000)*/
                        this._fetch_changePassword
                    }}>
                    保存
                </Button>

            </View>
        );
    }
    _renderActivityIndicator() {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{margin: 10,}}
                    color={'#fff'}
                    styleAttr={'Small'}/>

            ) : (
            <ActivityIndicatorIOS
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        )


    }
    async _fetch_changePassword(){
        let options = {
            method:'post',
            url: constants.api.member_changePwd,
            data: {
                iType: constants.iType.member_changePwd,
                //memberId:this.props.memberId,
                old_pwd:this.state.oldPass,
                new_pwd:this.state.newPass,
                sure_pwd:this.state.confPass,

            }
        }
        try {
            let result = await this.fetch(options)
            result = JSON.parse(result)
            //console.log(`fetch result -> `, typeof result)
            //console.log(`result`, result.result)
            alert(result.code)

        }
        catch (error) {
            //console.log(error)
            //..调用toast插件, show出错误信息...

        }
        finally {
            this._button_2.setState({
                loading: false,
                //disabled: false
            })
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS == 'ios' ? 64+10 : 56+10,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: constants.UIBackgroundColor,
    },
    textInput: {
        backgroundColor: 'white',
        height: 40,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIBackgroundColor,

    },
    button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3, borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30,

    },
});


const navigationBarRouteMapper = {

    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[ index - 1 ];
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


export default XhrEnhance(SetPassword)