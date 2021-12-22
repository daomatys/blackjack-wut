import MyComponent from '../components.js';
import thatComponentStyleSheet from './bank.css' assert { type: 'css' };


export default class Bank extends MyComponent {
  
  constructor() {
    super();
    this.render();
  }
  
  markup() {
    return `
      <img src="src/assets/graphics/bank.png">
      <div class="bank">
        <div class="bank__slot" id="slot-1"></div>
        <div class="bank__slot" id="slot-5"></div>
        <div class="bank__slot" id="slot-10"></div>
        <div class="bank__slot" id="slot-25"></div>
        <div class="bank__slot" id="slot-100"></div>
      </div>
    `;
  }

  render() {
    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      element: '[data-bank]',
      markup: this.markup()
    });
  }
}
