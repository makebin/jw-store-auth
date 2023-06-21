import Vue from 'vue'
export const USER_INFO_CACHE_KEY = USER_INFO_CACHE_KEY;

const jwAuthorize = function(options) {
	{
		state: {
			user: null,
		},
		mutations: {
			login(state, user) {
				state.user = user
				if (Vue.prototype.$cache && Vue.prototype.$cache.set) {
					// 缓存用户信息
					Vue.prototype.$cache.set(USER_INFO_CACHE_KEY, user, 0)
				}
				typeof options.mutations.login === 'function' && options.mutations.login(state, user);
			},
			logout(state) {
				state.user = null
				// 清理缓存用户信息
				if (Vue.prototype.$cache && Vue.prototype.$cache.delete) {
					Vue.prototype.$cache.delete(USER_INFO_CACHE_KEY)
				}
				typeof options.mutations.login === 'function' && options.mutations.logout(state);
			}
		},
		actions: {
			autoLogin({
				commit,
				getters,
				dispatch
			}) {
				// 判断本地是否有账号信息，如果有，就自动重新登录
				if (getters.user) {
					dispatch('userRefresh').then(res => {
						uni.hideLoading();
					}).catch(e => {
						uni.hideLoading();
					});
				}
				typeof options.actions.autoLogin === 'function' && options.actions.autoLogin({
					commit,
					getters,
					dispatch
				});
			},
			//获取用户信息
			getUser({
				commit,
				getters,
				dispatch
			}, params) {
				return new Promise((resolve, reject) => {
					typeof options.actions.getUser === 'function' && options.actions.getUser({
						commit,
						getters,
						dispatch,
						resolve,
						reject
					});
				})
			},
			//刷新用户信息
			userRefresh({
				commit,
				getters,
				dispatch
			}, params) {
				const cxt = this;
				return new Promise((resolve, reject) => {
					typeof options.actions.getUser === 'function' && options.actions.getUser({
						commit,
						getters,
						dispatch,
						resolve,
						reject,
						callback: (data) => {
							commit('login', data)
						}
					});
				});
			},
			login({
				commit,
				getters,
				dispatch
			}, params) {
				return new Promise((resolve, reject) => {
					typeof options.actions.login === 'function' && options.actions.login({
						commit,
						getters,
						dispatch,
						resolve,
						reject,
						callback: (data) => {
							dispatch('getUser');
						}
					});
				})
			},
			// 用户登出
			logout({
				commit,
				getters,
				dispatch
			}) {
				commit('logout');
				typeof options.actions.logout === 'function' && options.actions.logout({
					commit,
					getters,
					dispatch,
				});
			}
		},
		getters: {
			user: state => {
				if (state.user) {
					return state.user
				}
				if (Vue.prototype.$cache && Vue.prototype.$cache.get) {
					return Vue.prototype.$cache.get(USER_INFO_CACHE_KEY)
				}

			}
		}
	}
}

export default jwAuthorize;