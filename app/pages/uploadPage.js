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
    Modal,
    NativeModules,
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
import Toast from 'react-native-smart-toast'
import RNFS from 'react-native-fs'

import {doSign} from '../lib/utils'
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'
import ImageZoom from 'react-native-image-pan-zoom';

const NativeCompressedModule = NativeModules.NativeCompressedModule;

const { width: deviceWidth ,height: deviceHeight} = Dimensions.get('window')

/*{
 filename: "IMG_0003.JPG",
 height: 2500,
 isStored: true,
 uploaded:true,
 uploading:false,
 uri: "assets-library://asset/asset.JPG?id=9F983DBA-EC35-42B8-8773-B597CF782EDD&ext=JPG",
 width: 1668
 }*/
const photoList = [];


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
    constructor(props) {
        super(props);
        // 初始状态
        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            service_id: this.props.id,//服务单id
            photoList,
            dataSource: this._dataSource.cloneWithRows(photoList),
            showUrl: '',
            modalVisible: false,
        }
        this._uploadingXhrCacheList = []    //正在上传中的(包含上传失败的)xhr缓存列表, 用uri做唯一性, 该列表长度会影响当前可用的上传线程数
        this._waitForUploadQuene = []       //待上传队列, 用uri做唯一性
        this._waitForAddPhotos = null
        this._ids = [];
        this.ImgTemp = '';
        this._initCustomData()
        this.firstFetch=true;

    }

    componentWillMount() {
        this.ImgTemp = `${RNFS.DocumentDirectoryPath}/ImgTemp`
        //console.log(`RNFS.DocumentDirectoryPath = ${RNFS.DocumentDirectoryPath}`)
        RNFS.readDir(RNFS.DocumentDirectoryPath)
            .then((readDirItems) => {
                //console.log(`readDirItems -> `)
                //console.log(readDirItems)
            })
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                //console.log(`orderPage willfocus...`)
                //console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (event && currentRoute === event.data.route) {
                    //console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                    if (this._waitForAddPhotos && this._waitForAddPhotos.length > 0) {
                        this.setTimeout(() => {
                            /*
                             //@todo async this._getCompressedPhotos 返回photos数组, 遍历this._waitForAddPhotos {let compressedUri = await NativeCompressedModule.compress(...); 遍历的photo对象uri赋值compressedUri }
                             this._getCompressedPhotos().then((photos)=>{
                             this._addToUploadQuene(photos)
                             })*/
                            this._addToUploadQuene(this._waitForAddPhotos)
                            this._waitForAddPhotos = null

                        }, 300)

                    }
                } else {
                    //console.log("orderPage willDisappear, other willAppear")
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
                    console.log("upload didAppear")

                    if (this.firstFetch) {
                        this._fetchData()
                        this.firstFetch = false;
                    }
                }else {
                    //console.log("orderPage willDisappear, other willAppear")
                }
            })
        )


    }


    componentWillUnmount() {
        //console.log(' componentWillUnmount');
        //删除缓存目录
        RNFS.unlink(this.ImgTemp)
            .then(() => {
                //console.log('componentWillUnmount', 'FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
                //console.log(`componentWillUnmount`, err.message);
            });
    }

    /**
     * let compressedUri = await NativeCompressedModule.compress(...); 遍历的photo对象uri赋值compressedUri
     * @param AddPhotos
     * @private
     */
    async _getCompressedPhotos() {
        let photos = this._waitForAddPhotos
        for (let data of photos) {
            let compressedUri = ''
            if (Platform.OS == 'android') {
                //    uri: `file://${RNFS.ExternalDirectoryPath}/1.jpg`,   //for android, test ok
                compressedUri = await NativeCompressedModule.compress(data.big_uri, this.ImgTemp, data.width / 2, data.height / 2)
                compressedUri = `file://` + compressedUri
                //console.log(`compressedUri:`, compressedUri)
            } else {
                //    uri: RNFS.DocumentDirectoryPath + '/1.jpg',   //for ios, test ok
                compressedUri = await NativeCompressedModule.compress(data.big_uri, this.ImgTemp, data.width / 2, data.height / 2)

            }
            //重设uri
            data.uri = compressedUri
        }
        return photos

    }


    async _initCustomData() {
        this._token = await getToken()
        this._deviceID = await getDeviceID()
        this._data = await this.gZip({
            data: {
                iType: constants.iType.upload,
                deviceId: this._deviceID,
                token: this._token,
            }
        })
    }

    /*<Image
     source={{uri: this.state.showUrl}}
     style={{flex: 1, position: 'relative',margin: 5, }}/>*/

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this.setState({modalVisible:false})}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',
                    backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                        <TouchableOpacity
                            style={{position:'absolute',top:10,right:10, backgroundColor: 'transparent',}}
                            onPress={()=>this.setState({modalVisible:false})}>
                            <Icon
                                name='md-close-circle'  // 图标
                                size={constants.IconSize}
                                color={constants.UIActiveColor}/>
                        </TouchableOpacity>
                        <ImageZoom cropWidth={500}
                                   cropHeight={500}
                                   imageWidth={400}
                                   imageHeight={400}>
                            <Image
                                source={{uri: this.state.showUrl}}
                                style={{width:400,height:400, position: 'relative',margin: 5, }}/>
                        </ImageZoom>
                    </View>

                </Modal>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    contentContainerStyle={styles.listStyle}
                    enableEmptySections={true}
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
                            waitForAddToUploadQuene: this._waitForAddToUploadQuene,
                            ids:this._ids,
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
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>
                </Toast>
                <LoadingSpinnerOverlay
                    ref={ component => this._modalLoadingSpinnerOverLay = component }/>
            </View>
        );
    }

    _showBigUrl(url) {
        this.setState({showUrl: url, modalVisible: true})

    }

    _renderRow = (rowData, sectionID, rowID) => {
        let width = height = deviceWidth / 3
        return (
            <View
                key={`key${rowID}img`}
                style={[styles.itemViewStyle,{width, height,}]}>
                <TouchableOpacity
                    onPress={this._showBigUrl.bind(this,rowData.big_uri)}
                    style={{flex: 1,}}>
                    <Image
                        source={{uri: rowData.big_uri}}
                        style={{flex: 1, position: 'relative',margin: 5, }}>

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
                        {
                            rowData.uploadError ? <View
                                style={{flex: 1, backgroundColor: 'rgba(160, 160, 160, 0.7)', justifyContent: 'center', alignItems: 'center',}}>

                                <Text
                                    style={{color: '#fff', padding: 5, fontSize: 14,}}>上传失败</Text>
                            </View> : null
                        }
                        <TouchableOpacity
                            style={{position:'absolute',top:0,right:0, backgroundColor: 'transparent',}}
                            onPress={this._removeFromUploadQuene.bind(this, rowData.uri)}>
                            <Icon
                                name='md-close-circle'  // 图标
                                size={constants.IconSize}
                                color={constants.UIActiveColor}/>
                        </TouchableOpacity>
                    </Image>
                </TouchableOpacity>

            </View>
        )
    }

    componentWillUnmount() {
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
        //console.log(`_addToUploadQuene`, photos)
        for (let photo of photos) {
            let uploadTask = {
                uri: photo.big_uri,                 //用uri来做唯一性
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
        //遍历ids如果包含,删除id
        for (let data of this._ids) {

            if (data.uri == uri) {
                //console.log(`ids_delete${data.uri}:`, data.id)
                this._ids.splice(this._ids.indexOf(data), 1)
                break
            }
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

    _startUploadQuene() {
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
            //console.log(`_startUploadQuene xhrCache -> `, xhrCache)
            this._uploadingXhrCacheList.push(xhrCache)          //缓存该上传任务的xhr对象
        }
        //console.log('end this.state.photoList', this.state.photoList)
        //console.log('end this.state.dataSource', this.state.dataSource)
    }

    _upload(uploadPhoto) {
        //console.log(`_upload uploadPhoto.uri = `, uploadPhoto.uri)
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

        //console.log(`_fetch_sendCode options:`, options)
        /**
         * S sign处理完成
         * @type {XMLHttpRequest}
         */


        //console.log(`_upload photoList photoIndex`, photoList, photoIndex)

        let xhr = new XMLHttpRequest();

        xhr.onerror = () => {
            //console.log('onerror');
            //console.log('Status ', xhr.status);
            //console.log('Error ', xhr.responseText);

            let photoList = this._handlePhotoList({uploadPhoto, eventName: 'onerror'})
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
            //console.log('ontimeout');
            //console.log('Status ', xhr.status);
            //console.log('Response ', xhr.responseText);

            let photoList = this._handlePhotoList({uploadPhoto, eventName: 'ontimeout'})
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
        xhr.setRequestHeader('Content-Type', 'multipart/form-data')
        xhr.onload = () => {
            if (xhr.status == 200 && xhr.readyState == 4) {
                //console.log(`xhr.responseText = ${xhr.responseText}`)
                //处理获取的id
                let eventName = 'onload'
                this.gunZip(xhr.responseText).then((response)=> {

                    let result = JSON.parse(response)
                    if(!result){

                        return
                    }
                    if (result.code == '10' && result.result) {
                        //console.log(`response.result:`, result.result)
                        //id加入集合
                        let file = {uri: uploadPhoto.big_uri, id: result.result.id}
                        if (this._ids.indexOf(file) == -1) {
                            this._ids.push(file)
                            //console.log(`ids:`, this._ids);
                        }
                    } else {
                        //id出错
                        //console.log(`error`, result)
                        eventName = 'onerror'
                    }
                }, (error)=>console.log(`responseText:`, error))


                let photoList = this._handlePhotoList({uploadPhoto, eventName: eventName})
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
        //formdata.append('file', { ...uploadPhoto, type: 'image/jpg', name: uploadPhoto.filename }); //for android, must set type:'...'
        let name = uploadPhoto.filename
        if (Platform.OS == 'android') {
            /* let names=uploadPhoto.uri.split('/')
             name=names[names.length-1]+'.jpg'*/
            name = 'android.jpg'
        }
        //console.log(` uploadPhoto`, uploadPhoto)
        formdata.append('file', {...uploadPhoto, type: 'image/jpg', name: name}); //for android, must set type:'...'

        //这里增加其他参数, 比如: itype
        //console.log(`options.data.s`, options.data.s)
        formdata.append('s', options.data.s);
        //formdata.append("text", options.data.s);
        /**
         * 这里处理sign
         */
        options.data.sign = this._doRSASign(options.data.s)
        //console.log(` options.data.sign:`, options.data.sign)
        /**
         * 处理sign结束
         */
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

        //console.log(`formdata:`, formdata)
        xhr.send(formdata);

        let photoList = this._handlePhotoList({uploadPhoto,})
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

        let xhrCache = {xhr, uri: uploadPhoto.uri}    //用uri来做唯一性
        return xhrCache
    }

    _doRSASign(data) {
        return doSign(data)
    }

    _handlePhotoList({uploadPhoto, eventName, loaded, total,}) {
        let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
            return uploadPhoto.uri == xhrCache.uri
        })
        let photoIndex = this.state.photoList.findIndex((photo) => {
            return uploadPhoto.uri == photo.uri
        })
        let photo = this.state.photoList[photoIndex]

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
            case 'onload'://这里要传code进来判断是否成功  才设置photo.uploaded = true
                this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)
                photo.uploading = false
                photo.uploaded = true

                break;
            default:
                photo.uploading = true

                break;
        }
        return [...this.state.photoList.slice(0, photoIndex), photo, ...this.state.photoList.slice(photoIndex + 1, this.state.photoList.length)];
    }


    async _fetch_finish() {

        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let fileIds = '';
            for (let data of this._ids) {
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

            //console.log(`_fetch_finish options:`, options)

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

                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '上传成功'
                })
                setTimeout(()=>this.props.navigator.pop(),1000)


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

    async _fetchData() {
        console.log(`upload_fetchData`)
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

                let photos = []
                for (let data of result.result) {
                    //console.log('data', data)
                    let file = {uri: data.file_url, id: data.id}
                    if (this._ids.indexOf(file) == -1) {
                        this._ids.push(file)
                        //console.log(`ids:`, this._ids);
                    }

                    photos.push(
                        {
                            filename: data.filename,
                            height: data.height,
                            isStored: true,
                            uploaded: true,
                            uploading: false,
                            uri: data.file_url,
                            big_uri: data.big_url,
                            width: data.width,
                        }
                    )
                }
                //很明显, 这里UI要更新
                let photoList = this.state.photoList
                photoList = photoList.concat(photos)
                this.setState({
                    photoList,
                    dataSource: this._dataSource.cloneWithRows(photoList),
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
            if(this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }

        }
        finally {
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }
}

export default TimerEnhance(AppEventListenerEnhance(XhrEnhance(UploadPage)))

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 64 : 56,
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
        //borderBottomWidth: StyleSheet.hairlineWidth,
        //borderLeftWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,

    },
    buttonStyle: {
        position: 'absolute',
        bottom: 10,
        margin: 10,
        width: deviceWidth - 20,
        backgroundColor: constants.UIActiveColor,
        //borderWidth: StyleSheet.hairlineWidth,
        //borderColor:constants.UIActiveColor,

        height: 40,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center',
        borderRadius: 30,

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
//                NativeAppEventEmitter.emit('PicturePicker.finish.saveIds')
//                }}
//                style={navigatorStyle.navBarRightButton}>
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    完成
//                </Text>
//            </TouchableOpacity>
//        )
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