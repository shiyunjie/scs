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
    ScrollView,
    TextInput,
    Image,
    Dimensions,
} from 'react-native';


import constants from  '../constants/constant';
import UploadPage from './uploadPage';
import SudokuGrid from 'react-native-smart-sudoku-grid'
import Icon from 'react-native-vector-icons/Ionicons';


const { width: deviceWidth } = Dimensions.get('window');
const columnCount = 3;
const gridDataList = [{icon:''},{}];

export default class Upload extends Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.welcome}>
                    单证资料上传,支持jpg、png,最多支持30张,单张图片小于5M
                </Text>
                <SudokuGrid
                    style={styles.sudokuGrid}
                    rowWidth={deviceWidth-4}
                    containerStyle={{ backgroundColor: '#fff',}}
                    columnCount={columnCount}
                    dataSource={gridDataList}
                    renderCell={this._renderGridCell}
                />

            </ScrollView>
        );
    }

    _renderGridCell = (data, index, list) => {
        if (index == gridDataList.length - 1 || gridDataList.length == 1) {
            return (
                <TouchableOpacity underlayColor={'#eee'} onPress={()=>{

            }}>
                <View style={{ overflow: 'hidden',
                          justifyContent: 'center', alignItems: 'center', height: 150,
                          borderWidth: StyleSheet.hairlineWidth, borderColor: constants.UIInActiveColor,
                          borderRightWidth: (index + 1) % columnCount ? StyleSheet.hairlineWidth: 0, }}>
                    <Icon
                        name='md-add'  // 图标
                        size={50}
                        color={constants.UIInActiveColor}/>


                </View>
            </TouchableOpacity>);
        } else if (index < 30) {
            return (
                <TouchableOpacity underlayColor={'#eee'} onPress={()=>{

            }}>
                    <View style={{ overflow: 'hidden',
                          justifyContent: 'center', alignItems: 'center', height: 150,
                          borderWidth: StyleSheet.hairlineWidth, borderColor:constants.UIInActiveColor,
                          borderRightWidth: (index + 1) % columnCount ? StyleSheet.hairlineWidth: 0, }}>
                        <Image source={data.icon} style={{flex:1, }}/>


                    </View>
                </TouchableOpacity>
            )
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
        marginLeft:2,
        marginRight:2,
    },
    viewItem: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: constants.MarginLeftRight,
    },
    line: {
        marginLeft: constants.MarginLeftRight,
        marginRight: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    sudokuGrid: {
        flex: 4,
        borderColor: '#eee',
        borderTopWidth: 1,
    }

});