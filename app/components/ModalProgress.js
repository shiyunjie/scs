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
        marginBottom: PropTypes.number,
        showProgress: PropTypes.bool,
        showReload: PropTypes.bool,
        fetchData: PropTypes.func,
        onRequestClose: PropTypes.func,

    }
    static defaultProps = {
        showProgress: true,
        showReload: false,
        marginBottom: 0,
    }

    componentWillReceiveProps(nextProps) {
        let showProgress = nextProps.showProgress
        let showReload = nextProps.showReload
        if (showProgress != this.state.showProgress) {
            this.setState({
                showProgress: showProgress,
            })
        }
        if (showReload != this.state.showReload) {
            this.setState({
                showReload: showReload,
            })
        }
    }

    /**
     *
     *
     * 自适应高度 最外层view一定要加flex:1
     * @returns {XML}
     */
    render() {
        {
            return this.state.showProgress || this.state.showReload ? (
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.showProgress || this.state.showReload}
                    onRequestClose={this.props.onRequestClose}>
                    <View
                        style={[styles.modalStyle,{marginBottom:this.props.marginBottom},
                        {backgroundColor:this.state.showProgress ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',}]}>
                        { this.state.showReload ?
                            <TouchableOpacity
                                style={[{flexDirection:'column',alignItems:'center',}]}
                                onPress={this.props.fetchData}>
                                <Image
                                    style={{width:100,height:100}}
                                    source={image_logo}/>
                                <Text
                                    style={{marginTop:10,}}
                                    fontSize={16}
                                    //backgroundColor:'transparent'
                                >重新加载</Text>
                            </TouchableOpacity>:null
                        }

                        <ActivityIndicator
                            animating={this.state.showProgress}
                            color={'#fff'}
                            size={'large'}/>


                    </View>
                </Modal>
            ) : null
        }


    }


}

var styles = StyleSheet.create({
    modalStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS == 'ios' ? 64 : 56,
    },
});