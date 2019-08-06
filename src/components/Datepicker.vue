<template lang="pug">

  .datepicker

    .datepicker-text
      input(
        :placeholder="placeholder"
        :value="inputDate"
        @input="onInput($event.target.value)"
        @blur="onInputBlur"
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
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import chrono from 'chrono-node'
import DatepickerGrid from '@/components/DatepickerGrid.vue'
import { DatepickerGridDay } from './DatepickerDay.vue'

@Component({
  components: {
    DatepickerGrid,
  },
})
export default class Datepicker extends Vue {
  @Prop() placeholder?: String
  @PropSync('value') inputDate!: string

  // handle value prop
  // @PropSync('value') returnValue?: string

  mounted() {
    // accept initial input
    this.checkInput(this.inputDate)
    this.updateValueFromInput()
  }

  inputDay?: Date

  focusDay = new Date()
  selectedDay: Date | null = null

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

  formatDate(date: Date) {
    const y = date
      .getFullYear()
      .toString()
      .padStart(4, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date
      .getDate()
      .toString()
      .padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  get monthYearLabel(): string {
    const fd = this.focusDay
    return `${this.monthLabels[fd.getMonth()]} ${fd.getFullYear()}`
  }

  parseInput(d: string) {
    let parsed = new Date(d)

    if (chrono) {
      parsed = chrono.en_GB.parseDate(d)
    }

    return parsed
  }

  isDate(d?: Date | null) {
    return d instanceof Date && !isNaN(d.getTime())
  }

  updateValue(d: Date | null) {
    if (d && this.isDate(d)) {
      this.$emit('input', this.formatDate(d))
    } else {
      this.$emit('input', null)
    }
  }

  checkInput(d: string) {
    this.inputDay = this.parseInput(d)
  }

  get inputValid(): boolean {
    return this.isDate(this.inputDay)
  }

  updateValueFromInput() {
    if (this.inputDay && this.inputValid) {
      this.focusDay = this.inputDay
      this.selectedDay = this.inputDay
      this.updateValue(this.inputDay)
    } else {
      this.focusDay = new Date()
      this.selectedDay = null
      this.updateValue(null)
    }
  }

  onInput(d: string) {
    this.checkInput(d)
  }

  onInputBlur() {
    this.updateValueFromInput()
  }

  buttonClicked() {
    // toggle calendar
  }

  onDateClicked(day: DatepickerGridDay) {
    // we should update the focus in any case
    this.focusDay = day.date

    if (!day.disabled) {
      // day was selected
      this.selectedDay = day.date
      this.$emit('input', this.formatDate(day.date))
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

  // header navigation
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

  // move within grid
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

  // move to updated grid
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

