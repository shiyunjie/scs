/**
 * @fileoverview
 * @since 17/1/30 21:04
 * @author chenyiqin
 */

const timeoutPromise = async(timeout) => {
    await ((timeout = 5000) => {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    })(timeout)
    throw new Error('timeout');
};


export default async (options) => {
    let { url, timeout, ...rest, } = options

    let response = await Promise.race([ timeoutPromise(timeout), fetch(url, { ...rest }) ])

    if (response.status < 200 || response.status >= 300) {
        throw new Error(response);
    } else {
        let responseJson = await response.json();

        return responseJson
    }
}

