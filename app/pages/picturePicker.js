/**
 * @fileoverview
 * @since 17/1/8 16:14
 * @author chenyiqin
 */

import React, {
    Component,
} from 'react'
import {
    View,
    Text,
    Platform,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import constants from '../constants/constant'
import CameraRollPicker from 'react-native-camera-roll-picker';

export default class PicturePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            num: 0,
            selected: [],
        };
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{flex:1}}/>
                    <Text style={[styles.text,{color:'black'}]}>
                        <Text style={styles.bold}>已选择{this.state.num}张</Text>照片
                    </Text>
                    <TouchableOpacity
                        style={{flex:1,alignItems:'center',justifyContent:'center'}}
                        underlayColor={'#eee'}
                        onPress={() => {
                            this.props.waitForAddToUploadQuene(this.state.selected)
                            //this.props.addToUploadQuene(this.state.selected)
                            this.props.navigator.pop()
                    }}>
                        <Text style={[styles.text,{color:constants.UIActiveColor,fontSize:17}]}>
                            发送
                        </Text>
                    </TouchableOpacity>
                </View>
                <CameraRollPicker
                    scrollRenderAheadDistance={500}
                    initialListSize={1}
                    pageSize={3}
                    removeClippedSubviews={true}
                    groupTypes='SavedPhotos'
                    batchSize={5}
                    maximum={8}
                    selected={this.state.selected}
                    assetType='Photos'
                    imagesPerRow={3}
                    imageMargin={5}
                    callback={this._getSelectedImages} />
            </View>
        )

    }

    _getSelectedImages = (images, current) => {
        var num = images.length;

        this.setState({
            num: num,
            selected: images,
        });

        console.log(current);
        console.log(this.state.selected);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
        marginLeft:2,
        marginRight:2,
    },
    content: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 16,
        alignItems: 'center',
        color: '#fff',
    },
    bold: {
        fontWeight: 'bold',
    },
    info: {
        fontSize: 12,
    },
});