import MyComponent from '../components.js';
import thatComponentStyleSheet from './card.css' assert { type: 'css' };


export default class Card extends MyComponent {
  
  constructor( card ) {
    super();

    this.rank = card.rank;
    this.suit = card.suit;

    this.render();

    this.elem.ondragstart = () => false;
  }
  
  markup() {
    return `
      <div class="card">
        <div class="card__title">
          <img src="src/assets/graphics/cards/${ this.rank + this.suit }.png">
        </div>
        <div class="card__back">
          <img src="src/assets/graphics/cards/back_red.png">
        </div>
      </div>
    `;
  }

  render() {
    const selector = '#blackjack-table';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    this.elem = this.defineElementByItsWrap( selector );
  }
}
