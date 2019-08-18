<template lang="pug">

  .datepicker(
    :class="classes"
  )
    .datepicker-field
      .datepicker-field-input
        datepicker-input(
          ref="input"
          :required="required"
          :value="inputValue"
          @valid="onInputValid"
          @invalid="onInputInvalid"
          @input="onInputChange"
          @blur="onInputBlur"
        )

      .datepicker-field-toggle
        button.datepicker-toggle(
          :id="`datepicker-control_${_uid}`"
          :aria-label="buttonToggleLabel"
          :aria-controls="`datepicker-dialog_${_uid}`"
          :aria-expanded="dialogExpanded"
          @click="onToggleClick"
        )
          slot(name="button-label-toggle")
            .datepicker-label._toggle 📅

    datepicker-dialog(
      ref="dialog"
      v-if="dialogExpanded"
      :focussed="focusDay"
      :selected="selectedDay"
      @focus="onCalendarFocus"
      @input="onCalendarInput"
      @esc="onDialogEsc"
      v-click-outside="onDialogClickOutside"
    )
      template(v-slot:button-label-prev-year)
        slot(name="button-label-prev-year")
      template(v-slot:button-label-prev-month)
        slot(name="button-label-prev-month")
      template(v-slot:button-label-next-month)
        slot(name="button-label-next-month")
      template(v-slot:button-label-next-year)
        slot(name="button-label-next-year")


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
import vClickOutside from 'v-click-outside'
import DatepickerInput from '@/components/DatepickerInput.vue'
import DatepickerDialog from '@/components/DatepickerDialog.vue'

@Component({
  components: {
    DatepickerInput,
    DatepickerDialog,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
})
export default class Datepicker extends Vue {
  @Prop({ default: '' }) value!: string

  @Prop() placeholder?: String
  @Prop({ default: false, type: Boolean }) required?: boolean

  @Ref() input!: HTMLInputElement
  @Ref() dialog!: DatepickerDialog

  focusDay = new Date()
  selectedDay: Date | null = null

  inputValue: string = ''
  inputValid: boolean = false

  touched: boolean = false
  dialogExpanded: boolean = false

  get classes() {
    return {
      _valid: this.isValid,
      _invalid: !this.isValid,
      _required: this.required,
      _touched: this.touched,
    }
  }

  mounted() {
    if (this.value) {
      this.onValueChange(this.value)
    }
  }

  @Watch('value') onValueChange(val: string) {
    this.inputValue = val
  }

  get isValid() {
    return this.inputValid
  }

  // Strings

  private get buttonToggleLabel() {
    let label = 'Choose Date'
    if (this.selectedDay) {
      label += `, selected date is ${this.formatLabelDate(this.selectedDay)}`
    }
    return label
  }

  private formatLabelDate(date: Date) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString(undefined, options)
  }

  private formatReturnDate(date: Date) {
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

  // Input

  private onInputChange(val: string) {
    if (val) {
      this.focusDay = new Date(val)
      this.selectedDay = new Date(val)
    }

    this.$emit('input', val)
  }

  private onInputBlur() {
    this.touched = true
  }

  private onInputValid() {
    this.inputValid = true
  }

  private onInputInvalid() {
    this.inputValid = false
  }

  // Dialog

  @Watch('dialogExpanded') onDialogChange() {
    if (this.dialogExpanded) {
      this.$emit('calendarOpen')
    } else {
      this.$emit('calendarClose')
    }
  }

  openDialog() {
    this.dialogExpanded = true
    this.$nextTick(() => {
      this.dialog.focus()
    })
  }

  closeDialog() {
    this.dialogExpanded = false
  }

  private onDialogEsc() {
    this.dialogExpanded = false
    this.input.focus()
  }

  private onDialogClickOutside() {
    this.dialogExpanded = false
  }

  // Calendar

  private onCalendarInput(d: Date) {
    this.selectedDay = d
    this.inputValue = d ? this.formatReturnDate(d) : ''
    this.closeDialog()
  }

  private onCalendarFocus(d: Date) {
    this.focusDay = d
  }

  // Toggle

  private onToggleClick() {
    if (this.dialogExpanded) {
      this.closeDialog()
    } else {
      this.openDialog()
    }
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

.datepicker-field {
  display: flex;
  position: relative;
}

.datepicker-field-input {
  flex: auto;

  input {
    padding-right: 2em;
    width: 100%;
  }
}

.datepicker-field-toggle {
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

.datepicker-actions {
  display: flex;
  background: white;
  box-shadow: 0 -1px 0 shade(6);

  button {
    flex: auto;
  }
}
</style>

