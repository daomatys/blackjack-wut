import Deck from '../Deck/index.js';
import Panel from '../Panel/index.js';
import Menu from '../Menu/index.js';
import Sidebar from '../Sidebar/index.js';

import animations from './animations.js';

export default class Round {
  
  constructor() {
    this.incrustImportedElements();
    
    this.initNewRound();
    this.initNewRoundEventListeners();
  }
  
  incrustImportedElements() {
    this.animations = animations;
    
    this.panel = new Panel();
    this.menu = new Menu();
    this.sidebar = new Sidebar();
    
    document.querySelector('[data-panel]').append( this.panel.elem );
    document.querySelector('[data-menu]').append( this.menu.elem );
    document.querySelector('[data-sidebar]').append( this.sidebar.elem );
  }
  
  initNewRound = () => {
    this.deck = new Deck();
    
    document.querySelector('[data-zone-deck]').append( this.deck.elem );
    
    this.panel.initAdditionalValues();
    
    this.dealerCardsCount = 0;
    this.dealerCardsValue = 0;
    
    this.playerMaxValuedAce = false;
    this.dealerMaxValuedAce = true;
    
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
    this.indicatorsIndexes = {
      player: 0,
      dealer: 0
    };
    this.splitModeState = false;
    
    this.forbidDealerDrawAfterResults = false;
  }
  
  initNewRoundEventListeners() {
    this.deck.elem.addEventListener('card-placed', ({ detail }) => this.newCardPlayer( detail ));
    
    document.addEventListener('split', this.splitModeStateSwitcher, { once: true });
    
    document.addEventListener('first-chip-bet', this.initStageDeckReadyToLand, { once: true });
    
    document.addEventListener('end-of-player-draw', this.initStageDealerDraw, { once: true });
    
    document.querySelector('.caller-bank').addEventListener('click', this.initStagePlayerDraw, { once: true });
  }
  
  killLastRoundEventListeners() {
    this.deck.elem.removeEventListener('card-placed', ({ detail }) => this.newCardPlayer( detail ));
    
    document.removeEventListener('split', this.splitModeStateSwitcher, { once: true });
  }
  
  initStageDeckReadyToLand = () => {
    const caller = document.querySelector('.caller-bank');
    
    this.callerAutoDimmer = caller.animate(
      this.animations.bankcaller.autodim.action,
      this.animations.bankcaller.autodim.props
    );
    caller.style.display = 'inline';
  }
  
  initStagePlayerDraw = () => {
    const fakeAdders = document.querySelectorAll('.adder__fake');
    const caller = document.querySelector('.caller-bank');
    
    for ( let fake of fakeAdders ) this.toggleBlockOrPierce( fake );
    
    this.deckFalls = document.querySelector('.deck').animate( 
      this.animations.deck.fall.action,
      this.animations.deck.fall.props 
    );
    this.callerDims = document.querySelector('.caller-bank').animate(
      this.animations.bankcaller.dim.action,
      this.animations.bankcaller.dim.props 
    );
    this.tableShakes = document.querySelector('html').animate(
      this.animations.table.shake.action,
      this.animations.table.shake.props
    );
    this.bankShifts = document.querySelector('.bank').animate(
      this.animations.bank.shift.action,
      this.animations.bank.shift.props
    );
    this.deckFalls.persist();
    this.deckFalls.onfinish = () => {
      this.newCardDealerTransition();
      this.deck.initEventListeners();
    }
    this.callerDims.onfinish = () => caller.style.display = 'none';
  }
  
  initStageDealerDraw = () => {
    this.dealerDrawInterval = setInterval( this.newCardDealerTransition, 1000 );
  }
  
