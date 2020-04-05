<template>
  <div id="searchTable">
    <v-container grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card class="mx-auto">
            <v-card-title color="#0f1c41">
              Files For Download
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <v-data-table
              :headers="headers"
              :items="files"
              :items-per-page="10"
              class="files"
            >
              <template
                v-slot:item="row">

                <tr>
                  <td>{{row.item.nombre}}</td>
                  <td>{{row.item.tamaño}}</td>
                  <td>{{row.item.tipo}}</td>
                  <td>
                    <v-btn
                      class = "mx-2"
                      color = "#000000"
                      dark
                      icon
                      left
                      small
                      @click="onDownloadClick(row.item)">
                      <v-icon dark>{{ icons.mdiDownload }}</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import {
    mdiDownload
  } from '@mdi/js'


  export default {
    data () {
      return {
        search: '',
        icons: {
          mdiDownload,
        },
        headers: [
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'nombre',
          },
          { text: 'Tamaño', value: 'tamaño' },
          { text: 'Tipo', value: 'tipo' },
        ],
        files: [
          {
            nombre: 'XXX',
            tamaño: '100 MB',
            tipo: 'Pelicula'
          },
        ],
      }
    },
    methods: {
      onDownloadClick(item) {
        console.log('click on ' + item.nombre)
      },
    }
  }
</script>