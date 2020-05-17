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
                  <td>{{row.item.name}}</td>
                  <td>{{row.item.percentage.toFixed(2)}}%</td>
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
                  <td>{{row.item.name}}</td>
                  <td>
                    <v-btn
                      class = "mx-2"
                      color = "#000000"
                      dark
                      icon
                      left
                      small
                      @click="onDownloadClick(row.item)">
                      <v-icon>{{ icons.mdiDownload }}</v-icon>
                      Download
                    </v-btn>
                  </td>
                  <td>
                    <v-btn
                      class = "mx-2"
                      color = "#000000"
                      dark
                      icon
                      left
                      small
                      @click="onDeleteClick(row.item)">
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
    mdiDownload,
  } from '@mdi/js'
  import axios from 'axios'
  import { Server_url_prefix, Server_port } from '../variables/variables'

  //import axios from 'axios';

  export default {
    data () {
      return {
        search: '',
        icons: {
          mdiDelete,
          mdiDownload,
        },
        headers: [
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Descargado (%)', value: 'percentage' },
        ],
        files: [],
        headersDownloaded: [
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'name',
          },
        ],
        filesDownloaded:[],
      }
    },
    mounted() {
      this.updateTable();
      const updateTable = this.updateTable
      setInterval(function(){
        updateTable()
      },2000);
    },
    methods: {
      onDeleteClick(item) {
        const req = new XMLHttpRequest();
        req.open('POST',Server_url_prefix + ":" + Server_port + "/download/delete",false);
        req.send(JSON.stringify({id: item.id}));
        if (req.status == 200) { // Here delete from downloaded files
          let pos = -1;
          for(var i=0; i < this.filesDownloaded.length ; i++){
            if(this.filesDownloaded[i].id == item.id){
              pos = i;
              break;
            }
          }
          this.filesDownloaded.slice(pos,1);
        }
      },
      onDownloadClick(item){
        axios({
            url: Server_url_prefix + ":" + Server_port + "/download/file",
            method: 'POST',
            responseType: 'blob',
            data: {id: item.id},
        }).then((response) => {
             var fileURL = window.URL.createObjectURL(new Blob([response.data]));
             var fileLink = document.createElement('a');

             fileLink.href = fileURL;
             fileLink.setAttribute('download', item.name);
             document.body.appendChild(fileLink);

             fileLink.click();
        }).catch(error => {
          console.log(error)
        });
      },

      updateTable(){
        const req = new XMLHttpRequest();
        req.open('GET',Server_url_prefix + ":" + Server_port + "/download/status",false);
        req.send();

        this.files = []
        this.filesDownloaded = []
        if (req.status == 200) {
          //Check if they are uploaded files
          const responseFiles =  JSON.parse(req.response);
          for(var i=0; i<responseFiles.length; i++){
            const file = responseFiles[i];
            if(file.percentage === 100){
              this.filesDownloaded.push(file);
            }else{
              this.files.push(file);
            }
          }
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