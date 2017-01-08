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

let height= StyleSheet.hairlineWidth;
export default class ListItemView extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            show:this.props.show,
            hasCheckBox:this.props.hasCheckBox,
            hasLine:this.props.hasLine,
        };

    }


    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性
        name:PropTypes.string,
        size:PropTypes.number.isRequired,
        color:PropTypes.string,
        title:PropTypes.string.isRequired,
        show:PropTypes.bool,
        hasCheckBox:PropTypes.bool,
        hasLine:PropTypes.bool,


    }

    static defaultProps = {
        show:false,
        hasCheckBox:false,
        color:constants.UIInActiveColor,
        hasLine:true,

    }

    componentWillReceiveProps (nextProps) {
       /* let hasLine = nextProps.hasLine
        if(hasLine != this.state.hasLine) {
            height=0;
        }*/
    }


    render() {

        return (
            this.state.hasLine?
            <View style={styles.itemView}>
                        <View style={styles.itemIcon}>
                            <Icon
                                name={this.props.name}  // 图标
                                size={this.props.size}
                                color={this.props.color}/>
                        </View>
                <View  style={styles.itemText}>
                    <Text style={styles.TabText}>{this.props.title}</Text>
                </View>
                <View style={styles.itemButton}>
                    <Icon
                        name={this.state.show?'ios-arrow-round-down':'ios-arrow-forward'}  // 图标
                        size={this.props.size}
                        color={this.props.color}/>
                </View>

            </View>:<View style={styles.itemView}>
                <View style={styles.itemIcon}>
                    <Icon
                        name={this.props.name}  // 图标
                        size={this.props.size}
                        color={this.props.color}/>
                </View>
                <View  style={[styles.itemText, {borderBottomWidth: 0,}]}>
                    <Text style={styles.TabText}>{this.props.title}</Text>
                </View>
                <View style={[styles.itemButton, {borderBottomWidth: 0,}]}>
                    <Icon
                        name={this.state.show?'ios-arrow-round-down':'ios-arrow-forward'}  // 图标
                        size={this.props.size}
                        color={this.props.color}/>
                </View>

            </View>

        )
    }
}



var styles = StyleSheet.create({
   itemView: {
       flex:1,
        flexDirection: 'row',
       justifyContent:'flex-start',
       alignItems: 'stretch',
        padding: 0,
       backgroundColor:'white',


    },
    itemIcon: {
       flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    itemText: {
       flex:8,
        flexDirection: 'row',
        alignItems:'center',
        borderBottomWidth: height,
        borderColor: constants.UIInActiveColor,
    },
    itemButton:{
        flex:1,

        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth: height,
        borderColor: constants.UIInActiveColor,
    },
    TabText: {
        margin: 0,
        fontSize: 15,
        marginLeft:10,
    },

});