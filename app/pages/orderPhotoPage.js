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
const { width: deviceWidth } = Dimensions.get('window');


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
            order_id: this.props.id,//服务单id
            service_id: this.props.id,//服务单id
            photoList:[],
            dataSource: this._dataSource.cloneWithRows([]),

        }


        this.firstFetch = true;
        this._isUploading=false;
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


                    if(this.props.type=='order') {
                        //判断委托单
                        //console.log(`OrderphotoPage setState...`)
                        /*let photoList = this.state.photoList
                        this.setState({
                            photoList: photoList,
                            dataSource: this._dataSource.cloneWithRows(photoList),
                        })*/
                    }
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
            Alert.alert('温馨提醒', '确定不保存就退出吗?', [
                {text: '确定', onPress: ()=>this.props.navigator.pop()},
                {text: '取消', onPress: ()=> {}
                },

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
                        {this.props.type=='order'?
                            <ListView
                                style={styles.container}
                                contentContainerStyle={{ overflow: 'hidden',}}
                                initialListSize={10}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow}
                                enableEmptySections={true}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}/>:
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
                                    isUploading={this._isUploading}
                                />
                            </ScrollView>
                        }
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
                            <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>委托中...</Text>
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

    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <View style={{flex:1,flexDirection:'column', overflow: 'hidden',}}>
                <Text
                    style={[styles.contentText,{paddingTop:5,paddingBottom:5,fontSize:12}]}>{rowData.title}</Text>
                <ShowPhotoView
                    style={{flex:1,backgroundColor:'white',
                            paddingLeft:constants.MarginLeftRight,paddingRight:constants.MarginLeftRight,}}
                    navigator={this.props.navigator}
                    photoList={rowData.list}
                    //showPhoto={this._ImageZoomModal.ShowPhoto}
                    UploadPage={UploadPage}
                    isUploading={this._isUploading}
                />
            </View>
        )
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
                    iType:this.props.type=='order'? constants.iType.commissionOrder_missFileShow:constants.iType.uploadImageList,
                    id: this.props.type=='order'?this.state.order_id:this.state.service_id,
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

                //console.log('result_result:', result.result)

                if(this.props.type=='order'){
                    //委托单
                    let photoList = this.state.photoList

                    for(let data of result.result){
                        //console.log('data:', data)
                        let flag=true;
                        for(let item of photoList){
                            //console.log('item:', item)

                            if(item.file_type_id==data.file_type_id){
                                //console.log('break:', photoList)
                                item.list.push({...data,
                                    isStored: true,
                                    uploaded: true,
                                    uploading: false,})
                                flag=false;
                                break;
                            }

                            flag=true;
                        }

                        if(flag){

                            if(data.id){
                                photoList.push({
                                    file_type_id:data.file_type_id,
                                    title:data.file_type_name,
                                    list:[{...data,
                                        isStored: true,
                                        uploaded: true,
                                        uploading: false,}]
                                })
                            }else{
                                photoList.push({
                                    file_type_id:data.file_type_id,
                                    title:data.file_type_name,
                                    list:[]
                                })
                            }

                        }

                    }
                    //console.log(`photoList:`,photoList)

                    this.setState({
                        photoList:photoList,
                        dataSource: this._dataSource.cloneWithRows(photoList),
                    })
                }else{
                    //服务单
                    let photoList =this.state.photoList
                    for(let data of result.result){
                        photoList.push(
                            {...data,
                            isStored: true,
                            uploaded: true,
                            uploading: false,})
                    }
                    //photoList = photoList.concat(result.result)
                    this.setState({
                        photoList:photoList

                    })
                }



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
                showReload: false,//显示再次加载
            })
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

    async _fetch_finish() {

        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let ids=[];
            let fileIds = '';


            if(this.props.type=='order') {
                //委托单
                for (let data of this.state.photoList) {
                    //console.log('data:', data)
                    let fileIds = '';
                    for (let item of data.list) {
                        fileIds += item.id + ','
                    }
                    ids.push({
                        file_type_id: data.file_type_id,
                        file_ids: fileIds
                    })

                }

            }else {
                //服务单
                for (let data of this.state.photoList) {
                    fileIds += data.id + ','
                }
            }


            let options = this.props.type=='order'?{
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.commissionOrder_missFileSave,
                    list:ids,
                    deviceId: deviceID,
                    token: token,
                }
            }:{
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
        backgroundColor: constants.UIBackgroundColor,
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
        bottom: 10,
        margin: 10,
        width: deviceWidth - 20,
        backgroundColor: constants.UIActiveColor,
        //borderWidth: StyleSheet.hairlineWidth,
        //borderColor:constants.UIActiveColor,

        height: 40,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center',
        borderRadius: 30

    },

});

import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar,
    RightButton: function (route, navigator, index, navState) {
        return (
            <TouchableOpacity
                onPress={() => {
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