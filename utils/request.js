const API = require("../config/api")
let antiShake = false
const request = (url, data, method = 'GET') => {
    return new Promise((resolve, reject) => {
        let header = {
            "Content-Type": "application/json"
        }
        const res = uni.getStorageSync('storage_key');
        const token = res.token
        if (token) {
            header['Authorization'] = token
        }
        uni.request({
            url: url,
            data: data,
            method: method,
            header: header,
            success: async res => {
                if (res.statusCode == 200) {
                    if (res.data.code === "200" || res.data.code === "") {
                        resolve(res.data)
                    } else if (res.data.code === "20004" || res.data.code === "20005") {
                       if(token){
                           //  refreshToken
                           try {
                               await refreshToken();
                               //  重新发送上一次请求
                               setTimeout(async () => {
                                   const retryRequest =  await request(url, data, method)
                                   resolve(retryRequest)
                               },500)
                           } catch (e) {
                               goLogin()
                           }
                       }else{
                           goLogin()
                       }
                    } else {
                        uni.showToast({
                            title: res.data.message,
                            icon: "none"
                        })
                    }
                } else {
                    reject(res)
                }
            },
            fail: res => {
                reject(res)
            }
        })
    });
}
//不带token接口请求，首页
const request1 = (url, data, method = 'GET') => {
    return new Promise((resolve, reject) => {
        let header = {
            'Content-Type': 'application/json',
            'tenant': 'MDAwMA==',
        }
        uni.request({
            url: url,
            data: data,
            method: method,
            header: header,
            success: res => {
                if (res.data.code === "200" || data.code === "") {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            },
            fail: res => {
                reject(res)
            }
        })
    });
}

// refreshToken
const refreshToken = () => {
    // 防抖
    if(antiShake) return
    antiShake = true
    setTimeout(()=>{
        antiShake = false
    },3000)
    return new Promise((resolve, reject) => {
        let header = {
            "Content-Type": "application/json"
        }
        const res = uni.getStorageSync('storage_key');
        const token = res.token
        if (token) {
            header['Authorization'] = token
        }
        const data = {
            refreshToken: res.refreshToken
        }
        console.log("原有token过期，请求refreshToken")
        uni.request({
            url: API.RefreshToken,
            data: data,
            method: "POST",
            header: header,
            success: res => {
                if (res.statusCode == 200) {
                    if (res.data.code === "200" || res.data.code === "") {
                        resolve(res.data.data)
                        uni.setStorageSync('storage_key', res.data.data);
                        return
                    }
                }
                reject()
                goLogin()
            },
            fail: res => {
                reject(res)
                goLogin()
            }
        })
    });
}

const goLogin = () => {
    uni.removeStorageSync("storage_key")
    uni.navigateTo({
        url: '/pages_category_page2/userModule/login'
    })
}

module.exports = {
    request: request,
    request1: request1
}
