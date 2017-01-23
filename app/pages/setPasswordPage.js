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
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
} from 'react-native';

import {getDeviceID,getToken} from '../lib/User'
import {hex_md5} from '../lib/md5'
import Button from 'react-native-smart-button';
import constants from  '../constants/constant';
import Icon from 'react-native-vector-icons/Ionicons';
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'



class SetPassword extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            phone: this.props.phone,
            password:'',
            confPwd:'',

        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='请输入密码'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable={true}
                           secureTextEntry={true}
                           value={this.state.password}
                           onChangeText={(text) => this.setState({password:text})}/>

                    <TextInput style={styles.textInput}
                               clearButtonMode="while-editing"
                               placeholder='确认密码'
                               maxLength={20}
                               underlineColorAndroid='transparent'
                               editable={true}
                               secureTextEntry={true}
                               value={this.state.confPwd}
                               onChangeText={(text) => this.setState({confPwd:text})}/>
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
                        this._fetch_setPassword()
                        /*setTimeout( () => {
                            this._button_2.setState({
                                loading: false,
                                //disabled: false
                            })

                        }, 3000)*/
                    }}>
                    保存
                </Button>
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>

                </Toast>
            </View>
        );
    }

    async _fetch_setPassword(){
        try {
            let token= await getToken()
            let deviceID= await getDeviceID()

            let options = {
                method:'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.SavePwd,
                    phone:this.state.phone,
                    pwd:hex_md5(this.state.password),
                    surePwd:hex_md5(this.state.confPwd),
                    deviceId:deviceID,
                    token:token,

                }
            }

            options.data=await this.gZip(options)

            console.log(`_fetch_sendCode options:` ,options)

            let resultData = await this.fetch(options)

            let result=await this.gunZip(resultData)

            result=JSON.parse(result)
            console.log('gunZip:',result)
            if(result.code&&result.code==10){
                /* Alert.alert('提示', '注册成功', () => {
                 this.props.navigator.popToTop()
                 })*/
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '保存成功'
                })
                let routes = this.props.navigator.getCurrentRoutes();
                this.props.navigator.popToRoute(routes[routes.length-3])

            }else{
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            console.log(error)


        }
        finally {
            this._button_2.setState({
                loading: false,
                //disabled: false
            })
        }
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
}

export default XhrEnhance(SetPassword)

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS == 'ios' ? 64+10 : 56+10,
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
        paddingLeft:10,
        paddingRight:10,

    },
    button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3, borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30,

    },
});