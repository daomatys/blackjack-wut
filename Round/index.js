import Deck from '../Deck/index.js';

export default class Round {
  
  constructor() {
    this.deck = new Deck();
    
    this.initRound();
  }
  
  initRound() {
    this.dealerCardsValue = 0;
    this.dealerCardsCount = 0;
    
    this.playerCardsValue = 0;
    this.playerCardsCount = { 
      normal: 0,
      right: 1,
      left: 1
    };
    this.splitModeState = false;
    
    this.initListeners();
  }
  
  initListeners() {
    this.deck.elem.addEventListener(
      'card-placed',
      ({ detail: data }) => this.newCardPlayer( data )
    );
    
    document.addEventListener(
      'split', 
      () => this.splitModeState = true, 
      { once: true }
    );
  }
  
  newCardPlayer( data ) {
    this.splitModeState
      ? this.modeSplit( data )
      : this.modeNormal( data )
  }
  
  modeSplit( data ) {
    const subHand = data.below.closest('.subhand');
    const subHandRect = subHand.getBoundingClientRect();
    const subHandCardCount = subHand.classList.contains('subhand__left') 
      ? this.playerCardsCount.left++ 
      : this.playerCardsCount.right++;
    
    const animationContext = {
      zone: subHand,
      holder: subHandRect,
      card: data.card.elem,
      cardcount: subHandCardCount,
      cardprops: data,
      cardmargin: 18
    }
    this.newCardTransition( animationContext );
  }
  
  modeNormal( data ) {
    const playerHand = document.querySelector('.hand__player');
    const playerHandRect = playerHand.getBoundingClientRect();
    const playerHandCardCount = this.playerCardsCount.normal;
    
    const animationContext = {
      zone: playerHand,
      holder: playerHandRect,
      card: data.card.elem,
      cardcount: playerHandCardCount,
      cardprops: data,
      cardmargin: 60
    }
    if ( this.playerCardsCount.normal < 1 ) this.newCardDealer();
      
    if ( this.playerCardsCount.normal < 7 ) {
      this.newCardTransition( animationContext );
      this.playerCardsCount.normal++;
    } else {
      this.deck.sub('top').removeEventListener('pointerdown', this.deck.onPointerDown);
    }
  }
  
  newCardTransition( animationContext ) {
    const card = animationContext.card;
    const cardProps = animationContext.cardprops;
    
    animationContext.zone.append( card );
    
    Object.assign( card.style, {
      left: parseInt( cardProps.left, 10 ) - animationContext.holder.left + 1 + 'px',
      top: parseInt( cardProps.top, 10 ) - animationContext.holder.top + 1 + 'px'
    });
    
    const shiftX = -parseInt( card.style.left, 10 ) + animationContext.cardcount * animationContext.cardmargin + 'px';
    const shiftY = -parseInt( card.style.top, 10 ) + 'px';
    
    this.newCardMovement( card, shiftX, shiftY );
  }
  
  newCardDealer() {
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
    
    this.newCardMovement( card.elem, shiftX, shiftY );
    
    if ( this.dealerCardsCount < 7 ) this.dealerCardsCount++;
  }
  
  newCardMovement( elem, shiftX, shiftY ) {
    
    const shift = elem.animate({
      transform: [
        'scale( 1.05 )',
        `perspective( 900px ) scale( 1 ) translate( ${ shiftX }, ${ shiftY } ) rotateY( 0.5turn )`
      ]
    }, {
      easing: 'ease',
      duration: 1000,
      fill: 'both',
      composite: 'replace'
    });
    shift.persist();
  }
  
  getCardValue( card, currentValue ) {
    if ( typeof( card.rank ) === 'number' ) return card.rank;
    
    if ( card.rank === 'A' ) return currentValue + 11 < 22 ? 11 : 1 ;
    
    return 10;
  }
  
  getRect = sel => document.querySelector( sel ).getBoundingClientRect();
  
}