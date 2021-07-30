import Card from '../Card/index.js';

export default class Deck {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('deck');
    this.elem.insertAdjacentHTML('afterbegin', this.deckLayout());
    this.elem.ondragstart = () => false;
    
    this.deckGenerate();
    this.deckEventListeners();
  }
  
  deckLayout() {
    return `
      <div class="deck__veiled">
        <img src="/assets/cards/back_red_deck.png">
      </div>
      <div class="deck__top">
        <img src="/assets/cards/back_red.png">
      </div>`;
  }
  
  deckGenerate() {
    this.cards = [];
    
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
  
  deckEventListeners() {
    const deckTop = this.elem.querySelector('.deck__top');
    
    deckTop.addEventListener('pointerdown', this.onPointerDown);
    
    document.body.addEventListener('end-of-player-draw', () => deckTop.removeEventListener('pointerdown', this.onPointerDown), { once: true });
  }
  
  onPointerDown = event => {
    event.preventDefault();
    
    this.shiftX = event.clientX - this.sub('top').getBoundingClientRect().left;
    this.shiftY = event.clientY - this.sub('top').getBoundingClientRect().top;
    
    document.body.append( this.sub('top') );
    
    this.sub('top').style.opacity = 1;
    
    this.topCardScaleOnPick( 1.05 );
    
    Object.assign( this.sub('top').style, {
      top: event.pageY - this.shiftY + 'px',
      left: event.pageX - this.shiftX + 'px',
    });
    
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }
  
  onPointerMove = event => {
    event.preventDefault();
    
    Object.assign( this.sub('top').style, {
      top: event.pageY - this.shiftY + 'px',
      left: event.pageX - this.shiftX + 'px',
    });
  }
  
  onPointerUp = event => {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
    
    this.topCardScaleOnPick( 1 );
    
    this.sub('top').hidden = true;
    const elementBelow = document.elementFromPoint( event.clientX, event.clientY );
    this.sub('top').hidden = false;
    
    if ( elementBelow.closest('[data-zone-player]') ) this.topCardPlaced( elementBelow );
  }
  
  topCardPlaced( elementBelow ) {
    this.elem.dispatchEvent( new CustomEvent('card-placed', {
      detail: {
        left: this.sub('top').style.left,
        top: this.sub('top').style.top,
        card: this.topCardData(),
        below: elementBelow
      },
      bubbles: true
    }));
    
    this.elem.append( this.sub('top') );
    
    this.sub('top').style = 'opacity: 0';
  }
  
  topCardData() {
    const i = Math.floor( Math.random() * this.cards.length );
    
    const card = new Card( this.cards[i] );
    
    this.cards.splice(i, 1);
    
    return card;
  }
  
  topCardScaleOnPick( num ) {
    const zoom = this.sub('top').animate({
      transform: `scale(${ num })`
    }, {
      easing: 'ease',
      duration: 200,
      fill: 'both',
      composite: 'replace'
    });
    zoom.persist();
  }
  
  sub = suffix => document.querySelector(`.deck__${ suffix }`);
}
