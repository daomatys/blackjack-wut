import thatComponentStyleSheet from './deck.css' assert { type: 'css' };
import Card from '../card/card.js';
import MyComponent from '../components.js';


export default class Deck extends MyComponent {
  
  constructor() {
    super();

    this.render();
    this.deckGenerate();
    this.applyInitialPosition();

    this.elem.ondragstart = () => false;
  }

  markup() {
    return `
      <div class="deck">
        <div class="deck__veiled">
          <img src="src/assets/graphics/cards/back_red_deck.png">
        </div>
        <div class="deck__top">
          <img src="src/assets/graphics/cards/back_red.png">
        </div>
      </div>
    `;
  }

  render() {
    const selector = '[data-deck-socket]';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    this.elem = this.defineElementByItsWrap( selector );
  }
  
  deckGenerate() {
    const suits = [ 'C', 'D', 'H', 'S' ];
    const ranks = [ 'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K' ];

    this.cards = [];

    suits.forEach(
      suit => ranks.forEach(
        rank => this.cards.push({
          rank: rank,
          suit: suit,
        })
      )
    );
  }
  
  applyInitialPosition() {
    this.elem.style.transform = 'translate( -280px, -600px )';
  }
  
  initEventListeners() {
    this.sub('top').addEventListener('pointerdown', this.onPointerDown);
  }
  
  killEventListeners() {
    this.sub('top').removeEventListener('pointerdown', this.onPointerDown);
  }
  
  onPointerDown = event => {
    event.preventDefault();
    
    this.shiftX = event.clientX - this.sub('top').getBoundingClientRect().left;
    this.shiftY = event.clientY - this.sub('top').getBoundingClientRect().top;
    
    document.getElementById('blackjack-table').append( this.sub('top') );
    
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
    
    if ( elementBelow.closest('.allow-drop') ) this.topCardPlaced( elementBelow );
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
    
    this.cards.splice( i, 1 );
    
    return card;
  }
  
  topCardScaleOnPick( num ) {
    const zoom = this.sub('top').animate(
      this.animations.card.scale.action( num ),
      this.animations.card.scale.props,
    );
    zoom.persist();
  }
  
  sub = suffix => document.querySelector(`.deck__${ suffix }`);
}
