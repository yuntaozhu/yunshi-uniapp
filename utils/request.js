import {showLoading,hideLoading} from "../components/GlobalLoading";
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
		showLoading()
		uni.request({
			url: url,
			data: data,
			method: method,
			header: header,
			success: res => {
				hideLoading()
				if (res.statusCode == 200) {
					if (res.data.code === "200" || res.data.code === "") {
						resolve(res.data)
					} else if (res.data.code === "20004" || res.data.code === "20005") {
						uni.removeStorageSync("storage_key")
						uni.navigateTo({
							url: '/pages_category_page2/userModule/login'
						})
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
				hideLoading()
				reject(res)
			},
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
		showLoading()
		uni.request({
			url: url,
			data: data,
			method: method,
			header: header,
			success: res => {
				hideLoading()
				if (res.data.code === "200" || data.code === "") {
					resolve(res.data)
				} else {
					reject(res)
				}
			},
			fail: res => {
				hideLoading()
				reject(res)
			}
		})
	});
}

module.exports = {
	request: request,
	request1: request1
}
