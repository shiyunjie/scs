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
    ListView,
    TextInput,
    Image,
    Dimensions,
    Alert,
    NativeAppEventEmitter,
} from 'react-native';


import constants from  '../constants/constant';
import SudokuGrid from 'react-native-smart-sudoku-grid'
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-smart-button'


const { width: deviceWidth } = Dimensions.get('window');
const columnCount = 3;
const gridDataList = [{icon:''},{}];

import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import XhrEnhance from '../lib/XhrEnhance' //http

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'


let firstDataList = [
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
    {uri:'http://www.doorto.cn/images/banner-02.jpg'},
]
class Upload extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
          this._dataSource = new ListView.DataSource({
              rowHasChanged: (r1, r2) => r1 !== r2,
              //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
          });

          this.state = {
              dataList: firstDataList,
              dataSource: this._dataSource.cloneWithRows(firstDataList),
          }
      }


    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                console.log(`orderPage willfocus...`)
                console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (event&&currentRoute === event.data.route) {
                    console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
    }

    /*<ScrollView style={styles.container}>

     <SudokuGrid
     style={styles.sudokuGrid}
     rowWidth={deviceWidth-4}
     containerStyle={{ backgroundColor: '#fff',}}
     columnCount={columnCount}
     dataSource={gridDataList}
     renderCell={this._renderGridCell}
     />

     </ScrollView>*/
    render() {
        return (
            <View style={styles.container}>
                <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                contentContainerStyle={styles.listStyle}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}/>
                <Button
                    touchableType={Button.constants.touchableTypes.highlight}
                    underlayColor={constants.UIInActiveColor}
                    style={styles.buttonStyle}
                    textStyle={{fontSize: 17, color: 'white'}}>
                    <Icon
                        name='md-add'  // 图标
                        size={30}
                        color={'#ffffff'}/>
                   上传图片
                </Button>
            </View>
        );
    }

    _renderRow = (rowData, sectionID, rowID) => {
        return(
            <View
                key={`key${rowID}img`}
                style={[styles.itemViewStyle,{width: deviceWidth / 3,}]}>
            <Image
                source={{uri: `${rowData.uri}`}}
                style={{flex:1, }}/>
                <TouchableOpacity
                    style={{position:'absolute',top:0,right:0}}
                    onPress={()=> Alert.alert(`删除${rowData.uri}`)}>
                    <Icon
                        name='md-close-circle'  // 图标
                        size={constants.IconSize}
                        color={constants.UIActiveColor}/>
                </TouchableOpacity>
            </View>
        )
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
                <TouchableOpacity onPress={()=>{

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
        flexDirection:'column',
    },
    listStyle:{
        flexDirection:'row', //改变ListView的主轴方向
        flexWrap:'wrap', //换行
    },
    itemViewStyle:{
        justifyContent: 'center',
        alignItems:'center', //这里要注意，如果每个Item都在外层套了一个 Touchable的时候，一定要设置Touchable的宽高

        height:150,
        overflow: 'hidden',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    buttonStyle:{
        position:'absolute',
        bottom:10,
        margin: 10,
        justifyContent: 'center',
        height: 40,
        width:deviceWidth-20,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3,
        //borderWidth: StyleSheet.hairlineWidth,
        //borderColor:constants.UIActiveColor,
        justifyContent: 'center',

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

const navigationBarRouteMapper = {

    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[ index - 1 ];
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={navigatorStyle.navBarLeftButton}>
                <View style={navigatorStyle.navBarLeftButtonAndroid}>
                    <Icon
                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
                        name={'ios-arrow-back'}
                        size={constants.IconSize}
                        color={'white'}/>
                </View>
            </TouchableOpacity>

        );
    },

    RightButton: function (route, navigator, index, navState) {
        return(
            <TouchableOpacity
                onPress={() =>  Alert.alert(`完成`)}
                style={navigatorStyle.navBarRightButton}>
            <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
            完成
            </Text>
            </TouchableOpacity>
        )
    },

    Title: function (route, navigator, index, navState) {
        return (
            Platform.OS == 'ios' ?
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {route.title}
                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {route.title}
                </Text>
            </View>
            )
    },

}

export default AppEventListenerEnhance(XhrEnhance(Upload))