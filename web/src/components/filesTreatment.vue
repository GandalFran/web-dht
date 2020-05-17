<template>
  <div id="searchTable">
    <v-container grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-file-input
            id = "inputFile"
            type = "file"
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
            @click="onUploadClick()"
            
            left>
            Upload File
          </v-btn>
        </v-flex>

        <v-flex xs12>
          <v-alert
            :value="fileErrorFlag"
            :v-bind="fileErrorMessage"
            type="error">
            {{ fileErrorMessage }}
          </v-alert>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-xl text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-file-input
            id = "inputTorrent"
            type = "file"
            label="Click here to select torrent for fownload"
            outlined
            v-model="torrentFile"
          >
          </v-file-input>
        </v-flex>

        <v-flex xs12>
          <v-btn
            id="okFileButton"
            class="futura"
            text
            color="#0f1c41"
            @click="onDownloadClick()"
            
            left>
            Download File
          </v-btn>
        </v-flex>

        <v-flex xs12>
          <v-alert
            :value="torrentErrorFlag"
            :v-bind="torrentErrorMessage"
            type="error">
            {{ torrentErrorMessage }}
          </v-alert>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { Server_url_prefix, Server_port } from '../variables/variables'

  export default {
    data () {
      return {
        //upload image data
        file: null,
        fileErrorMessage:null,
        fileErrorFlag: false,
        //Upload torrent
        torrentFile: null,
        torrentErrorMessage: null,
        torrentErrorFlag: null,
      }
    },
    methods: {
      onDownloadClick() {
            this.torrentErrorMessage = null;
            this.torrentErrorFlag = false;

            //Check file size
            if(this.torrentFile == null){
              this.torrentErrorMessage = "Debe seleccionar un .torrent para poder descargar";
              this.torrentErrorFlag = true;
              return;
            }

            const allowedTypes = [ "application/x-bittorrent"];
            if(!allowedTypes.includes(this.torrentFile.type)){
                this.torrentErrorMessage = "Formato del archivo no válido. Debe introducirse un .torrent";
                this.torrentErrorFlag = true;
                this.torrentFile = null;
                return;
            }

            const req = new XMLHttpRequest();
            const formData = new FormData(); //Object that allows us send the data using XMLHttpRequest
            formData.append('file',this.torrentFile);
            req.open('POST',Server_url_prefix + ":" + Server_port + "/download/create",false);
            req.send(formData);

            if (req.status == 200) {
              console.log(req.response);
            }else{
              this.torrentErrorMessage = "El archivo que se quiere descargar no es correcto";
              this.torrentErrorFlag = true;
              this.torrentFile = null;
              return;
            }
      },
      onUploadClick(){ 
            this.fileErrorMessage = null;
            this.fileErrorFlag = false;

            //Check file size
            if(this.file == null){
              this.fileErrorMessage = "Debe seleccionar un archivo para subir";
              this.fileErrorFlag = true;
              return;
            }

            //Check file size
            if(this.file.size > 1000000){
              this.fileErrorMessage = "No es posible subir archivo de un tamaño superior a 1MB";
              this.fileErrorFlag = true;
              this.file = null;
              return;
            }

            const req = new XMLHttpRequest();
            const formData = new FormData(); //Object that allows us send the data using XMLHttpRequest
            formData.append('file',this.file);
            req.open('POST',Server_url_prefix + ":" + Server_port + "/upload/create",false);
            req.send(formData);

            if (req.status != 200) {
              this.fileErrorMessage = "Se ha producido un error en el procesamiento de la petición";
              this.fileErrorFlag = true;
              this.file = null;
              return;
            }
      },
    }
  }
</script>