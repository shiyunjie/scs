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
    NativeAppEventEmitter,
    TouchableOpacity,
} from 'react-native';

import Button from 'react-native-smart-button';
import constants from  '../constants/constant';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import XhrEnhance from '../lib/XhrEnhance' //http
//import { register_firstStep,errorXhrMock } from '../mock/xhr-mock'   //mock data

import RegisterPage from './registerPage';
import SetPassword from './setPasswordPage';

let nextPage;

class ForgetPassword extends Component {
    // 构造
    constructor(props) {
        super(props);
        nextPage = this.props.nextPageIndex;
        // 初始状态
        this.state = {
            phone: '',
            code: '',
            deviceId:'9999',
        };
    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.props.navigator.navigationContext.addListener('willfocus', (event) => {
            console.log(`orderPage willfocus...`)
            console.log(`currentRoute`, currentRoute)
            //console.log(`event.data.route`, event.data.route)
            if (event && currentRoute === event.data.route) {
                console.log("orderPage willAppear")
                NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
            } else {
                console.log("orderPage willDisappear, other willAppear")
            }
            //
        })
    }

    componentDidMount() {
        //获取设备号
    }


    render() {

        return (
            <View style={styles.container}>
                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='请输入您的手机号'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable={true}
                           value={this.state.phone}
                           onChangeText={(text) => this.setState({phone:text})}/>
                <View style={[styles.textInput,{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'stretch',}]}>
                    <TextInput style={[{flex:2}]}
                               clearButtonMode="while-editing"
                               placeholder='请输入验证码'
                               maxLength={20}
                               underlineColorAndroid='transparent'
                               editable={true}
                               value={this.state.code}
                               onChangeText={(text) => this.setState({code:text})}/>
                    <Button
                        ref={ component => this._button_3 = component }
                        touchableType={Button.constants.touchableTypes.fadeContent}
                        style={[styles.button,{flex:1,marginRight:10,height:30,alignSelf:'center'}]}
                        textStyle={{fontSize: 15, color: 'white'}}
                        loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text style={{fontSize: 15, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>发送中</Text>
                            </View>
                    }
                        onPress={ () => {
                        if(this.state.phone==''){
                        alert('请填写电话号码')
                        }else{
                         this._button_3.setState({
                            loading: true,
                            //disabled: true,
                        })
                         this._fetchData()
                        /*setTimeout( () => {
                           /!* this._button_3.setState({
                                loading: false,
                                //disabled: false
                            });*!/


                        }, 1000)*/
                        }
                        }}>
                        发送验证码
                    </Button>
                </View>


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
                                加载中...</Text>
                            </View>
                    }
                    onPress={ () => {
                    if(this.state.phone==''||this.state.code==''){
                    alert('请输入手机号与验证码')
                    }else{
                        this._button_2.setState({
                            loading: true,
                            //disabled: true,
                        })

                            this._button_2.setState({
                                loading: false,
                                //disabled: false
                            })
                    if(nextPage=='forget'){
                    this.props.navigator.push({
                    title: '忘记密码',
                    component: SetPassword,
                    passProps:{
                        phone:this.state.phone,
                        code:this.state.code,
                    }
                        });
                    }else if(nextPage=='register'){

                        this._fetchData_code()
                    }

                    }
                    }}>
                    下一步
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

    async _fetchData () {
        console.log(`_fetch_sendCode`)
        try {

        let options = {
            method: 'post',
            url: constants.api.service,
            data: {
                iType: constants.iType.register_firstStep,
                //memberId:this.props.memberId,
                phone: this.state.phone,
                deviceId:this.state.deviceId,
                token:'',
            }
        }

            options.data=await this.gZip(options)

            console.log(`_fetch_sendCode options:` ,options)

            let resultData = await this.fetch(options)

            let result=await this.gunZip(resultData)
            console.log('result:',result)
            let d=JSON.parse(result.result)

            console.log('gunZip:',d)
            if(d.code&&d.code==10){
                alert('验证码已发送')
            }else{
                alert(d.msg)
            }


        }catch (error) {
            console.log(error)
            //..调用toast插件, show出错误信息...

        }finally {
            this._button_3.setState({
                loading: false,
                //disabled: false
            })
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

    async _fetchData_code () {
        console.log(`_fetch_sendCode`)
        try {

        let options = {
            method: 'post',
            url: constants.api.service,
            data: {
                iType: constants.iType.checkMsgCode,
                //memberId:this.props.memberId,
                phone: this.state.phone,
                code:this.state.code,
                deviceId:this.state.deviceId,
                token:'',
            }
        }

            options.data=await this.gZip(options)

            console.log(`_fetch_sendCode options:` ,options)

            let resultData = await this.fetch(options)

            let result=await this.gunZip(resultData)
            console.log('result:',result)
            let d=JSON.parse(result.result)

            console.log('gunZip:',d)
            if(d.code&&d.code==10){
                //跳转注册
                this.props.navigator.push({
                    title: '注册',
                    component: RegisterPage,
                    passProps:{
                        phone:this.state.phone,
                        code:this.state.code,
                    }
                });
            }else{
                alert(d.msg)
            }


        }catch (error) {
            console.log(error)
            //..调用toast插件, show出错误信息...

        }finally {
            this._button_3.setState({
                loading: false,
                //disabled: false
            })
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }



}
const styles = StyleSheet.create(
    {
        container: {
            marginTop: Platform.OS == 'ios' ? 64 + 10 : 56 + 10,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            backgroundColor: constants.UIBackgroundColor,
        }, textInput: {
        backgroundColor: 'white',
        height: 40,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIBackgroundColor
    }, button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3, borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30
    }
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


export default XhrEnhance(ForgetPassword)