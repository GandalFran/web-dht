import Vue from 'vue'
import Router from 'vue-router'

//Import components
import Dash from "./components/dash"
import FilesTreatment from "./components/filesTreatment"
import StatusFiles from "./components/statusFiles"

Vue.use(Router)

var router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: {name: 'dash'}
        },
        {
            path: '/dash',
            name: 'dash',
            redirect:{name:'statusFiles'},
            component: Dash,
            children: [
                {
                    path: '/statusFiles',
                    name: 'statusFiles',
                    component: StatusFiles
                },
                {
                    path: '/filesTreatment',
                    name: 'filesTreatment',
                    component: FilesTreatment
                }
            ]
        }
    ]
})

export default router;