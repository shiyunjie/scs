/**
 * Created by shiyunjie on 16/12/30.
 */
/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
    NativeAppEventEmitter,
} from 'react-native';
/**
 * md-checkmark-circle
 *
 ios-radio-button-off

 'ios-arrow-forward'
 */

import ItemView from '../components/orderItemView';
import constants from  '../constants/constant';
import Button from 'react-native-smart-button';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import {getDeviceID,getToken,getPhone} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
//import { member_changeInfoShow,member_changeInfo,errorXhrMock } from '../mock/xhr-mock'   //mock data

class ChangeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            email: '',
            qq: '',
            phone: '',
            real_name: '',
            contact_time: '',
            company_name: '',
            company_address: '',
            company_introduction: '',
        }
        this._qqValidate=/^[0-9]*$/
    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
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
        )
        this._fetchData_loadInfo()
    }

    render() {
        return (
            <View style={{flex:1}}>
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}>
                    <View
                        style={[{height:50,},{marginTop:10}]}>
                        <ItemView
                            title='用户名'
                            show={false}
                            rightText={this.state.account}/>
                    </View>

                    <View
                        style={{height:50,}}>
                        <ItemView
                            title='姓名'
                            show={false}
                            rightText={this.state.real_name}/>
                    </View>
                    <View
                        style={{height:50,}}>
                        <ItemView
                            title='联系电话'
                            show={false}
                            rightText={this.state.phone}/>
                    </View>
                    <View
                        style={{height:50,}}>
                        <ItemView
                            title='邮箱'
                            show={false}
                            rightText={this.state.email}/>
                    </View>

                    <View
                        style={styles.inputView}>
                        <View
                            style={ styles.textLine}>
                            <Text>QQ</Text>
                        </View>
                        <View
                            style={{flex: 4,
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderColor: constants.UIInActiveColor,}}>
                            <TextInput
                                ref={(component) => this._QQ = component}
                                style={styles.textInput}
                                placeholder='请输入'
                                textAlign='right'
                                maxLength={40}
                                underlineColorAndroid='transparent'
                                editable={true}
                                onChangeText={(text) => this.setState({qq:text})}
                                value={this.state.qq}
                                reg={this._qqValidate}/>
                        </View>
                    </View>
                    <View
                        style={styles.inputView}>
                        <View
                            style={ styles.textLine}>
                            <Text>联系时间</Text>
                        </View>
                        <View
                            style={{flex: 4,
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderColor: constants.UIInActiveColor,}}>
                            <TextInput
                                ref={(component) => this._Contact_time = component}
                                style={styles.textInput}
                                placeholder='请输入'
                                clearButtonMode="while-editing"

                                textAlign='right'
                                maxLength={40}
                                underlineColorAndroid='transparent'
                                value={this.state.contact_time}
                                editable={true}
                                onChangeText={(text) => this.setState({contact_time:text})}/>
                        </View>
                    </View>
                    <View
                        style={styles.inputView}>
                        <View
                            style={ styles.textLine}>
                            <Text>公司名称</Text>
                        </View>
                        <View
                            style={{flex: 4,
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderColor: constants.UIInActiveColor,}}>
                            <TextInput
                                ref={(component) => this._Company_name = component}
                                style={styles.textInput}
                                placeholder='请输入'
                                clearButtonMode="while-editing"
                                textAlign='right'
                                maxLength={40}
                                underlineColorAndroid='transparent'
                                value={this.state.company_name}
                                editable={true}
                                onChangeText={(text) => this.setState({company_name:text})}/>
                        </View>
                    </View>
                    <View
                        style={styles.inputView}>
                        <View
                            style={ styles.textLine}>
                            <Text>公司地址</Text>
                        </View>
                        <View
                            style={{flex: 4,
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderColor: constants.UIInActiveColor,}}>
                            <TextInput
                                style={styles.textInput}
                                placeholder='请输入'
                                clearButtonMode="while-editing"
                                textAlign='right'
                                maxLength={80}
                                underlineColorAndroid='transparent'
                                value={this.state.company_address}
                                editable={true}
                                onChangeText={(text) => this.setState({company_address:text})}/>
                        </View>
                    </View>
                    <View
                        style={{height:150,}}>
                        <TextInput
                            style={{flex:1,fontSize:15,
                            textAlignVertical:'top',
                            backgroundColor:'white',
                            padding:constants.MarginLeftRight}}

                            placeholder='请输入公司简介'
                            maxLength={300}
                            underlineColorAndroid='transparent'
                            multiline={true}//多行输入
                            numberOfLines={8}
                            value={this.state.company_introduction}
                            editable={true}
                            onChangeText={(text) => this.setState({company_introduction:text})}/>

                    </View>
                    <View
                        style={{flex:1,padding:10,marginLeft:constants.MarginLeftRight,marginRight:constants.MarginLeftRight}}>
                        <Button
                            ref={ component => this.button2 = component }
                            touchableType={Button.constants.touchableTypes.fadeContent}
                            style={styles.button}
                            textStyle={{fontSize: 17, color: 'white'}}
                            loadingComponent={
                            <View
                            style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text
                                style={{fontSize: 17, color: 'white',
                                 fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>保存中...</Text>
                            </View>
                        }
                            onPress={ () => {
                             if(!this._qqValidate.test(this.state.qq)){

                             this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: 'QQ格式错误'
                            })
                            return
                        }
                        this.button2.setState({

                            loading: true,
                            //disabled: true,
                        });
                        this._fetch_submitInfo();

                        /*                        setTimeout( () => {
                                this.button2.setState({
                                    loading: false,
                                    //disabled: false
                                })


                                this.props.navigator.pop();
                            }, 3000)*/
                        }}>
                            保存
                        </Button>
                    </View>
                </ScrollView>

                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>

                </Toast>
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

    async _fetchData_loadInfo() {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.changeInfoShow,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)

            console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)

            result = JSON.parse(result)
            console.log('gunZip:', result)
            //console.log(`fetch result -> `, typeof result)
            //console.log(`result`, result.result)
            if (result.code && result.code == -54) {
                /**
                 * 发送事件去登录
                 */
                NativeAppEventEmitter.emit('getMsg_202_code_need_login');
                return
            }

            if (result.code && result.code == 10) {
                if (result.result) {
                    this.setState({
                        account: result.result.account,
                        email: result.result.email,
                        qq: result.result.qq,
                        phone: result.result.phone,
                        real_name: result.result.real_name,
                        contact_time: result.result.contact_time,
                        company_name: result.result.company_name,
                        company_address: result.result.company_address,
                        company_introduction: result.result.company_introduction,
                    })

                }
            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }

        }
        catch (error) {
            console.log(error)

            //..调用toast插件, show出错误信息...

        }


    }

    async _fetch_submitInfo() {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'POST',
                url: constants.api.service,
                data: {
                    iType: constants.iType.changeInfo,
                    qq: this.state.qq,
                    contact_time: this.state.contact_time,
                    company_name: this.state.company_name,
                    company_address: this.state.company_address,
                    company_introduction: this.state.company_introduction,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)

            console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)

            result = JSON.parse(result)
            if (result.code && result.code == -54) {
                /**
                 * 发送事件去登录
                 */
                NativeAppEventEmitter.emit('getMsg_202_code_need_login');
                return
            }
            if (result.code && result.code == 10) {
                /* Alert.alert('提示', '注册成功', () => {
                 this.props.navigator.popToTop()
                 })*/
                console.log('result', result.result)

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '修改成功'
                })
                this.props.navigator.pop()

            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        } catch (error) {
            //console.log(error)
            console.log(error)

            //..调用toast插件, show出错误信息...


        }
        finally {
            this.button2.setState({
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
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,

        flexDirection: 'column',
    },
    button: {

        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3, borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30,
    },
    textInput: {
        flex:1,
        alignSelf: 'stretch',
        marginRight:constants.MarginLeftRight

    },
    textLine: {
        flex: 1, justifyContent: 'center', backgroundColor: 'white',
        marginLeft: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },

    inputView: {
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',


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

export default AppEventListenerEnhance(XhrEnhance(ChangeInfo))