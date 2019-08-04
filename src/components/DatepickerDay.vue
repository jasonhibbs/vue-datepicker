<template lang="pug">
  td.datepicker-cell
    button.datepicker-button._date(
      tabindex="-1"
      :disabled="isDisabled"
      :data-date="datestring"
    )
      span.datepicker-label._date {{ label }}
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  PropSync,
  Ref,
  Vue,
  Watch,
} from 'vue-property-decorator'

@Component
export default class DatepickerDay extends Vue {
  @PropSync('date') day!: DatepickerGridDay

  get isDisabled() {
    return this.day.disabled
  }

  get label() {
    return this.day.date.getDate()
  }

  get datestring() {
    let day = this.day.date

    let d: string = day.getDate().toString()
    if (day.getDate() < 9) {
      d = '0' + d
    }

    let m: string = (day.getMonth() + 1).toString()
    if (day.getMonth() < 9) {
      m = '0' + m
    }

    return day.getFullYear() + '-' + m + '-' + d
  }
}

export interface DatepickerGridDay {
  date: Date
  disabled: boolean
  selected: boolean
}
</script>
