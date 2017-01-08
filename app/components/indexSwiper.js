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
import Carousel from 'react-native-looped-carousel';

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

/*
 <Swiper style={styles.swiperStyle}
 autoplay={this.props.autoplay}
 height={150}
 width={this.props.width}
 autoplayTimeout={3}
 loop={true}>
<Image
key={index}
style={[{width: this.props.width, height: 150}]}
    //defaultSource={image_default_banner}
source={{uri: `${item.big_url}`}}/>*/


    render() {
        return (
                <Carousel
                    delay={5000}
                    style={[{width: this.props.width, height: 150}]}
                    autoplay
                    pageInfo={false}
                    currentPage={0}
                   >

            <View>
                {
                    this.props.dataSource.map((item, index) => {
                    return (
                        <Image
                            key={index}
                            style={[{width: this.props.width, height: 150}]}
                            //defaultSource={image_default_banner}
                            source={{uri: `${item.big_url}`}}/>
                    )
                    })
                }
                </View>

            </Carousel>

        )
        //return (
        //    <Swiper style={styles.swiperStyle}
        //        //autoplay={this.props.autoplay}
        //            autoplay={true}
        //            showsButtons={false}
        //            removeClippedSubviews={false}
        //            height={150}
        //            width={this.props.width}
        //            autoplayTimeout={3}
        //            loop={true}>
        //        <Image
        //            key={1}
        //            style={[{width: this.props.width, height: 150}]}
        //            defaultSource={{image_default_banner}}
        //            source={{uri: `http://www.doorto.cn/images/banner-01.jpg`}}/>
        //        <Image
        //            key={2}
        //            style={[{width: this.props.width, height: 150}]}
        //            defaultSource={{image_default_banner}}
        //            source={{uri: `http://www.doorto.cn/images/banner-02.jpg`}}/>
        //    </Swiper>
        //
        //)

        //return (
        //    <Swiper height={150} autoplay={true} autoplayTimeout={3.5}>
        //        <View>
        //            <Image style={[{width: this.props.width, height: 150}]} resizeMode={'stretch'} source={{uri: 'http://www.doorto.cn/images/banner-03.jpg'}}></Image>
        //        </View>
        //        <View>
        //            <Image style={[{width: this.props.width, height: 150}]} resizeMode={'stretch'} source={{uri: 'http://www.doorto.cn/images/banner-02.jpg'}}></Image>
        //        </View>
        //    </Swiper>
        //)
    }
}

var styles = StyleSheet.create({
    swiperStyle: {
        //overflow: 'hidden',
        //flex: 1,
        //backgroundColor: constants.UIActiveColor,
    },

});