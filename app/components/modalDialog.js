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

export default class ModalProgress extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showDialog: this.props.showDialog,
            title:this.props.title,

        };
    }

    static propTypes = {
        ...View.propTypes, // 包含默认的View的属性
        marginBottom: PropTypes.number,
        showDialog: PropTypes.bool,
        confirmValue:PropTypes.string,
        confirmColor:PropTypes.string,
        cancelColor:PropTypes.string,
        cancelValue:PropTypes.string,
        title:PropTypes.string,
        fetchData: PropTypes.func,

    }
    static defaultProps = {
        showDialog: true,
        marginBottom: 0,
        confirmValue:'确认',
        confirmColor:constants.UIActiveColor,
        cancelColor:constants.UIInActiveColor,
        cancelValue:'取消',
        title:'确认这样做吗'
    }

    componentWillReceiveProps(nextProps) {
        let showDialog = nextProps.showDialog

        if (showDialog != this.state.showDialog) {
            this.setState({
                showDialog: showDialog,
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
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.showDialog}
                onRequestClose={ ()=>{this.setState({showDialog:false})} }>
                <View
                    style={[styles.modalStyle,{marginBottom:this.props.marginBottom},
                        {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                    <View
                         style={[{width:180,height:120,flexDirection:'column',alignItems:'center',
                         borderRadius: 6,backgroundColor:'white'},]}>
                        <View style={{flex:2,justifyContent:'center'}}>
                            <Text fontSize={17}>{this.props.title}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',
                                    alignItems:'stretch',}}>
                            <TouchableOpacity style={{flex:1,backgroundColor:this.props.confirmColor,
                                              justifyContent:'center',alignItems:'center',borderBottomLeftRadius:6,
    }}
                                              onPress={this.props.fetchData}>
                                <Text style={{color:'white'}}
                                      fontSize={17}>{this.props.confirmValue}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,backgroundColor:this.props.cancelColor,
                                              justifyContent:'center',alignItems:'center',borderBottomRightRadius:6,}}
                                              onPress={ ()=>{this.setState({showDialog:false})} }>
                                <Text style={{color:'white'}}
                                      fontSize={17}>{this.props.cancelValue}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height:100,backgroundColor:'transparent'}}/>
                </View>
            </Modal>
        )


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