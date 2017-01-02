/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class OrderDetail extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    服务单账单
                </Text>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});