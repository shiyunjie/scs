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
    ActivityIndicator,
} from 'react-native'

import constants from  '../constants/constant';
import SudokuGrid from 'react-native-smart-sudoku-grid'
import Icon from 'react-native-vector-icons/Ionicons'
import XhrEnhance from '../lib/XhrEnhance'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import TimerEnhance from 'react-native-smart-timer-enhance'
import PicturePicker from './picturePicker'
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Button from 'react-native-smart-button'
import {getDeviceID,getToken} from '../lib/User'

const { width: deviceWidth } = Dimensions.get('window')
const columnCount = 3;
const photoList = [
    {
    filename: "IMG_0003.JPG",
    height: 2500,
    isStored: true,
    uploaded:true,
    uploading:false,
    uri: "assets-library://asset/asset.JPG?id=9F983DBA-EC35-42B8-8773-B597CF782EDD&ext=JPG",
    width: 1668
    }
];

const maxiumUploadImagesCount = 30 //最多上传图片总数
const maxiumXhrNums = 5 //最多同时上传数量

class UploadPage extends Component {

    /*  // 构造
     constructor (props) {
     super(props)
     // 初始状态
     this.state = {
     photoList,   //{ uri: 'xxx', compressedUri: 'xxx', uploadProgress: 0.9, uploadError: false, uploading: true, uploaded: false,   }, { uri: 'xxx', compressedUri: 'xxx', uploadProgress: 1, uploadError: false, uploading: false, uploaded: true,  }
     };
     this._uploadingXhrCacheList = []    //正在上传中的(包含上传失败的)xhr缓存列表, 用uri做唯一性, 该列表长度会影响当前可用的上传线程数
     this._waitForUploadQuene = []       //待上传队列, 用uri做唯一性
     }*/
    // 构造
    constructor (props) {
        super(props);
        // 初始状态
        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            service_id: this.props.service_id,//服务单id
            photoList,
            dataSource: this._dataSource.cloneWithRows(photoList),
        }
        this._uploadingXhrCacheList = []    //正在上传中的(包含上传失败的)xhr缓存列表, 用uri做唯一性, 该列表长度会影响当前可用的上传线程数
        this._waitForUploadQuene = []       //待上传队列, 用uri做唯一性
        this._waitForAddPhotos = null

