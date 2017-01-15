/**
 * Created by shiyunjie on 17/1/14.
 */

import React, {
    PropTypes,
    Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    PixelRatio,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Modal,


} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';

import image_logo from '../images/icon.png'
import Spinner  from'react-native-spinkit';

export default class ModalProgress extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showProgress: this.props.showProgress,
            showReload: this.props.showReload,
        };
    }

    static propTypes = {
        ...View.propTypes, // 包含默认的View的属性
        showProgress: PropTypes.bool,
        showReload: PropTypes.bool,
        fetchData: PropTypes.func,

    }
    static defaultProps = {
        showProgress: true,
        showReload: false,
    }

    /**
     *
     *
     * 自适应高度 最外层view一定要加flex:1
     * @returns {XML}
     */
    render() {
        console.log(`visible:` + this.state.showProgress || this.state.showReload)

        return (
            <Modal
                animationType={"none"}
                transparent={false}
                visible={this.state.showProgress||this.state.showReload}
                onRequestClose={() => {this.setState({modalVisible:false});}}>

                <View style={{flex:1}}>
                    <View style={[{justifyContent:'center',alignItems:'center',},
                            this.state.showReload?{flex:1}:{height:0}]}>
                        <TouchableOpacity
                            onPress={this.props.fetchData}>
                            <Image
                                style={this.state.showReload?{width:100,height:100}:{width:0,height:0}}
                                source={image_logo}/>
                            <Text
                                style={{color:constants.UIActiveColor,marginTop:10,}}
                                //backgroundColor:'transparent'
                            >重新加载</Text>
                        </TouchableOpacity>
                        <View style={[{justifyContent:'center',alignItems:'center'},
                                this.state.showProgress?{flex:1}:{height:0}]}>
                            <View style={{width:50,height:50,}}>
                            <Spinner
                                style={{margin:50}}
                                isVisible={true}
                                size={constants.IconSize}
                                type='Circle'
                                color={'red'}/>
                            </View>
                        </View>
                    </View>
                </View>

            </Modal>)


    }


}

var styles = StyleSheet.create({});