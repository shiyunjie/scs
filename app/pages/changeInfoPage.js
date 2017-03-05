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
    Alert,
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
import ValidatePage from './validateInputPage';
import ProgressView from '../components/modalProgress'

import {getDeviceID,getToken,getPhone} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'

//import { member_changeInfoShow,member_changeInfo,errorXhrMock } from '../mock/xhr-mock'   //mock data

class ChangeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showProgress: true,//显示加载
            showReload: false,//显示加载更多
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
        this._qqValidate = /^[0-9]*$/
        this._textValidate = /^.*$/
        this.firstFetch = true;
    }

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
        this.addAppEventListener(
            NativeAppEventEmitter.addListener('validatepage_send_value', (context, label) => {
                if (label == 'QQ') {
                    this.setState({qq: context})
                } else if (label == '联系时间') {

                    this.setState({contact_time: context})
                } else if (label == '公司名称') {

                    this.setState({company_name: context})
                } else if (label == '公司地址') {

                    this.setState({company_address: context})
                } else if (label == '公司简介') {

                    this.setState({company_introduction: context})
                }
            })
        )

        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('didfocus', (event) => {
                //console.log(`payPage didfocus...`)
                if (event && currentRoute === event.data.route) {
                    console.log("upload didAppear")

                    if (this.firstFetch) {
                        this._fetchData_loadInfo()
                        this.firstFetch = false;
                    }
                }else {
                    //console.log("orderPage willDisappear, other willAppear")
                }


            })
        )

    }

    render() {
        return (
            <View style={{flex:1}}>
                {this.state.showProgress || this.state.showReload ?
                    <ProgressView
                        showProgress={this.state.showProgress}
                        showReload={this.state.showReload}
                        fetchData={()=>{}}/> :
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

                        <TouchableOpacity
                            style={styles.inputView}
                            onPress={ ()=>{
                            this.props.navigator.push({
                            title: 'QQ',
                            component: ValidatePage,
                            passProps:{
                            context:this.state.qq,
                            label:'QQ',
                            reg:this._qqValidate
                                }
                            });
                            } }>
                            <ItemView
                                name='ios-arrow-forward'
                                title='QQ'
                                rightText={this.state.qq}
                                aligRight={true}/>

                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.inputView}
                            onPress={ ()=>{
                            this.props.navigator.push({
                            title: '联系时间',
                            component: ValidatePage,
                            passProps:{
                            context:this.state.contact_time,
                            label:'联系时间',
                            reg:this._textValidate
                                }
                            });
                            } }>
                            <ItemView
                                name='ios-arrow-forward'
                                title='联系时间'
                                rightText={this.state.contact_time}
                                aligRight={true}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.inputView}
                            onPress={ ()=>{
                            this.props.navigator.push({
                            title: '公司名称',
                            component: ValidatePage,
                            passProps:{
                            context:this.state.company_name,
                            label:'公司名称',
                            reg:this._textValidate
                                }
                            });
                            } }>
                            <ItemView
                                name='ios-arrow-forward'
                                title='公司名称'
                                rightText={this.state.company_name}
                                aligRight={true}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.inputView}
                            onPress={ ()=>{
                            this.props.navigator.push({
                            title: '公司地址',
                            component: ValidatePage,
                            passProps:{
                            context:this.state.company_address,
                            label:'公司地址',
                            reg:this._textValidate
                                }
                            });
                            } }>
                            <ItemView
                                name='ios-arrow-forward'
                                title='公司地址'
                                rightText={this.state.company_address}
                                aligRight={true}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{height:150,}}
                            onPress={ ()=>{
                            this.props.navigator.push({
                            title: '公司简介',
                            component: ValidatePage,
                            passProps:{
                            context:this.state.company_introduction,
                            label:'公司简介',
                            reg:this._textValidate,
                            multiline:4,
                                }
                            });
                            } }>
                            <Text
                                style={{flex:1,fontSize:14,
                                textAlignVertical:'top',
                                backgroundColor:'white',
                                padding:constants.MarginLeftRight,
                                color:constants.PointColor,}}

                                placeholder='请输入公司简介'
                                maxLength={300}
                                underlineColorAndroid='transparent'
                                multiline={true}//多行输入
                                numberOfLines={4}

                            >{this.state.company_introduction!=null&&this.state.company_introduction!=''?
                                this.state.company_introduction:'请输入公司简介'}</Text>

                        </TouchableOpacity>
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
                                {
                                //this._renderActivityIndicator()
                                }
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
                }

                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>

                </Toast>
                <LoadingSpinnerOverlay
                    ref={ component => this._modalLoadingSpinnerOverLay = component }/>
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

            //console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log('gunZip:', result)
            //console.log(`fetch result -> `, typeof result)
            //console.log(`result`, result.result)
            if(!result){
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
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
            //console.log(error)

            if (this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }

        } finally {
            this.setState({
                showProgress: false,//显示加载
            })
        }


    }

    async _fetch_submitInfo() {
        if (this._modalLoadingSpinnerOverLay) {
            this._modalLoadingSpinnerOverLay.show()
        }
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
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log(`gunZip:`, result)
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            if(!result){
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
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


                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '修改成功'
                })
               /* Alert.alert('温馨提醒','修改成功',
                    [{text:'确定',onPress:()=>this.props.navigator.pop()}]
                  )*/
                setTimeout(()=>this.props.navigator.pop(),1000)


            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        } catch (error) {
            //console.log(error)
            if (this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }


        }
        finally {
            this.button2.setState({
                loading: false,
                //disabled: false
            })
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
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
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30,
    },
    textInput: {
        flex: 1,
        alignSelf: 'stretch',
        marginRight: constants.MarginLeftRight

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

import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar
}

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

export default AppEventListenerEnhance(XhrEnhance(ChangeInfo))