        this._initCustomData()

    }

    componentWillMount () {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                console.log(`orderPage willfocus...`)
                console.log(`currentRoute`, currentRoute)
                console.log(`event.data.route`, event.data.route)
                if (event && currentRoute === event.data.route) {
                    console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                    if(this._waitForAddPhotos && this._waitForAddPhotos.length > 0) {
                        this.setTimeout( () => {
                            //@todo async this._getCompressedPhotos 返回photos数组, 遍历this._waitForAddPhotos {let compressedUri = await NativeCompressedModule.compress(...); 遍历的photo对象uri赋值compressedUri }
                            this._addToUploadQuene(this._waitForAddPhotos)
                            this._waitForAddPhotos = null
                        }, 300)

                    }
                } else {
                    console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
    }

    async _initCustomData () {
        this._token = await getToken()
        this._deviceID = await getDeviceID()
        this._data = await this.gZip({data:  {
            iType: constants.iType.upload,
            deviceId: this._deviceID,
            token: this._token,
        }})
    }

    render () {
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
                    textStyle={{fontSize: 17, color: 'white'}}
                    onPress={()=>{
                            this.props.navigator.push({
                        title: '相机胶卷',
                        component: PicturePicker,
                        passProps: {
                            maxiumUploadImagesCount,
                            currentUploadImagesCount: this.state.photoList.length,
                            waitForAddToUploadQuene: this._waitForAddToUploadQuene
                            //addToUploadQuene: this._addToUploadQuene
                        }
                    })
                }}>
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
        let width = height = deviceWidth / 3
        return (
            <View
                key={`key${rowID}img`}
                style={[styles.itemViewStyle,{width, height,}]}>
                <Image
                    source={{uri: rowData.uri}}
                    style={{flex: 1, position: 'relative', }}>
                    {
                        rowData.uploading ? <View
                            style={{flex: 1, backgroundColor: 'rgba(160, 160, 160, 0.5)', justifyContent: 'center', alignItems: 'center',}}>
                            <ActivityIndicator
                                animating={true}
                                color={'#fff'}
                                size={'small'}/>
                            <Text
                                style={{color: '#fff', padding: 5, fontSize: 14,}}>{rowData.uploadProgress ? Math.floor(rowData.uploadProgress * 100) : 0}%</Text>
                        </View> : null
                    }
                    <TouchableOpacity
                        style={{position:'absolute',top:2,right:2, backgroundColor: 'transparent',}}
                        onPress={this._removeFromUploadQuene.bind(this, rowData.uri)}>
                        <Icon
                            name='md-close-circle'  // 图标
                            size={constants.IconSize}
                            color={constants.UIActiveColor}/>
                    </TouchableOpacity>
                </Image>


            </View>
        )
    }

    componentWillUnmount () {
        //结束正在上传中的线程
        this._uploadingXhrCacheList.forEach(xhrCache => {
            let { xhr, } = xhrCache
            if (xhr.status != 200 || xhr.readyState != 4) {
                xhr.abort()
            }
        })
    }

    _waitForAddToUploadQuene = (photos) => {
        this._waitForAddPhotos = photos;
    }

    _addToUploadQuene = (photos) => {
        for (let photo of photos) {
            let uploadTask = {
                uri: photo.uri,                 //用uri来做唯一性
                init: this._upload.bind(this, photo), //将上传方法对象赋值给上传任务
            }
            this._waitForUploadQuene.push(uploadTask)   //将上传任务加入待上传队列
        }
        //很明显, 这里UI要更新
        let photoList = this.state.photoList
        photoList = photoList.concat(photos)
        this.setState({
            photoList,
            dataSource: this._dataSource.cloneWithRows(photoList),
        }, () => {
            this._startUploadQuene()    //启动一次上传队列
        })
    }

    _removeFromUploadQuene = (uri) => {
        //先看待waitForUploadQuene上传队列中是否存在, 存在直接移除队列中的这个对象, 阻止后续的上传
        let uploadTaskIndex = this._waitForUploadQuene.find(uploadTask => {
            return uri == uploadTask.uri
        })
        this._waitForUploadQuene.splice(uploadTaskIndex, 1)

        //再看uploadingXhrCacheList中是否存在(会包含上传失败的xhr), 存在就移除, 这个list的长度会影响当前的上传可用线程数
        let xhrCache = this._uploadingXhrCacheList.find((xhrCache) => {
            return uri == xhrCache.uri
        })
        let xhr = xhrCache && xhrCache.xhr
        if (xhr && (xhr.status != 200 || xhr.readyState != 4)) {
            xhr.abort()
        }

        //根据photoIndex, 删除photoList, 并更新state
        let { photoList, } = this.state
        let photoIndex = photoList.findIndex((photo) => {
            return photo.uri == uri
        })
        photoList.splice(photoIndex, 1)
        this.setState({
            photoList,
            dataSource: this._dataSource.cloneWithRows(photoList),
        });
    }

    _startUploadQuene () {
        //启动上传队列, 会计算可用线程数, 并根据线程数执行对应的上传任务, 并将各个上传任务的xhr对象缓存
        let restUploadNum = maxiumXhrNums - this._uploadingXhrCacheList.length
        if (restUploadNum <= 0) {
            return
        }
        //console.log(`_startUploadQuene photoList ->`, this.state.photoList)
        let shiftNum = restUploadNum <= this._waitForUploadQuene.length ? restUploadNum : this._waitForUploadQuene.length
        for (let i = 0; i < shiftNum; i++) {
            //console.log(`i = ${i}, shiftNum = ${shiftNum}`)
            let uploadTask = this._waitForUploadQuene.shift()   //将待上传队列当前第一项任务对象从队列中取出
            let xhrCache = uploadTask.init()                    //执行上传任务
            console.log(`_startUploadQuene xhrCache -> `, xhrCache)
            this._uploadingXhrCacheList.push(xhrCache)          //缓存该上传任务的xhr对象
        }
        console.log('end this.state.photoList', this.state.photoList)
        console.log('end this.state.dataSource', this.state.dataSource)
    }

    _upload (uploadPhoto) {
        console.log(`_upload uploadPhoto.uri = `, uploadPhoto.uri)
        /**
         * 处理 S  sign
         */
        let options = {
            method: 'post',
            url: constants.api.service,
            data: this._data,
            //data: {
            //    iType: constants.iType.upload,
            //    deviceId: this._deviceID,
            //    token: this._token,
            //}
        }

        //options.data = await this.gZip(options)

        console.log(`_fetch_sendCode options:`, options)
        /**
         * S sign处理完成
         * @type {XMLHttpRequest}
         */


        //console.log(`_upload photoList photoIndex`, photoList, photoIndex)

        let xhr = new XMLHttpRequest();

        xhr.onerror = () => {
            console.log('onerror');
            console.log('Status ', xhr.status);
            console.log('Error ', xhr.responseText);

            let photoList = this._handlePhotoList({ uploadPhoto, eventName: 'onerror' })
            this.setState({
                photoList,
                dataSource: this._dataSource.cloneWithRows(photoList),
            });

            //let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
            //    return uploadPhoto.uri == xhrCache.uri
            //})
            //this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)
            //
            //let photoIndex = this.state.photoList.findIndex((photo) => {
            //    return uploadPhoto.uri == photo.uri
            //})
            //let photo = this.state.photoList[ photoIndex ]
            //photo.uploading = false
            //photo.uploadError = true
            //this.setState({
            //    photoList: [...photoList.slice(0, photoIndex), photo, ...photoList.slice(photoIndex + 1, photoList.length)],
            //    dataSource: this._dataSource.cloneWithRows(photoList),
            //});

            this._startUploadQuene()    //再次启动上传队列(因为this._uploadingXhrCacheList的length有变化了)
        };

        xhr.ontimeout = () => {
            console.log('ontimeout');
            console.log('Status ', xhr.status);
            console.log('Response ', xhr.responseText);

            let photoList = this._handlePhotoList({ uploadPhoto, eventName: 'ontimeout' })
            this.setState({
                photoList,
                dataSource: this._dataSource.cloneWithRows(photoList),
            });

            //let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
            //    return uploadPhoto.uri == xhrCache.uri
            //})
            //this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)
            //
            //let photoIndex = this.state.photoList.findIndex((photo) => {
            //    return uploadPhoto.uri == photo.uri
            //})
            //let photo = this.state.photoList[ photoIndex ]
            //photo.uploading = false
            //photo.uploadError = true
            //this.setState({
            //    photoList: [...this.state.photoList.slice(0, photoIndex), photo, ...this.state.photoList.slice(photoIndex + 1, this.state.photoList.length)],
            //    dataSource: this._dataSource.cloneWithRows(photoList),
            //});

            this._startUploadQuene()    //再次启动上传队列(因为this._uploadingXhrCacheList的length有变化了)
        };

        //xhr.open('post', 'http://posttestserver.com/post.php')
        xhr.open('post', constants.api.service)
        xhr.onload = () => {
            if (xhr.status == 200 && xhr.readyState == 4) {
                console.log(`xhr.responseText = ${xhr.responseText}`)

                let photoList = this._handlePhotoList({ uploadPhoto, eventName: 'onload' })
                this.setState({
                    photoList,
                    dataSource: this._dataSource.cloneWithRows(photoList),
                });

                //let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
                //    return uploadPhoto.uri == xhrCache.uri
                //})
                //this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)
                //
                //let photoIndex = this.state.photoList.findIndex((photo) => {
                //    return uploadPhoto.uri == photo.uri
                //})
                //let photo = this.state.photoList[ photoIndex ]
                //photo.uploading = false
                //photo.uploaded = true
                //this.setState({
                //    photoList: [...this.state.photoList.slice(0, photoIndex), photo, ...this.state.photoList.slice(photoIndex + 1, this.state.photoList.length)],
                //    dataSource: this._dataSource.cloneWithRows(photoList),
                //});

                this._startUploadQuene()    //再次启动上传队列(因为this._uploadingXhrCacheList的length有变化了)
            }

        };
        var formdata = new FormData();

        //formdata.append('image', { ...uploadPhoto, type: 'image/jpg', name: uploadPhoto.filename }); //for android, must set type:'...'
        formdata.append('file', { ...uploadPhoto, type: 'image/jpg', name: uploadPhoto.filename }); //for android, must set type:'...'

        //这里增加其他参数, 比如: itype
        formdata.append('s', options.data.s);
        formdata.append('sign', options.data.sign);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                //console.log(`${event.loaded} / ${event.total}`)

                let photoList = this._handlePhotoList({
                    uploadPhoto,
                    eventName: 'onprogress',
                    loaded: event.loaded,
                    total: event.total,
                })
                this.setState({
                    photoList,
                    dataSource: this._dataSource.cloneWithRows(photoList),
                });

                //let photoIndex = this.state.photoList.findIndex((photo) => {
                //    return uploadPhoto.uri == photo.uri
                //})
                //let photo = this.state.photoList[ photoIndex ]
                //photo.uploadProgress = event.loaded / event.total
                //this.setState({
                //    photoList: [...this.state.photoList.slice(0, photoIndex), photo, ...this.state.photoList.slice(photoIndex + 1, this.state.photoList.length)],
                //    dataSource: this._dataSource.cloneWithRows(photoList),
                //});
            }
        }

        xhr.timeout = 600000 //超时60秒

        xhr.send(formdata);

        let photoList = this._handlePhotoList({ uploadPhoto, })
        this.setState({
            photoList,
            dataSource: this._dataSource.cloneWithRows(photoList),
        });

        //let photoIndex = this.state.photoList.findIndex((photo) => {
        //    return uploadPhoto.uri == photo.uri
        //})
        //let photo = this.state.photoList[ photoIndex ]
        //photo.uploading = true
        //
        //this.setState({
        //    photoList: [...this.state.photoList.slice(0, photoIndex), photo, ...this.state.photoList.slice(photoIndex + 1, this.state.photoList.length)],
        //    dataSource: this._dataSource.cloneWithRows(photoList),
        //});

        let xhrCache = { xhr, uri: uploadPhoto.uri }    //用uri来做唯一性
        return xhrCache
    }

    _handlePhotoList ({uploadPhoto, eventName, loaded, total,}) {
        let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
            return uploadPhoto.uri == xhrCache.uri
        })
        let photoIndex = this.state.photoList.findIndex((photo) => {
            return uploadPhoto.uri == photo.uri
        })
        let photo = this.state.photoList[ photoIndex ]
        switch (eventName) {
            case 'onerror':
            case 'ontimeout':
                this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)

                photo.uploading = false
                photo.uploadError = true

                break;
            case 'onprogress':
                photo.uploadProgress = loaded / total

                break;
            case 'onload':
                this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)
                photo.uploading = false
                photo.uploaded = true

                break;
            default:
                photo.uploading = true

                break;
        }
        return [ ...this.state.photoList.slice(0, photoIndex), photo, ...this.state.photoList.slice(photoIndex + 1, this.state.photoList.length) ];
    }

    /*
     _renderGridCell = (data, index, list) => {
     //console.log(`_renderGridCell data.uri`, data.uri)
     return (
     <TouchableOpacity underlayColor={'#eee'} style={{backgroundColor: 'red'}}>
     <View style={{ overflow: 'hidden',
     justifyContent: 'center', alignItems: 'center', height: 150,
     borderWidth: StyleSheet.hairlineWidth, borderColor:constants.UIInActiveColor,
     borderRightWidth: (index + 1) % columnCount ? StyleSheet.hairlineWidth: 0, }}>
     <Image source={{uri: data.uri}} style={{width: 100, height: 100, }}/>
     </View>
     </TouchableOpacity>
     )
     }*/
}

export default TimerEnhance(AppEventListenerEnhance(XhrEnhance(UploadPage)))

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
        flexDirection: 'column',
    },
    listStyle: {
        flexDirection: 'row', //改变ListView的主轴方向
        flexWrap: 'wrap', //换行
    },
    itemViewStyle: {
        //justifyContent: 'center',
        //alignItems:'center', //这里要注意，如果每个Item都在外层套了一个 Touchable的时候，一定要设置Touchable的宽高

        //height:150,
        overflow: 'hidden',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    buttonStyle: {
        position: 'absolute',
        bottom: 10,
        margin: 10,
        justifyContent: 'center',
        height: 40,
        width: deviceWidth - 20,
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
        return (
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