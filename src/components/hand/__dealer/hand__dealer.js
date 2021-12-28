import MyComponent from '/src/components/components.js';
import thatComponentStyleSheet from './hand__dealer.css' assert { type: 'css' };


export default class HandDealer extends MyComponent {
  
  constructor() {
    super();
    this.render();
  }
  
  markup() {
    return `
      <img src="src/assets/graphics/zone_hand.png">
      <div class="holder hand__dealer"></div>
    `;
  }

  render() {
    const selector = '[data-zone-dealer]';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    this.elem = this.defineElementByItsWrap( selector );
  }
}
