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
        name:PropTypes.string,
        title: PropTypes.string.isRequired,
        rightText: PropTypes.string,
        show: PropTypes.bool,
        hasCheckBox: PropTypes.bool,
        hasLine: PropTypes.bool,
        showRightText:PropTypes.bool,
        isChose:PropTypes.bool,
        aligRight:PropTypes.bool,


    }

    static defaultProps = {
        rightText: '',
        show: true,
        hasCheckBox: false,
        size:constants.IconSize,
        color:constants.UIInActiveColor,
        hasLine:true,
        showRightText:true,
        isChose:false,
        aligRight:false,
    }


    render() {
        if (this.props.show) {
            return (
                <View style={styles.itemView}>
                    <View style={styles.itemIcon}/>
                    <View style={[styles.itemText,this.props.hasLine?{borderBottomWidth:StyleSheet.hairlineWidth}:{borderBottomWidth:0}]}>
                        <Text style={[styles.TabText,this.props.isChose?styles.contextText:styles.labelText]}>{this.props.title}</Text>
                    </View>
                    <View style={[styles.itemButton,this.props.hasLine?{borderBottomWidth:StyleSheet.hairlineWidth}:{borderBottomWidth:0},
                    this.props.showRightText?{}:{flex:2}]}>
                        <Text style={[styles.TabText,styles.contextText,this.props.aligRight?{textAlign:'right'}:null]}>{this.props.rightText}</Text>
                        <Icon
                            name={this.props.name}  // 图标
                            size={this.props.size}
                            color={this.props.color}/>
                    </View>

                </View>

            )
        } else {
            return (
                <View style={styles.itemView}>
                    <View style={styles.itemIcon}/>
                    <View style={styles.itemText}>
                        <Text style={[styles.TabText,{color:constants.PointColor}]} >{this.props.title}</Text>
                    </View>
                    <View style={styles.itemButton}>
                        <Text style={[styles.TabText,{textAlign:'right',},]}>{this.props.rightText}</Text>

                    </View>

                </View>

            )
        }
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
    labelText:{
        fontSize:14,
        color:constants.PointColor,
    },
    contextText:{
        fontSize:14,
        color:constants.LabelColor,
    },
    itemIcon: {
        width: constants.MarginLeftRight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderColor: constants.LineColor,
    },
    itemButton: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
        paddingRight:10,
    },
    TabText: {
        flex:1,
        margin: 0,
        fontSize: 14,
        marginRight:10,
        color:constants.LabelColor
    },

});