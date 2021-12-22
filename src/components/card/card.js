import MyComponent from '../components.js';
import thatComponentStyleSheet from './card.css' assert { type: 'css' };


export default class Card extends MyComponent {
  
  constructor( card ) {
    super();

    this.rank = card.rank;
    this.suit = card.suit;
    
    this.elem = document.createElement('div');
    this.elem.classList.add('card');
    this.elem.ondragstart = () => false;

    this.render();
  }
  
  markup() {
    return `
      <div class="card__title">
        <img src="src/assets/graphics/cards/${ this.rank + this.suit }.png">
      </div>
      <div class="card__back">
        <img src="src/assets/graphics/cards/back_red.png">
      </div>
    `;
  }

  render() {
    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      element: this.elem,
      markup: this.markup()
    })
  }
}
