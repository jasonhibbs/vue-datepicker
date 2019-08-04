<template lang="pug">
  table.datepicker-grid(
    role="grid"
    aria-labelledby="id-dialog-label"
  )
    thead
      tr
        th(
          v-for="day in days"
          scope="col"
          :abbr="day"
          :title="day"
        )
          span.datepicker-label._day {{ day.slice(0, 2) }}

    tbody
      tr.datepicker-row(
        v-for="row in 6"
        v-if="row !== 6 || !lastRowHidden"
      )
        datepicker-day(
          v-for="column in 7"
          :date="shownDays[dayIndex(row, column)]"
          @dateClicked="$emit('dateClicked', $event)"
        )

</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'vue-property-decorator'
import DatepickerDay from '@/components/DatepickerDay.vue'

@Component({
  components: {
    DatepickerDay,
  },
})
export default class DatepickerGrid extends Vue {
  @Prop() days!: String[]
  @PropSync('focussed') focusDay!: Date
  @PropSync('selected') selectedDay!: Date

  dayIndex(row: number, column: number) {
    return (row - 1) * 7 + (column - 1)
  }

  makeDay(date: Date, focusDay: Date) {
    date = new Date(date)
    let disabled = date.getMonth() != focusDay.getMonth()
    let selected = false
    let day = { date, disabled, selected }

    if (
      date.getFullYear() == this.selectedDay.getFullYear() &&
      date.getMonth() == this.selectedDay.getMonth() &&
      date.getDate() == this.selectedDay.getDate()
    ) {
      day.selected = true
    }

    return day
  }

  lastRowHidden: boolean = false

  get shownDays() {
    let fd = this.focusDay
    let firstDayOfMonth = new Date(fd.getFullYear(), fd.getMonth(), 1)
    let daysInMonth = new Date(fd.getFullYear(), fd.getMonth() + 1, 0).getDate()
    let dayOfWeek = firstDayOfMonth.getDay()
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
}
</script>
