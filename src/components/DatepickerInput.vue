<template lang="pug">

  input.datepicker-input(
    :class="{ _touched: this.touched }"
    ref="input"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    :placeholder="placeholder"
    :required="required"
    @input="onInputChange($event.target.value)"
    @change="onInputChange($event.target.value)"
    @blur="onInputBlur"
  )

</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import chrono from 'chrono-node'

@Component({})
export default class DatepickerInput extends Vue {
  @Prop({ default: '' }) value!: string

  @Prop() placeholder?: String
  @Prop({ default: false, type: Boolean }) required?: boolean

  @Ref() input!: HTMLInputElement

  innerDate: Date | null = null

  parsed: boolean = false
  touched: boolean = false

  @Watch('value') onValueChange(newValue: string) {
    if (newValue !== this.returnDate) {
      this.checkValue(newValue)
      this.updateValue()
    }
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

  private get returnDate(): string {
    return this.innerDate ? this.formatReturnDate(this.innerDate) : ''
  }

  private parseValue(d: string) {
    let parsed = new Date(d)
    if (chrono) {
      parsed = chrono.en_GB.parseDate(d)
    }
    return parsed
  }

  private checkValue(val: string) {
    if (!val) {
      this.innerDate = null
      this.parsed = false
      this.$emit(this.required ? 'invalid' : 'valid')
      return
    }

    let parse = this.parseValue(val)

    if (parse) {
      this.innerDate = parse
      this.parsed = true
      this.$emit('valid')
    } else {
      this.innerDate = null
      this.parsed = false
      this.$emit('invalid')
    }
  }

  private updateValue() {
    if (this.parsed) {
      this.input.value = this.returnDate
    }

    this.$emit('input', this.returnDate)
  }

  private onInputChange(val: string) {
    this.checkValue(val)
    this.$emit('input', this.returnDate)
  }

  private onInputBlur() {
    this.touched = true
    this.updateValue()
    this.$emit('blur')
  }

  focus() {
    this.input.focus()
  }
}
</script>



