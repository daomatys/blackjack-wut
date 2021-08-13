export default class Card {
  
  constructor(card) {
    this.rank = card.rank;
    this.suit = card.suit;
    
    this.elem = document.createElement('div');
    this.elem.classList.add('card');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.elem.ondragstart = () => false;
  }
  
  layout() {
    return `
      <div class="card__title">
        <img src="assets/graphics/cards/${ this.rank + this.suit }.png">
      </div>
      <div class="card__back">
        <img src="assets/graphics/cards/back_red.png">
      </div>`;
  }
}
