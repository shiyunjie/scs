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


export default class ChangeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={[{height:50,},{marginTop:10}]}
                >
                    <ItemView title='用户名' show={false} rightText='TTO'/>
                </View>

                <View style={{height:50,}}
                >
                    <ItemView title='姓名' show={false} rightText='用户姓名'/>
                </View>
                <View style={{height:50,}}
                >
                    <ItemView title='联系电话' show={false} rightText='13131313113'/>
                </View>

                <View style={{height:50,}}

                >
                    <ItemView title='邮箱' show={false} rightText='mail@163.com'/>
                </View>

                <View style={styles.inputView}>
                    <View style={ styles.textLine}>
                        <Text>QQ</Text>
                    </View>
                    <TextInput style={styles.textInput}
                               clearButtonMode="while-editing"
                               maxLength={20}
                               underlineColorAndroid='transparent'
                    />
                </View>
                <View style={styles.inputView}>
                    <View style={ styles.textLine}>
                        <Text>联系时间</Text>
                    </View>
                    <TextInput style={styles.textInput}
                               clearButtonMode="while-editing"
                               maxLength={20}
                               underlineColorAndroid='transparent'
                    />
                </View>
                <View style={styles.inputView}>
                    <View style={ styles.textLine}>
                        <Text>公司名称</Text>
                    </View>
                    <TextInput style={styles.textInput}
                               clearButtonMode="while-editing"
                               maxLength={20}
                               underlineColorAndroid='transparent'
                    />
                </View>
                <View style={styles.inputView}>
                    <View style={ styles.textLine}>
                        <Text>公司地址</Text>
                    </View>
                    <TextInput style={styles.textInput}
                               clearButtonMode="while-editing"
                               maxLength={20}
                               underlineColorAndroid='transparent'
                    />
                </View>
                <View style={{flex:1,backgroundColor:constants.UIBackgroundColor}}>
                    <TextInput
                        style={{flex:1,fontSize:13,textAlignVertical:'top',
                      backgroundColor:'white',

                      justifyContent:'flex-start'
                      }}
                        clearButtonMode="while-editing"
                        placeholder=' 公司简介'
                        maxLength={300}
                        underlineColorAndroid='transparent'
                        multiline={true}//多行输入
                        numberOfLines={6}
                    />

                </View>
                <View style={{flex:1,padding:10}}>
                    <Button
                        ref={ component => this.button2 = component }
                        touchableType={Button.constants.touchableTypes.fadeContent}
                        style={styles.button}
                        textStyle={{fontSize: 17, color: 'white'}}
                        loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>委托中...</Text>
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

        /**
        * 提交订单数据
        */
        this.props.navigator.pop();
    }, 3000)
                    }}>
                        保存
                    </Button>
                </View>
            </ScrollView>
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
        flex:4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,

    },
    textLine: {
        flex:1,justifyContent:'center', backgroundColor:'white',
        marginLeft:constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },

    inputView: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems:'stretch',


    },

});