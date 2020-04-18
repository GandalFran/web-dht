<template>
  <div id="firstTable">
    <v-container grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-file-input
            label="Click here to select file for upload"
            outlined
            v-model="file"
          >
          </v-file-input>
        </v-flex>

        <v-flex xs12>
          <v-btn
            id="okFileButton"
            class="futura"
            text
            color="#0f1c41"
            @click="onSubmit()"
            
            left>
            Upload File
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
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

  import axios from 'axios';


  export default {
    data () {
      return {
        search: '',
        //upload image data
        file: null,
        fileErrorMessage:"",
        fileErrorFlag: false,
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
      },
      async onSubmit(){ 
            var urlUpload = "http://localhost:8125/upload";
            const formData = new FormData(); //Object that allows us send the data using XMLHttpRequest
            formData.append('file',this.file);

            console.log(this.file);
            try {
                await axios.post(urlUpload, formData);
                location.reload(true);
            } catch (err) {
                console.log(err);
            }
      }
    }
  }
</script>

<style>
#uploadFileButtomIcon {
    margin-left: 10px;
}
</style>