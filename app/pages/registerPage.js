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
    TouchableOpacity,
    TouchableHighlight,
    Modal,
    NativeAppEventEmitter,
    Alert,
} from 'react-native';

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import Button from 'react-native-smart-button';
import constants from  '../constants/constant';

import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Toast from 'react-native-smart-toast'
import XhrEnhance from '../lib/XhrEnhance' //http

import {getDeviceID,getToken} from '../lib/User'
import {hex_md5} from '../lib/md5'
//import { register_secondStep, errorXhrMock } from '../mock/xhr-mock'   //mock data

class Register extends Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showProgress: false,//显示加载
            showReload: false,//显示加载更多
            showDialog:false,//显示确认框
            phone:this.props.phone,
            modalVisible: false,
            userName:'',
            realName:'',
            email:'',
            newPass:'',
            confPass:'',
            editable:true,


        };
      }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
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
        )
    }

    render() {
        return (
            <View style={{flex:1}}>
                <ModalProgress
                    showProgress={this.state.showProgress}
                    showReload={this.state.showReload}
                    fetchData={()=>{
                    this.setState({
                    showProgress:true,//显示加载
                    showReload:false,//显示加载更多
                     })
                    }}
                    onRequestClose={this._onRequestClose.bind(this)}/>
                <ModalDialog
                    showDialog={this.state.showDialog}
                    title='确认要取消订单吗'
                    fetchData={()=>{
                    this.setState({
                    showDialog:false,
                     })
                     //回退登录

                           this.props.navigator.pop()

                    }}/>
            <View style={[styles.container,{ marginTop: Platform.OS == 'ios' ? 64+10 : 56+10,}]}>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this.setState({modalVisible:false});}}>
                  <View style={[styles.container,{flex:1,backgroundColor:'white'}]}>
                      <Text>协议</Text>
                      <TouchableHighlight underlayColor={'#ccc'}
                                          style={{flex:1,backgroundColor: '#fff',justifyContent:'center',flexDirection:'column',alignItems:'center'}}
                                          onPress={()=>{this.setState({modalVisible:false});}}>
                          <Text style={{flex:1,fontSize: 20,margin:10}}
                          >关闭</Text>

                      </TouchableHighlight>
                  </View>
                </Modal>

                <TextInput style={styles.textInput}
                           autoCorrect={false}
                           placeholder='请输入会员名'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable = {this.state.editable}
                           value={this.state.userName}
                           onChangeText={(text) => this.setState({userName:text})}/>

                <TextInput style={styles.textInput}
                           autoCorrect={false}
                           placeholder='请输入联系人姓名'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable = {this.state.editable}
                           value={this.state.realName}
                           onChangeText={(text) => this.setState({realName:text})}/>


                <TextInput
                           style={styles.textInput}
                           autoCorrect={false}
                           placeholder='请输入邮箱'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable = {this.state.editable}
                           value={this.state.email}
                           onChangeText={(text) => this.setState({email:text})}/>

                <TextInput style={[styles.textInput,{marginTop:10}]}
                           autoCorrect={false}
                           placeholder='请输入密码'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable = {this.state.editable}
                           secureTextEntry={true}
                           value={this.state.newPass}
                           onChangeText={(text) => this.setState({newPass:text})}/>

                <TextInput style={styles.textInput}
                           autoCorrect={false}
                           placeholder='确认密码'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                           editable = {this.state.editable}
                           secureTextEntry={true}
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
                                <Text style={{fontSize: 17, color: 'white',
                                fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>
                                注册中...</Text>
                            </View>
                    }
                    onPress={ () => {
                        this._button_2.setState({
                            loading: true,
                            //disabled: true,
                        })
                        this._fetch_register()
                        /*setTimeout( () => {
                            this._button_2.setState({
                                loading: false,
                                //disabled: false
                            })

                        }, 3000)*/
                    }}>
                    注册
                </Button>

                <View style={styles.foot} >
                    <Text>点击"注册"即接受</Text>
                    <TouchableOpacity
                        onPress={this._showAgreement}>
                        <Text style={{color:'blue'}}>用户协议</Text>
                    </TouchableOpacity>
                </View>
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>

                </Toast>
            </View>
            </View>
        );
    }

    _showAgreement=()=>{this.setState({modalVisible: true})}


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

    async _fetch_register(){
        try {
        let token= await getToken()
        let deviceID= await getDeviceID()
            this.setState({editable:false})
        let options = {
            method:'post',
            url: constants.api.service,
            data: {
                iType: constants.iType.register_secondStep,
                pwd:hex_md5(this.state.newPass),
                account:this.state.userName,
                real_name:this.state.realName,
                phone:this.state.phone,
                email:this.state.email,
                sure_pwd:hex_md5(this.state.confPass),
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
                console.log('token',result.result)
                AsyncStorage.setItem('token',result.result)
                AsyncStorage.setItem('phone',this.state.phone)
                AsyncStorage.setItem('realName',this.state.realName)

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '注册成功'
                })
                this.props.navigator.popToTop()

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
            this.setState({editable:true})
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS == 'ios' ? 64 : 56,
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
        paddingLeft:10,paddingRight:10,
    },
    button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3, borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30,

    },
    foot:{
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
    }
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


export default AppEventListenerEnhance(XhrEnhance(Register))