
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
}
