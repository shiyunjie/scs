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

import Button from 'react-native-smart-button';
import constants from  '../constants/constant';

import RegisterPage from './registerPage';
import SetPassword from './setPasswordPage';
let nextPage;

export default class ForgetPassword extends Component {
    // 构造
      constructor(props) {
        super(props);
          console.log('nextPage_:'+this.props.nextPageIndex)
          nextPage=this.props.nextPageIndex;
        // 初始状态
        this.state = {};
      }


    render() {

        return (
            <View style={styles.container}>
                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='请输入您的手机号'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                />
                <View style={[styles.textInput,{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'stretch',}]}>
                    <TextInput style={[{flex:2}]}
                               clearButtonMode="while-editing"
                               placeholder='请输入验证码'
                               maxLength={20}
                               underlineColorAndroid='transparent'
                    />
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
                        this._button_3.setState({
                            loading: true,
                            //disabled: true,
                        })
                        setTimeout( () => {
                            this._button_3.setState({
                                loading: false,
                                //disabled: false
                            });


                        }, 3000)
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
                        this._button_2.setState({
                            loading: true,
                            //disabled: true,
                        })
                        setTimeout( () => {
                            this._button_2.setState({
                                loading: false,
                                //disabled: false
                            })
            if(nextPage=='forget'){
                              this.props.navigator.push({
            title: '忘记密码',
            component: SetPassword,
                });
            }else if(nextPage=='register'){
                               this.props.navigator.push({
            title: '注册',
            component: RegisterPage,
                });

}
                        }, 3000)
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
                }

                const styles=StyleSheet.create({
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