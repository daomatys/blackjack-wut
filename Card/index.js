export default class Card {
  
  constructor(card) {
    this.card = card;
    
    this.elem = document.createElement('div');
    
    this.elem.classList.add('card');
    this.elem.ondragstart = () => false;
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.elem.addEventListener('pointerdown', this.onPointerDown);
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
  
  onPointerDown() {
    document.querySelector('.card__title').style.opacity = 1;
    document.addEventListener('pointerup', this.onPointerUp);
  }
  
  onPointerUp() {
    document.querySelector('.card__title').style.opacity = 0;
    document.removeEventListener('pointerup', this.onPointerUp);
  }
}