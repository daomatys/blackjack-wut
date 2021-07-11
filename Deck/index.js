export default class Deck {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('deck');
    this.elem.insertAdjacentHTML('afterbegin', this.layoutDeck());
    
    this.playerCardsCount = 0;
    
    this.deckFill();
    this.deckInitLocation();
    
    this.drawTopCard();
  }
  
  layoutDeck() {
    return `
      <div class="deck__veiled">
        <img src="/assets/cards/back_red_deck.png">
      </div>
      <div class="deck__top">
        <img src="/assets/cards/back_red.png">
      </div>`;
  }
  
  deckSub = suffix => this.elem.querySelector(`.deck__${ suffix }`);
  
  deckFill() {
    this.cards = [];
    
    // (C)lubs (D)iamonds (H)earts (S)pades (4)
    // A 2 3 4 5 6 7 8 9 10 J Q K (13)
    
    const ranks = [ 'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K' ];
    const suits = [ 'C', 'D', 'H', 'S' ];
    
    for (let suit of suits) {
      for (let rank of ranks) {
        this.cards.push({
          rank: rank,
          suit: suit,
        });
      }
    }
  }
  
  deckInitVeiled() {
    Object.assign( this.deckSub('veiled').style, {
      top: this.clientCenterHeight - 96 + 'px',
      right: this.clientCenterWidth - 69 + 'px'
    });
  }
  
  deckInitTop() {
    Object.assign( this.deckSub('top').style, {
      top: this.clientCenterHeight - 97 + 'px',
      left: '',
      right: this.clientCenterWidth - 70 + 'px',
      opacity: 0
    });
  }
  
  deckInitLocation() {
    this.clientCenterHeight = document.documentElement.clientHeight / 2;
    this.clientCenterWidth = document.documentElement.clientWidth / 2;
    
    this.deckInitVeiled();
    this.deckInitTop();
  }
  
  drawTopCard() {
    this.elem.ondragstart = () => false;
    
    this.deckSub('top').addEventListener('pointerdown', this.onPointerDown);
  }
  
  onPointerDown = event => {
    event.preventDefault();
    
    this.deckSub('top').style.opacity = 1;
    
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
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
    
    this.deckSub('top').hidden = true;
    const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.deckSub('top').hidden = false;
    
    if ( elementBelow.closest('.hand__player') ) this.cardPlaced();
  }
  
  cardPlaced() {
    this.dispatchCustomEvent();
    
    this.deckInitTop();
    
    this.playerCardsCount > 6
      ? this.deckSub('top').remove()
      : this.playerCardsCount++;
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
