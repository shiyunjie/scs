/**
 * Created by shiyunjie on 16/12/26.
 */
/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    TouchableOpacity,
    Platform,
    NativeAppEventEmitter,
} from 'react-native';

import constants from  '../constants/constant';
import InputView from '../components/loginInputView';
import ForgetPasswordPage from './forgetPasswordPage';
import Button from 'react-native-smart-button';

import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

export default class Login extends Component {
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
                <View style={styles.instructions}>
                    <InputView style={{backgroundColor:'white',height:30}}
                               iconName='ios-person'
                               iconSize={constants.IconSize}
                               placeholder='输入手机号/会员名/邮箱'
                               maxLength={20}


                    />
                    <InputView style={{backgroundColor:'white',height:30,marginTop:10}}
                               iconName='ios-lock'
                               iconSize={constants.IconSize}
                               placeholder='输入密码'
                               maxLength={20}
                               secureTextEntry={true}

                    />
                    <View style={{flex:1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',}}>
                        <View style={{flex:1,flexDirection: 'row',marginRight:5,marginLeft:5}}>
                            <TouchableOpacity
                                onPress={this._onRegister}
                            ><Text style={{fontSize:13,color:constants.UIActiveColor}}>立即注册</Text>
                            </TouchableOpacity>
                            <View style={{flex:1,}}></View>
                            <TouchableOpacity
                                onPress={this._onForgetPassword}
                            ><Text style={{fontSize:13,color:constants.UIActiveColor}}
                            >忘记密码</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,}}></View>

                    </View>
                    <View style={{flex:1,}}>
                        <Button
                            ref={ component => this.button2 = component }
                            touchableType={Button.constants.touchableTypes.fadeContent}
                            style={styles.button}
                            textStyle={{fontSize: 17, color: 'white'}}
                            loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>登录中...</Text>
                            </View>
                    }
                            onPress={ () => {
                        this.button2.setState({

                            loading: true,
                            //disabled: true,
                        });

                        setTimeout( () => {
        this.button2.setState({
            loading: false,
            //disabled: false
        })
    }, 3000)
                    }}>
                            登录
                        </Button>

                    </View>
                </View>


            </View>
        );
    }


    _onRegister = () => {

        this.props.navigator.push({
            title: '注册',
            component: ForgetPasswordPage,
            passProps: {
                nextPageIndex:'register'
            }
        });
    }

    _onForgetPassword = () => {

        this.props.navigator.push({
            title: '忘记密码',
            component: ForgetPasswordPage,
            passProps: {
                nextPageIndex:'forget'
            }
        });
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#FDC288',
    },

    instructions: {

        height: 200,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginLeft: constants.MarginLeftRight,
        marginRight: constants.MarginLeftRight,
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