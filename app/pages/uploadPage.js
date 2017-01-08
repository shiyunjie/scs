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
} from 'react-native'

import constants from  '../constants/constant';
import SudokuGrid from 'react-native-smart-sudoku-grid'
import Icon from 'react-native-vector-icons/Ionicons'
import XhrEnhance from '../lib/XhrEnhance'
import PicturePicker from './picturePicker'

const { width: deviceWidth } = Dimensions.get('window')
const columnCount = 3;
const photoList = [
    //{
    //filename: "IMG_0004.JPG",
    //height: 2500,
    //isStored: true,
    //uploaded:true,
    //uploading:false,
    //uri: "assets-library://asset/asset.JPG?id=99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7&ext=JPG",
    //width: 1668
    //}
];

const maxiumUploadImagesCount = 30 //最多上传图片总数
const maxiumXhrNums = 5 //最多同时上传数量

class UploadPage extends Component {

    // 构造
    constructor (props) {
        super(props)
        // 初始状态
        this.state = {
            photoList,   //{ uri: 'xxx', compressedUri: 'xxx', uploadProgress: 0.9, uploadError: false, uploading: true, uploaded: false,   }, { uri: 'xxx', compressedUri: 'xxx', uploadProgress: 1, uploadError: false, uploading: false, uploaded: true,  }
        };
        this._uploadingXhrCacheList = []    //正在上传中的(包含上传失败的)xhr缓存列表, 用uri做唯一性, 该列表长度会影响当前可用的上传线程数
        this._waitForUploadQuene = []       //待上传队列, 用uri做唯一性
    }

    render () {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.welcome}>
                    单证资料上传,支持jpg、png,最多支持30张,单张图片小于5M
                </Text>
                <TouchableOpacity underlayColor={'#eee'} onPress={()=>{
                     this.props.navigator.push({
                        title: '相机胶卷',
                        component: PicturePicker,
                        passProps: {
                            maxiumUploadImagesCount,
                            currentUploadImagesCount: this.state.photoList.length,
                            addToUploadQuene: this._addToUploadQuene
                        }
                    })
                }}>
                    <View style={{ overflow: 'hidden',
                      justifyContent: 'center', alignItems: 'center', height: 150,
                      borderWidth: StyleSheet.hairlineWidth, borderColor: constants.UIInActiveColor,
                      borderRightWidth: StyleSheet.hairlineWidth, }}>
                                <Icon
                                    name='md-add'  // 图标
                                    size={50}
                                    color={constants.UIInActiveColor}/>
                    </View>
                </TouchableOpacity>
                <SudokuGrid
                    style={styles.sudokuGrid}
                    rowWidth={deviceWidth - 4}
                    containerStyle={{ backgroundColor: '#fff',}}
                    columnCount={columnCount}
                    dataSource={this.state.photoList}
                    renderCell={this._renderGridCell}
                />

