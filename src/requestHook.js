import Vue from 'vue'

const requestHook = function(options) {
	// 结合Store的请求拦截器，用于request携带headers相关信息
	const interceptors = {
		request: () => {

		},
		response: () => {

		}
	}
	return interceptors;
}

export default requestHook;