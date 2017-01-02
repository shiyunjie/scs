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
import Icon from 'react-native-vector-icons/Ionicons';

export default class SetPassword extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='原密码'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                />
                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='新密码'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                />

                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='确认密码'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                />



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
                        setTimeout( () => {
                            this._button_2.setState({
                                loading: false,
                                //disabled: false
                            })

                        }, 3000)
                    }}>
                    保存
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

const styles = StyleSheet.create({
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