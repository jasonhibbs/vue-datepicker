<template lang="pug">

  .datepicker

    .datepicker-text
      input(
        :placeholder="placeholder"
        v-model="inputDate"
        @input="onInput"
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

      datepicker-grid(
        :focussed="focusDay"
        :selected="selectedDay"
        :dayLabels="dayLabels"
        @dateClick="onDateClicked"
        @dateKeydown="onDateKeydown"
      )

      </table>

</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import DatepickerGrid from '@/components/DatepickerGrid.vue'
import { DatepickerGridDay } from './DatepickerDay.vue'

@Component({
  components: {
    DatepickerGrid,
  },
})
export default class Datepicker extends Vue {
  @Prop() placeholder?: String

  focusDay = new Date()
  selectedDay = new Date()

  inputDate: string = this.selectedDay.toISOString().slice(0, 10)

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

  get monthYearLabel() {
    const fd = this.focusDay
    return this.monthLabels[fd.getMonth()] + ' ' + fd.getFullYear()
  }

  onInput() {
    // check validity
    // update calendar
  }

  buttonClicked() {
    // toggle calendar
  }

  onDateClicked(day: DatepickerGridDay) {
    // we should update the focus in any case
    this.focusDay = day.date

    if (!day.disabled) {
      // day was selected
    }
  }

  onDateKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft':
        this.moveFocusToPreviousDay()
        break
      case 'ArrowRight':
        this.moveFocusToNextDay()
        break
      case 'Home':
        this.moveFocusToFirstDayOfWeek()
        break
      case 'End':
        this.moveFocusToLastDayOfWeek()
        break
      case 'ArrowUp':
        this.moveFocusToPreviousWeek()
        break
      case 'ArrowDown':
        this.moveFocusToNextWeek()
        break
      case 'PageUp':
        if (e.shiftKey) {
          this.moveToPreviousYear()
        } else {
          this.moveToPreviousMonth()
        }
        break
      case 'PageDown':
        if (e.shiftKey) {
          this.moveToNextYear()
        } else {
          this.moveToNextMonth()
        }
        break
    }
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

  moveFocusToPreviousDay() {
    this.focusDay = new Date(this.focusDay.setDate(this.focusDay.getDate() - 1))
  }
  moveFocusToNextDay() {
    this.focusDay = new Date(this.focusDay.setDate(this.focusDay.getDate() + 1))
  }
  moveFocusToFirstDayOfWeek() {
    this.focusDay = new Date(
      this.focusDay.setDate(this.focusDay.getDate() - this.focusDay.getDay())
    )
  }
  moveFocusToLastDayOfWeek() {
    this.focusDay = new Date(
      this.focusDay.setDate(
        this.focusDay.getDate() + (6 - this.focusDay.getDay())
      )
    )
  }
  moveFocusToPreviousWeek() {
    this.focusDay = new Date(this.focusDay.setDate(this.focusDay.getDate() - 7))
  }
  moveFocusToNextWeek() {
    this.focusDay = new Date(this.focusDay.setDate(this.focusDay.getDate() + 7))
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

  td:first-child {
    padding-left: 0;
  }
  td:last-child {
    padding-right: 0;
  }
}

.datepicker-cell {
  button {
    background: none;
    line-height: (20/16);
    padding: (8em/16) (10em/16);
    width: 100%;

    &:focus,
    &:hover {
      background: #eee;
    }
  }

  &._today button {
    background: #eee;
  }

  &._selected button {
    background: #ddd;
  }

  &._disabled button {
    color: #aaa;
  }
}
</style>

