/**
 * @fileoverview
 * @since 17/1/8 16:14
 * @author chenyiqin
 */

import React, {
    Component,
} from 'react'
import {
    View,
    Text,
    Platform,
    StyleSheet,
    TouchableOpacity,
    NativeAppEventEmitter,
} from 'react-native'
import constants from '../constants/constant'
//import CameraRollPicker from 'react-native-camera-roll-picker'
import CameraRollPicker from 'react-native-smart-camera-roll-picker'

import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import Icon from 'react-native-vector-icons/Ionicons'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'


class PicturePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            num: 0,
            selected: [],
        };
    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                //console.log(`OrderDetail willfocus...`)
                //console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (currentRoute === event.data.route) {
                    //console.log("OrderDetail willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    //console.log("OrderDetail willDisappear, other willAppear")
                }
                //
            })
        )
        this.addAppEventListener(
            NativeAppEventEmitter.addListener('PicturePicker.selected.setState', () => {
                let Uris = []

                for (let data of this.props.ids) {
                    Uris.push(data.uri)
                }
                //console.log(`Uris:`, Uris)
                let selected = [];
                for (let i = this.state.selected.length - 1; i >= 0; i--) {
                    let data = this.state.selected[i]
                    if (Uris.indexOf(data.uri) == -1) {
                        //console.log(`Uris_data:`, data)
                        data.big_uri = data.uri
                        selected.push(data)
                    }

                }
                //this.props.waitForAddToUploadQuene(this.state.selected)
                this.props.waitForAddToUploadQuene(selected)
                //this.props.addToUploadQuene(this.state.selected)
                this.props.navigator.pop()
            })
        )


    }

    /**
     *
     * @returns {XML}
     */

    render() {
        /*return (
         <View style={styles.container}>

         <View style={styles.content}>
         <View style={{flex:1}}/>
         <Text style={[styles.text,{color:'black'}]}>
         <Text style={styles.bold}>已选择{this.state.num}张</Text>照片
         </Text>
         <TouchableOpacity
         style={{flex:1,alignItems:'center',justifyContent:'center'}}
         underlayColor={'#eee'}
         onPress={() => {
         //this.props.waitForAddToUploadQuene(this.state.selected)
         //this.props.addToUploadQuene(this.state.selected)
         //this.props.navigator.pop()
         }}>

         </TouchableOpacity>
         </View>
         <CameraRollPicker
         scrollRenderAheadDistance={500}
         initialListSize={1}
         pageSize={3}
         removeClippedSubviews={true}
         groupTypes='SavedPhotos'
         //groupTypes='All'
         batchSize={5}
         maximum={8}
         selected={this.state.selected}
         assetType='Photos'
         fetchSize={30}
         imagesPerRow={3}
         imageMargin={5}
         //onEndReachedThreshold={100}
         callback={this._getSelectedImages} />
         </View>
         )*/
        //return (
        //    <View style={{marginTop: Platform.OS == 'ios' ? 64 : 56, flex: 1,}}>
        //    <CameraRollPicker
        //        style={{flex: 1,}}
        //        onSelect={this._getSelectedImages}/>
        //</View>)

        return (
            <View style={{marginTop: Platform.OS == 'ios' ? 64 : 56, flex: 1,}}>
                <View style={styles.content}>
                    <View style={{flex:1}}/>
                    <Text style={[styles.text,{color:'black'}]}>
                        <Text style={styles.bold}>已选择{this.state.num}张</Text>照片
                    </Text>
                    <TouchableOpacity
                        style={{flex:1,alignItems:'center',justifyContent:'center'}}
                        underlayColor={'#eee'}
                        onPress={() => {}}>
                    </TouchableOpacity>
                </View>
                <CameraRollPicker
                    style={{flex:1}}
                    selected={this.state.selected}
                    initialListSize={30}
                    pageSize={30}
                    fetchSize={90}
                    onSelect={this._getSelectedImages}
                    onEndReachedThreshold={100}/>
            </View>)

    }

    _getSelectedImages = (images, current) => {
        var num = images.length;

        this.setState({
            num: num,
            selected: images,
        });

        console.log(current);
        console.log(this.state.selected);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
        marginLeft: 2,
        marginRight: 2,
    },
    content: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 16,
        alignItems: 'center',
        color: '#fff',
    },
    bold: {
        fontWeight: 'bold',
    },
    info: {
        fontSize: 12,
    },
});

export default AppEventListenerEnhance(PicturePicker)


import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar,
    RightButton: function (route, navigator, index, navState) {
        return (
            <TouchableOpacity
                onPress={() => {
                NativeAppEventEmitter.emit('PicturePicker.selected.setState')
            }}
                style={navigatorStyle.navBarRightButton}>
                <View style={navigatorStyle.navBarLeftButtonAndroid}>
                    <Text
                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize:14}]}
                        color={'white'}>
                        发送
                    </Text>
                </View>
            </TouchableOpacity>)
    },
};


//const navigationBarRouteMapper = {
//
//    LeftButton: function (route, navigator, index, navState) {
//        if (index === 0) {
//            return null;
//        }
//
//        var previousRoute = navState.routeStack[index - 1];
//        return (
//            <TouchableOpacity
//                onPress={() => navigator.pop()}
//                style={navigatorStyle.navBarLeftButton}>
//                <View style={navigatorStyle.navBarLeftButtonAndroid}>
//                    <Icon
//                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
//                        name={'ios-arrow-back'}
//                        size={constants.IconSize}
//                        color={'white'}/>
//                </View>
//            </TouchableOpacity>
//
//        );
//    },
//
//    RightButton: function (route, navigator, index, navState) {
//        return (
//            <TouchableOpacity
//                onPress={() => {
//                NativeAppEventEmitter.emit('PicturePicker.selected.setState')
//            }}
//                style={navigatorStyle.navBarRightButton}>
//                <View style={navigatorStyle.navBarLeftButtonAndroid}>
//                    <Text
//                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize:14}]}
//                        color={'white'}>
//                        发送
//                    </Text>
//                </View>
//            </TouchableOpacity>)
//    },
//
//    Title: function (route, navigator, index, navState) {
//        return (
//            Platform.OS == 'ios' ?
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    {route.title}
//                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    {route.title}
//                </Text>
//            </View>
//        )
//    },
//
//}