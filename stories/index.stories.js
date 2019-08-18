/* eslint-disable react/react-in-jsx-scope */

// Examples
// https://storybooks-vue.netlify.com
// https://github.com/storybookjs/storybook/tree/next/examples/vue-kitchen-sink

import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import Datepicker from '../src/components/Datepicker'
import DatepickerInput from '../src/components/DatepickerInput'

storiesOf('DatepickerInput', module).add('Default', () => ({
  components: { DatepickerInput },
  template: `<datepicker-input v-model="value"></datepicker-input>`,
  data() {
    return {
      value: '',
    }
  },
}))

storiesOf('Datepicker', module)
  .add('Default', () => ({
    components: { Datepicker },
    template: `
      <datepicker
        v-model="value"
        @input="onInput"
        @calendarOpen="onCalendarOpen"
        @calendarClose="onCalendarClose"
      ></datepicker>
    `,
    data() {
      return {
        value: '',
      }
    },
    methods: {
      onInput: action('input', event),
      onCalendarOpen: action('calendar-open'),
      onCalendarClose: action('calendar-close'),
    },
  }))
  .add('Slots', () => ({
    components: { Datepicker },
    template: `
      <datepicker placeholder="Placeholder" v-model="value">
        <template v-slot:button-label-prev-month>←</template>
        <template v-slot:button-label-next-month>→</template>
        <template v-slot:button-label-prev-year>←←</template>
        <template v-slot:button-label-next-year>→→</template>
        <template v-slot:button-label-toggle>📆</template>
        <template v-slot:button-label-today>⭕️</template>
        <template v-slot:button-label-clear>❌</template>
      </datepicker>
    `,
    data() {
      return {
        value: '',
      }
    },
  }))
