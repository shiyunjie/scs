/**
 * Created by shiyunjie on 17/3/7.
 */
import React, {
    PropTypes,
    Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    PixelRatio,
    TouchableOpacity,
    NativeAppEventEmitter,
    Image,
    Dimensions,
    Alert,
    NativeModules,
    ActivityIndicator,

} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from '../constants/constant';
import UploadPage from '../pages/uploadPage'
import RNFS from 'react-native-fs'
import {doSign} from '../lib/utils'
import {getDeviceID,getToken} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance'

import doc from '../images/word.png'
import excel from '../images/excel.png'
import pdf from '../images/pdf.png'
import file from '../images/File_Blank.png'

import ImageZoomModal from '../components/ImageZoomModal'
import ImagePicker from 'react-native-image-crop-picker'
const NativeCompressedModule = NativeModules.NativeCompressedModule;

const { width: deviceWidth } = Dimensions.get('window');

import PicturePicker from '../pages/picturePicker'

const maxiumUploadImagesCount = 30 //最多上传图片总数
const maxiumXhrNums = 5 //最多同时上传数量

 class ShowPhotoView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            //photoList: [...this.props.photoList]
            photoList: this.props.photoList
        };

        this._uploadingXhrCacheList = []    //正在上传中的(包含上传失败的)xhr缓存列表, 用uri做唯一性, 该列表长度会影响当前可用的上传线程数
        this._waitForUploadQuene = []       //待上传队列, 用uri做唯一性
        this._waitForAddPhotos = null
        this._ids = [];
        this.ImgTemp = '';
        this._initCustomData()
    }



    static propTypes = {
        ...View.propTypes, // 包含默认的View的属性
        //showPhoto: PropTypes.func,
        UploadPage: PropTypes.any.isRequired,
        photoList: PropTypes.array,
        showUpload: PropTypes.bool,
    }
    static defaultProps = {
        photoList: [],
        showUpload: true,
        //showPhoto: this._showPhoto
    }



    _showPhoto(url) {
        this._ImageZoomModal.ShowPhoto(url)
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




    componentWillReceiveProps(nextProps) {
        let photoList = nextProps.photoList
            console.log(`componentWillReceiveProps:`, photoList)
            this.setState({
                photoList: photoList,
            })

            if (this._waitForAddPhotos && this._waitForAddPhotos.length > 0) {
                setTimeout(() => {
                    /*
                     //@todo async this._getCompressedPhotos 返回photos数组, 遍历this._waitForAddPhotos {let compressedUri = await NativeCompressedModule.compress(...); 遍历的photo对象uri赋值compressedUri }
                     this._getCompressedPhotos().then((photos)=>{
                     this._addToUploadQuene(photos)
                     })*/
                    this._addToUploadQuene(this._waitForAddPhotos)
                    this._waitForAddPhotos = null

                }, 300)

            }


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


    render() {
        let width = height = (deviceWidth - constants.MarginLeftRight * 2 - 20) / 4
        return (
            <View
                style={[this.props.style,{flexDirection:'row',justifyContent:'flex-start',flexWrap: 'wrap',}]}
            >
                <ImageZoomModal
                    ref={ component => this._ImageZoomModal = component }
                    PhotoList={this.props.photoList}
                    DeletePhoto={this._removeFromUploadQuene.bind(this)}
                    showDeleteButton={this.props.showUpload}
                />
                {
                    this.state.photoList.map((item, index) => {

                            if (item.file_mime&&item.file_mime.indexOf('image') == -1) {
                                if (item.file_mime.indexOf('pdf') > -1) {
                                    return (
                                        <View
                                            key={`${index}`}
                                            style={{width:width,height:height,
                                            marginRight:5,paddingTop:5,marginBottom:5}}
                                        >
                                            <Image
                                                style={{width:width-20,height:height-20,}}
                                                source={pdf}/>
                                            <Text
                                                style={{fontSize:12,color:constants.LabelColor}}
                                                numberOfLines={1}>
                                                {item.file_name}
                                            </Text>
                                            {this.props.showUpload ?
                                                <TouchableOpacity
                                                    style={{position:'absolute',top:1,right:1, backgroundColor: 'transparent',}}
                                                    onPress={this._deleteFile.bind(this,item.id)}>
                                                    <Icon
                                                        name="ios-remove-circle"
                                                        size={constants.IconSize-5}
                                                        color={constants.UIActiveColor}
                                                    />
                                                </TouchableOpacity> : null
                                            }
                                        </View>
                                    )
                                } else if (item.file_mime.indexOf('word') > -1) {
                                    return (
                                        <View
                                            key={`${index}`}
                                            style={{width:width,height:height,
                                            marginRight:5,paddingTop:5,marginBottom:5}}
                                        >
                                            <Image
                                                style={{width:width-20,height:height-20,}}
                                                source={doc}/>
                                            <Text
                                                style={{fontSize:12,color:constants.LabelColor}}
                                                numberOfLines={1}>
                                                {item.file_name}
                                            </Text>
                                            {this.props.showUpload ?
                                                <TouchableOpacity
                                                    style={{position:'absolute',top:1,right:1, backgroundColor: 'transparent',}}
                                                    onPress={this._deleteFile.bind(this,item.id)}>
                                                    <Icon
                                                        name="ios-remove-circle"
                                                        size={constants.IconSize-5}
                                                        color={constants.UIActiveColor}
                                                    />
                                                </TouchableOpacity> : null
                                            }
                                        </View>
                                    )
                                } else if (item.file_mime.indexOf('excel') > -1) {
                                    return (
                                        <View
                                            key={`${index}`}
                                            style={{width:width,height:height,
                                            marginRight:5,paddingTop:5,marginBottom:5}}
                                        >
                                            <Image
                                                style={{width:width-20,height:height-20,}}
                                                source={excel}/>
                                            <Text
                                                style={{fontSize:12,color:constants.LabelColor}}
                                                numberOfLines={1}>
                                                {item.file_name}
                                            </Text>
                                            {this.props.showUpload ?
                                                <TouchableOpacity
                                                    style={{position:'absolute',top:1,right:1, backgroundColor: 'transparent',}}
                                                    onPress={this._deleteFile.bind(this,item.id)}>
                                                    <Icon
                                                        name="ios-remove-circle"
                                                        size={constants.IconSize-5}
                                                        color={constants.UIActiveColor}
                                                    />
                                                </TouchableOpacity> : null
                                            }
                                        </View>
                                    )
                                }else {
                                    return (
                                        <View
                                            key={`${index}`}
                                            style={{width:width,height:height,
                                            marginRight:5,paddingTop:5,marginBottom:5}}
                                        >
                                            <Image
                                                style={{width:width-20,height:height-20,}}
                                                source={file}/>
                                            <Text
                                                style={{fontSize:12,color:constants.LabelColor}}
                                                numberOfLines={1}>
                                                {item.file_name}
                                            </Text>
                                            {this.props.showUpload ?
                                                <TouchableOpacity
                                                    style={{position:'absolute',top:1,right:1, backgroundColor: 'transparent',}}
                                                    onPress={this._deleteFile.bind(this,item.id)}>
                                                    <Icon
                                                        name="ios-remove-circle"
                                                        size={constants.IconSize-5}
                                                        color={constants.UIActiveColor}
                                                    />
                                                </TouchableOpacity> : null
                                            }
                                        </View>
                                    )


                                }

                            }else {
                                return (
                                    <View
                                        key={`${index}`}
                                        style={{width:width,height:height,backgroundColor:constants.UIInActiveColor,
                                        marginRight:5,marginTop:5,marginBottom:5}}>

                                        <TouchableOpacity
                                            onPress={()=>this._showPhoto(item.big_url)}>

                                            <Image style={{width:width,height:height}}
                                                   source={{uri:`${item.file_url}`}}>
                                                {
                                                    item.uploading ? <View
                                                        style={{flex: 1, backgroundColor: 'rgba(160, 160, 160, 0.5)', justifyContent: 'center', alignItems: 'center',}}>
                                                        <ActivityIndicator
                                                            animating={true}
                                                            color={'#fff'}
                                                            size={'small'}/>
                                                        <Text
                                                            style={{color: '#fff', padding: 5, fontSize: 14,}}>{item.uploadProgress ? Math.floor(item.uploadProgress * 100) : 0}%</Text>
                                                    </View> : null
                                                }
                                                {
                                                    item.uploadError ? <View
                                                        style={{flex: 1, backgroundColor: 'rgba(160, 160, 160, 0.7)', justifyContent: 'center', alignItems: 'center',}}>

                                                        <Text
                                                            style={{color: '#fff', padding: 5, fontSize: 14,}}>上传失败</Text>
                                                    </View> : null
                                                }
                                            </Image>

                                        </TouchableOpacity>
                                        {this.props.showUpload ?
                                            <TouchableOpacity
                                                style={{position:'absolute',top:1,right:1, backgroundColor: 'transparent',}}
                                                onPress={this._removeFromUploadQuene.bind(this,item.big_url)}>
                                                <Icon
                                                    name="ios-remove-circle"
                                                    size={constants.IconSize-5}
                                                    color={constants.UIActiveColor}
                                                />
                                            </TouchableOpacity> : null
                                        }
                                    </View>
                                )
                            }
                        }
                    )
                }
                {this.props.showUpload ?
                    <TouchableOpacity
                        key={`last`}
                        style={{width:width,height:height,marginRight:5,marginTop:5,marginBottom:5,flexDirection:'column',
                                    justifyContent:'flex-start',alignItems:'center',padding:0}}
                        onPress={()=>{

                                       /* this.props.navigator.push({
                                                title: '相机胶卷',
                                                component: PicturePicker,
                                                passProps: {
                                                    maxiumUploadImagesCount,
                                                    currentUploadImagesCount: this.state.photoList.length,
                                                    waitForAddToUploadQuene: this._waitForAddToUploadQuene,
                                                    ids:this._ids,
                                                    //addToUploadQuene: this._addToUploadQuene
                                                    }
                                                })*/
                                       //this.props.navigator.push({
                                       //     title: '上传资料',
                                       //     component: UploadPage,
                                       //     passProps: {
                                       //        id:'',
                                       //        showList:this.props.photoList,
                                       //        }
                                       //     });

                                ImagePicker.openPicker({
                                  multiple: true,
                                }).then(images => {
                                  //console.log(images);
                                        if(!images||images.length==0){
                                        return;
                                        }

                                    let Uris = []

                                    for (let data of this._ids) {
                                        Uris.push(data.big_uri)
                                    }
                                    //console.log(`Uris:`, Uris)
                                    let selected = [];
                                    for (let i = images.length - 1; i >= 0; i--){
                                        let data = images[i]
                                        if (Uris.indexOf(data.path) == -1) {
                                            console.log(`Uris_data:`, data)
                                            console.log(`Uris:`, Uris)
                                            data.big_uri = data.path
                                            data.uri = data.path
                                            data.file_url=data.path
                                            data.big_url=data.path
                                            selected.push(data)
                                        }
                                    }
                                    //this.props.waitForAddToUploadQuene(this.state.selected)
                                    this._waitForAddToUploadQuene(selected)
                                    if (this._waitForAddPhotos && this._waitForAddPhotos.length > 0) {
                                    setTimeout(() => {

                                     //@todo async this._getCompressedPhotos 返回photos数组, 遍历this._waitForAddPhotos {let compressedUri = await NativeCompressedModule.compress(...); 遍历的photo对象uri赋值compressedUri }
                                     //this._getCompressedPhotos().then((photos)=>{
                                     //this._addToUploadQuene(photos)
                                     //})
                                    this._addToUploadQuene(this._waitForAddPhotos)
                                    this._waitForAddPhotos = null

                                         }, 300)

                                    }

                                });

                       }}>
                        <Icon
                            name='ios-image'  // 图标
                            size={width-20}
                            color={constants.LabelColor}/>
                        <Text
                            style={{fontSize:12,color:constants.LabelColor}}>点击上传</Text>

                    </TouchableOpacity> : null
                }
            </View>)
    }



     _waitForAddToUploadQuene = (photos) => {
         this._waitForAddPhotos = photos;

        /* if (this._waitForAddPhotos && this._waitForAddPhotos.length > 0) {
             setTimeout(() => {
                 /!*
                  //@todo async this._getCompressedPhotos 返回photos数组, 遍历this._waitForAddPhotos {let compressedUri = await NativeCompressedModule.compress(...); 遍历的photo对象uri赋值compressedUri }
                  this._getCompressedPhotos().then((photos)=>{
                  this._addToUploadQuene(photos)
                  })*!/
                 this._addToUploadQuene(this._waitForAddPhotos)
                 this._waitForAddPhotos = null

             }, 300)

         }*/
     }

     _addToUploadQuene = (photos) => {
         console.log(`_addToUploadQuene`, photos)
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
             photoList:photoList
         }, () => {
             this._startUploadQuene()    //启动一次上传队列
         })
     }

    _removeFromUploadQuene(url) {
        Alert.alert('温馨提醒', '确定要删除图片吗?',
            [{
                text: '取消', onPress: ()=> {}
                },
                {
                    text: '确定', onPress: ()=> {
                    //先看待waitForUploadQuene上传队列中是否存在, 存在直接移除队列中的这个对象, 阻止后续的上传
                    let uploadTaskIndex = this._waitForUploadQuene.find(uploadTask => {
                        return url == uploadTask.big_uri
                    })
                    this._waitForUploadQuene.splice(uploadTaskIndex, 1)

                    //再看uploadingXhrCacheList中是否存在(会包含上传失败的xhr), 存在就移除, 这个list的长度会影响当前的上传可用线程数
                    let xhrCache = this._uploadingXhrCacheList.find((xhrCache) => {
                        return url == xhrCache.big_uri
                    })
                    let xhr = xhrCache && xhrCache.xhr
                    if (xhr && (xhr.status != 200 || xhr.readyState != 4)) {
                        xhr.abort()
                    }

                    //遍历ids如果包含,删除id
                    for (let data of this._ids) {

                        if (data.big_uri == url) {
                            //console.log(`ids_delete${data.big_uri}:`, data.id)
                            this._ids.splice(this._ids.indexOf(data), 1)
                            break
                        }
                    }

                   /* let deleteIndex = this.props.photoList.find((showTask) => {
                        console.log(`photoList.find`,showTask)
                        return url == showTask.big_url
                    })
                    this.props.photoList.splice(this.props.photoList.indexOf(deleteIndex), 1)
                    */

                    for(let data of this.props.photoList){
                        if (data.big_url == url) {
                            this.props.photoList.splice(this.props.photoList.indexOf(data), 1)
                            break
                        }
                    }
                    //console.log(`photoList.url`,url)

                    let photoList=this.state.photoList
                    for(let data of photoList){
                        if (data.big_url == url) {
                            photoList.splice(photoList.indexOf(data), 1)
                            break
                        }
                    }

                    this.setState({photoList: photoList})
                    this._ImageZoomModal.setState({modalVisible:false})
                }
                }

            ])

        }
     _deleteFile(id){
         Alert.alert('温馨提醒', '确定要删除图片吗?',
             [{
                 text: '取消', onPress: ()=> {}
             },
             {
                 text: '确定', onPress: ()=> {
                 for(let data of this.props.photoList){
                     if (data.id == id) {
                         this.props.photoList.splice(this.props.photoList.indexOf(data), 1)
                         break
                     }
                 }
                 this.setState({photoList: this.props.photoList})
                 }
             }

             ])

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
        //console.log(`_upload uploadPhoto.big_uri = `, uploadPhoto.uri)
        /**
         * 处理 S  sign
         */
        let options = {
            method: 'post',
            url: constants.api.service,
            data: this._data,

        }


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
                photoList:photoList
            });



            this._startUploadQuene()    //再次启动上传队列(因为this._uploadingXhrCacheList的length有变化了)
        };

        xhr.ontimeout = () => {
            //console.log('ontimeout');
            //console.log('Status ', xhr.status);
            //console.log('Response ', xhr.responseText);

            let photoList = this._handlePhotoList({uploadPhoto, eventName: 'ontimeout'})
            this.setState({
                photoList:photoList
            });


            this._startUploadQuene()    //再次启动上传队列(因为this._uploadingXhrCacheList的length有变化了)
        };

        if(constants.development){
            //测试模式
            xhr.open('post', 'http://posttestserver.com/post.php')
        }else {
            xhr.open('post', constants.api.service)
        }
        xhr.setRequestHeader('Content-Type', 'multipart/form-data')
        xhr.onload = () => {
            if (xhr.status == 200 && xhr.readyState == 4) {
                //console.log(`xhr.responseText = ${xhr.responseText}`)
                //处理获取的id
                let eventName = 'onload'

                if(constants.development){
                    //开发模式
                    let myDate = new Date();

                    let id=myDate.getMilliseconds()+''

                    //id加入集合
                    let file = {big_uri: uploadPhoto.big_uri, id: id}
                    if (this._ids.indexOf(file) == -1) {
                        this._ids.push(file)
                        //console.log(`ids:`, this._ids);
                    }

                    //url 加入到上一个页面显示照片列表,

                    this.props.photoList.push({
                        id:id,
                        file_url:uploadPhoto.big_url,
                        big_url:uploadPhoto.big_url,
                    })

                    let photoList=this.state.photoList
                    for(let data of photoList){
                        if(data.big_url==uploadPhoto.big_url){
                            data.id=id;
                        }

                    }


                    this.setState({photoList: photoList})



                }else {


                    this.gunZip(xhr.responseText).then((response)=> {

                        let result = JSON.parse(response)
                        if (!result) {

                            return
                        }
                        if (result.code == '10' && result.result) {
                            //console.log(`response.result:`, result.result)
                            //id加入集合
                            let file = {big_uri: uploadPhoto.big_uri, id: result.result.id}
                            if (this._ids.indexOf(file) == -1) {
                                this._ids.push(file)
                                //console.log(`ids:`, this._ids);
                            }

                            //url 加入到上一个页面显示照片列表,
                            this.props.photoList.push({
                                id:id,
                                file_url:uploadPhoto.big_uri,
                                big_url:uploadPhoto.big_uri,
                            })

                            let photoList=this.state.photoList
                            for(let data of photoList){
                                if(data.big_url==uploadPhoto.big_url){
                                    data.id=id;
                                }

                            }

                            this.setState({photoList: photoList})

                        } else {
                            //id出错
                            //console.log(`error`, result)
                            eventName = 'onerror'
                        }
                    }, (error)=>console.log(`responseText:`, error))
                }

                let photoList = this._handlePhotoList({uploadPhoto, eventName: eventName})
                this.setState({
                    photoList:photoList
                });



                this._startUploadQuene()    //再次启动上传队列(因为this._uploadingXhrCacheList的length有变化了)
            }

        };
        var formdata = new FormData();


        //formdata.append('image', { ...uploadPhoto, type: 'image/jpg', name: uploadPhoto.filename }); //for android, must set type:'...'
        //formdata.append('file', { ...uploadPhoto, type: 'image/jpg', name: uploadPhoto.filename }); //for android, must set type:'...'
        let name = uploadPhoto.filename
        if (Platform.OS == 'android') {
            /* let names=uploadPhoto.big_uri.split('/')
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
                    photoList:photoList
                });

            }
        }

        xhr.timeout = 60000 //超时60秒

        //console.log(`formdata:`, formdata)
        xhr.send(formdata);

        let photoList = this._handlePhotoList({uploadPhoto,})
        this.setState({
            photoList:photoList
        });


        let xhrCache = {xhr, big_uri: uploadPhoto.big_uri}    //用uri来做唯一性
        return xhrCache
    }

    _doRSASign(data) {
        return doSign(data)
    }

    _handlePhotoList({uploadPhoto, eventName, loaded, total,}) {
        let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
            return uploadPhoto.big_uri == xhrCache.big_uri
        })


        let photoIndex = this.state.photoList.findIndex((photo) => {
            return uploadPhoto.big_uri == photo.big_uri
        })


        let photo = this.state.photoList[photoIndex]

        //console.log(`uploadingXhrCacheIndex:`,photo);

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

}

export default XhrEnhance(ShowPhotoView)