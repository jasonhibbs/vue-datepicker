<template lang="pug">
  table.datepicker-grid(
    role="grid"
    aria-labelledby="id-dialog-label"
  )
    thead
      tr.datepicker-row
        th.datepicker-cell._day(
          v-for="(day, index) in dayLabels"
          scope="col"
          :class="{ _weekend: index > 4 }"
          :abbr="day"
          :title="day"
        )
          span.datepicker-label._day {{ day.slice(0, 1) }}

    tbody
      tr.datepicker-row(
        v-for="row in 6"
        v-if="!hideRow(row)"
        :key="row"
      )
        datepicker-day(
          v-for="column in 7"
          ref="days"
          :key="column"
          :date="shownDays[dayIndex(row, column)]"
          @click="$emit('dateClick', $event)"
          @keydown="$emit('dateKeydown', $event)"
        )

</template>

<script lang="ts">
import { Component, Prop, PropSync, Ref, Vue } from 'vue-property-decorator'
import DatepickerDay from '@/components/DatepickerDay.vue'

@Component({
  components: {
    DatepickerDay,
  },
})
export default class DatepickerGrid extends Vue {
  @PropSync('focussed') focusDay!: Date
  @PropSync('selected') selectedDay?: Date

  @Ref('days') gridDays!: DatepickerDay[]

  @Prop({
    default: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  })
  dayLabels!: String[]

  dayIndex(row: number, column: number) {
    return (row - 1) * 7 + (column - 1)
  }

  daysAreSame(a: Date, b: Date) {
    return (
      a.getFullYear() == b.getFullYear() &&
      a.getMonth() == b.getMonth() &&
      a.getDate() == b.getDate()
    )
  }

  makeDay(date: Date, focusDay: Date) {
    date = new Date(date)
    let disabled = date.getMonth() != focusDay.getMonth()
    let selected = false
    let focussed = false
    let day = { date, disabled, focussed, selected }

    if (this.selectedDay && this.daysAreSame(date, this.selectedDay)) {
      day.selected = true
    }

    if (this.daysAreSame(date, this.focusDay)) {
      day.focussed = true
    }

    return day
  }

  lastRowHidden: boolean = false

  hideRow(row: number) {
    return row === 6 && this.lastRowHidden
  }

  get shownDays() {
    let fd = this.focusDay
    let firstDayOfMonth = new Date(fd.getFullYear(), fd.getMonth(), 1)
    let daysInMonth = new Date(fd.getFullYear(), fd.getMonth() + 1, 0).getDate()
    let dayOfWeek = (firstDayOfMonth.getDay() + 6) % 7
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - dayOfWeek)

    let d = new Date(firstDayOfMonth)
    let days = []

    for (let i = 0; i < 6 * 7; i++) {
      days[i] = this.makeDay(d, fd)
      d.setDate(d.getDate() + 1)
    }

    if (dayOfWeek + daysInMonth < 36) {
      this.lastRowHidden = true
    } else {
      this.lastRowHidden = false
    }

    return days
  }

  focus() {
    this.updateFocus()
  }

  updated() {
    this.updateFocus()
  }

  updateFocus() {
    let fd = this.focusDay

    this.gridDays.forEach((gridDay, index) => {
      let d = gridDay.day.date
      if (this.daysAreSame(d, fd)) {
        gridDay.focus()
      }
    })
  }
}
</script>
