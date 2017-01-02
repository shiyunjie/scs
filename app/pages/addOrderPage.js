/**
 * Created by shiyunjie on 16/12/30.
 */
/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
} from 'react-native';
/**
 * md-checkmark-circle
 *
 ios-radio-button-off

 'ios-arrow-forward'
 */

import ItemView from '../components/orderItemView';
import constants from  '../constants/constant';
import Button from 'react-native-smart-button';
import Picker from 'react-native-picker';

let items = [{name: '需求国际物流'}, {name: '出口国陆运'}, {name: '订舱服务海运'}, {name: '国内物流'}];
let pay = [{name: '信用证'}]
let selectedItems = ['信用证',];

let typeData = ['FOB', 'DOB', 'COB', 'FOF', 'FOR'];
let CountryData = ['中国', '日本', '新加坡', '美国', '英国', '加拿大'];

export default class Order extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            items: items,
            pay: pay,
            selectedItems: selectedItems,
            type: '',
            start: '',
            reach: '',
        }
    }


    componentDidMount() {
        console.log('items:' + this.state.items.length)
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <TouchableOpacity style={[{height:50,},{marginTop:10}]}
                                  onPress={()=>{
                                 Picker.init({
                                        pickerData: typeData,
                                        pickerConfirmBtnText:'确定',
                                        pickerCancelBtnText:'取消',
                                        pickerTitleText:'选择贸易条款',
                                        selectedValue: [0],
                                        onPickerConfirm: data => {
                                            this.setState({type:data+''})
                                        },
                                        onPickerCancel: data => {
                                            console.log(data);
                                        },
                                        onPickerSelect: data => {
                                            this.setState({type:data+''})
                                        }
                                    });
                                    Picker.show();
                                  }}
                >
                    <ItemView name='ios-arrow-forward' title='贸易条款' rightText={this.state.type}/>
                </TouchableOpacity>
                <TouchableOpacity style={{height:50,}}
                >
                    <ItemView title='委托人' show={false} rightText='用户姓名'/>
                </TouchableOpacity>
                <TouchableOpacity style={{height:50,}}
                >
                    <ItemView title='联系电话' show={false} rightText='13131313113'/>
                </TouchableOpacity>

                <TouchableOpacity style={{height:50,}}
                                  onPress={()=>{
                             Picker.init({
                                    pickerData: CountryData,
                                    pickerConfirmBtnText:'确定',
                                    pickerCancelBtnText:'取消',
                                    pickerTitleText:'选择国家',
                                    selectedValue: [0],
                                    onPickerConfirm: data => {
                                        this.setState({start:data+''})
                                    },
                                    onPickerCancel: data => {
                                        console.log(data);
                                    },
                                    onPickerSelect: data => {
                                        this.setState({start:data})
                                    }
                                });
                                Picker.show();
                                  }}
                >
                    <ItemView name='ios-arrow-forward' title='出发国家' rightText={this.state.start}/>
                </TouchableOpacity>

                <TouchableOpacity style={{height:50,}}
                                  onPress={()=>{
                                    Picker.init({
                                    pickerData: CountryData,
                                     pickerConfirmBtnText:'确定',
                                    pickerCancelBtnText:'取消',
                                    pickerTitleText:'选择国家',
                                    selectedValue: [0],
                                    onPickerConfirm: data => {
                                        this.setState({reach:data+''})
                                    },
                                    onPickerCancel: data => {
                                        console.log(data);
                                    },
                                    onPickerSelect: data => {
                                        this.setState({reach:data})
                                    }
                                });
                                Picker.show();
                                  }}
                >
                    <ItemView name='ios-arrow-forward' title='目的国家' rightText={this.state.reach}/>
                </TouchableOpacity>
                <Text style={{marginLeft:constants.MarginLeftRight}}>货代服务</Text>
                {this.state.items.map((item, index) => {
                    let icon = 'md-checkmark-circle'
                    let color = constants.UIActiveColor
                    if (this.state.selectedItems.indexOf(item.name) == -1) {
                        icon = 'ios-close-circle-outline'
                        color = constants.UIInActiveColor
                    }
                    console.log(item.name + ",icon:" + icon);
                    return (
                        <TouchableOpacity key={`item-${index}`} style={{height:50,}}
                                          onPress={()=>{
                     if (this.state.selectedItems.indexOf(item.name) == -1) {
                            selectedItems.push(item.name)
                    }else{
                    let deletIndex=this.state.selectedItems.indexOf(item.name)
                                selectedItems.splice(deletIndex,1);
                    }
                    this.setState({selectedItems:selectedItems});
                                  }}
                        >
                            <ItemView name={icon} color={color} title={item.name} rightText=''/>
                        </TouchableOpacity>
                    )
                })
                }
                <Text style={{marginLeft:constants.MarginLeftRight}}>支付方式</Text>
                {this.state.pay.map((item, index) => {
                    let icon = 'md-checkmark-circle'
                    let color = constants.UIActiveColor

                    if (this.state.selectedItems.indexOf(item.name) == -1) {
                        icon = 'ios-close-circle-outline'
                        color = constants.UIInActiveColor
                    }
                    console.log(item.name + ",icon:" + icon);
                    return (
                        <TouchableOpacity key={`item-${index}`} style={{height:50,}}
                                          onPress={()=>{
                     if (this.state.selectedItems.indexOf(item.name) == -1) {
                            selectedItems.push(item.name)
                    }else{
                               let deletIndex=this.state.selectedItems.indexOf(item.name)
                                selectedItems.splice(deletIndex,1);
                    }
                    this.setState({selectedItems:selectedItems});
                                  }}
                        >
                            <ItemView name={icon} color={color} title={item.name} rightText=''/>
                        </TouchableOpacity>
                    )
                })}
                <View style={{flex:1,backgroundColor:constants.UIBackgroundColor}}>
                    <TextInput
                        style={{flex:1,fontSize:15,textAlignVertical:'top',
                        margin:3,

                      borderColor: constants.UIInActiveColor,
                      justifyContent:'flex-start'
                      }}
                        clearButtonMode="while-editing"
                        placeholder='请提供宝贵意见'
                        maxLength={300}
                        underlineColorAndroid='transparent'
                        multiline={true}//多行输入
                        numberOfLines={6}
                    />
                    <Text style={{color:constants.UIInActiveColor,position:'absolute',bottom:5,right:5,}}>300字以内</Text>
                </View>
                <View style={{flex:1,padding:10}}>
                    <Button
                        ref={ component => this.button2 = component }
                        touchableType={Button.constants.touchableTypes.fadeContent}
                        style={styles.button}
                        textStyle={{fontSize: 17, color: 'white'}}
                        loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>委托中...</Text>
                            </View>
                    }
                        onPress={ () => {
                        this.button2.setState({

                            loading: true,
                            //disabled: true,
                        });

                        setTimeout( () => {
        this.button2.setState({
            loading: false,
            //disabled: false
        })

        /**
        * 提交订单数据
        */
        this.props.navigator.pop();
    }, 3000)
                    }}>
                        发起委托
                    </Button>
                </View>
            </ScrollView>
        );
    }


    _renderActivityIndicator() {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{margin: 10,}}
                    color={'#fff'}
                    styleAttr={'Small'}/>

            ) : (
            <ActivityIndicatorIOS
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        )


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
        flexDirection: 'column',
    },
    button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderRadius: 3, borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center', borderRadius: 30,
    },

});