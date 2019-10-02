import { $fetch } from '../plugins/fetch'
let fetchPostsUid = 0

export default {
    namespaced: true,

    state() {
        return {
            draft: null, //博客草稿
            // 上一次请求的地图范围
            // 防止重复请求
            mapBounds: null,
            // 当前地图范围内的博客
            posts: [],
            // 当前选中的博客ID
            selectedPostId: null,
            // 获取选中的博客的详情
            selectedPostDetails: null,
        }
    },

    getters: {
        draft: state => state.draft,
        posts: state => state.posts,
        //博客的id字段为'_id' 在mongoDB中
        selectedPost: state => state.posts.find(p => p._id === state.selectedPostId),
        selectedPostDetails: state => state.selectedPostDetails,
        //草稿优先于当前选中的博客
        currentPost: (state, getters) => state.draft || getters.selectedPost,
    },

    mutations: {
        addPost(state, value) {
            state.posts.push(value)
        },

        draft(state, value) {
            state.draft = value
        },

        posts(state, { posts, mapBounds }) {
            state.posts = posts
            state.mapBounds = mapBounds
        },

        selectedPostId(state, value) {
            state.selectedPostId = value
        },
        selectedPostDetails(state, value) {
            state.selectedPostDetails = value
        },
        updateDraft(state, value) {
            Object.assign(state.draft, value)
        },
    },
    actions: {
        clearDraft({ commit }) {
            commit('draft', null)
        },

        createDraft({ commit }) {
            // Default values
            commit('draft', {
                title: '',
                content: '',
                position: null,
                placeId: null,
            })
        },

        async createPost({ commit, dispatch }, draft) {
            const data = {
                ...draft,
                // 需要获取表单对象
                position: draft.position.toJSON(),
            }

            // 发送请求
            const result = await $fetch('posts/new', {
                method: 'POST',
                body: JSON.stringify(data),
            })
            dispatch('clearDraft')

            // 更新博客列表
            commit('addPost', result)
            dispatch('selectPost', result._id)
        },
        async fetchPosts({ commit, state }, { mapBounds, force }) {
            let oldBounds = state.mapBounds
            if (force || !oldBounds || !oldBounds.equals(mapBounds)) {
                const requestId = ++fetchPostsUid

                // Request
                const ne = mapBounds.getNorthEast()
                const sw = mapBounds.getSouthWest()
                const query = `posts?ne=${
                    encodeURIComponent(ne.toUrlValue())
                    }&sw=${
                    encodeURIComponent(sw.toUrlValue())
                    }`
                const posts = await $fetch(query)

                // We abort if we started another query
                if (requestId === fetchPostsUid) {
                    commit('posts', {
                        posts,
                        mapBounds,
                    })
                }
            }
        },
        //新建的博客会被自动选中
        async selectPost({ commit, getters }, id) {
            commit('selectedPostDetails', null)
            commit('selectedPostId', id)
            const details = await $fetch(`posts/${id}`)
            commit('selectedPostDetails', details)
        },
        //点击地图时调用
        setDraftLocation({ dispatch, getters }, { position, placeId }) {
            if (!getters.draft) {// 如果没有旧创建
                dispatch('createDraft')
            }
            dispatch('updateDraft', { // 更新draft地点信息
                position,
                placeId,
            })
        },

        updateDraft({ dispatch, commit, getters }, draft) {
            commit('updateDraft', draft)
        },
        'logged-in': {
            handler({ dispatch, state }) {
                if (state.mapBounds) {
                    dispatch('fetchPosts', {
                        mapBounds: state.mapBounds,
                        force: true,
                    })
                }
                if (state.selectedPostId) {
                    dispatch('selectPost', state.selectedPostId)
                }
            },
            root: true,
        },
        logout: {
            handler({ commit }) {
                commit('posts', {
                    posts: [],
                    mapBounds: null,
                })
            },
            root: true,
        },
        unselectPost({ commit }) {
            commit('selectedPostId', null)
        },
    },
}
