<template>
  <div id="firstTable">
    <v-container grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card class="mx-auto">
            <v-card-title color="#0f1c41">
              Downloading Files
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
              class="downloadingFiles"
            >
                <template 
                  v-slot:item="row">
                  <tr>
                  <td>{{row.item.nombre}}</td>
                  <td>{{row.item.tamaño}}</td>
                  <td>{{row.item.velocidadDescarga}}</td>
                  <td>{{row.item.porcentajeDescargado}}</td>
                </tr>
                </template>
            </v-data-table>
          </v-card>
        </v-flex>>
      </v-layout>
    </v-container>
    <v-container grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card class="mx-auto">
            <v-card-title color="#0f1c41">
              Downloaded Files
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
              :headers="headersDownloaded"
              :items="filesDownloaded"
              :items-per-page="10"
              class="downloadedFiles"
            >
              <template
                v-slot:item="row">

                <tr>
                  <td>{{row.item.nombre}}</td>
                  <td>
                    <v-btn
                      class = "mx-2"
                      color = "#000000"
                      dark
                      icon
                      left
                      small
                      @click="onButtonClick(row.item)">
                      <v-icon>{{ icons.mdiDelete }}</v-icon>
                      Delete
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
    mdiDelete,
  } from '@mdi/js'


  export default {
    data () {
      return {
        search: '',
        icons: {
          mdiDelete,
        },
        headers: [
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'nombre',
          },
          { text: 'Tamaño', value: 'tamaño' },
          { text: 'Vel. Descarga', value: 'velocidadDescarga' },
          { text: 'Descargado (%)', value: 'porcentajeDescargado' },
        ],
        files: [
          {
            nombre: 'XXX',
            tamaño: '100 MB',
            velocidadDescarga: '10 MB/s',
            porcentajeDescargado: '1%',
          },
        ],
        headersDownloaded: [
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'nombre',
          },
        ],
        filesDownloaded: [
          {
            nombre: 'XXX',
          },
        ],
      }
    },
    methods: {
      onButtonClick(item) {
        console.log('click on ' + item.nombre)
      }
    }
  }
</script>