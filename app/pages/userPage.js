/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity,
    Dimensions,
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';
import ItemView from '../components/UserViewItem';

import image_background from '../images/background.png';
import image_head from '../images/head.png';
import EditInfoPage from './changeInfoPage';
import ChangePwdPage from './changepwdPage';
import MessagePage from './messagePage';


const { width: deviceWidth } = Dimensions.get('window');

export default class user extends Component {
    render() {
        return (
            <View style={styles.container}>
               <Image source={image_background} style={styles.head}>
                   <Image source={image_head} style={{width:80,height:80,}}/>
                   <Text style={{color:'white'}}>用户名</Text>
               </Image>
                <TouchableOpacity style={{height:50,}}
                                  onPress={this._onProfile}
                >
                    <ItemView name='ios-person' size={constants.IconSize} title='我的头像' show={false} hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity style={{height:50,}}
                                  onPress={this._onMessage}
                >
                    <ItemView name='ios-mail' size={constants.IconSize} title='我的消息' show={false} hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity style={{height:50,}}
                                  onPress={this._onEdit}
                >
                    <ItemView name='ios-paper' size={constants.IconSize} title='修改信息' show={false} hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity style={{height:50,}}
                                  onPress={this._onChangePwd}
                >
                    <ItemView name='ios-lock' size={constants.IconSize} title='修改密码' show={false} hasCheckBox={false}/>
                </TouchableOpacity>

                <TouchableOpacity style={{height:50,marginTop:10,backgroundColor:'white',justifyContent:'center',alignItems:'center',}}
                                  onPress={this._onSingOut}
                >
                    <Text style={{color:constants.UIActiveColor}}>退出</Text>
                </TouchableOpacity>

            </View>
        );
    }

    _onProfile=()=>{

    };

    _onSingOut=()=>{

    };
    _onMessage=()=>{
        this.props.navigator.push({
            title: '我的消息',
            component: MessagePage,

        });
    };

    _onChangePwd=()=>{
        this.props.navigator.push({
            title: '更改密码',
            component: ChangePwdPage,

        });
    };
    _onEdit=()=>{
        this.props.navigator.push({
            title: '更改信息',
            component: EditInfoPage,

        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    head:{
        height:150,
        width:deviceWidth,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center'
    }

});