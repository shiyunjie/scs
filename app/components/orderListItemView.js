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



} from 'react-native';

import constants from  '../constants/constant';
import Icon from 'react-native-vector-icons/Ionicons';


export default class ListItemView extends Component {
    // 构造


    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性
        orderNum: PropTypes.string,
        time: PropTypes.string,
        rightText: PropTypes.string,
        logistics: PropTypes.string,
        cost: PropTypes.string,
        route: PropTypes.string,


    }

    static defaultProps = {
        orderNum: '',
        time: '',
        rightText: '状态',
        logistics: '',
        cost: '',
        route: '',
    }


    render() {

            return (
                <View style={styles.itemView}>
                    <View style={styles.itemIcon}/>
                    <View style={styles.itemText}>
                        <View style={styles.itemDetail}>
                            <Text style={{fontSize:17,}}>单号:</Text>
                            <Text style={{flex:2,fontSize:17,}}>{this.props.orderNum}</Text>
                        </View>
                        <View style={styles.itemDetail}>
                            <Text style={{color:constants.UIInActiveColor}}>发起时间:</Text>
                            <Text style={{flex:2,color:constants.UIInActiveColor}}>{this.props.time}</Text>
                        </View>
                        {
                            this.props.logistics?<View style={styles.itemDetail}>
                            <Text  style={{color:constants.UIInActiveColor}}>物流状态:</Text>
                            <Text style={{flex:2,color:constants.UIInActiveColor}}>{this.props.logistics}</Text>
                            </View>:<View/>}
                        {
                            this.props.cost?<View style={styles.itemDetail}>
                            <Text style={{color:constants.UIInActiveColor}}>服务费总计:</Text>
                            <Text style={{flex:2,color:constants.UIInActiveColor}}>{this.props.cost}</Text>
                            </View>:<View/>
                        }
                        <View style={styles.itemDetail}>
                            <Text style={{flex:1,fontSize:19,}}>{this.props.route}</Text>
                        </View>
                    </View>
                    <View style={styles.itemButton}>
                        <Text style={styles.TabText}>{this.props.rightText}</Text>
                        <Icon
                            name='ios-arrow-forward'  // 图标
                            size={constants.IconSize}
                            color={constants.UIInActiveColor}/>
                    </View>

                </View>

            )

    }
}


var styles = StyleSheet.create({
    itemView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 0,
        backgroundColor: 'white',
        paddingTop:10,
        paddingBottom:10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,

    },
    itemIcon: {
        width: constants.MarginLeftRight,
    },
    itemText: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',

    },
    itemDetail: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',

    },
    itemButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 10,
    },
    TabText: {
        margin: 0,
        fontSize: 15,
        color:constants.UIActiveColor,

    },


});