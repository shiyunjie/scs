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
    Dimensions,
} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';
import Swiper from 'react-native-swiper';
import image_default_banner from '../images/banner.png';    //需要换默认banner图
import Carousel from 'react-native-carousel';
const { width: deviceWidth } = Dimensions.get('window');

export default class IndexSwiper extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }


    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性
        dataSource: PropTypes.array.isRequired,
        width: PropTypes.number.isRequired,
        autoplay: PropTypes.bool.isRequired,

    }

    /*
     {
     Platform.OS == 'android' ?
     <Carousel
     width={deviceWidth}
     delay={3000}
     indicatorColor={'#FB687D'}
     indicatorSize={25}
     indicatorSpace={10}
     indicatorOffset={0}
     inactiveIndicatorColor={'#fff'}
     inactiveIndicatorText='•'>
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
     </Carousel> :
     <Swiper style={styles.swiperStyle}
     autoplay={this.props.autoplay}
     height={150}
     width={this.props.width}
     autoplayTimeout={3}
     loop={true}>

     {
     this.props.dataSource.map((item, index) => {
     return (
     <View style={{width: this.props.width, height: 150}}>
     <Image
     key={index}
     style={{width: this.props.width, height: 150}}
     //defaultSource={image_default_banner}
     source={{uri: `${item.big_url}`}}/>
     </View>
     )
     })
     }
     </Swiper>

     }*/


    render() {
        return (
            <View style={{height: deviceWidth/3,width:deviceWidth}}>
                <Carousel
                    width={deviceWidth}
                    delay={3000}
                    indicatorColor={'#FB687D'}
                    indicatorSize={25}
                    indicatorSpace={10}
                    indicatorOffset={0}
                    inactiveIndicatorColor={'#fff'}
                    inactiveIndicatorText='•'>
                    {
                        this.props.dataSource.map((item, index) => {
                            if (item.sort_no) {
                                return (

                                    <Image
                                        key={index}
                                        style={{width: this.props.width, height: deviceWidth/3}}
                                        source={{uri: `${item.file_url}`}}/>

                                )
                            } else {
                                return (
                                    <Image
                                        key={index}
                                        style={{width: this.props.width, height: deviceWidth/3}}
                                        source={item}/>
                                )
                            }
                        })
                    }
                </Carousel>
            </View>

        )
    }

}

let styles = StyleSheet.create({
    swiperStyle: {
        //overflow: 'hidden',
        flex: 1,
        //backgroundColor: constants.UIActiveColor,
    },

});