/**
 * Created by shiyunjie on 17/3/7.
 */
import React, {  PropTypes,Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Dimensions,
    Image,
    Modal,
    Alert,
} from 'react-native';
import {ImageZoom} from 'react-native-image-pan-zoom';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';
const NOOP = () => {}
const { width: deviceWidth } = Dimensions.get('window');

export default class ImageZoomModal extends Component {
// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            modalVisible: false,
            showUrl: '',
        }

    }

    static propTypes = {
        PhotoList:PropTypes.array,
        ShowPhoto: PropTypes.func,
        DeletePhoto: PropTypes.func,
        showDeleteButton:PropTypes.bool,
    }

    static defaultProps = {
        ShowPhoto: NOOP,
        DeletePhoto:NOOP,
        showDeleteButton:true,
    }

    ShowPhoto = (url)=> {
        this.setState({showUrl: url,modalVisible: true})
    }

    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {this.setState({modalVisible:false})}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center',
                    backgroundColor:constants.UIInActiveColor}}>
                <View
                    style={{width:deviceWidth,height:Platform.OS == 'ios' ? 64 : 56
                    ,backgroundColor:'black',flexDirection:'row',position:'absolute',top:0,
                    justifyContent:'center',alignItems: 'center',paddingTop:10}}
                >
                    <TouchableOpacity
                        style={{flex:1,paddingLeft:20}}
                        onPress={()=>this.setState({modalVisible:false})}>
                        <Icon
                            name={'ios-arrow-back'}
                            size={constants.IconSize}
                            color='white'
                        />
                    </TouchableOpacity>
                        <View
                            style={{flex:4}}
                        />
                    {this.props.showDeleteButton ?
                        <TouchableOpacity
                            style={{flex:1,alignItems:'flex-end',paddingRight:20,}}
                            onPress={()=>{
                            this.props.DeletePhoto(this.state.showUrl)

                            }}>
                            <Icon
                                name="ios-trash"
                                size={constants.IconSize}
                                color='white'
                            />
                        </TouchableOpacity>:null
                    }

                </View>

                    <ImageZoom cropWidth={deviceWidth+100}
                               cropHeight={deviceWidth+100}
                               imageWidth={deviceWidth}
                               imageHeight={deviceWidth}>
                        <Image
                            source={{uri: this.state.showUrl}}
                            style={{width:400,height:400, position: 'relative',margin: 5, }}/>
                    </ImageZoom>
                </View>

            </Modal>
        )
    }
}