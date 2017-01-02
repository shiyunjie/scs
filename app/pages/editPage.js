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


import constants from  '../constants/constant';
import Button from 'react-native-smart-button';

export default class Edit extends Component {
    render() {
        return (
            <View style={styles.container}>
              <View  style={{flex:1,}}>
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
                  />
                  <Text style={{color:constants.UIInActiveColor,position:'absolute',bottom:5,right:5,}}>300字以内</Text>
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
                                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>提交中...</Text>
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
                        提交
                    </Button>
                </View>


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