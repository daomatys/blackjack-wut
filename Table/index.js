import Deck from '../Deck/index.js';

export default class Table {

  constructor() {
    this.deck = new Deck();
    
    this.initGame();
  }
  
  initGame() {
    this.dealerCardsCount = 0;
    this.dealerCardsValue = 0;
    
    this.playerCardsCount = 0;
    this.playerCardsValue = 0;
    
    this.incrust( this.deck.elem, 'deck' );
    
    this.setNewCard();
    
    this.eventListeners();
  }
  
  eventListeners() {
    this.deck
      .elem
      .addEventListener(
        'card-placed',
        ({ detail: data }) => this.setNewDraggedCard( data )
      );
  }
  
  setNewDraggedCard( data ) {
    const card = data.card;
  }
  
  setNewCard() {
    const card = this.deck.topCardData();
    
    this.playerCardsCount > 6
      ? this.sub('top').remove()
      : this.playerCardsCount++;
  }
  
  getCardValue( rank, currentValue ) {
    if ( typeof(rank) === 'number' ) return rank;
    
    if ( rank === 'A' ) return currentValue + 11 < 22 ? 11 : 1 ;
    
    return 10;
  }
  
  getRect = sel => document.querySelector( sel ).getBoundingClientRect()
  
  incrust = ( block, suffix ) => document.querySelector(`#zone-${ suffix }`).append( block );
}
