/**
 * Created by shiyunjie on 16/12/31.
 */
/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform
} from 'react-native';


import constants from  '../constants/constant';

export default class MessageDetail extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.itemView}>
                    <Text style={{flex:1,}}>{this.props.title}</Text>
                    <View style={{flex:1,}}>
                        <Text style={{flex:1,}}>{this.props.time}</Text>
                    </View>
                </View>
                <Text>{this.props.content}</Text>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',

        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
    },
    itemView:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

});