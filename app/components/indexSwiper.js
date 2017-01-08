/**
 * Created by shiyunjie on 16/12/30.
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
    Platform,
    Image,
} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';
import Swiper from 'react-native-swiper';
import image_default_banner from '../images/banner.png';    //需要换默认banner图
import Carousel from 'react-native-carousel';

export default class IndexSwiper extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }


    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性
        dataSource:PropTypes.array.isRequired,
        width:PropTypes.number.isRequired,
        autoplay:PropTypes.bool.isRequired,

    }

    render() {
        return (
                 <View style={{height: 150,}} >
                    <Carousel width={375} delay={3000} loop={true}
                              indicatorColor={'#FB687D'}
                              indicatorSize={20}
                              indicatorSpace={15}
                              indicatorOffset={0}
                              inactiveIndicatorColor={'#fff'}
                              indicatorAtBottom={true}
                              inactiveIndicatorText= '•'
                              indicatorText= '•' >
                        {
                            this.props.dataSource.map((item, index) => {
                                return (
                                        <Image
                                            key={index}
                                            style={{width: this.props.width, height: 150}}
                                                //defaultSource={image_default_banner}
                                            source={{uri: `${item.big_url}`}}/>

                                )
                            })
                        }
                    </Carousel>
                 </View>

        )
    }

}

var styles = StyleSheet.create({
    swiperStyle: {
        //overflow: 'hidden',
        //flex: 1,
        //backgroundColor: constants.UIActiveColor,
    },

});