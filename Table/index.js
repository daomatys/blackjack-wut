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
    
    document.querySelector('[data-zone-deck]').append( this.deck.elem );
    
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
    document.querySelector('.hand__player').append( data.card.elem );
    
    const x = this.getRect('.hand__player').left * ( this.playerCardsCount + 1 ) - parseInt( data.left, 10 ) + 'px' ;
    
    Object.assign( data.card.elem.style, {
      left: ( parseInt( data.left ) - this.getRect('.hand__player').left + 1 + 'px' ),
      top: ( parseInt( data.top ) - this.getRect('.hand__player').top + 1 + 'px' ),
    });
    
    console.log(x)
    
    this.playerCardsCount < 7
      ? this.playerCardsCount++
      : this.deck.sub('top').removeEventListener('pointerdown', this.deck.onPointerDown);
  }
  
  setNewCard() {
    const card = this.deck.topCardData();
    
  }
  
  getCardValue( card, currentValue ) {
    if ( typeof( card.rank ) === 'number' ) return card.rank;
    
    if ( card.rank === 'A' ) return currentValue + 11 < 22 ? 11 : 1 ;
    
    return 10;
  }
  
  getRect = sel => document.querySelector( sel ).getBoundingClientRect();
  
}
