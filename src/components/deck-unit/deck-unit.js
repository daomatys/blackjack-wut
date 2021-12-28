import thatComponentStyleSheet from './deck-unit.css' assert { type: 'css' };
import MyComponent from '../components.js';


export default class DeckUnit extends MyComponent {
  
  constructor() {
    super();
    this.render();
  }

  markup() {
    return `
      <div class="indicator indicator__dealer"></div>

      <div class="deck-unit__game-starter">
        <img src="src/assets/graphics/buttons/caller-bank.png">
      </div>
      <div class="deck-unit__deck-socket" data-deck-socket>
        <img src="src/assets/graphics/zone_deck.png">
      </div>

      <div class="indicator indicator__player"></div>
    `;
  }

  render() {
    const selector = '[data-deck-unit]';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    this.elem = this.defineElementByItsWrap( selector );
  }
}
