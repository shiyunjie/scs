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
    AsyncStorage,
    BackAndroid,
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
import ValidateTextInput from '../components/validateTextInput'

import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'
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
          this._userName=/^[A-Za-z0-9]{2,20}$|^[\u4E00-\u9FA50-9]{2,10}$/
          this._realName=/^[A-Za-z]{2,20}$|^[\u4E00-\u9FA5]{2,8}$/
          this._email=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          this._newPassword=/^[a-zA-Z0-9]{6,}$/
          this._conformPassword=/^[a-zA-Z0-9]{6,}$/

      }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                //console.log(`orderPage willfocus...`)
                //console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (event&&currentRoute === event.data.route) {
                    //console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    //console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
        this.addAppEventListener(
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
        )
    }

    onBackAndroid = () => {
        const routers = this.props.navigator.getCurrentRoutes();
        if (routers.length > 1) {
            Alert.alert('温馨提醒','确定退出吗?',[
                {text:'确定',onPress:()=>this.props.navigator.popToRoute(routes[1])},
                {text:'取消',onPress:()=>{}},

            ])

            return true;
        }

    }

    render() {
        return (
            <View style={{flex:1}}>

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

                <ValidateTextInput
                    ref={ component => this._input_username = component }
                    style={styles.textInput}
                    autoCorrect={false}
                    placeholder='请输入会员名'
                    clearButtonMode="while-editing"
                    maxLength={20}
                    underlineColorAndroid='transparent'
                    editable = {this.state.editable}
                    value={this.state.userName}
                    onChangeText={(text) => this.setState({userName:text})}
                    reg={this._userName}/>

                <ValidateTextInput
                    ref={ component => this._input_realname = component }
                    style={styles.textInput}
                    autoCorrect={false}
                    placeholder='请输入联系人姓名'
                    clearButtonMode="while-editing"
                    maxLength={20}
                    underlineColorAndroid='transparent'
                    editable = {this.state.editable}
                    value={this.state.realName}
                    onChangeText={(text) => this.setState({realName:text})}
                    reg={this._realName}/>


                <ValidateTextInput
                    ref={ component => this._input_email = component }
                    style={styles.textInput}
                    autoCorrect={false}
                    placeholder='请输入邮箱'
                    clearButtonMode="while-editing"
                    maxLength={20}
                    underlineColorAndroid='transparent'
                    editable = {this.state.editable}
                    value={this.state.email}
                    onChangeText={(text) => this.setState({email:text})}
                    reg={this._email}/>

                <ValidateTextInput
                    ref={ component => this._input_password = component }
                    style={[styles.textInput,{marginTop:10}]}
                    autoCorrect={false}
                    placeholder='请输入密码'
                    clearButtonMode="while-editing"
                    maxLength={20}
                    underlineColorAndroid='transparent'
                    editable = {this.state.editable}
                    secureTextEntry={true}
                    value={this.state.newPass}
                    onChangeText={(text) => this.setState({newPass:text})}
                    reg={this._newPassword}/>

                <ValidateTextInput
                    ref={ component => this._input_conform_password = component }
                    style={styles.textInput}
                    autoCorrect={false}
                    placeholder='确认密码'
                    clearButtonMode="while-editing"
                    maxLength={20}
                    underlineColorAndroid='transparent'
                    editable = {this.state.editable}
                    secureTextEntry={true}
                    value={this.state.confPass}
                    onChangeText={(text) => this.setState({confPass:text})}
                    reg={this._conformPassword}/>


                <Button
                    ref={ component => this._button_2 = component }
                    touchableType={Button.constants.touchableTypes.fadeContent}
                    style={[styles.button,{ marginLeft: constants.MarginLeftRight,
                    marginRight: constants.MarginLeftRight,
                    marginTop: 20,}]}
                    textStyle={{fontSize: 17, color: 'white'}}
                    loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {
                                //this._renderActivityIndicator()
                                }
                                <Text style={{fontSize: 17, color: 'white',
                                fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>
                                注册中...</Text>
                            </View>
                    }
                    onPress={ () => {
                        if(!this._input_username.validate){
                                    this._input_username.setState({
                                    backgroundColor:constants.UIInputErrorColor,
                                    })
                                     this._toast.show({
                                        position: Toast.constants.gravity.center,
                                        duration: 255,
                                        children: '用户名格式错误,要求2-20位,不能含有标点'
                                    })
                                    return
                                }
                        if(!this._input_realname.validate){
                            this._input_realname.setState({
                            backgroundColor:constants.UIInputErrorColor,
                            })
                             this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: '联系人格式错误'
                            })
                            return
                        }
                        if(!this._input_email.validate){
                            this._input_email.setState({
                            backgroundColor:constants.UIInputErrorColor,
                            })
                             this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: '电子邮件格式错误'
                            })
                            return
                        }
                         if(!this._input_password.validate){
                                this._input_password.setState({
                                backgroundColor:constants.UIInputErrorColor,
                                })
                                 this._toast.show({
                                    position: Toast.constants.gravity.center,
                                    duration: 255,
                                    children: '密码格式错误'
                                })
                                return
                            }

                         if(!this._input_conform_password.validate||this.state.newPass!=this.state.confPass){

                            this._input_conform_password.setState({
                            backgroundColor:constants.UIInputErrorColor,
                             iconColor: 'red',
                             iconName: 'ios-close-circle',
                             showIcon: true,
                            })
                             this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: '两次密码不一致'
                            })
                            return
                         }
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
                            } }>
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

                <LoadingSpinnerOverlay
                    ref={ component => this._modalLoadingSpinnerOverLay = component }/>
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
        if(this._modalLoadingSpinnerOverLay) {
            this._modalLoadingSpinnerOverLay.show()
        }
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

            //console.log(`_fetch_sendCode options:` ,options)

            let resultData = await this.fetch(options)

            let result=await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result=JSON.parse(result)
            //console.log('gunZip:',result)
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
            if(result.code&&result.code==10){
               /* Alert.alert('提示', '注册成功', () => {
                    this.props.navigator.popToTop()
                })*/
                //console.log('token',result.result)
                AsyncStorage.setItem('token',result.result)
                AsyncStorage.setItem('phone',this.state.phone)
                AsyncStorage.setItem('realName',this.state.realName)

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '注册成功'
                })
                setTimeout(()=>this.props.navigator.popToRoute(routes[1]),1000)


            }else{
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }

        }
        catch (error) {
            //console.log(error)
            if(this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }

        }
        finally {
            this._button_2.setState({
                loading: false,
                //disabled: false
            })
            this.setState({editable:true})
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
        borderWidth: StyleSheet.hairlineWidth,
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

import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar,
    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[ index - 1 ];
        return (
            <TouchableOpacity
                onPress={() => Alert.alert('温馨提醒','确定退出吗?',[
             {text:'取消',onPress:()=>{}},
             {text:'确定',onPress:()=>this.props.navigator.popToRoute(routes[1])}
             ])}
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
};

//const navigationBarRouteMapper = {
//
//    LeftButton: function (route, navigator, index, navState) {
//        if (index === 0) {
//            return null;
//        }
//
//        var previousRoute = navState.routeStack[ index - 1 ];
//        return (
//            <TouchableOpacity
//                onPress={() => Alert.alert('温馨提醒','确定退出吗?',[
//             {text:'取消',onPress:()=>{}},
//             {text:'确定',onPress:()=>this.props.navigator.popToRoute(routes[1])}
//             ])}
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


export default AppEventListenerEnhance(XhrEnhance(Register))