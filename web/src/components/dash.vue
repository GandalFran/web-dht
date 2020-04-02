<template>
    <div class="dash">
        <v-toolbar class="toolbar" id="toolbar" fixed>

            <v-menu bottom left>
                <template v-slot:activator="{ on }">
                    <v-btn
                            dark
                            icon
                            v-on="on"
                            class="hidden-lg-and-up">
                    </v-btn>
                </template>

                <v-list id="itemMenu" class="hidden-lg-and-up">
                    <v-list-tile
                            v-for="(item, i) in items"
                            :key="i"
                            @click="onClickMenu(item)">
                        <v-list-tile-title>
                            {{ item.title }}
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            
            <v-spacer class="hidden-lg-and-up"></v-spacer>

            <v-spacer class="hidden-md-and-down"></v-spacer>

            <v-toolbar-items class="hidden-md-and-down">
                <v-btn
                        flat
                        class="toolbar"
                        color="#0f1c41"
                        to="/HellowWorld">
                    {{ $t('home') }}
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
                { path: "/#/HellowWorld", title: this.$t('home') },
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