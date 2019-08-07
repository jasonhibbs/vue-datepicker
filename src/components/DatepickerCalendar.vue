<template lang="pug">
  .datepicker-calendar
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
        :id="`datepicker-calendar-label_${$parent._uid}`"
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
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import DatepickerGrid from '@/components/DatepickerGrid.vue'
import { DatepickerGridDay } from './DatepickerDay.vue'

@Component({
  components: {
    DatepickerGrid,
  },
})
export default class DatepickerCalendar extends Vue {
  @Prop() dayLabels!: String[]
  @PropSync('focussed') focusDay!: Date
  @PropSync('selected') selectedDay?: Date

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

  updateFocus(d: Date) {
    this.$emit('focus', d)
  }

  updateSelected(d: Date) {
    this.$emit('input', d)
  }

  onDateClicked(day: DatepickerGridDay) {
    // we should update the focus in any case
    this.updateFocus(day.date)

    // day was selected
    if (!day.disabled) {
      this.updateSelected(day.date)
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
    const d = new Date(this.focusDay)
    this.updateFocus(new Date(d.setDate(d.getDate() - 1)))
  }
  moveFocusToNextDay() {
    const d = new Date(this.focusDay)
    this.updateFocus(new Date(d.setDate(d.getDate() + 1)))
  }
  moveFocusToFirstDayOfWeek() {
    const d = new Date(this.focusDay)
    const offset = (d.getDay() + 6) % 7
    this.updateFocus(new Date(d.setDate(d.getDate() - offset)))
  }
  moveFocusToLastDayOfWeek() {
    const d = new Date(this.focusDay)
    const offset = (7 - d.getDay()) % 7
    this.updateFocus(new Date(d.setDate(d.getDate() + offset)))
  }
  moveFocusToPreviousWeek() {
    const d = new Date(this.focusDay)
    this.updateFocus(new Date(d.setDate(d.getDate() - 7)))
  }
  moveFocusToNextWeek() {
    const d = new Date(this.focusDay)
    this.updateFocus(new Date(d.setDate(d.getDate() + 7)))
  }

  // move to updated grid
  moveToPreviousMonth() {
    const d = new Date(this.focusDay)
    this.updateFocus(new Date(d.setMonth(d.getMonth() - 1)))
  }
  moveToNextMonth() {
    const d = new Date(this.focusDay)
    this.updateFocus(new Date(d.setMonth(d.getMonth() + 1)))
  }
  moveToPreviousYear() {
    const d = new Date(this.focusDay)
    this.updateFocus(new Date(d.setFullYear(d.getFullYear() - 1)))
  }
  moveToNextYear() {
    const d = new Date(this.focusDay)
    this.updateFocus(new Date(d.setFullYear(d.getFullYear() + 1)))
  }
}
</script>
