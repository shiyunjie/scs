/**
 * Created by shiyunjie on 16/12/6.
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


} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import constants from  '../constants/constant';

export default class TabView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showChild: false,
            childList: [],
            choseItem: [],
        };
    }


    static propTypes = {
        name: PropTypes.string.isRequired,
        choseList: PropTypes.array,
        cost: PropTypes.string,
    }


    render() {
        return (
            <View style={styles.tabView}>
                <View style={styles.tabTitle}>
                    <Icon
                        name={this.props.choseItem.length>0?'md-checkmark-circle':'ios-close-circle-outline'}  // 图标
                        size={constants.IconSize}
                        color={this.props.choseItem.length>0?constants.UIActiveColor:constants.UIInActiveColor}/>
                    <Text>{this.props.name}</Text>
                    <View style={{flex:1,justifyContent:'flex-end',}}>
                        <Icon
                            name='ios-arrow-up'  // 图标
                            size={constants.IconSize}
                            color={constants.UIInActiveColor}/>
                        <Text style={{color:'red'}}>{this.props.cost}</Text>
                    </View>
                </View>
                {this.state.showChild?this.state.childList.map((item, index) => {
                    return (
                        <TouchableOpacity style={styles.tabItem}
                                          onPress={}>
                            <View style={{flex:1, flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        alignItems: 'stretch',}}>
                                <Text>{item.cost_name}</Text>
                                <View style={{flex:1, flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',}}>

                                </View>
                            </View>
                            <Icon
                                name={this.state.childList.indexOf(item.id)>0?'md-checkmark-circle':'ios-close-circle-outline'}  // 图标
                                size={constants.IconSize}
                                color={this.state.childList.indexOf(item.id)>0?constants.UIActiveColor:constants.UIInActiveColor}/>

                        </TouchableOpacity>
                    )
                }):<View/>

                }
            </View>

        );
    }
}

var styles = StyleSheet.create({
    tabView: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,
    },
    tabTitle: {
        height: 40,
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: constants.UIInActiveColor,

    },
    tabItem: {
        height: 40,
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',

    },


});