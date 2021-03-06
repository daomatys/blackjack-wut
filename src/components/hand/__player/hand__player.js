import MyComponent from '../../components.js';
import thatComponentStyleSheet from './hand__player.css' assert { type: 'css' };


export default class HandPlayer extends MyComponent {
  
  constructor() {
    super();
    this.render();
  }
  
  markup() {
    return `
      <img src="src/assets/graphics/zone_hand.png">
      <div class="holder hand__player allow-drop">
        <div class="subhand subhand__left"></div>
        <div class="subhand subhand__right"></div>
      </div>
    `;
  }

  render() {
    const selector = '[data-zone-player]';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    this.elem = this.defineElementByItsWrap( selector );
  }
}
