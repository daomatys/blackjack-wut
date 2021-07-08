export default class Deck {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('deck');
    this.elem.insertAdjacentHTML('afterbegin', this.layoutHands() + this.layoutDeck());
    
    this.playerCardsCount = 0;
    
    this.deckFill();
    this.deckLocation();
    
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
  
  handSub = suffix => this.elem.querySelector(`.hand__${ suffix }`);
  
  deckFill() {
    this.cards = [];
    
    // (C)lubs (D)iamonds (H)earts (S)pades (4)
    // 2 3 4 5 6 7 8 9 10 J Q K A (13)
    
    const ranks = [ 'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K' ];
    const suits = [ 'C', 'D', 'H', 'S' ];
    
    for (let suit of suits) {
      for (let rank of ranks) {
        this.cards.push({
          rank: rank,
          suit: suit,
          drawn: false
        });
      }
    }
  }
  
  deckLocation() {
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
    this.handSub('playa').style.opacity = 1;
    
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
    this.handSub('playa').style.opacity = 0;
    
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
    
    this.deckSub('top').hidden = true;
    const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.deckSub('top').hidden = false;
    
    if ( elementBelow.closest('.hand__playa') ) this.cardPlaced();
  }
  
  cardPlaced() {
    this.dispatchCustomEvent();
    
    Object.assign( this.deckSub('top').style, {
      left: '',
      right: '49px',
      top: document.documentElement.clientHeight / 2 - 100 + 'px',
      opacity: 0
    });
    
    if ( 1 + this.playerCardsCount < 8 ) {
      this.playerCardsCount++;
      this.handSub('playa').style.left = 60 * ( this.playerCardsCount + 1 ) + 'px';
    } else {
      this.handSub('playa').remove();
      this.deckSub('top').remove();
    }
  }
  
  dispatchCustomEvent() {
    this.elem.dispatchEvent( new CustomEvent('card-placed', {
      detail: {
        left: this.deckSub('top').style.left,
        top: this.deckSub('top').style.top 
      },
      bubbles: true
    }));
  }
}
