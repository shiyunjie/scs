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


import constants from  '../constants/constant';
import Button from 'react-native-smart-button';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import XhrEnhance from '../lib/XhrEnhance' //http
//import { sysInfo_feedBack,errorXhrMock } from '../mock/xhr-mock'   //mock data

class Edit extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text:'',
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
            <View
                style={styles.container}>
              <View
                  style={{flex:1,}}>
                  <TextInput
                      style={{flex:1,fontSize:15,textAlignVertical:'top',
                      margin:3,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: constants.UIInActiveColor,
                      justifyContent:'flex-start'
                      }}
                      clearButtonMode="while-editing"
                      placeholder='请提供宝贵意见'
                      maxLength={300}
                      underlineColorAndroid='transparent'
                      multiline={true}//多行输入
                      numberOfLines={6}
                      editable = {true}
                      value={this.state.oldPass}
                      onChangeText={(text) => this.setState({text:text})}/>
                  <Text style={{color:constants.UIInActiveColor,position:'absolute',
                  bottom:5,right:5,}}>300字以内</Text>
              </View>
                <View  style={{flex:1,padding:10}}>
                    <Button
                        ref={ component => this.button2 = component }
                        touchableType={Button.constants.touchableTypes.fadeContent}
                        style={styles.button}
                        textStyle={{fontSize: 17, color: 'white'}}
                        loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text style={{fontSize: 17, color: 'white',
                                fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>提交中...</Text>
                            </View>
                    }
                        onPress={ () => {
                        this.button2.setState({

                            loading: true,
                            //disabled: true,
                        });
                        this._fetch_edit
                       /* setTimeout( () => {
                            this.button2.setState({
                            loading: false,
                            //disabled: false
                            })
                            }, 3000)*/
                    }}>
                        提交
                    </Button>
                </View>


            </View>
        );
    }

    async _fetch_edit(){
        let options = {
            method:'post',
            url: constants.api.sysInfo_feedBack,
            data: {
                iType: constants.iType.sysInfo_feedBack,
                //memberId:this.props.memberId,
                content:this.state.text,

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
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: constants.UIBackgroundColor,
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

export default XhrEnhance(Edit)