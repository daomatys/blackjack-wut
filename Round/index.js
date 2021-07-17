import Deck from '../Deck/index.js';

export default class Round {
  
  constructor() {
    this.deck = new Deck();
    
    this.initRound();
  }
  
  initRound() {
    this.dealerCardsCount = 0;
    this.dealerCardsValue = 0;
    
    this.playerCardsCount = 0;
    this.playerCardsValue = 0;
    
    this.initListeners();
    
    this.firstAutodraw();
  }
  
  initListeners() {
    this.deck.elem.addEventListener(
      'card-placed',
      ({ detail: data }) => this.setNewPlayerCard( data )
    );
    document.body.addEventListener('check', this.panelButtonCheck);
    document.body.addEventListener('doubled', this.panelButtonDoubled);
    document.body.addEventListener('split', this.panelButtonSplit);
    document.body.addEventListener('hover', this.panelButtonHover);
  }
  
  cardAnimation( cardStyle, shiftX, shiftY, noturn ) {
    cardStyle.transform = `
      translate( ${ shiftX }, ${ shiftY } )
      ${ !noturn ? 'rotateY( -0.5turn )' : '' }
    `;
  }
  
  setNewPlayerCard( data ) {
    document.querySelector('.hand__player').append( data.card.elem );
    
    const cardStyle = data.card.elem.style;
    
    Object.assign( cardStyle, {
      left: parseInt( data.left ) - this.getRect('.hand__player').left + 1 + 'px',
      top: parseInt( data.top ) - this.getRect('.hand__player').top + 1 + 'px'
    });
    
    const shiftX = -parseInt( cardStyle.left, 10 ) + this.playerCardsCount * 60 + 'px';
    const shiftY = -parseInt( cardStyle.top, 10 ) + 'px';
    
    this.cardAnimation( cardStyle, shiftX, shiftY, false );
    
    this.playerCardsCount < 7
      ? this.playerCardsCount++
      : this.deck.sub('top').removeEventListener('pointerdown', this.deck.onPointerDown);
  }
  
  setNewDealerCard( ) {
    const card = this.deck.topCardData();
    
    document.querySelector(`.hand__dealer`).append( card.elem );
    
    const cardStyle = card.elem.style;
    const cardStyleRight = this.getRect(`.hand__dealer`).right - this.getRect('[data-zone-deck]').right + 'px';
    const cardStyleTop = this.getRect(`.hand__dealer`).top - this.getRect('[data-zone-deck]').top + 'px';
    
    Object.assign( cardStyle, {
      left: cardStyleRight,
      top: cardStyleTop
    });
    
    const shiftX = -parseInt( cardStyleRight, 10 ) + this.dealerCardsCount * 60 + 'px';
    const shiftY = -parseInt( cardStyleTop, 10 ) + 'px';
    
    this.cardAnimation( cardStyle, shiftX, shiftY, this.dealerCardsCount === 0 ? false : true );
    
    if ( this.dealerCardsCount < 7 ) this.dealerCardsCount++;
  }
  
  getCardValue( card, currentValue ) {
    if ( typeof( card.rank ) === 'number' ) return card.rank;
    
    if ( card.rank === 'A' ) return currentValue + 11 < 22 ? 11 : 1 ;
    
    return 10;
  }
  
  getRect = sel => document.querySelector( sel ).getBoundingClientRect();
  
  firstAutodraw() {
    for (let i = 0; i < 2; i++) this.setNewDealerCard();
  }
}