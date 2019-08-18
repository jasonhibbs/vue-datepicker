<template lang="pug">

  .datepicker-dialog(
    role="dialog"
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
      button.datepicker-button(type="button" @click="onTodayClick")
        slot(name="button-label-today")
          .datepicker-label._today Today
      button.datepicker-button(type="button" @click="onClearClick")
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

  onTodayClick() {
    this.$emit('input', new Date())
  }

  onClearClick() {
    this.$emit('input', null)
  }

  onCalendarInput(d: Date) {
    this.$emit('input', d)
  }

  onCalendarFocus(d: Date) {
    this.$emit('focus', d)
  }

  onDialogEsc() {
    this.$emit('esc')
  }
}
</script>
