import thatComponentStyleSheet from './deck.css' assert { type: 'css' };
import Card from '../card/card.js';
import MyComponent from '../components.js';


export default class Deck extends MyComponent {
  
  constructor() {
    super();

    this.render();

    this.topCard = document.querySelector('.deck__top');

    this.createFreshDeckCards();
    this.defineDeckInitialPosition();
    
    this.elem.ondragstart = () => false;
  }

  markup() {
    return `
      <div class="deck">
        <div class="deck__veiled">
          <img src="src/assets/graphics/cards/back_red_deck.png">
        </div>
        <div class="deck__top js-allow-drag">
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
  
  createFreshDeckCards() {
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
  
  defineDeckInitialPosition() {
    this.elem.style.transform = 'translate( -280px, -600px )';
  }
  
  initEventListeners() {
    this.topCard.addEventListener('pointerdown', this.initOnPointerDownEvent);
  }
  
  killEventListeners() {
    this.topCard.removeEventListener('pointerdown', this.initOnPointerDownEvent);
  }
  
  initOnPointerDownEvent = event => {
    event.preventDefault();
    
    this.shiftX = event.clientX - this.topCard.getBoundingClientRect().left;
    this.shiftY = event.clientY - this.topCard.getBoundingClientRect().top;
    
    document.getElementById('blackjack-table').append( this.topCard );
    
    this.topCard.style.opacity = 1;
    
    this.scaleTopCardOnPick( 1.05 );
    
    Object.assign( this.topCard.style, {
      top: event.pageY - this.shiftY + 'px',
      left: event.pageX - this.shiftX + 'px',
    });
    
    document.addEventListener('pointermove', this.initOnPointerMoveEvent);
    document.addEventListener('pointerup', this.initOnPointerUpEvent);
  }
  
  initOnPointerMoveEvent = event => {
    event.preventDefault();
    
    Object.assign( this.topCard.style, {
      top: event.pageY - this.shiftY + 'px',
      left: event.pageX - this.shiftX + 'px',
    });
  }
  
  initOnPointerUpEvent = event => {
    document.removeEventListener('pointermove', this.initOnPointerMoveEvent);
    document.removeEventListener('pointerup', this.initOnPointerUpEvent);
    
    this.scaleTopCardOnPick( 1 );
    
    this.topCard.hidden = true;
    const elementBelow = document.elementFromPoint( event.clientX, event.clientY );
    this.topCard.hidden = false;
    
    if ( elementBelow.closest('.allow-drop') ) this.placeTopCard( elementBelow );
  }
  
  placeTopCard( elementBelow ) {
    this.elem.dispatchEvent( new CustomEvent('card-placed', {
      detail: {
        left: this.topCard.style.left,
        top: this.topCard.style.top,
        card: this.defineTopCardData(),
        below: elementBelow
      },
      bubbles: true
    }));
    
    this.elem.append( this.topCard );
    
    this.topCard.style = 'opacity: 0';
  }
  
  defineTopCardData() {
    const i = Math.floor( Math.random() * this.cards.length );
    
    const card = new Card( this.cards[i] );
    
    this.cards.splice( i, 1 );
    
    return card;
  }
  
  scaleTopCardOnPick( num ) {
    const zoom = this.topCard.animate(
      this.animations.card.scale.action( num ),
      this.animations.card.scale.props,
    );
    zoom.persist();
  }

  toggleTopCardDragPossibility() {
    this.topCard.classList.toggle('js-allow-drag');
    this.topCard.classList.toggle('js-deny-drag');
  }
}
