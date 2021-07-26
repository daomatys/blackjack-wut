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
      ({ detail: cardOnSpawnProperties }) => this.newCardPlayer( cardOnSpawnProperties )
    );
    
    document.addEventListener(
      'split', 
      () => this.splitModeState = true, 
      { once: true }
    );
    
    document.querySelector('.caller-bank').addEventListener(
      'click',
      this.deckSpawn
    );
  }
  
  deckSpawn() {
    const deckFallsDown = document.querySelector('.deck').animate({
      transform: ['scale( 2 ) rotate( 180deg )', 'translate( 280px, 600px ) scale( 1 ) rotate( -360deg )']
    }, {
      easing: 'cubic-bezier(0.68, -0.6, 0.32, 1.1)',
      duration: 800,
      fill: 'forwards',
      composite: 'add'
    });
    deckFallsDown.persist();
    
    const tableShakes = document.querySelector('html').animate([
      { transform: 'translate(0px, 0px) rotate(0deg)' },
      { transform: 'translate(1px, 1px) rotate(0deg)' },
      { transform: 'translate(-1px, -2px) rotate(-1deg)' },
      { transform: 'translate(-3px, 0px) rotate(1deg)' },
      { transform: 'translate(3px, 2px) rotate(0deg)' },
      { transform: 'translate(1px, -1px) rotate(1deg)' },
      { transform: 'translate(-1px, 2px) rotate(-1deg)' },
      { transform: 'translate(-3px, 1px) rotate(0deg)' },
      { transform: 'translate(3px, 1px) rotate(-1deg)' },
      { transform: 'translate(-1px, -1px) rotate(1deg)' },
      { transform: 'translate(1px, 2px) rotate(0deg)' },
      { transform: 'translate(1px, -2px) rotate(-1deg)' },
      { transform: 'translate(0px, 0px) rotate(0deg)' },
    ], {
      easing: 'ease',
      delay: 710,
      duration: 200,
      fill: 'both',
      composite: 'add'
    });
  }
  
  newCardPlayer( cardOnSpawnProperties ) {
    this.splitModeState
      ? this.modeSplit( cardOnSpawnProperties )
      : this.modeNormal( cardOnSpawnProperties )
  }
  
  modeSplit( cardOnSpawnProperties ) {
    const subHand = cardOnSpawnProperties.below.closest('.subhand');
    const subHandRect = subHand.getBoundingClientRect();
    const subHandCardCount = subHand.classList.contains('subhand__left') 
      ? this.playerCardsCount.left++ 
      : this.playerCardsCount.right++;
    
    const animationContext = {
      parent: subHand,
      holder: subHandRect,
      count: subHandCardCount,
      card: {
        elem: cardOnSpawnProperties.card.elem,
        props: cardOnSpawnProperties,
        margin: 18
      }
    }
    this.newCardPlayerTransition( animationContext );
  }
  
  modeNormal( cardOnSpawnProperties ) {
    const playerHand = document.querySelector('.hand__player');
    const playerHandRect = playerHand.getBoundingClientRect();
    const playerHandCardCount = this.playerCardsCount.normal;
    
    const animationContext = {
      parent: playerHand,
      holder: playerHandRect,
      count: playerHandCardCount,
      card: {
        elem: cardOnSpawnProperties.card.elem,
        props: cardOnSpawnProperties,
        margin: 60
      }
    }
    this.newCardPlayerTransition( animationContext );
    
    this.playerCardsCount.normal < 7 
      ? this.playerCardsCount.normal++
      : this.deck.sub('top').removeEventListener('pointerdown', this.deck.onPointerDown);
  }
  
  newCardPlayerTransition( animationContext ) {
    const card = animationContext.card;
    
    animationContext.parent.append( card.elem );
    
    Object.assign( card.elem.style, {
      left: parseInt( card.props.left, 10 ) - animationContext.holder.left + 1 + 'px',
      top: parseInt( card.props.top, 10 ) - animationContext.holder.top + 1 + 'px'
    });
    
    const shiftX = -parseInt( card.elem.style.left, 10 ) + animationContext.count * animationContext.card.margin + 'px';
    const shiftY = -parseInt( card.elem.style.top, 10 ) + 'px';
    
    this.newCardMovement( card.elem, shiftX, shiftY );
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