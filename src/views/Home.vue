<template lang="pug">

  main
    h1 Datepicker
    p Value: {{ pickedDate || 'No date' }}

    p
      datepicker(required v-model="pickedDate" @input="onInput")

    p
      datepicker-input(v-model="pickedDate")

    p
      button(@click="pickedDate = `today`") Today
      button(@click="pickedDate = `next year`") Next Year
      button(@click="pickedDate = `yesterday`") Yesterday
      button(@click="pickedDate = `last sunday`") Last Sunday
      button(@click="pickedDate = `13th Jan 1999`") 13th Jan 1999
      button(@click="pickedDate = `mar 25`") Mar 25
      button(@click="pickedDate = `10/11/12`") 10/11/12
      button(@click="pickedDate = `12/13/14`") 12/13/14



</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Datepicker, DatepickerInput } from '@/components/Datepicker'

@Component({
  components: {
    Datepicker,
    DatepickerInput,
  },
})
export default class Home extends Vue {
  pickedDate?: string = ''

  onInput(val: string) {
    console.log(val)
  }
}

// TODO
// Calendar steals focus when open, e.g. 12-1
</script>
