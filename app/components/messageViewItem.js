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

    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性

        size: PropTypes.number.isRequired,
        color: PropTypes.string,
        title: PropTypes.string.isRequired,
        show: PropTypes.bool,
        do_ret:PropTypes.bool,
        time:PropTypes.string,
        content:PropTypes.string,
        showIcon:PropTypes.bool,


    }

    static defaultProps = {
        show: false,
        showIcon: true,
        do_ret:false,
        size:constants.IconSize,
        color: constants.UIInActiveColor,
        time:'',
        content:'',

    }


    render() {

        return (
            <View style={styles.itemView}>
                <View style={styles.itemIcon}/>
                {this.props.showIcon?
                    <View style={styles.itemButton}>
                        <Icon
                            name={this.props.do_ret?'ios-mail-open-outline':'ios-mail'}  // 图标
                            size={this.props.size}
                            color={this.props.color}/>
                    </View>:null
                }


                <View style={styles.itemText}>
                    <View style={styles.TextView}>
                        <Text style={[styles.TabText,this.props.do_ret?{color:constants.UIInActiveColor}:{}]}>{this.props.title}</Text>
                        <Text style={[styles.TabText,{marginLeft:10,fontSize:12,color:constants.PointColor},
                        this.props.do_ret?{color:constants.UIInActiveColor}:{}]}>{this.props.time}</Text>
                    </View>
                    <View style={styles.TextView}>
                        <Text style={[styles.TabText,{fontSize:12,color:constants.PointColor}]} numberOfLines={1}>{this.props.content}</Text>
                    </View>


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

        backgroundColor: 'white',


    },
    itemIcon: {
        marginLeft: constants.MarginLeftRight,
    },
    TextView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    itemText: {
        flex: 8,
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
        paddingTop: 10,
        paddingBottom: 10,
    },
    itemButton: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    TabText: {
        margin: 0,
        fontSize: 14,
        marginLeft: 10,
        color:constants.LabelColor,

    },

});