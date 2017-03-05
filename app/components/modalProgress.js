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

        marginBottom: 0,
    }

    componentWillReceiveProps(nextProps) {
        let showProgress = nextProps.showProgress
        let showReload = nextProps.showReload

        //console.log(`componentWillReceiveProps:`, showProgress)


        if (showProgress != this.state.showProgress) {
            //console.log(`showProgress:`, showProgress)
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

        return (
            <View
                style={[styles.modalStyle,{marginBottom:this.props.marginBottom},
                        {backgroundColor: '#f5fcff',}]}>
                {
                    this.state.showProgress ?

                            <ActivityIndicator
                                style={{position: 'relative', left: 1, top: 1,
                                 marginBottom: Platform.OS == 'ios' ? 64 : 56,
                                }}
                                animating={true}
                                color={constants.UIInActiveColor}
                                size={'small'}/>
                       : null
                }
                {
                    this.state.showReload ?
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
                        </TouchableOpacity> : null
                }

            </View>)

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