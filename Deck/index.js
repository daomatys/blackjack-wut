export default class Deck {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('deck');
    
    this.elem.insertAdjacentHTML(
      'afterbegin',
      this.layoutHands() + 
      this.layoutDeck()
    );
    this.defineDeckLocation();
    this.drawTopCard();
  }
  
  layoutDeck() {
    return `
      <div class="deck">
        <div class="deck__veiled">
          <img src="/assets/cards/back_red_deck.png" width="126px">
        </div>
        <div class="deck__top">
          <img src="/assets/cards/back_red.png" width="120px">
        </div>
      </div>`;
  }
  
  layoutHands() {
    return `
      <div class="hand">
        <div class="hand__robot"></div>
        <div class="hand__playa">
          <img src="/assets/cards/glowing_frame.png" width="120px">
        </div>
      </div>`;
  }
  
  deckSub = suffix => this.elem.querySelector(`.deck__${ suffix }`);
  
  defineDeckLocation() {
    const top = document.documentElement.clientHeight / 2 - 100;
    
    this.deckSub('veiled').style.top = top + 'px';
    this.deckSub('top').style.top = top - 1 + 'px';
  }
  
  drawTopCard() {
    this.elem.ondragstart = () => false;
    
    this.deckSub('top').addEventListener('pointerdown', this.onPointerDown);
  }
  
  onPointerDown = event => {
    event.preventDefault();
    
    this.deckSub('top').style.opacity = 1;
    
    this.playahand = document.querySelector('.hand__playa')
    this.playahand.style.opacity = 1;
    
    this.shiftX = event.clientX - this.deckSub('top').getBoundingClientRect().left;
    this.shiftY = event.clientY - this.deckSub('top').getBoundingClientRect().top;
    
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }
  
  onPointerMove = event => {
    event.preventDefault();
    
    Object.assign( this.deckSub('top').style, {
      top: event.pageY - this.shiftY + 'px',
      left: event.pageX - this.shiftX + 'px',
    });
  }
  
  onPointerUp = event => {
    this.playahand.style.opacity = 0;
    
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }
}