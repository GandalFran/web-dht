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
            value: 'nombre',
          },
          { text: 'Descargado (%)', value: 'porcentajeDescargado' },
        ],
        files: [],
        headersDownloaded: [
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'nombre',
          },
        ],
        filesDownloaded:[],
      }
    },
    mounted() {
      //console.log(document.querySelector(".grid"));
      //console.log(document.getElementById("grid"));
      //console.log(this.$refs.firstTable);
      //Get downloading files
      const req = new XMLHttpRequest();
      req.open('GET',"http://localhost:80/files/status",false);
      req.send();

      console.log("He enviado petición")
      if (req.status == 200) {
        console.log(req.response);
        //Check if they are downloaded files
        const responseDownloads = req.response;

        if(responseDownloads.length > 0){
          responseDownloads.forEach(element => {
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
        req.open('POST',"http://localhost:80/files/delete",false);
        req.send(JSON.stringify(item.id));
        console.log("He enviado petición para eliminar");
        if (req.status == 200 && req.response == true) { // Here delete from downloaded files
          console.log("He recibido confirmación");
          let pos = this.filesDownloaded.map(function(e){return e.id}).indexof(item.id);
          this.filesDownloaded.slice(pos,1);
        }
      },
      intervalRetreaving(){
        setInterval(function(){
          const req = new XMLHttpRequest();
          req.open('GET',"http://localhost:80/files/status",false);
          req.send();

          if (req.status == 200) {
            console.log(req.response);
            //Check if they are downloaded files
            const responseDownloads = req.response;

            if(responseDownloads.length > 0){
              responseDownloads.forEach(element => {
                if(element.percentage == 100){
                  //Check if it is in downloading files
                  let pos = this.filesDownloaded.map(function(e){return e.id}).indexof(element.id);

                  if(pos == -1){//Here it doesn´t exist in downloaded files
                    //check if exists in downloading files
                    pos = this.files.map(function(e){return e.id}).indexof(element.id);
                    if(pos != -1){//Delete from downloading files and add it to downloaded files
                      this.files.slice(pos,1);
                    }
                    //Add it with nothing to do if it doesn´t exists
                    this.filesDownloaded.push(element);
                  }
                  //In case it exists nothing to do
                }else{
                  //In this case check only in downloading files
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