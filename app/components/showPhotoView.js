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
    PixelRatio,
    TouchableOpacity,
    NativeAppEventEmitter,
    Image,
    Dimensions,
    Alert,

} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from '../constants/constant';
import UploadPage from '../pages/uploadPage'
import doc from '../images/word.png'
import excel from '../images/excel.png'
import pdf from '../images/pdf.png'
import file from '../images/File_Blank.png'
import ImageZoomModal from '../components/ImageZoomModal'

const { width: deviceWidth } = Dimensions.get('window');

export default class ShowPhotoView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            //photoList: [...this.props.photoList]
            photoList: this.props.photoList
        };
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


    componentWillReceiveProps(nextProps) {
        let photoList = nextProps.photoList
        /*let result = this.state.photoList
         //console.log(`photoList:`, photoList)
         for (let data of photoList) {
         let flag=true
         for(let item of result){
         if(item.id==data.id&&item.file_url==data.file_url){
         flag=false
         break;
         }
         //result.splice(result.length-1,0,data)

         }
         if(flag) {
         result.push(data)
         }
         }*/
        //console.log(`result:`, result)
        this.setState({
            photoList: photoList,
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
                    DeletePhoto={this._deletePhoto.bind(this)}
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
                                        </View>
                                    )


                                }

                            }
                            return (
                                <View
                                    key={`${index}`}
                                    style={{width:width,height:height,backgroundColor:constants.UIInActiveColor,
                                    marginRight:5,marginTop:5,marginBottom:5}}>

                                    <TouchableOpacity
                                        onPress={()=>this._showPhoto(item.big_url)}>

                                        <Image style={{width:width,height:height}}
                                               source={{uri:`${item.file_url}`}}
                                        />

                                    </TouchableOpacity>
                                    {this.props.showUpload ?
                                        <TouchableOpacity
                                            style={{position:'absolute',top:1,right:1, backgroundColor: 'transparent',}}
                                            onPress={this._deletePhoto.bind(this,item.big_url)}>
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
                    )
                }
                {this.props.showUpload ?
                    <TouchableOpacity
                        key={`last`}
                        style={{width:width,height:height,marginRight:5,marginTop:5,marginBottom:5,flexDirection:'column',
                                    justifyContent:'flex-start',alignItems:'center',padding:0}}
                        onPress={()=>{
                                       this.props.navigator.push({
                                            title: '上传资料',
                                            component: UploadPage,
                                            passProps: {
                                               id:'',
                                               showList:this.props.photoList,
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

    _deletePhoto(url) {
        Alert.alert('温馨提醒', '确定要删除图片吗?',
            [{
                text: '取消', onPress: ()=> {
                }
            },
                {
                    text: '确定', onPress: ()=> {
                    let deleteIndex = this.props.photoList.find((showTask) => {
                        console.log(`photoList.find`,showTask)
                        return url == showTask.big_url
                    })
                    console.log(`photoList.url`,url)
                    console.log(`photoList.deleteIndex`,deleteIndex)
                    this.props.photoList.splice(this.props.photoList.indexOf(deleteIndex), 1)
                    this.setState({photoList: this.props.photoList})
                    this._ImageZoomModal.setState({modalVisible:false})
                }
                }

            ])

    }
}