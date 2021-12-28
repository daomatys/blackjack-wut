import MyComponent from '../components.js';
import thatComponentStyleSheet from './bank.css' assert { type: 'css' };


export default class Bank extends MyComponent {
  
  constructor() {
    super();
    this.render();
  }
  
  markup() {
    return `
      <div class="bank">
        <div class="bank__slot-row">
          <div class="bank__slot" id="slot-1"></div>
          <div class="bank__slot" id="slot-5"></div>
          <div class="bank__slot" id="slot-10"></div>
          <div class="bank__slot" id="slot-25"></div>
          <div class="bank__slot" id="slot-100"></div>
        </div>
      </div>
    `;
  }

  render() {
    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: '[data-bank]',
      markup: this.markup()
    });
  }
}
