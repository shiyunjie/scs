/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    Linking,
} from 'react-native';
import constants from  '../constants/constant';
import ItemView from '../components/UserViewItem';
import ContactPage from './contactPage';
import EditPage from './editPage';
import HelpPage from './helpPage';
import VersionPage from './versionPage';

export default class More extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{height:50,}}
                                  onPress={this._onCall}
                >
                    <ItemView name='ios-call' size={constants.IconSize} title='联系我们' show={false} hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity style={{height:50,}}
                                  onPress={this._onHelp}
                >
                    <ItemView name='ios-help-circle' size={constants.IconSize} title='帮助中心' show={false}
                              hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity style={{height:50,}}
                                  onPress={this._onEdit}
                >
                    <ItemView name='ios-paper' size={constants.IconSize} title='用户反馈' show={false} hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity style={{height:50,}}
                                  onPress={this._onVersion}
                >
                    <ItemView name='ios-bookmarks-outline' size={constants.IconSize} title='版本说明' show={false}
                              hasCheckBox={false}/>
                </TouchableOpacity>
            </View>
        );
    }


    _onCall=()=>{
        //打电话
        //return Linking.openURL(constants.Tel)
        this.props.navigator.push({
            title: '联系我们',
            component: ContactPage,

        });
    };
    _onHelp=()=>{
        this.props.navigator.push({
            title: '帮助中心',
            component: HelpPage,

        });
    };
    _onEdit=()=>{
        this.props.navigator.push({
            title: '用户反馈',
            component: EditPage,

        });
    };

    _onVersion=()=>{
        this.props.navigator.push({
            title: '版本说明',
            component: VersionPage,

        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: constants.UIBackgroundColor,
    },


});