            </ScrollView>
        );
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
        console.log(`_addToUploadQuene photoList = `, photoList)
        this.setState({
            photoList,
        }, () => {
            this._startUploadQuene()    //启动一次上传队列
        })
    }

    _removeFromUploadQuene = (index, uri) => {
        //先看待waitForUploadQuene上传队列中是否存在, 存在直接移除队列中的这个对象, 阻止后续的上传
        let uploadTaskIndex = this._waitForUploadQuene.find( uploadTask => {
            return uri == uploadTask.uri
        })
        this._waitForUploadQuene.splice(uploadTaskIndex, 1)

        //再看uploadingXhrCacheList中是否存在(会包含上传失败的xhr), 存在就移除, 这个list的长度会影响当前的上传可用线程数
        let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
            return uri == xhrCache.uri
        })
        let xhr = this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)
        if (xhr.status != 200 || xhr.readyState != 4) {
            xhr.abort()
        }

        //根据photoIndex, 删除photoList, 并更新state
        let { photoList, } = this.state
        photoList.splice(index, 1)
        this.setState({
            photoList,
        });
    }

    _startUploadQuene () {
        //启动上传队列, 会计算可用线程数, 并根据线程数执行对应的上传任务, 并将各个上传任务的xhr对象缓存
        let restUploadNum = maxiumXhrNums - this._uploadingXhrCacheList.length
        if (restUploadNum <= 0) {
            return
        }
        console.log(`_startUploadQuene`)
        let shiftNum = restUploadNum <= this._waitForUploadQuene.length ? restUploadNum : this._waitForUploadQuene.length
        for (let i = 0; i < shiftNum; i++) {
            let uploadTask = this._waitForUploadQuene.shift()   //将待上传队列当前第一项任务对象从队列中取出
            let xhrCache = uploadTask.init()                    //执行上传任务
            this._uploadingXhrCacheList.push(xhrCache)          //缓存该上传任务的xhr对象
        }
    }

    _upload (uploadPhoto) {
        console.log(`_upload`)
        let { photoList, } = this.state

        let photoIndex = photoList.findIndex((photo) => {
            return uploadPhoto.uri == photo.uri
        })
        let photo = photoList[ photoIndex ]
        console.log(`_upload photoList photoIndex`, photoList, photoIndex)

        let xhr = new XMLHttpRequest();

        xhr.onerror = () => {
            console.log('onerror');
            console.log('Status ', xhr.status);
            console.log('Error ', xhr.responseText);

            let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
                return uploadPhoto.uri == xhrCache.uri
            })
            this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)

            photo.uploading = false
            photo.uploadError = true
            this.setState({
                photoList: [...photoList.slice(0, photoIndex), photo, ...photoList.slice(photoIndex, photoList.length - 1)]
            });
            this._startUploadQuene()    //再次启动上传队列(因为this._uploadingXhrCacheList的length有变化了)
        };

        xhr.ontimeout = () => {
            console.log('ontimeout');
            console.log('Status ', xhr.status);
            console.log('Response ', xhr.responseText);

            let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
                return uploadPhoto.uri == xhrCache.uri
            })
            this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)

            photo.uploading = false
            photo.uploadError = true
            this.setState({
                photoList: [...photoList.slice(0, photoIndex), photo, ...photoList.slice(photoIndex, photoList.length - 1)]
            });
            this._startUploadQuene()    //再次启动上传队列(因为this._uploadingXhrCacheList的length有变化了)
        };

        xhr.open('post', 'http://192.168.1.200:8080/app/gateway');
        xhr.onload = () => {
            if (xhr.status == 200 && xhr.readyState == 4) {
                console.log(`xhr.responseText = ${xhr.responseText}`)
                let uploadingXhrCacheIndex = this._uploadingXhrCacheList.findIndex((xhrCache) => {
                    return uploadPhoto.uri == xhrCache.uri
                })
                this._uploadingXhrCacheList.splice(uploadingXhrCacheIndex, 1)

                photo.uploading = false
                photo.uploaded = true
                console.log(`xhr.onload photoList = `, photoList)
                console.log(` this._uploadingXhrCacheList = `,  this._uploadingXhrCacheList)
                console.log(` this._waitForUploadQuene = `,  this._waitForUploadQuene)
                this.setState({
                    photoList: [...photoList.slice(0, photoIndex), photo, ...photoList.slice(photoIndex, photoList.length - 1)]
                });
                this._startUploadQuene()    //再次启动上传队列(因为this._uploadingXhrCacheList的length有变化了)
            }

        };
        var formdata = new FormData();

        formdata.append('file', { ...uploadPhoto, type: 'image/jpg', name: uploadPhoto.filename }); //for android, must set type:'...'
        //formdata.append('file', { ...uploadPhoto, name: uploadPhoto.filename }); //for android, must set type:'...'

        //这里增加其他参数, 比如: itype
        formdata.append({
            //s: JSON.stringify({
            //    itype: 95,
            //}),
            itype: 95,
        })

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                console.log(`${event.loaded} / ${event.total}`)
                photo.uploadProgress = event.loaded / event.total
                this.setState({
                    photoList: [...photoList.slice(0, photoIndex), photo, ...photoList.slice(photoIndex, photoList.length - 1)]
                });
            }
        };

        xhr.timeout = 600000 //超时60秒

        xhr.send(formdata);

        photo.uploading = true
        this.setState({
            photoList: [...photoList.slice(0, photoIndex), photo, ...photoList.slice(photoIndex, photoList.length - 1)]
        });

        let xhrCache = { xhr, uri: uploadPhoto.uri }    //用uri来做唯一性
        return xhrCache
    }

    _renderGridCell = (data, index, list) => {
            console.log(`_renderGridCell data.uri`, data.uri)
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
    }
}

export default XhrEnhance(UploadPage)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
        marginLeft: 2,
        marginRight: 2,
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