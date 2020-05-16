<template>
  <div id="firstTable">
    <v-container grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card class="mx-auto">
            <v-card-title color="#0f1c41">
              Uploading Files
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
              class="uploadingFiles"
            >
                <template 
                  v-slot:item="row">
                  <tr>
                  <td>{{row.item.nombre}}</td>
                  <td>{{row.item.porcentajeSubido}}%</td>
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
              Uploaded Files
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
              :headers="headersUploaded"
              :items="filesUploaded"
              :items-per-page="10"
              class="uploadedFiles"
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
  import { Server_url_prefix, Server_port } from '../variables/variables'

  //import axios from 'axios';

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
            value: 'name',
          },
          { text: 'Subido (%)', value: 'percentage' },
        ],
        files: [],
        headersUploaded: [
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'name',
          },
        ],
        filesUploaded:[],
      }
    },
    mounted() {
      //Get downloading files
      const req = new XMLHttpRequest();
      req.open('GET',Server_url_prefix + ":" + Server_port + "/upload/status",false);
      req.send();

      console.log("He enviado petición")
      if (req.status == 200) {
        console.log(req.response);
        //Check if they are downloaded files
        const responseUploads = req.response;

        if(responseUploads.length > 0){
          responseUploads.forEach(element => {
            if(element.percentage == 100){
              this.filesDownloaded.push(element);
            }else{
              this.files.push(element);
            }
          });
        }

        this.intervalRetreaving();
      }
    },
    methods: {
      onButtonClick(item) {
        console.log('click on ' + item.nombre);
        const req = new XMLHttpRequest();
        req.open('POST',Server_url_prefix + ":" + Server_port + "/upload/delete",false);
        req.send(JSON.stringify(item.id));
        console.log("He enviado petición para eliminar");
        if (req.status == 200 && req.response == true) { // Here delete from downloaded files
          console.log("He recibido confirmación");
          let pos = this.filesUploaded.map(function(e){return e.id}).indexof(item.id);
          this.filesUploaded.slice(pos,1);
        }
      },
      intervalRetreaving(){
        setInterval(function(){
          const req = new XMLHttpRequest();
          req.open('GET',Server_url_prefix + ":" + Server_port + "/upload/status",false);
          req.send();

          if (req.status == 200) {
            console.log(req.response);
            //Check if they are uploaded files
            const responseUploads = req.response;

            if(responseUploads.length > 0){
              responseUploads.forEach(element => {
                if(element.percentage == 100){
                  //Check if it is in uploading files
                  let pos = this.filesUploaded.map(function(e){return e.id}).indexof(element.id);

                  if(pos == -1){//Here it doesn´t exist in uploaded files
                    //check if exists in uploading files
                    pos = this.files.map(function(e){return e.id}).indexof(element.id);
                    if(pos != -1){//Delete from uploading files and add it to uploaded files
                      this.files.slice(pos,1);
                    }
                    //Add it with nothing to do if it doesn´t exists
                    this.filesUploaded.push(element);
                  }
                  //In case it exists nothing to do
                }else{
                  //In this case check only in uploading files
                  let pos = this.files.map(function(e){return e.id}).indexof(element.id);

                  if(pos == -1){//It doesn´t exist, add it
                    this.files.push(element);
                  }else{ //Change the element for the new data
                    this.files[pos] = element;
                  }
                  
                }
              });
            }

          }
        },2000);
      }
    }
  }
</script>

<style>
#uploadFileButtomIcon {
    margin-left: 10px;
}
</style>