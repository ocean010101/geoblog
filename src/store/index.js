import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: true,
    state() {
        return {
            user: null
        }
    },
    mutations: {
        user: (state, user) => {//更新state中用户
            state.user = user;
        }
    },
    getters: {
        user: state => state.user,
        userPicture: () => null,
    }
});

export default store