  initStageRoundResults = () => {
    const showWinner = text => {
      switch( text ) {
        case 'player': this.indicatorsIndexes = { player: 1, dealer: 2 }; break;
        case 'dealer': this.indicatorsIndexes = { player: 2, dealer: 1 }; break;
        case 'tie': this.indicatorsIndexes = { player: 0, dealer: 0 }; break;
      }
    }
    const valueDealer = this.dealerCardsValue;
    const valuePlayer = this.playerCardsValue.normal;
    
    const countDealer = this.dealerCardsCount;
    const countPlayer = this.playerCardsCount.normal;
    
    if ( valuePlayer > 21 || valueDealer > 21 ) {
      if ( valuePlayer > 21 ) showWinner('dealer');
      if ( valueDealer > 21 ) showWinner('player');
      if ( valuePlayer > 21 && valueDealer > 21 ) showWinner('tie');
    }
    if ( valuePlayer < 22 && valueDealer < 22 && countDealer === countPlayer ) {
      if ( valueDealer > valuePlayer ) showWinner('dealer');
      if ( valueDealer < valuePlayer ) showWinner('player');
      if ( valueDealer === valuePlayer ) showWinner('tie');
    }
    this.forbidDealerDrawAfterResults = true;
    
    this.deck.initEventListeners();
    
    this.setProperIndicator( this.indicatorsIndexes, 1 );
    
    document.addEventListener('end-of-round', this.initStageRoundReset, { once: true });
  }
  
  initStageRoundReset = () => {
    const drawnCards = document.querySelectorAll('.card');
    const fakeAdders = document.querySelectorAll('.adder__fake');
    const betChips = document.querySelectorAll('.chip-bet');
    
    function elementRemover( elem ) { 
      if ( elem.parentNode ) elem.parentNode.removeChild( elem );
    }
    for ( let card of drawnCards ) {
      const cardRemove = card.animate(
        this.animations.card.remove.action,
        this.animations.card.remove.props 
      );
      cardRemove.onfinish = () => elementRemover( card );
    }
    for ( let chip of betChips ) elementRemover( chip );
    for ( let adder of fakeAdders ) this.toggleBlockOrPierce( adder );
    
    this.deckFalls.cancel();
    this.tableShakes.cancel();
    this.bankShifts.cancel();
    
    this.setProperIndicator( this.indicatorsIndexes, 0 );
    
    this.killLastRoundEventListeners();
    this.deck.killEventListeners();
    
    document.querySelector('[data-zone-deck]').removeChild( this.deck.elem );
    
    this.initNewRound();
    this.initNewRoundEventListeners();
  }
  
  //card animation methods
  
  splitModeStateSwitcher() {
    this.splitModeState = !this.splitModeState;
  }
  
  newCardPlayer( detail ) {
    const cardOnSpawnProperties = detail;
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
    
    if ( this.playerCardsValue.normal > 20 && !this.forbidDealerDrawAfterResults ) {
      this.deck.killEventListeners();
      
      this.initStageDealerDraw();
    }
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
    
    this.newCardFlightAnimation( card.elem, shiftX, shiftY );
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
    
    this.newCardFlightAnimation( card.elem, shiftX, shiftY );
    
    if ( ++this.dealerCardsCount < 8 ) this.dealerCardsValue += this.calcCardValue( card, this.dealerCardsValue );
    
    if ( this.dealerCardsValue > 19 ) {
       clearInterval( this.dealerDrawInterval );
       
       this.initStageRoundResults();
    }
    console.log( 'dealer:', this.dealerCardsValue )
  }
  
  newCardFlightAnimation( elem, shiftX, shiftY ) {
    const flight = elem.animate({
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
    flight.persist();
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
  
  //utilities
  
  defineRect = sel => document.querySelector( sel ).getBoundingClientRect();
  
  toggleBlockOrPierce = item => item.classList.contains('block-mode')
    ? item.classList.replace('block-mode', 'pierce-mode')
    : item.classList.replace('pierce-mode', 'block-mode');
  
  setProperIndicator = ( indexes, opacity ) => {
    const playerIndicators = document.querySelector('.indicator_player').children;
    const dealerIndicators = document.querySelector('.indicator_dealer').children;
    
    playerIndicators[ indexes.player ].style.opacity = opacity;
    dealerIndicators[ indexes.dealer ].style.opacity = opacity;
  }
}
