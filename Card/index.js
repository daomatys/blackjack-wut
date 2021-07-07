export default class Card {
  
  constructor(card) {
    this.card = card;
    
    this.elem = document.createElement('div');
    this.elem.classList.add('card');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.events();
  }
  
  layout() {
    return `
      <div class="card__back">
        <img src="/assets/cards/back_red.png">
      </div>
      <div class="card__title">
        <img src="/assets/cards/${ this.card.rank + this.card.suit }.png">
      </div>
    `;
  }
  
  events() {
    this.elem.onclick = () => this.elem.querySelector('.card__title').classList.toggle('visible');
    this.elem.ondragstart = () => false;
  }
}