import { configure } from '@storybook/vue'
import 'normalize.css'
import './storybook.scss'

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
