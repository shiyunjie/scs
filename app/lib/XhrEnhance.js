/**
 * @fileoverview A simple fetch like XhrEnhance for ReactNative app
 * @since 17/1/2 10:40
 * @author chenyiqin
 */
import {NativeModules,} from 'react-native'

const HttpRSAModule = NativeModules.HttpRSAModule;
import constants from '../constants/constant'

let _key = 'XhrEnhance_xhrs'


export default XhrEnhance = (ComposedComponent) => {
    return class extends ComposedComponent {

        componentWillUnmount() {
            super.componentWillUnmount && super.componentWillUnmount()
            let {
                [ _key ]: xhrList,
                } = this
            xhrList && xhrList.forEach((xhr) => {
                if (xhr.status != 200 || xhr.readyState != 4) {
                    xhr.abort()
                }
            })
            this[_key] = null
        }

        /**
         * 简易的fetch方法
         * @param options 请求参数配置
         * @param options.method {String} 请求方法, 默认为GET
         * @param options.url {String} 请求url地址
         * @param options.requestHeaders {Object} 自定义请求头, 强制加入了'application/x-www-form-urlencoded', 当传入FormData时会自动变成'multipart/form-data'
         * @param options.timeout {Number} 请求超时时间
         * @param options.data {Object} 请求提交的参数, 当传入data时, 不需要再传formData
         * @param options.formData {FormData} 请求提交的表单参数, 当传入formData时, 不需要再传data.
         * @returns {Promise}
         */
        fetch = (options) => {


            let xhr = new XMLHttpRequest()

            let { [ _key ]: xhrList } = this
            if (!xhrList) {
                this[_key] = [xhr,]
            } else {
                xhrList.push(xhr)
            }

            return new Promise((resolve, reject) => {
                const handleError = () => {
                    const status = xhr.status
                    const error = xhr.responseText
                    reject(error)
                }
                const handleTimeout = () => {
                    reject('网络不给力, 再试一次看看吧')
                }
                const handleSuccess = () => {
                    const status = xhr.status
                    const response = xhr.responseText
                    resolve(response)
                }
                xhr.onerror = handleError
                xhr.ontimeout = handleTimeout
                xhr.onload = handleSuccess

                let { method, url, requestHeaders, timeout, data, formData, } = options
                if (!method) {
                    method = constants.requestMethod
                }

                if(method.toLowerCase() == 'get') {
                    url += this._formatUrlParams(data)
                }

                xhr.open(method, url);
                if (requestHeaders) {
                    Object.keys(requestHeaders).forEach(headerName => {
                        xhr.setRequestHeader(headerName, requestHeaders[headerName])
                    })
                }
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                xhr.timeout = timeout || constants.requestTimeout
                let sendData = null
                if(method.toLowerCase() != 'get') {
                    if (formData) {
                        sendData = formData
                    }
                    else if (data) {
                        sendData = Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&')
                    }
                }
                xhr.send(sendData);
            })
        }

        _formatUrlParams (data) {
            let urlParams = ''
            Object.keys(data).forEach( (key, index) => {
                if(index) {
                    urlParams += `&${key}=${data[key]}`
                }
                else {
                    urlParams += `?${key}=${data[key]}`
                }
            })
            return urlParams
        }


        /**
         * 压缩数据
         * @param options
         * @returns {Promise}
         */
        gZip = (options) => {
            return new Promise((resolve, reject) => {

                let { data,} = options
                try {
                   let sendData = {
                        itype: data.iType,
                        deviceId: data.deviceId,
                        data:data,
                        token: data.token,
                        }

                        delete(sendData.data['iType'])
                        delete(sendData.data['deviceId'])
                        delete(sendData.data['token'])
                        console.log('data_deviceId:',sendData.deviceId);

                        console.log('data_sendData:',sendData);

                        let result = HttpRSAModule.gzipRSA(JSON.stringify(sendData))
                        //let result = JSON.stringify(sendData)
                        resolve(result)
                        //resolve(JSON.stringify(options))
                    } catch (error) {
                    reject(error)
                    }
            })
        }
        /**
         * 解压返回数据
         * @param data
         * @returns {Promise}
         */
        gunZip = (data) => {
            return new Promise((resolve, reject) => {
                try {
                    //let responseData = HttpRSAModule.gunzipRSA(data)
                    //resolve(responseData)
                    resolve(data)
                    } catch (error) {
                    reject(error)
                    }
            })
        }
    }
}


