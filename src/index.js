import Vue from 'vue'
export const USER_INFO_CACHE_KEY = '_userinfo_';
export const USER_AUTHORIZE_CACHE_KEY = '_authorize_';
const jwAuthorize = function(options) {
	{
		state: {
			user: null,
			//授权携带的数据信息
			authorize: {}
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
			// 授权信息进行处理
			authorize(state, authorize) {
				state.authorize = authorize
				if (Vue.prototype.$cache && Vue.prototype.$cache.set) {
					// 缓存用户信息
					Vue.prototype.$cache.set(USER_AUTHORIZE_CACHE_KEY, authorize, 0)
				}
				typeof options.mutations.authorize === 'function' && options.mutations.authorize(state, authorize);
			},
			//用户退出操作
			logout(state) {
				state.user = null;
				state.authorize = {};
				// 清理缓存用户信息
				if (Vue.prototype.$cache && Vue.prototype.$cache.delete) {
					Vue.prototype.$cache.delete(USER_INFO_CACHE_KEY)
					Vue.prototype.$cache.delete(USER_AUTHORIZE_CACHE_KEY)
				}
				typeof options.mutations.login === 'function' && options.mutations.logout(state);
			}
		},
		actions: {
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
						reject,
						next: (data) => {
							commit('login', {
								data,
								scene: params.scene || 'GET'
							});
							commit('authorize', {
								data,
								scene: params.scene || 'GET'
							});
						}
					});
				})
			},
			// 请求登录
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
						// 登录成功后调用callback执行后续操作
						next: (data) => {
							dispatch('getUser', data);
							commit('authorize', {
								data,
								scene: 'LOGIN'
							});
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
			//用户信息
			user: state => {
				if (state.user) {
					return state.user
				}
				if (Vue.prototype.$cache && Vue.prototype.$cache.get) {
					return Vue.prototype.$cache.get(USER_INFO_CACHE_KEY)
				}
			},
			//授权信息
			authorize: state => {
				if (state.authorize) {
					return state.authorize
				}
				if (Vue.prototype.$cache && Vue.prototype.$cache.get) {
					return Vue.prototype.$cache.get(USER_AUTHORIZE_CACHE_KEY)
				}
			}
		}
	}
}

export default jwAuthorize;