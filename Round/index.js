import Deck from '../Deck/deck.js';
import Panel from '../Panel/panel.js';
import Menu from '../Menu/menu.js';
import Sidebar from '../Sidebar/sidebar.js';

import animations from './animations.js';

export default class Round {
  
  constructor() {
    this.incrustImportedElements();
    
    this.initNewRound();
    this.initNewRoundEventListeners();
  }
  
  initAdditionalValues() {
    this.drawnCards = {
      
      dealer: {
        count: 0,
        value: 0,
        topaces: 0
      },
      
      player: {
        normal: {
          count: 0,
          value: 0,
          topaces: 0
        },
        
        split: {
          left: {
            count: 1,
            value: 0,
            topaces: 0
          },
          
          right: {
            count: 1,
            value: 0,
            topaces: 0
          }
        }
      }
    };
    
    this.results = {
      overdraft: {
        player: false,
        dealer: false
      }
    };
    
    this.indicatorsIndexes = {
      player: 0,
      dealer: 0
    };
    
    this.splitModeState = false;
    
    this.forbidDealerDrawAfterResults = false;
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
    this.initAdditionalValues();
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
    
    for ( let fake of fakeAdders ) this.toggleButtonClickPossibility( fake );
    
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
    this.dealerDrawInterval = setInterval( this.newCardDealerTransition, 700 );
  }
  
  initStageRoundResults = () => {
    const showWinner = text => {
      switch( text ) {
        case 'player': this.indicatorsIndexes = { player: 1, dealer: 2 }; break;
        case 'dealer': this.indicatorsIndexes = { player: 2, dealer: 1 }; break;
        case 'tie': this.indicatorsIndexes = { player: 0, dealer: 0 }; break;
      }
    }
    const valueDealer = this.drawnCards.dealer.value;
    const valuePlayer = this.drawnCards.player.normal.value;
    
    const countDealer = this.drawnCards.dealer.count;
    const countPlayer = this.drawnCards.player.normal.count;
    
    if ( this.results.overdraft.player || this.results.overdraft.dealer ) {
      if ( this.results.overdraft.player && this.results.overdraft.dealer ) {
        showWinner('tie');
      } else {
        if ( this.results.overdraft.player ) showWinner('dealer');
        if ( this.results.overdraft.dealer ) showWinner('player');
      }
    } else {
      if ( countPlayer === countDealer ) {
        if ( valuePlayer === valueDealer ) {
          showWinner('tie');
        } else {
          if ( valuePlayer > valueDealer ) showWinner('player');
          if ( valuePlayer < valueDealer ) showWinner('dealer');
        }
      }
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
    const usedDeck = this.deck.elem;
    
    this.killLastRoundEventListeners();
    this.deck.killEventListeners();
    
    for ( let card of drawnCards ) {
      const cardRemove = card.animate(
        this.animations.card.remove.action,
        this.animations.card.remove.props 
      );
      cardRemove.onfinish = () => elementRemover( card );
    }
    for ( let chip of betChips ) elementRemover( chip );
    for ( let adder of fakeAdders ) this.toggleButtonClickPossibility( adder );
    
    const deckRemove = usedDeck.animate(
      this.animations.deck.remove.action,
      this.animations.deck.remove.props
    );
    deckRemove.onfinish = () => elementRemover( usedDeck );
    
    this.tableShakes.cancel();
    this.bankShifts.cancel();
    
    this.setProperIndicator( this.indicatorsIndexes, 0 );
    
    this.initNewRound();
    this.initNewRoundEventListeners();
    
    function elementRemover( elem ) {
      if ( elem.parentNode ) elem.parentNode.removeChild( elem );
    }
  }
  
  //card animation methods
  
  splitModeStateSwitcher() {
    this.splitModeState = !this.splitModeState;
  }
  
  newCardPlayer( detail ) {
    this.splitModeState
      ? this.initPlayerDrawSplit( detail )
      : this.initPlayerDrawNormal( detail );
  }
  
  initPlayerDrawNormal( cardProps ) {
    const playerHand = document.querySelector('.hand__player');
    const playerHandRect = playerHand.getBoundingClientRect();
    const playerHandCardCount = this.drawnCards.player.normal.count;
    
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
    
    if ( ++this.drawnCards.player.normal.count < 8 ) this.drawnCards.player.normal.value += this.calcCardValue( cardProps.card, this.drawnCards.player.normal.value );
    
    if ( this.drawnCards.player.normal.value > 20 && !this.forbidDealerDrawAfterResults ) {
      if ( this.drawnCards.player.normal.value > 21 ) this.results.overdraft.player = true;
      this.deck.killEventListeners();
      this.initStageDealerDraw();
    }
    console.log( 'playa:', this.drawnCards.player.normal.value );
  }
  
  initPlayerDrawSplit( cardProps ) {
    const subHand = cardProps.below.closest('.subhand');
    const subHandRect = subHand.getBoundingClientRect();
    const subHandCardCount = subHand.classList.contains('subhand__left') ? this.drawnCards.player.count.left++ : this.drawnCards.player.count.right++ ;
    
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
    
  }
  
  newCardPlayerTransition( animationContext ) {
    const card = animationContext.card;
    
    animationContext.parent.append( card.elem );
    
    const cardLeft = parseInt( card.props.left, 10 ) - animationContext.holder.left + 1 + 'px';
    const cardTop = parseInt( card.props.top, 10 ) - animationContext.holder.top + 1 + 'px';
    
    Object.assign( card.elem.style, {
      left: cardLeft,
      top: cardTop
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
    
    const shiftX = -parseInt( cardStyleRight, 10 ) + this.drawnCards.dealer.count * 60 + 'px';
    const shiftY = -parseInt( cardStyleTop, 10 ) + 'px';
    
    this.newCardFlightAnimation( card.elem, shiftX, shiftY );
    
    if ( ++this.drawnCards.dealer.count < 8 ) this.drawnCards.dealer.value += this.calcCardValue( card, this.drawnCards.dealer.value );
    
    if ( this.drawnCards.dealer.value > 19 || this.results.overdraft.player ) {
      if ( this.drawnCards.dealer.value > 21 ) this.results.overdraft.dealer = true;
      clearInterval( this.dealerDrawInterval );
      this.initStageRoundResults();
    }
    console.log( 'dealer:', this.drawnCards.dealer.value );
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
        card.elem.closest('.hand__player')
          ? ++this.drawnCards.player.normal.topaces
          : ++this.drawnCards.dealer.topaces;
        outputValue = 11; 
      } else {
        outputValue = 1;
      }
    }
    if ( outputValue + inputValue > 21 ) {
      if ( card.elem.closest('.hand__player') && this.drawnCards.player.topaces > 0 ) {
        --this.drawnCards.player.normal.topaces;
        outputValue -= 10;
      }
      if ( card.elem.closest('.hand__dealer') && this.drawnCards.dealer.topaces > 0 ) {
        --this.drawnCards.dealer.topaces;
        outputValue -= 10;
      }
    }
    return outputValue;
  }
  
  //utilities
  
  defineRect = sel => document.querySelector( sel ).getBoundingClientRect();
  
  toggleButtonClickPossibility = item => {
    item.classList.toggle('deny-click');
    item.classList.toggle('allow-click');
  }
  
  setProperIndicator = ( indexes, opacity ) => {
    const playerIndicators = document.querySelector('.indicator_player').children;
    const dealerIndicators = document.querySelector('.indicator_dealer').children;
    
    playerIndicators[ indexes.player ].style.opacity = opacity;
    dealerIndicators[ indexes.dealer ].style.opacity = opacity;
  }
}
