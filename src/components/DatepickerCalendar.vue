<template lang="pug">
  .datepicker-calendar
    .datepicker-header
      button.datepicker-button._prev-year(
        ref="buttonPrevYear"
        aria-label="Previous year"
        @click="onPreviousYearClicked"
        @keydown.tab="onFirstButtonTab"
      )
        slot(name="button-label-prev-year")
          .datepicker-label._prev-year(style="font-family: emojisymbols") ⏪

      button.datepicker-button._prev-month(
        ref="buttonPrevMonth"
        aria-label="Previous month"
        @click="onPreviousMonthClicked"
      )
        slot(name="button-label-prev-month")
          .datepicker-label._prev-month(style="font-family: emojisymbols") ◀️

      h2.datepicker-label._month-year#id-dialog-label(
        class="monthYear"
        aria-live="polite"
        :id="`datepicker-calendar-label_${$parent._uid}`"
      ) {{ monthYearLabel }}

      button.datepicker-button._next-month(
        ref="buttonNextMonth"
        aria-label="Next month"
        @click="onNextMonthClicked"
      )
        slot(name="button-label-next-month")
          .datepicker-label._next-month(style="font-family: emojisymbols") ▶️

      button.datepicker-button._next-year(
        ref="buttonNextYear"
        aria-label="Next year"
        @click="onNextYearClicked"
      )
        slot(name="button-label-next-year")
          .datepicker-label._next-year(style="font-family: emojisymbols") ⏩

    datepicker-grid(
      ref="grid"
      :focussed="focusDay"
      :selected="selectedDay"
      :dayLabels="dayLabels"
      @dateClick="onDateClicked"
      @dateKeydown="onDateKeydown"
    )
</template>
<script lang="ts">
import { Component, Prop, PropSync, Ref, Vue } from 'vue-property-decorator'
import DatepickerGrid from '@/components/DatepickerGrid.vue'
import { DatepickerGridDay } from './DatepickerDay.vue'

@Component({
  components: {
    DatepickerGrid,
  },
})
export default class DatepickerCalendar extends Vue {
  @PropSync('focussed') focusDay!: Date
  @PropSync('selected') selectedDay?: Date

  @Ref() grid!: DatepickerGrid
  @Ref() buttonPrevYear!: HTMLButtonElement
  @Ref() buttonPrevMonth!: HTMLButtonElement
  @Ref() buttonNextMonth!: HTMLButtonElement
  @Ref() buttonNextYear!: HTMLButtonElement

  @Prop() dayLabels?: String[]

  @Prop({
    default: [
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
    ],
  })
  monthLabels!: String[]

  private get monthYearLabel(): string {
    const m = this.focusDay.getMonth()
    const y = this.focusDay.getFullYear()
    return `${this.monthLabels[m]} ${y}`
  }

  focus() {
    this.grid.focus()
  }

  focusFirstButton() {
    this.buttonPrevYear.focus()
  }

  private onFirstButtonTab(e: KeyboardEvent) {
    if (e.shiftKey) {
      e.preventDefault()
      this.$emit('tabOut')
    }
  }

  private updateFocus(d: Date) {
    this.$emit('focus', d)
  }

  private updateSelected(d: Date) {
    this.$emit('input', d)
  }

  private onDateClicked(day: DatepickerGridDay) {
    // we should update the focus in any case
    this.updateFocus(day.date)

    // day was selected
    if (!day.disabled) {
      this.updateSelected(day.date)
    }
  }

  private onDateKeydown(e: KeyboardEvent) {
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
  private onPreviousMonthClicked(e: Event) {
    this.moveToPreviousMonth()
  }
  private onNextMonthClicked(e: Event) {
    this.moveToNextMonth()
  }
  private onPreviousYearClicked(e: Event) {
    this.moveToPreviousYear()
  }
  private onNextYearClicked(e: Event) {
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
