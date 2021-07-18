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
    
    this.splitLeverState = false;
  }
  
  initListeners() {
    this.deck.elem.addEventListener(
      'card-placed',
      ({ detail: data }) => this.newCardForPlayer( data )
    );
    document.body.addEventListener('check', this.panelButtonCheck);
    document.body.addEventListener('doubled', this.panelButtonDoubled);
    document.body.addEventListener('split', this.panelButtonSplit);
    document.body.addEventListener('hover', this.panelButtonHover);
  }
  
  cardMovement( cardStyle, shiftX, shiftY ) {
    cardStyle.transform = `
      translate( ${ shiftX }, ${ shiftY } )
      rotateY( -0.5turn )
    `;
  }
  
  modeSplit( data ) {
    
  }
  
  modeNormal( data ) {
    document.querySelector('.hand__player').append( data.card.elem );
    
    const cardStyle = data.card.elem.style;
    
    Object.assign( cardStyle, {
      left: parseInt( data.left, 10 ) - this.getRect('.hand__player').left + 1 + 'px',
      top: parseInt( data.top, 10 ) - this.getRect('.hand__player').top + 1 + 'px'
    });
    const shiftX = -parseInt( cardStyle.left, 10 ) + this.playerCardsCount * 60 + 'px';
    const shiftY = -parseInt( cardStyle.top, 10 ) + 'px';
    
    this.cardMovement( cardStyle, shiftX, shiftY );
    
    this.playerCardsCount < 1
      ? this.newCardForDealer()
      : null;
    
    this.playerCardsCount < 7
      ? this.playerCardsCount++
      : this.deck.sub('top').removeEventListener('pointerdown', this.deck.onPointerDown);
  }
  
  newCardForPlayer( data ) {
    this.splitLeverState
      ? this.modeSplit( data )
      : this.modeNormal( data )
  }
  
  newCardForDealer() {
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
    
    this.cardMovement( cardStyle, shiftX, shiftY );
    
    if ( this.dealerCardsCount < 7 ) this.dealerCardsCount++;
  }
  
  getCardValue( card, currentValue ) {
    if ( typeof( card.rank ) === 'number' ) return card.rank;
    
    if ( card.rank === 'A' ) return currentValue + 11 < 22 ? 11 : 1 ;
    
    return 10;
  }
  
  
  panelButtonHover() {
    const cards = document.querySelector('.hand__player').children;
    
    console.log(cards)
    
    const onHover = ( card ) => {
      card.style.transform = 'rotateY( -0.5turn )';
      card.removeEventListener('pointerover', onHover( card ));
    }
    for (let card of cards) card.addEventListener('pointerover', onHover( card ));
  }
  
  panelButtonSplit() {
    this.splitLeverState = true;
    
    const subHands = `
      <div class="subhand subhand__left"></div>
      <div class="subhand subhand__right"></div>`;
    
    const hand = document.querySelector('.hand__player');
    
    hand.append( subHands );
    
    hand.querySelector('.subhand__left').append( hand.firstChild );
    hand.querySelector('.subhand__right').append( hand.lastChild );
    
    const leftCard = hand.querySelector('.subhand__left').firstChild;
    const rightCard = hand.querySelector('.subhand__right').firstChild;
    
    
  }
  
  getRect = sel => document.querySelector( sel ).getBoundingClientRect();
  
}