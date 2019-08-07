<template lang="pug">

  .datepicker(
    :class="classes"
  )
    .datepicker-input
      .datepicker-field
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
      datepicker-calendar(
        :focussed="focusDay"
        :selected="selectedDay"
        :dayLabels="dayLabels"
        @focus="onCalendarFocus"
        @input="onCalendarInput"
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
import DatepickerCalendar from '@/components/DatepickerCalendar.vue'
import DatepickerGrid from '@/components/DatepickerGrid.vue'
import { DatepickerGridDay } from './DatepickerDay.vue'

@Component({
  components: {
    DatepickerCalendar,
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

  onCalendarInput(d: Date) {
    this.selectedDay = d
    this.emitValue(d)
  }

  onCalendarFocus(d: Date) {
    this.focusDay = d
  }
}
</script>

<style lang="scss">
@function em($value, $context: 16) {
  @return (1em * $value) / $context;
}

@function shade($value) {
  @return fade-out(black, (100 - $value) / 100);
}

.datepicker-input {
  display: flex;
}

.datepicker-field {
  flex: auto;

  input {
    width: 100%;
  }
}

.datepicker-button {
  appearance: none;
  background-color: transparent;
  border-color: transparent;
  cursor: pointer;
  font-size: 1em;
  line-height: (22/16);
  padding: em(10) em(4);

  &:focus,
  &:hover {
    background: shade(6);
    outline: none;
  }
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
  color: shade(50);
  line-height: (22/16);
  font-weight: 500;
  padding: em(11) em(4);
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
    background: shade(6);
    outline: none;
  }

  ._weekend & {
    color: shade(50);
  }

  ._disabled & {
    color: shade(20);
  }

  ._today & {
    border-color: shade(20);
  }

  ._selected & {
    background: shade(80);
    color: white;
  }
}

.datepicker-label._date {
  font-variant-numeric: tabular-nums;
}
</style>

