<template>
    <div class="dash">
        <v-toolbar class="toolbar" id="toolbar" fixed>
            <v-toolbar-items class="hidden-md-and-down">
                <v-btn
                        flat
                        class="toolbar"
                        color="#0f1c41"
                        to="/filesTreatment">
                    Files
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <div id="toolbarSpacer">
        </div>

        <router-view/>
    </div>
</template>

<script>

export default {
    data() {
        return {
            items: [
                { path: "/#/", title: "Files" }
            ],
            locationWindow: null,
            on: false
        }
    },
    methods: {
        onClickMenu(item) {
            window.location.href = item.path;
        }
    }
}
</script>