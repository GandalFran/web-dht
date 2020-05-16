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
                  <td>{{row.item.porcentajeDescargado}}%</td>
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
      //Get downloading files
      const req = new XMLHttpRequest();
      req.open('GET',Server_url_prefix + ":" + Server_port + "/download/status",false);
      req.send();

      console.log("He enviado petición")
      if (req.status == 200) {
        console.log(req.response);
        //Check if they are downloaded files
        const responseDownloads = req.response;

        if(responseDownloads.length > 0){
          for(var i =0; i<responseDownloads.length; i++){
            const element = responseDownloads[i];
            if(element.percentage == 100){
              this.filesDownloaded.push(element);
            }else{
              this.files.push(element);
            }
          }
        }

        this.intervalRetreaving();
      }
    },
    methods: {
      onButtonClick(item) {
        console.log('click on ' + item.nombre);
        const req = new XMLHttpRequest();
        req.open('POST',Server_url_prefix + ":" + Server_port + "/download/delete",false);
        req.send(JSON.stringify(item.id));
        console.log("He enviado petición para eliminar");
        if (req.status == 200 && req.response == true) { // Here delete from downloaded files
          console.log("He recibido confirmación");
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
      intervalRetreaving(){
        const files = this.files
        const filesDownloaded = this.filesDownloaded
        setInterval(function(){
          const req = new XMLHttpRequest();
          req.open('GET',Server_url_prefix + ":" + Server_port + "/download/status",false);
          req.send();

          if (req.status == 200) {
            console.log(req.response);
            //Check if they are downloaded files
            const responseDownloads = req.response;

            if(responseDownloads.length > 0){
              for(var i =0; i<responseDownloads.length; i++){
                const element = responseDownloads[i];
                if(element.percentage == 100){
                  //Check if it is in downloading files
                  //Check if it is in uploading files
                    let pos = -1;

                    if(filesDownloaded.length > 0){
                      for(var j=0; j < filesDownloaded.length ; j++){
                        if(filesDownloaded[j].id == element.id){
                          pos = j;
                          break;
                        }
                      } 
                    }

                  if(pos == -1){//Here it doesn´t exist in downloaded files
                    //check if exists in downloading files
                    if(files.length > 0){
                        for(var k=0; k < files.length ; k++){
                          if(files[k].id == element.id){
                            pos = k;
                            break;
                          }
                        } 
                      }
                    if(pos != -1){//Delete from downloading files and add it to downloaded files
                      files.slice(pos,1);
                    }
                    //Add it with nothing to do if it doesn´t exists
                    filesDownloaded.push(element);
                  }
                  //In case it exists nothing to do
                }else{
                  //In this case check only in downloading files
                  let pos = -1;
                    if(files.length > 0){
                        for(var l=0; j < files.length ; l++){
                          if(files[l].id == element.id){
                            pos = l;
                            break;
                          }
                        } 
                      }

                  if(pos == -1){//It doesn´t exist, add it
                    files.push(element);
                  }else{ //Change the element for the new data
                    files[pos] = element;
                  }
                  
                }
              }
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