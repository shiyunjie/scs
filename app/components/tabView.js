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
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';

export default class TabView extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }


    static propTypes = {
        name:PropTypes.string.isRequired,
        size:PropTypes.number.isRequired,
        color:PropTypes.string,
        selectedColor:PropTypes.string,
        title:PropTypes.string,
        selected:PropTypes.bool,
    }

    static defaultProps = {

        selected:false,
        color:constants.UIInActiveColor,
        selectedColor:constants.UIActiveColor,
    }



    render() {
        return (
            <View style={styles.tabView}>
                <Icon
                name={this.props.name}  // 图标
                size={this.props.size-2}
                color={this.props.selected?this.props.selectedColor:this.props.color}/>
                <Text  style={this.props.selected?styles.selectedTabText:styles.tabText}>
                    {this.props.title}</Text>

            </View>

        );
    }
}

var styles = StyleSheet.create({
    tabView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5,

    },
    tabText: {
        margin: 0,
        color: constants.UIInActiveColor,
        fontSize: 12
    },
    selectedTabText: {
        margin: 0,
        color: constants.UIActiveColor,
        fontSize: 12
    },

});