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

} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';
import Swiper from 'react-native-swiper';
import ImageLoader from 'react-native-smart-image-loader';

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





    render() {
        return (
            <Swiper style={styles.swiperStyle}
                    autoplay={this.props.autoplay}
                    showsButtons={false}
                    removeClippedSubviews={false}
                    height={150}
                    width={this.props.width}
                    autoplayTimeout={3}
                    loop={true}

            >{ this.props.dataSource.map((item, index) => {
                return (<ImageLoader
                    key={`item-${index}`}
                    style={[{width: this.props.width, height: 150}]}
                    options={{
                         rowID: '0',
                         src: `${item.path}`,
                         placeholder: Platform.OS == 'ios' ? 'goods-placeholder' : 'goods_placeholder',
                         }}/>);
            })
            }
            </Swiper>

        );
    }
}

var styles = StyleSheet.create({
    swiperStyle: {
        overflow: 'hidden',
        flex: 1,
        backgroundColor: constants.UIActiveColor,
    },

});