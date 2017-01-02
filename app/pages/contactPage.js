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

class ItemView extends Component {
    render() {
        return (
            <View style={styles.itemView}><View style={styles.itemTitle}>
                <Text style={[styles.TabText,{color:'black'}]}>{this.props.title}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text style={styles.TabText}>{this.props.text}</Text>
                </View>

            </View>
        )
    }
}


export default class Contact extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ItemView title='公司名字' text={constants.CompName}/>
             <TouchableOpacity onPress={this._onCall}>
                 <ItemView title='联系电话' text={constants.CompTel}/>
             </TouchableOpacity><ItemView title='传真' text={constants.CompFax}/>
                    <ItemView title='邮箱' text={constants.CompEmail}/>
                    <ItemView title='公司地址' text={constants.CompAddress}/>
            </View>
    )
    }


    _onCall(){
        //打电话
        return Linking.openURL(constants.Tel);
    }

    }





    const styles = StyleSheet.create({
        container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems: 'stretch',
        backgroundColor: constants.UIBackgroundColor,
    },
        itemView: {
        height:50,
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'stretch',
        marginLeft:20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,

    },
        itemTitle: {
        flex:1,
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'center',
        padding: 0,


    },
        itemText: {
        flex:2,
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignItems: 'center',
        padding: 0,


    },
        TabText: {
        marginRight: 10,
        fontSize: 17,
        marginLeft:10,
    },

    });