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
} from 'react-native';

import Button from 'react-native-smart-button';
import constants from  '../constants/constant';

export default class More extends Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {modalVisible: false,};
      }

    render() {
        return (
            <View style={[styles.container,{ marginTop: Platform.OS == 'ios' ? 64+10 : 56+10,}]}>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this.setState({modalVisible:false});}}
                >
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
                           clearButtonMode="while-editing"
                           placeholder='请输入会员名'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                />

                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='请输入联系人姓名'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                />


                <TextInput style={styles.textInput}
                           clearButtonMode="while-editing"
                           placeholder='请输入邮箱'
                           maxLength={20}
                           underlineColorAndroid='transparent'
                />
                <TextInput style={[styles.textInput,{marginTop:10}]}
                           clearButtonMode="while-editing"
                           placeholder='请输入密码'
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
                                注册中...</Text>
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
                    注册
                </Button>

                <View style={styles.foot} >
                    <Text>点击"注册"即接受</Text>
                    <TouchableOpacity
                        onPress={this._showAgreement}
                    >
                    <Text style={{color:'blue'}}>用户协议</Text>
                        </TouchableOpacity>
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