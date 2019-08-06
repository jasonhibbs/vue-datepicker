<template lang="pug">

  main
    h1 Datepicker
    datepicker(v-model="pickedDate" @input="onInput")

    p {{ pickedDate || 'No date' }}



</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Datepicker from '@/components/Datepicker.vue'

@Component({
  components: {
    Datepicker,
  },
})
export default class Home extends Vue {
  pickedDate?: string = ''

  onInput(val: string) {
    console.log(val)
  }
}
</script>
