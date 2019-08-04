<template lang="pug">

  .datepicker

    .datepicker-text
      input(
        :placeholder="placeholder"
      )

    .datepicker-button
      button(
        @click="buttonClicked"
      ) Open Calendar

    .datepicker-dialog
      .datepicker-header
        button.datepicker-button._previous-year(
          aria-label="Previous year"
          @click="onPreviousYearClicked"
        ) ⏪
        button.datepicker-button._previous-month(
          aria-label="Previous month"
          @click="onPreviousMonthClicked"
        ) ◀️
        h2.datepicker-label._month-year#id-dialog-label(
          class="monthYear"
          aria-live="polite"
        ) {{ monthYearLabel }}
        button.datepicker-button._next-month(
          aria-label="Next month"
          @click="onNextMonthClicked"
        ) ▶️
        button.datepicker-button._next-year(
          aria-label="Next year"
          @click="onNextYearClicked"
        ) ⏩
      table.datepicker-grid(
        role="grid"
        aria-labelledby="id-dialog-label"
      )
        thead
          tr
            th(
              v-for="day in dayLabels"
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
            )


      </table>

</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import DatepickerDay from '@/components/DatepickerDay.vue'

@Component({
  components: {
    DatepickerDay,
  },
})
export default class Datepicker extends Vue {
  @Prop() placeholder?: String

  dayLabels = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  monthLabels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  focusDay = new Date()
  selectedDay = new Date(0, 0, 1)

  get monthYearLabel() {
    let fd = this.focusDay
    return this.monthLabels[fd.getMonth()] + ' ' + fd.getFullYear()
  }

  dayIndex(row: number, column: number) {
    return (row - 1) * 7 + (column - 1)
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
      let date = new Date(d)
      let disabled = date.getMonth() != fd.getMonth()
      let selected = false
      let day = { date, disabled, selected }

      if (
        date.getFullYear() == this.selectedDay.getFullYear() &&
        date.getMonth() == this.selectedDay.getMonth() &&
        date.getDate() == this.selectedDay.getDate()
      ) {
        day.selected = true
      }

      days.push(day)
      d.setDate(date.getDate() + 1)
    }

    if (dayOfWeek + daysInMonth < 36) {
      this.lastRowHidden = true
    } else {
      this.lastRowHidden = false
    }

    return days
  }

  buttonClicked() {
    console.log('clicked')
  }

  onPreviousMonthClicked(e: Event) {
    this.moveToPreviousMonth()
  }
  onNextMonthClicked(e: Event) {
    this.moveToNextMonth()
  }
  onPreviousYearClicked(e: Event) {
    this.moveToPreviousYear()
  }
  onNextYearClicked(e: Event) {
    this.moveToNextYear()
  }

  moveToPreviousMonth() {
    this.focusDay = new Date(
      this.focusDay.setMonth(this.focusDay.getMonth() - 1)
    )
  }
  moveToNextMonth() {
    this.focusDay = new Date(
      this.focusDay.setMonth(this.focusDay.getMonth() + 1)
    )
  }
  moveToPreviousYear() {
    this.focusDay = new Date(
      this.focusDay.setFullYear(this.focusDay.getFullYear() - 1)
    )
  }
  moveToNextYear() {
    this.focusDay = new Date(
      this.focusDay.setFullYear(this.focusDay.getFullYear() + 1)
    )
  }
}
</script>

<style lang="scss">
.datepicker-header {
  display: flex;
  text-align: center;

  h2 {
    flex: auto;
    font-size: 1em;
    line-height: (20/16);
    margin: 0;
  }
}

.datepicker-grid {
  border-collapse: collapse;

  button {
    line-height: (20/16);
    padding: (8em/16) (10em/16);
    width: 100%;
  }

  td:first-child {
    padding-left: 0;
  }
  td:last-child {
    padding-right: 0;
  }
}
</style>

