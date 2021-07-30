import Deck from '../Deck/index.js';

export default class Round {
  
  constructor() {
    this.deck = new Deck();
    
    this.initRound();
  }
  
  initRound() {
    this.dealerCardsCount = 0;
    this.dealerCardsValue = 0;
    
    this.playerCardsCount = { 
      normal: 0,
      right: 1,
      left: 1
    };
    this.playerCardsValue = {
      normal: 0,
      right: 0,
      left: 0
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
    
    document.addEventListener(
      'first-chip-bet',
      this.onFirstChipEvent,
      { once: true }
    );
    
    document.querySelector('.caller-bank').addEventListener(
      'click',
      this.initStagePlayerDraw,
      { once: true }
    );
    
    document.addEventListener(
      'end-of-player-draw',
      this.initStageDealerDraw,
      { once: true }
    );
  }
  
  onFirstChipEvent() {
    const caller = document.querySelector('.caller-bank');
    const callerAutoDimmer = caller.animate([
      { opacity: 0 },
      { opacity: 1 },
      { opacity: 0 }
    ], {
      duration: 4000,
      iterations: Infinity
    });
    callerAutoDimmer.persist();
    
    caller.style.display = 'inline';
  }
  
  initStagePlayerDraw = () => {
    const deckFallDownUponZone = document.querySelector('.deck').animate({
      transform: [
        'scale( 2 ) rotate( 180deg )', 
        'translate( 280px, 600px ) scale( 1 ) rotate( -360deg )'
      ]
    }, {
      easing: 'cubic-bezier(0.68, -0.6, 0.32, 1.1)',
      duration: 800,
      fill: 'forwards',
      composite: 'add'
    });
    
    const callerDimDown = document.querySelector('.caller-bank').animate({
      opacity: 0
    },{
      duration: 300,
      fill: 'forwards',
      composite: 'replace'
    });
    
    const tableShakes = document.querySelector('html').animate({
      transform: [
        'translate(0px, 0px) rotate(0deg)',
        'translate(1px, 1px) rotate(0deg)',
        'translate(-1px, -2px) rotate(-1deg)',
        'translate(-3px, 0px) rotate(1deg)',
        'translate(3px, 2px) rotate(0deg)',
        'translate(1px, -1px) rotate(1deg)',
        'translate(-1px, 2px) rotate(-1deg)',
        'translate(-3px, 1px) rotate(0deg)',
        'translate(3px, 1px) rotate(-1deg)',
        'translate(-1px, -1px) rotate(1deg)',
        'translate(1px, 2px) rotate(0deg)',
        'translate(1px, -2px) rotate(-1deg)',
        'translate(0px, 0px) rotate(0deg)'
      ]
    }, {
      easing: 'ease',
      delay: 710,
      duration: 200,
      fill: 'both',
      composite: 'add'
    });
    
    const bankMoves = document.querySelector('.bank').animate({
      transform: 'translateY(-100px)'
    }, {
      easing: 'ease',
      duration: 500,
      fill: 'both',
      composite: 'add'
    });
    
    const adders = document.querySelectorAll('.adder');
    
    for ( let adder of adders ) {
      adder.lastElementChild.src = '/assets/buttons/adder_inactive.png';
      
      Object.assign( adder.lastElementChild.style, {
        display: 'inline',
        opacity: 0
      });
      
      adder.lastElementChild.animate({
        opacity: 1
      }, {
        easing: 'ease',
        duration: 500,
        fill: 'both',
        composite: 'replace'
      });
    }
    deckFallDownUponZone.onfinish = this.newCardDealerTransition;
    
    deckFallDownUponZone.persist();
    callerDimDown.persist();
    tableShakes.persist();
    bankMoves.persist();
    
    document.body.dispatchEvent( new CustomEvent('end-of-bet', { bubbles: true }) );
  }
  
  initStageDealerDraw = () => {
    this.dealerDrawInterval = setInterval( this.newCardDealerTransition, 1000 );
  }
  
  initStageGameResults() {
    
  }
  
  newCardPlayer( cardOnSpawnProperties ) {
    this.splitModeState
      ? this.initPlayerDrawSplit( cardOnSpawnProperties )
      : this.initPlayerDrawNormal( cardOnSpawnProperties )
  }
  
  initPlayerDrawNormal( cardProps ) {
    const playerHand = document.querySelector('.hand__player');
    const playerHandRect = playerHand.getBoundingClientRect();
    const playerHandCardCount = this.playerCardsCount.normal;
    
    const animationContext = {
      parent: playerHand,
      holder: playerHandRect,
      count: playerHandCardCount,
      card: {
        elem: cardProps.card.elem,
        props: cardProps,
        margin: 60
      }
    }
    this.newCardPlayerTransition( animationContext );
    
    if ( ++this.playerCardsCount.normal < 8 ) this.playerCardsValue.normal += this.calcCardValue( cardProps.card, this.playerCardsValue.normal );
    
    if ( this.playerCardsValue.normal > 20 ) document.body.dispatchEvent( new CustomEvent('end-of-player-draw', { bubbles: true }) );
    
    console.log( 'playa:', this.playerCardsValue.normal )
  }
  
  initPlayerDrawSplit( cardProps ) {
    const subHand = cardProps.below.closest('.subhand');
    const subHandRect = subHand.getBoundingClientRect();
    const subHandCardCount = subHand.classList.contains('subhand__left') ? this.playerCardsCount.left++ : this.playerCardsCount.right++ ;
    
    const defineSide = value => subHand.classList.contains('subhand__left') ? value.left : value.right ;
    
    const animationContext = {
      parent: subHand,
      holder: subHandRect,
      count: subHandCardCount,
      card: {
        elem: cardProps.card.elem,
        props: cardProps,
        margin: 18
      }
    }
    this.newCardPlayerTransition( animationContext );
    
    if ( defineSide( this.playerCardsValue ) > 20 ) this.initStageDealerDraw();
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
  
  newCardDealerTransition = () => {
    const card = this.deck.topCardData();
    
    document.querySelector(`.hand__dealer`).append( card.elem );
    
    const cardStyle = card.elem.style;
    const cardStyleRight = this.defineRect(`.hand__dealer`).right - this.defineRect('[data-zone-deck]').right + 'px';
    const cardStyleTop = this.defineRect(`.hand__dealer`).top - this.defineRect('[data-zone-deck]').top + 'px';
    
    Object.assign( cardStyle, {
      left: cardStyleRight,
      top: cardStyleTop
    });
    const shiftX = -parseInt( cardStyleRight, 10 ) + this.dealerCardsCount * 60 + 'px';
    const shiftY = -parseInt( cardStyleTop, 10 ) + 'px';
    
    this.newCardMovement( card.elem, shiftX, shiftY );
    
    if ( ++this.dealerCardsCount < 8 ) this.dealerCardsValue += this.calcCardValue( card, this.dealerCardsValue );
    
    if ( this.dealerCardsValue > 19 ) {
       this.initStageGameResults();
       clearInterval( this.dealerDrawInterval );
    }
    
    console.log( 'dealer:', this.dealerCardsValue )
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
  
  calcCardValue( card, inputValue ) {
    let outputValue = 10;
    
    if ( typeof( card.rank ) === 'number' ) outputValue = card.rank;
    
    if ( card.rank === 'A' ) {
      if ( inputValue + 11 < 22 ) {
        card.elem.closest('.hand__player') ? this.playerMaxValuedAce = true : this.dealerMaxValuedAce = true ;
        outputValue = 11; 
      } else {
        outputValue = 1;
      }
    }
    
    if ( outputValue + inputValue > 21 ) {
      if ( card.elem.closest('.hand__player') && this.playerMaxValuedAce ) {
        this.playerMaxValuedAce = false;
         outputValue -= 10;
      }
      if ( card.elem.closest('.hand__dealer') && this.dealerMaxValuedAce ) {
        this.dealerMaxValuedAce = false;
        outputValue -= 10;
      }
    }
    
    return outputValue;
  }
  
  defineRect = sel => document.querySelector( sel ).getBoundingClientRect();
}