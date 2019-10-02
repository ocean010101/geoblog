import { $fetch } from '../plugins/fetch'

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
        }
    },

    getters: {
        draft: state => state.draft,
        posts: state => state.posts,
        //博客的id字段为'_id' 在mongoDB中
        selectedPost: state => state.posts.find(p => p._id === state.selectedPostId),
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
        //新建的博客会被自动选中
        async selectPost({ commit, getters }, id) {
            commit('selectedPostId', id)
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
    },
}
