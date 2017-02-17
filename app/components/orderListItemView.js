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
        showCost:PropTypes.bool,


    }

    static defaultProps = {
        cost:'',
        orderNum: '',
        time: '',
        rightText: '状态',
        logistics: '',
        showCost:false,
        route: '',
    }


    render() {

            return (
                <View style={styles.itemView}>
                    <View style={styles.itemIcon}/>
                    <View style={styles.itemText}>
                        <View style={styles.itemDetail}>
                            <Text style={{fontSize:13,color:constants.LabelColor}}>单号:</Text>
                            <Text style={{flex:2,fontSize:13,}}>{this.props.orderNum}</Text>
                        </View>
                        <View style={styles.itemDetail}>
                            <Text style={{fontSize:12,color:constants.UIInActiveColor}}>发起时间:</Text>
                            <Text style={{flex:2,fontSize:12,color:constants.UIInActiveColor}}>{this.props.time}</Text>
                        </View>
                        {
                            this.props.logistics?<View style={styles.itemDetail}>
                            <Text  style={{fontSize:12,color:constants.UIInActiveColor}}>物流状态:</Text>
                            <Text style={{flex:2,fontSize:12,color:constants.UIInActiveColor}}>{this.props.logistics}</Text>
                            </View>:<View/>}
                        {
                            this.props.showCost?<View style={styles.itemDetail}>
                            <Text style={{fontSize:12,color:constants.UIInActiveColor}}>服务费总计:</Text>
                            <Text style={{flex:2,fontSize:12,color:constants.UIInActiveColor}}>￥{this.props.cost}</Text>
                            </View>:<View/>
                        }
                        <View style={styles.itemDetail}>
                            <Text style={{flex:1,fontSize:13,color:constants.LabelColor,}}>{this.props.route}</Text>
                        </View>
                    </View>
                    <View style={styles.itemButton}>
                        <Text style={styles.TabText}>{this.props.rightText}</Text>
                        <Icon
                            name='ios-arrow-forward'  // 图标
                            size={constants.IconSize-5}
                            color={constants.LineColor}/>
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
        borderColor: constants.LineColor,

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
        marginRight: 5,
        fontSize: 13,
        color:constants.UIActiveColor,

    },


});