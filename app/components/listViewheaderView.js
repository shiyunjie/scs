/**
 * Created by shiyunjie on 16/12/29.
 */
/**
 * Created by shiyunjie on 16/12/28.
 */
import React, {
    PropTypes,
    Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    PixelRatio,
    Image,
    ActivityIndicator,

} from 'react-native';

import constants from  '../constants/constant';
//import Icon from 'react-native-vector-icons/Ionicons';
import image_logo from '../images/horse.png'

/**
 * types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse',
 * 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress',
 * 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
 */

//let Spinner = require('react-native-spinkit');


export default class ListItemView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            show: this.props.show,
            hasCheckBox: this.props.hasCheckBox,
            degree: props.degree,
        };
    }


    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性
        name: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        color: PropTypes.string,
        title: PropTypes.string.isRequired,
        isRefresh: PropTypes.bool,
        isFoot:PropTypes.bool,
        degree: PropTypes.number.isRequired,

    }

    static defaultProps = {
        isRefresh: false,
        color: constants.UIInActiveColor,
        degree: 0,
        isFoot:false,
    }

    componentWillReceiveProps(nextProps) {
        let degree = nextProps.degree
        if (degree != this.state.degree) {
            this.setState({
                degree,
            })
        }
    }

    render() {

        /* return (
         !this.props.isRefresh ?
         <View
         style={styles.HeaderView}>
         <View style={{transform: [{rotate: `${this.state.degree}deg`}]}}>
         <Icon name={this.props.name}  // 图标
         size={this.props.size}
         color={this.props.color}/>
         </View>
         <Text
         style={{marginLeft:5,color:constants.PointColor}}
         >{this.props.title}</Text>
         </View> :
         <View
         style={styles.HeaderView}>
         <ActivityIndicator
         animating={true}
         color={this.props.color}
         size={'large'}/>
         <Text
         style={{marginLeft:5,color:constants.PointColor}}
         >{this.props.title}</Text>
         </View>

         )*/
        //console.log(`this.state.degree:`, this.state.degree)
        let scale = this.state.degree / 100


        //console.log(`scale:`, scale)
        return (
            !this.props.isRefresh ?
                <View
                    style={[styles.HeaderView,this.props.isFoot?{justifyContent:'flex-start',}:{}]}>
                    <Image source={image_logo} style={{width:25*scale,height:25*scale}}/>
                    <Text
                        style={{color:constants.PointColor,fontSize:constants.DefaultFontSize}}
                        >{this.props.title}</Text>
                </View> :
                <View
                    style={[styles.HeaderView,]}>
                    <ActivityIndicator
                        animating={true}
                        color={this.props.color}
                        size={'small'}/>
                    <Text
                        style={{color:constants.PointColor,fontSize:constants.DefaultFontSize}}
                        >{this.props.title}</Text>
                </View>

        )

    }
}


var styles = StyleSheet.create({
    spinner: {
        marginBottom: 3,
    },
   /* HeaderView: {
        flex:1,
        flexDirection: 'row',
        height: constants.pullDownStayDistance,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',

    },*/
    HeaderView: {
        height: constants.pullDownStayDistance,
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection:'column',
        justifyContent:'flex-end',


    },

});