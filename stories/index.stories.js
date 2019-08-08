/* eslint-disable react/react-in-jsx-scope */

// Examples
// https://storybooks-vue.netlify.com
// https://github.com/storybookjs/storybook/tree/next/examples/vue-kitchen-sink

import { storiesOf } from '@storybook/vue'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import Datepicker from '../src/components/Datepicker'

storiesOf('Datepicker', module).add('Default', () => ({
  components: { Datepicker },
  template: `<datepicker placeholder="The beginning of time" v-model="value"></datepicker>`,
  data() {
    return {
      value: '',
    }
  },
}))
