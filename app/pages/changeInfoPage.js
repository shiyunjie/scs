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
    NativeAppEventEmitter,
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
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import XhrEnhance from '../lib/XhrEnhance' //http
//import { member_changeInfoShow,member_changeInfo,errorXhrMock } from '../mock/xhr-mock'   //mock data

class ChangeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account:'',
            email: '',
            qq: '',
            phone: '',
            real_name:'',
            contact_time:'',
            company_name:'',
            company_address:'',
            company_introduction:'',
        }
    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.props.navigator.navigationContext.addListener('willfocus', (event) => {
            console.log(`orderPage willfocus...`)
            console.log(`currentRoute`, currentRoute)
            //console.log(`event.data.route`, event.data.route)
            if (event&&currentRoute === event.data.route) {
                console.log("orderPage willAppear")
                NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
            } else {
                console.log("orderPage willDisappear, other willAppear")
            }
            //
        })
        this._fetchData_loadInfo
    }

    render() {
        return (
            <ScrollView
                style={styles.container}>
                <View
                    style={[{height:50,},{marginTop:10}]}>
                    <ItemView
                        title='用户名'
                        show={false}
                        rightText={this.state.account}/>
                </View>

                <View
                    style={{height:50,}}>
                    <ItemView
                        title='姓名'
                        show={false}
                        rightText={this.state.real_name}/>
                </View>
                <View
                    style={{height:50,}}>
                    <ItemView
                        title='联系电话'
                        show={false}
                        rightText={this.state.phone}/>
                </View>
                <View
                    style={{height:50,}}>
                    <ItemView
                        title='邮箱'
                        show={false}
                        rightText={this.state.email}/>
                </View>

                <View
                    style={styles.inputView}>
                    <View
                        style={ styles.textLine}>
                        <Text>QQ</Text>
                    </View>
                    <TextInput
                        ref={(component) => this._QQ = component}
                        style={styles.textInput}
                        clearButtonMode="while-editing"
                        maxLength={40}
                        underlineColorAndroid='transparent'
                        editable = {true}
                        onChangeText={(text) => this.setState({qq:text})}
                        value={this.state.qq}/>
                </View>
                <View
                    style={styles.inputView}>
                    <View
                        style={ styles.textLine}>
                        <Text>联系时间</Text>
                    </View>
                    <TextInput
                        ref={(component) => this._Contact_time = component}
                        style={styles.textInput}
                        clearButtonMode="while-editing"
                        maxLength={40}
                        underlineColorAndroid='transparent'
                        value={this.state.contact_time}
                        editable = {true}
                        onChangeText={(text) => this.setState({contact_time:text})}/>
                </View>
                <View
                    style={styles.inputView}>
                    <View
                        style={ styles.textLine}>
                        <Text>公司名称</Text>
                    </View>
                    <TextInput
                        ref={(component) => this._Company_name = component}
                        style={styles.textInput}
                        clearButtonMode="while-editing"
                        maxLength={40}
                        underlineColorAndroid='transparent'
                        value={this.state.company_name}
                        editable = {true}
                        onChangeText={(text) => this.setState({company_name:text})}/>
                </View>
                <View
                    style={styles.inputView}>
                    <View
                        style={ styles.textLine}>
                        <Text>公司地址</Text>
                    </View>
                    <TextInput
                        ref={(component) => this._Company_address = component}
                        style={styles.textInput}
                        clearButtonMode="while-editing"
                        maxLength={80}
                        underlineColorAndroid='transparent'
                        value={this.state.company_address}
                        editable = {true}
                        onChangeText={(text) => this.setState({company_address:text})}/>
                </View>
                <View
                    style={{flex:1,backgroundColor:constants.UIActiveColor}}>
                    <TextInput
                        ref={(component) => this._Company_introduction = component}
                        style={{flex:1,fontSize:13,textAlignVertical:'top',
                        backgroundColor:'white',}}
                        placeholder='公司简介'
                        maxLength={300}
                        underlineColorAndroid='transparent'
                        multiline={true}//多行输入
                        numberOfLines={6}
                        value={this.state.company_introduction}
                        editable = {true}
                        onChangeText={(text) => this.setState({company_introduction:text})}/>

                </View>
                <View
                    style={{flex:1,padding:10}}>
                    <Button
                        ref={ component => this.button2 = component }
                        touchableType={Button.constants.touchableTypes.fadeContent}
                        style={styles.button}
                        textStyle={{fontSize: 17, color: 'white'}}
                        loadingComponent={
                            <View
                            style={{flexDirection: 'row', alignItems: 'center'}}>
                                {this._renderActivityIndicator()}
                                <Text
                                style={{fontSize: 17, color: 'white',
                                 fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>委托中...</Text>
                            </View>
                        }
                        onPress={ () => {
                        this.button2.setState({

                            loading: true,
                            //disabled: true,
                        });
                        this._fetch_submitInfo;

                        /*                        setTimeout( () => {
                                this.button2.setState({
                                    loading: false,
                                    //disabled: false
                                })


                                this.props.navigator.pop();
                            }, 3000)*/
                        }}>
                        保存
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

    async _fetchData_loadInfo() {
        let options = {
            //method:{'post'},
            url: constants.api.member_changeInfoShow,
            data: {
                iType: constants.iType.member_changeInfoShow,
                memberId:this.props.memberId,
            }
        }
        try {
            let result = await this.fetch(options)
            result = JSON.parse(result)
            //console.log(`fetch result -> `, typeof result)
            //console.log(`result`, result.result)
            let loadedAll
            if (result.result.member){
                this.setState({
                    account:result.result.member.account,
                    email:result.result.member.email,
                    qq: result.result.member.qq,
                    phone: result.result.member.phone,
                    real_name:result.result.member.real_name,
                    contact_time:result.result.member.contact_time,
                    company_name:result.result.member.company_name,
                    company_address:result.result.member.company_address,
                    company_introduction:result.result.member.company_introduction,
                })

            }

        }
        catch (error) {
            //console.log(error)
            //..调用toast插件, show出错误信息...

        }
        finally {
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

    }    async _fetch_submitInfo() {
        let options = {
            method:'POST',
            url: constants.api.member_changeInfo,
            data: {
                iType: constants.iType.member_changeInfo,
                //memberId:this.props.memberId,
                account: this.state.account,
                email:this.state.email,
                qq:this._QQ.value,
                phone:this.state.phone,
                real_name:this.state.real_name,
                contact_time:this._Contact_time.value,
                company_name:this._Company_name.value,
                company_address:this._Company_address.value,
                company_introduction:this._Company_introduction,
            }
        }
        try {
            let result = await this.fetch(options)
            result = JSON.parse(result)
            //console.log(`fetch result -> `, typeof result)
            //console.log(`result`, result.result)
            alert(result.code)


        }catch (error) {
            //console.log(error)
            //..调用toast插件, show出错误信息...


        }
        finally {
            this.button2.setState({
                loading: false,
                //disabled: false
            })
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }

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
    textInput: {
        flex:4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
        alignSelf:'stretch',

    },
    textLine: {
        flex:1,justifyContent:'center', backgroundColor:'white',
        marginLeft:constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },

    inputView: {
        height:50,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems:'stretch',


    },

});

const navigationBarRouteMapper = {

    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[ index - 1 ];
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={navigatorStyle.navBarLeftButton}>
                <View style={navigatorStyle.navBarLeftButtonAndroid}>
                    <Icon
                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
                        name={'ios-arrow-back'}
                        size={constants.IconSize}
                        color={'white'}/>
                </View>
            </TouchableOpacity>

        );
    },

    RightButton: function (route, navigator, index, navState) {

    },

    Title: function (route, navigator, index, navState) {
        return (
            Platform.OS == 'ios' ?
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {route.title}
                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {route.title}
                </Text>
            </View>
        )
    },

}

export default XhrEnhance(ChangeInfo)