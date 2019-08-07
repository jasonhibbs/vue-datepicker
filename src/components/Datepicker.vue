<template lang="pug">

  .datepicker(
    :class="classes"
  )

    .datepicker-text
      input(
        ref="input"
        :placeholder="placeholder"
        :value="inputDate"
        @input="onInput($event.target.value)"
        @blur="onInputBlur"
      )

    .datepicker-control
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
import {
  Component,
  Prop,
  PropSync,
  Ref,
  Vue,
  Watch,
} from 'vue-property-decorator'
import chrono from 'chrono-node'
import DatepickerGrid from '@/components/DatepickerGrid.vue'
import { DatepickerGridDay } from './DatepickerDay.vue'

@Component({
  components: {
    DatepickerGrid,
  },
})
export default class Datepicker extends Vue {
  @Ref() input!: HTMLInputElement
  @PropSync('value') inputDate!: string

  @Prop() placeholder?: String

  get classes() {
    return {}
  }

  mounted() {
    this.checkInput(this.inputDate)
    this.updateValueFromInput()
  }

  inputDay?: Date

  focusDay = new Date()
  selectedDay: Date | null = null

  dayLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
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

  get monthYearLabel(): string {
    const m = this.focusDay.getMonth()
    const y = this.focusDay.getFullYear()
    return `${this.monthLabels[m]} ${y}`
  }

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

  isDate(d?: Date | null) {
    return d instanceof Date && !isNaN(d.getTime())
  }

  parseInput(d: string) {
    let parsed = new Date(d)
    if (chrono) {
      parsed = chrono.en_GB.parseDate(d)
    }
    return parsed
  }

  checkInput(d: string) {
    this.inputDay = this.parseInput(d)
  }

  emitValue(d: Date | null) {
    if (d && this.isDate(d)) {
      this.$emit('input', this.formatDate(d))
    } else {
      this.$emit('input', null)
    }
  }

  get inputValid(): boolean {
    return this.isDate(this.inputDay)
  }

  get isValid() {
    return this.inputDay && this.inputValid
  }

  clearValues() {
    this.focusDay = new Date()
    this.selectedDay = null
    this.emitValue(null)
  }

  updateValues(d: Date) {
    this.focusDay = d
    this.selectedDay = d
    this.emitValue(d)
  }

  updateValueFromInput() {
    if (!this.input.value) {
      this.clearValues()
    }

    // input is valid, update values
    if (this.inputDay && this.inputValid) {
      this.updateValues(this.inputDay)
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
    // day was selected
    if (!day.disabled) {
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
    const d = new Date(this.focusDay)
    this.focusDay = new Date(d.setMonth(d.getMonth() - 1))
  }
  moveToNextMonth() {
    const d = new Date(this.focusDay)
    this.focusDay = new Date(d.setMonth(d.getMonth() + 1))
  }
  moveToPreviousYear() {
    const d = new Date(this.focusDay)
    this.focusDay = new Date(d.setFullYear(d.getFullYear() - 1))
  }
  moveToNextYear() {
    const d = new Date(this.focusDay)
    this.focusDay = new Date(d.setFullYear(d.getFullYear() + 1))
  }
}
</script>

<style lang="scss">
@function em($value, $context: 16) {
  @return (1em * $value) / $context;
}

.datepicker-button {
  appearance: none;
  border-color: transparent;
  cursor: pointer;
  line-height: (22/16);
  padding: em(10) em(4);
}

.datepicker-header {
  display: flex;
  align-items: center;
  text-align: center;

  h2 {
    flex: auto;
    font-size: 1em;
    line-height: (20/16);
    margin: 0;
  }

  button {
    min-width: em(44);
  }
}

.datepicker-label._day {
  display: block;
  color: #888;
  line-height: (22/16);
  font-weight: 500;
  padding: em(4) em(4);
}

.datepicker-grid {
  border-collapse: collapse;
  width: 100%;

  td:first-child {
    padding-left: 0;
  }
  td:last-child {
    padding-right: 0;
  }
}

.datepicker-cell {
  padding: 0;
}

.datepicker-button._date {
  background: none;
  width: 100%;

  &:focus,
  &:hover {
    background: #eee;
  }

  ._disabled & {
    color: #bbb;
  }

  ._weekend & {
    color: #888;
  }

  ._today & {
    border-color: #ddd;
  }

  ._selected & {
    background: #444;
    color: white;
  }
}

.datepicker-label._date {
  font-variant-numeric: tabular-nums;
}
</style>

