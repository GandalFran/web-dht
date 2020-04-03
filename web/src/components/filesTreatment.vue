<template>
  <v-data-table
    :headers="headers"
    :items="files"
    :items-per-page="10"
    class="downloadingFiles"
  >
      <template v-slot:item.porcentajeDescargado>
        <v-progress-linear color="purple" value="item.porcentajeDescargado" :height="10"></v-progress-linear>
      </template>
  </v-data-table>
</template>

<script>
  export default {
    data () {
      return {
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
            velocidadDescarga: '',
            porcentajeDescargado: 24,
          },
        ],
      }
    },
  }
</script>