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
    ListView,
    Image,
    Dimensions,
    Alert,
    NativeAppEventEmitter,
    ActivityIndicator,
    NativeModules,
    BackAndroid,
} from 'react-native';

import LoginPage from './loginPage'
import constants from  '../constants/constant';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

import {getDeviceID,getToken,getPhone,getRealName} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import Button from 'react-native-smart-button'
import ProgressView from '../components/modalProgress'
import ModalDialog from '../components/modalDialog'
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'
import { tabBarConfig } from '../constants/sharedConfig'

import UploadPage from '../pages/uploadPage'
//import ImageZoomModal from '../components/ImageZoomModal'
import ShowPhotoView from '../components/showPhotoView'

const photoList = [];

class ServicePhoto extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            showProgress: true,//显示加载
            showReload: false,//显示加载更多
            showDialog: false,//显示确认框
            service_id: this.props.id,//服务单id
            photoList,


        }
        this.firstFetch = true;
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
            NativeAppEventEmitter.addListener('PicturePicker.finish.saveIds', () => {
                if(this._modalLoadingSpinnerOverLay){
                    this._modalLoadingSpinnerOverLay.show()
                }
                this._fetch_finish()
            })
        )
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('didfocus', (event) => {
                //console.log(`payPage didfocus...`)
                if (event && currentRoute === event.data.route) {
                    //console.log("upload didAppear")

                    if (this.firstFetch) {
                        this._fetchData()
                        this.firstFetch = false;
                    }
                } else {
                    //console.log("orderPage willDisappear, other willAppear")
                }


            })
        )
        this.addAppEventListener(
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
        )

    }

    onBackAndroid = () => {
        const routers = this.props.navigator.getCurrentRoutes();
        if (routers.length > 1) {
            Alert.alert('温馨提醒','确定不保存就退出吗?',[
                {text:'确定',onPress:()=>this.props.navigator.pop()},
                {text:'取消',onPress:()=>{}},

            ])

            return true;
        }

    }


    render() {
        return (
            <View style={{flex:1}}>
                {this.state.showProgress || this.state.showReload ?
                    <ProgressView
                        showProgress={this.state.showProgress}
                        showReload={this.state.showReload}
                    /> :
                    <View style={{flex:1,backgroundColor:'white'}}>
                    <ScrollView
                        style={styles.container}
                        showsVerticalScrollIndicator={false}>
                        <Text
                            style={[styles.contentText,{paddingTop:5,paddingBottom:5,fontSize:12}]}>上传资料</Text>
                        <ShowPhotoView
                            style={{flex:1,backgroundColor:'white',
                            paddingLeft:constants.MarginLeftRight,paddingRight:constants.MarginLeftRight,}}
                            navigator={this.props.navigator}
                            photoList={this.state.photoList}
                            UploadPage={UploadPage}
                        />
                    </ScrollView>
                        <Button
                            ref={ component => this.button2 = component }
                            touchableType={Button.constants.touchableTypes.fadeContent}
                            style={styles.button}
                            textStyle={{fontSize: 17, color: 'white'}}
                            loadingComponent={
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        {
                                        //this._renderActivityIndicator()
                                        }
                                        <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold',
                                        fontFamily: '.HelveticaNeueInterface-MediumP4',}}>委托中...</Text>
                                        </View>
                                        }
                            onPress={ () => {
                                if( this._modalLoadingSpinnerOverLay){
                                this._modalLoadingSpinnerOverLay.show()
                                }
                                this._fetch_finish()

                            } }>
                            完成上传
                        </Button>

                        </View>

                }

                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>
                </Toast>
                <LoadingSpinnerOverlay
                    ref={ component => this._modalLoadingSpinnerOverLay = component }/>

            </View>
        );

    }




    async _fetchData() {
        //console.log(`fetchData_photoList`)

        try {
            let token = await getToken()
            let deviceID = await getDeviceID()

            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.uploadImageList,
                    id: this.state.service_id,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)

            //console.log(`_fetchData options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log('gunZip:', result)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            if (result.code && result.code == 10) {

                //console.log('token', result.result)

                let photoList = this.state.photoList
                photoList = photoList.concat(result.result)
                this.setState({
                    photoList:photoList

                })

            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            //console.log(error)
            if (this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }


        }
        finally {
            this.setState({
                showProgress: false,//显示加载
                showReload: false,//显示加载更多
            })

            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }


    async _fetch_finish() {

        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let fileIds = '';
            for (let data of this.state.photoList) {
                fileIds += data.id + ','
            }
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.uploadFinish,
                    id: this.state.service_id,
                    file_ids: fileIds,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)


            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log('gunZip:', result)
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            if(!result){
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            if (result.code && result.code == 10) {

                //console.log('token', result.result)

               this.props.navigator.pop()


            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            //console.log(error)
            if(this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }


        }
        finally {
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
    },
    viewItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: constants.MarginLeftRight,
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 10,
    },
    line: {
        //marginLeft: constants.MarginLeftRight,
        //marginRight: constants.MarginLeftRight,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.LineColor,
    },
    labelText: {
        fontSize: 14,
        color: constants.LabelColor,
    },
    contentText: {
        fontSize: 14,
        color: constants.PointColor,
        paddingLeft: constants.MarginLeftRight,
    },
    button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center',
        borderRadius: 30,
        margin:10
    },

});

import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar,
    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[ index - 1 ];
        return (
            <TouchableOpacity
                onPress={() => Alert.alert('温馨提醒','确定不保存就退出吗?',[
             {text:'取消',onPress:()=>{}},
             {text:'确定',onPress:()=>navigator.pop()}
             ])}
                style={navigatorStyle.navBarLeftButton}>
                <View style={navigatorStyle.navBarLeftButtonAndroid}>
                    <Icon
                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 30,}]}
                        name={'ios-arrow-back'}
                        size={constants.IconSize}
                        color={'white'}/>
                </View>
            </TouchableOpacity>

        );
    },
    RightButton: function (route, navigator, index, navState) {
        return (
            <TouchableOpacity
                onPress={() => {
                disabled=false
                NativeAppEventEmitter.emit('PicturePicker.finish.saveIds')
                }}
                style={navigatorStyle.navBarRightButton}>
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    完成
                </Text>
            </TouchableOpacity>
        )
    },
};

export default AppEventListenerEnhance(XhrEnhance(ServicePhoto))