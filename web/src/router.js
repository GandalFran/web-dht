import Vue from 'vue'
import Router from 'vue-router'

//Import components
import Dash from "./components/dash"
import FilesTreatment from "./components/filesTreatment"
import StatusDownloadingFiles from "./components/statusDownloadingFiles"
import StatusUploadingFiles from "./components/statusUploadingFiles"

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
            redirect:{name:'statusDownloadingFiles'},
            component: Dash,
            children: [
                {
                    path: '/statusDownloadingFiles',
                    name: 'statusDownloadingFiles',
                    component: StatusDownloadingFiles
                },
                {
                    path: '/statusUploadingFiles',
                    name: 'statusUploadingFiles',
                    component: StatusUploadingFiles
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