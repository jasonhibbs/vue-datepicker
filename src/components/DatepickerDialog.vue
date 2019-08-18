<template lang="pug">

  .datepicker-dialog(
    role="dialog"
    aria-model="true"
    :id="`datepicker-dialog_${$parent._uid}`"
    :aria-labelledby="`datepicker-calendar-label_${$parent._uid}`"
    @keydown.esc="onDialogEsc"
  )
    datepicker-calendar(
      ref="calendar"
      :focussed="focusDay"
      :selected="selectedDay"
      :dayLabels="dayLabels"
      @focus="onCalendarFocus"
      @input="onCalendarInput"
      @tabOut="onFirstButtonTab"
    )
      template(v-slot:button-label-prev-year)
        slot(name="button-label-prev-year")
      template(v-slot:button-label-prev-month)
        slot(name="button-label-prev-month")
      template(v-slot:button-label-next-month)
        slot(name="button-label-next-month")
      template(v-slot:button-label-next-year)
        slot(name="button-label-next-year")

    .datepicker-actions
      button.datepicker-button(
        ref="buttonToday"
        type="button"
        @click="onTodayClick")
        slot(name="button-label-today")
          .datepicker-label._today Today
      button.datepicker-button(
        ref="buttonClear"
        type="button"
        @click="onClearClick"
        @keydown.tab="onLastButtonTab")
        slot(name="button-label-clear")
          .datepicker-label._clear Clear

</template>
<script lang="ts">
import { Component, PropSync, Ref, Vue } from 'vue-property-decorator'
import DatepickerCalendar from '@/components/DatepickerCalendar.vue'
import DatepickerGrid from '@/components/DatepickerGrid.vue'
import { DatepickerGridDay } from './DatepickerDay.vue'

@Component({
  components: {
    DatepickerCalendar,
    DatepickerGrid,
  },
})
export default class DatepickerDialog extends Vue {
  @PropSync('focussed') focusDay!: Date
  @PropSync('selected') selectedDay?: Date

  @Ref() calendar!: DatepickerCalendar
  @Ref() buttonToday!: HTMLButtonElement
  @Ref() buttonClear!: HTMLButtonElement

  dayLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  focus() {
    this.calendar.focus()
  }

  private onTodayClick() {
    this.$emit('input', new Date())
  }

  private onClearClick() {
    this.$emit('input', null)
  }

  private onCalendarInput(d: Date) {
    this.$emit('input', d)
  }

  private onCalendarFocus(d: Date) {
    this.$emit('focus', d)
  }

  private onDialogEsc() {
    this.$emit('esc')
  }

  private onFirstButtonTab() {
    this.buttonClear.focus()
  }

  private onLastButtonTab(e: KeyboardEvent) {
    if (!e.shiftKey) {
      e.preventDefault()
      this.calendar.focusFirstButton()
    }
  }
}
</script>
