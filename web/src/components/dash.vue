<template>
    <div class="dash">
        <v-app-bar 
            fixed>
            <v-toolbar dark color="#d3d3d3" class=" toolbar hidden-md-and-up" id="toolbar">
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-col cols="12" sm="5">
                        <v-btn
                            text
                            class="toolbar"
                            color="#0f1c41"
                            to="/statusFiles"
                        >
                            Status
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-btn
                            text
                            class="toolbar"
                            color="#0f1c41"
                            to="/filesTreatment"
                        >
                            Files
                        </v-btn>
                    </v-col>
                </v-toolbar-items>
            </v-toolbar>
        </v-app-bar>
        <router-view/>
    </div>
</template>

<script>

export default {
    data() {
        return {
            items: [
                { path: "/#/", title: "Status" },
                { path: "/#/filesTreatment", title: "Files" }
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