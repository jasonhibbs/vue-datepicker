<template lang="pug">
  td.datepicker-cell(
    :class="cellClasses"
  )
    button.datepicker-button._date(
      :tabindex="isSelected ? 0 : -1"
      :aria-selected="isSelected"
      :data-date="datestring"
      @click="onClick"
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

  get cellClasses() {
    return {
      _selected: this.isSelected,
      _today: this.isToday,
      _weekend: this.isWeekend,
      _disabled: this.isDisabled,
    }
  }

  get isDisabled() {
    return this.day.disabled
  }

  get isSelected() {
    return this.day.selected
  }

  get isToday() {
    return this.day.date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
  }

  get isWeekend() {
    return !(this.day.date.getDay() % 6)
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

  onClick() {
    this.$emit('dateClicked', this.day)
  }
}

export interface DatepickerGridDay {
  date: Date
  disabled: boolean
  selected: boolean
}
</script>
