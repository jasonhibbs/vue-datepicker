<template lang="pug">

  .datepicker(
    :class="classes"
  )
    .datepicker-input
      .datepicker-input-field
        input(
          ref="input"
          :placeholder="placeholder"
          :required="required"
          :value="inputDate"
          @input="onInput($event.target.value)"
          @change="onInputBlur"
        )

      .datepicker-input-button
        button(
          :id="`datepicker-control_${_uid}`"
          :aria-label="buttonAriaLabel"
          :aria-controls="`datepicker-dialog_${_uid}`"
          :aria-expanded="dialogExpanded"
          @click="buttonClicked"
        )
          slot(name="button-label") 📅

    .datepicker-dialog(
      v-if="dialogExpanded"
      role="dialog"
      :id="`datepicker-dialog_${_uid}`"
      :aria-labelledby="`datepicker-calendar-label_${_uid}`"
      @keydown.esc="onDialogEsc"
    )
      datepicker-calendar(
        :focussed="focusDay"
        :selected="selectedDay"
        :dayLabels="dayLabels"
        @focus="onCalendarFocus"
        @input="onCalendarInput"
      )
        template(v-slot:button-label-prev-year)
        template(v-slot:button-label-prev-month)
        template(v-slot:button-label-next-month)
        template(v-slot:button-label-next-year)

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
  @PropSync('value', { default: '' }) inputDate!: string

  @Prop() placeholder?: String
  @Prop() required?: Boolean

  @Ref() input!: HTMLInputElement

  inputDay?: Date
  focusDay = new Date()
  selectedDay: Date | null = null

  dialogExpanded: boolean = false

  dayLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  get classes() {
    return {}
  }

  mounted() {
    this.checkInput(this.inputDate)
    this.updateValueFromInput()
  }

  formatStringDate(date: Date) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString(undefined, options)
  }

  formatReturnDate(date: Date) {
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
      this.$emit('input', this.formatReturnDate(d))
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

  get buttonAriaLabel() {
    let label = 'Choose Date'
    if (this.selectedDay) {
      label += `, selected date is ${this.formatStringDate(this.selectedDay)}`
    }
    return label
  }

  buttonClicked() {
    this.dialogExpanded = !this.dialogExpanded
  }

  onCalendarInput(d: Date) {
    this.selectedDay = d
    this.emitValue(d)
  }

  onCalendarFocus(d: Date) {
    this.focusDay = d
  }

  onDialogEsc() {
    this.dialogExpanded = false
    this.input.focus()
  }
}
</script>

<style lang="scss">
@function em($value, $context: 16) {
  @return (1em * $value) / $context;
}

@function shade($value, $black: black) {
  @return fade-out($black, (100 - $value) / 100);
}

.datepicker {
  display: block;
  position: relative;
  margin-bottom: em(16);
}

.datepicker-input {
  display: flex;
  position: relative;
}

.datepicker-input-field {
  flex: auto;

  input {
    padding-right: 2em;
    width: 100%;
  }
}

.datepicker-input-button {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;

  button {
    appearance: none;
    background-color: transparent;
    border-color: transparent;
    cursor: pointer;
    height: 100%;
    font-size: 1em;
    padding: em(2) em(4);
  }
}

.datepicker-button {
  appearance: none;
  background-color: transparent;
  border: 1px solid transparent;
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

.datepicker-dialog {
  margin-top: em(16);
  background: white;
  box-shadow: 0 0 0 1px shade(20);
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
  box-shadow: 0 1px 0 shade(6);
}

.datepicker-grid {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;

  td:first-of-type {
    padding-left: 0;
  }
  td:last-of-type {
    padding-right: 0;
  }
}

.datepicker-cell {
  padding: 0;
}

.datepicker-button._date {
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

    &:focus,
    &:hover {
      background: shade(70);
    }
  }
}

.datepicker-label._date {
  font-variant-numeric: tabular-nums;
}
</style>

