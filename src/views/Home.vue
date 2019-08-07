<template lang="pug">

  main
    h1 Datepicker
    p Value: {{ pickedDate || 'No date' }}

    datepicker(v-model="pickedDate" @input="onInput")



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
    // console.log(val)
  }
}
</script>
