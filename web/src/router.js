import Vue from 'vue'
import Router from 'vue-router'

//Import components
//import x from ./components/x

Vue.use(Router)

var router = new Router({
    routes: [
        {
            path: '/',
            name: 'dash',
            redirect:{name:'dashHome'},
            component: Dash,
            children: [
                {
                    path: '/dashHome',
                    name: 'dashHome',
                    component: DashHome
                }
            ]
        }
    ]
});

export default router;