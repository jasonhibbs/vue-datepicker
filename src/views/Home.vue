<template lang="pug">

  main
    h1 Datepicker
    datepicker

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Datepicker from '@/components/Datepicker.vue'

@Component({
  components: {
    Datepicker,
  },
})
export default class Home extends Vue {}
</script>
