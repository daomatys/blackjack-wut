import MyComponent from '../components.js';
import thatComponentStyleSheet from './indicator.css' assert { type: 'css' };


export default class Indicator extends MyComponent {
  
  constructor() {
    super();
    this.render();
  }
  
  markup() {
    return `
      <img class="indicator__img" src="src/assets/graphics/indicators/indicator_tie.png">
      <img class="indicator__img" src="src/assets/graphics/indicators/indicator_win.png">
      <img class="indicator__img" src="src/assets/graphics/indicators/indicator_lose.png">
      <img class="indicator__img" src="src/assets/graphics/indicators/indicator_test.png">
    `;
  }

  render() {
    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      element: '.indicator',
      markup: this.markup()
    });
  }
}
