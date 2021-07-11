import Card from '../Card/index.js';
import Deck from '../Deck/index.js';

export default class Table {

  constructor() {
    this.deck = new Deck();
    
    this.gameInit();
  }
  
  gameInit() {
    document
      .querySelectorAll('.hand')
      .forEach(item => item.ondragstart = () => false);
    
    this.dealerCardsCount = 0;
    
    this.handDealerValue = 0;
    this.handPlayerValue = 0;
    
    this.incrust( this.deck.elem, 'deck' );
    
    this.setNewDealerCard()
    this.setNewDealerCard()
    
    this.eventListeners();
  }
  
  eventListeners() {
    this.deck
      .elem
      .addEventListener(
        'card-placed',
        ({ detail: data }) => this.setNewPlayerCard( data )
      );
  }
  
  getNewCard() {
    const i = this.getRandomInt( this.deck.cards.length );
    
    const card = new Card( this.deck.cards[i] );
    
    this.deck.cards.splice(i, 1);
    
    return card;
  }
  
  setNewPlayerCard( cardCoords ) {
    const card = this.getNewCard();
    
    this.incrust( card.elem, 'hand-player' );
    
    Object.assign( card.elem.style, {
      left: cardCoords.left,
      top: cardCoords.top,
      transform: `
        translate(
          ${ 60 * ( this.deck.playerCardsCount + 1 ) - parseInt( cardCoords.left, 10 ) + 'px' },
          ${ document.querySelector('.hand__player').getBoundingClientRect().top - parseInt( cardCoords.top, 10 ) + 9 + 'px' }
        )
        rotateY(-180deg)`
    });
    this.handPlayerValue += this.getCardValue( card.rank, this.handPlayerValue );
    console.log(this.handPlayerValue)
  }
  
  setNewDealerCard() {
    const card = this.getNewCard();
    
    this.incrust( card.elem, 'hand-dealer' );
    
    Object.assign( card.elem.style, {
      top: document.documentElement.clientHeight / 2 - 99 + 'px',
      left: document.documentElement.clientWidth / 2 - 69 + 'px',
      transform: `
        translate(
          ${ this.getRect('.hand__dealer').right - this.deck.deckSub('veiled').getBoundingClientRect().right - 60 * ( this.dealerCardsCount ) + 10 + 'px' },
          ${ this.getRect('.hand__dealer').top - this.deck.deckSub('veiled').getBoundingClientRect().top + 16 + 'px' }
        )`
    });
    if ( this.dealerCardsCount++ === 0 ) card.elem.style.transform += 'rotateY(-180deg)';
    
    this.handDealerValue += this.getCardValue( card.rank, this.handDealerValue );
    console.log(this.handDealerValue)
  }
  
  getCardValue( rank, currentValue ) {
    if ( typeof(rank) === 'number' ) return rank;
    
    if ( rank === 'A' ) return currentValue + 11 < 22 ? 11 : 1 ;
    
    return 10;
  }
  
  getRect = sel => document.querySelector( sel ).getBoundingClientRect()
  
  getRandomInt = num => Math.floor( Math.random() * Math.floor( num ) );
  
  incrust = ( block, suffix ) => document.querySelector(`[data-${ suffix }-holder]`).append( block );
}
