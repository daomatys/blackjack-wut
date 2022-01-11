import animations from '../../assets/lib/animations.js';
import defaults from '../../assets/lib/defaults.js';

import Bank from '../../components/bank/bank.js';
import Deck from '../../components/deck/deck.js';
import Menu from '../../components/menu/menu.js';
import Panel from '../../components/panel/panel.js';
import Sidebar from '../../components/sidebar/sidebar.js';
import DeckUnit from '../../components/deck-unit/deck-unit.js';
import HandDealer from '../../components/hand/__dealer/hand__dealer.js';
import HandPlayer from '../../components/hand/__player/hand__player.js';


export default class Round {
  
  constructor() {
    this.defaults = defaults;
    this.animations = animations;
    
    this.initGeneralComponents();
    this.initCollectionsOfControllableComponents();

    this.initNewRound();
  }
  
  initGeneralComponents() {
    this.handPlayer = new HandPlayer();
    this.handDealer = new HandDealer();
    this.deckUnit = new DeckUnit();
    this.sidebar = new Sidebar();
    this.panel = new Panel();
    this.bank = new Bank();
    this.menu = new Menu();
  }

  initCollectionsOfControllableComponents() {
    this.clickers = this.panel.clickersCollection;
    this.adders = this.panel.addersCollection;
  }
  
  initNewRound = () => {
    this.deck = new Deck();

    this.initAdditionalValues();
    this.initNewRoundEventListeners();
  }
  
  initNewRoundEventListeners() {
    this.deck.elem
      .addEventListener('card-placed', ({ detail }) => this.choosePlayerDrawMode( detail ));

    document
      .addEventListener('bank-doubled', this.activateBankDoubling, { once: true });
    
    document
      .addEventListener('split-mode-activated', this.activateSplitDrawMode, { once: true });
    
    document
      .addEventListener('first-chip-bet', this.initStageDeckReadyToLand, { once: true });
    
    document
      .addEventListener('end-of-player-draw', this.initStageDealerDraw, { once: true });
    
    document.querySelector('.deck-unit__game-starter')
      .addEventListener('click', this.initStagePlayerDraw, { once: true });
  }
  
  killLastRoundEventListeners() {
    this.deck.elem
      .removeEventListener('card-placed', ({ detail }) => this.choosePlayerDrawMode( detail ));

    document
      .removeEventListener('split-mode-activated', this.activateSplitDrawMode, { once: true });

    this.deck.killEventListeners();
  }
  

  //round stages
  
  initStageDeckReadyToLand = () => {
    this.starterAutoDimmer = document.querySelector('.deck-unit__game-starter').animate(
      this.animations.starter.autodim.action,
      this.animations.starter.autodim.props
    );
    this.deckUnit.switchStarterDisplayState();
  }
  
  initStagePlayerDraw = () => {
    this.switchAddersClickability();
    
    this.deckFalls = this.deck.elem.animate( 
      this.animations.deck.fall.action,
      this.animations.deck.fall.props 
    );
    this.starterDims = document.querySelector('.deck-unit__game-starter').animate(
      this.animations.starter.dim.action,
      this.animations.starter.dim.props
    );
    this.tableShakes = document.querySelector('#blackjack-table').animate(
      this.animations.table.shake.action,
      this.animations.table.shake.props
    );
    this.bankShifts = document.querySelector('.bank__slot-row').animate(
      this.animations.bank.shift.action,
      this.animations.bank.shift.props
    );
    this.deckFalls.persist();
    this.deckFalls.onfinish = () => {
      this.deck.toggleTopCardDragPossibility();
      this.initAutoDraw( 'dealer', this.drawnCards.dealer );
    }
    this.starterDims.onfinish = () => this.deckUnit.switchStarterDisplayState();
  }
  
  initStageDealerDraw = () => {
    this.deck.toggleTopCardDragPossibility();
    this.clickers.check.toggleClickPossibility();
    this.dealerDrawInterval = setInterval( () => this.initAutoDraw( 'dealer', this.drawnCards.dealer ), 700 );
  }
  
  initStageRoundResults() {
    if ( !this.splitModeState ) {
      this.results.normal = this.defineRoundResults( this.drawnCards.player.normal );
    }
    if ( this.splitModeState ) {
      this.results.left = this.defineRoundResults( this.drawnCards.player.splitleft );
      this.results.right = this.defineRoundResults( this.drawnCards.player.splitright );
      
      Object.assign( this.results.normal, {
        player: this.results.left.player || this.results.right.player,
        dealer: this.results.left.dealer && this.results.right.dealer,
        tie: this.results.left.tie && this.results.right.tie
      });
      this.panel.switchSplitModeState( false );
    }
    this.indicatorsIndexes = this.defineIndicatorsIndexes( this.results.normal );
    this.defineIndicatorsVisibilityByIndex( this.indicatorsIndexes, 1 );

    document
      .addEventListener('end-of-round', this.initStageRoundReset, { once: true });
    
    this.deck.toggleTopCardDragPossibility();

    if ( !this.sidebar.elem.classList.contains('sidebar_ejected') ) {
      this.sidebar.shiftSidebar();
    }
  }
  
  initStageRoundReset = () => {
    const killElement = function removeDOMElementFromDOMTree( elem ) {
      if ( elem.parentNode ) {
        elem.parentNode.removeChild( elem );
      }
    }
    const drawnCards = document.querySelectorAll('.card');
    const betChips = document.querySelectorAll('.chip-bet');
    const usedDeck = this.deck.elem;
    
    if ( this.splitModeState ) {
      this.panel.switchSplitModeState( true );
    }
    this.killLastRoundEventListeners();
    
    this.clickers.hover.toggleClickPossibility();

    drawnCards.forEach( card => {
      const cardRemove = card.animate(
        this.animations.card.remove.action,
        this.animations.card.remove.props 
      );
      cardRemove.onfinish = () => killElement( card );
    });
    betChips.forEach( chip => killElement( chip ) );
    this.switchAddersClickability();
    
    const deckRemove = usedDeck.animate(
      this.animations.deck.remove.action,
      this.animations.deck.remove.props
    );
    deckRemove.onfinish = () => killElement( usedDeck );
    
    this.tableShakes.cancel();
    this.bankShifts.cancel();
    
    this.defineIndicatorsVisibilityByIndex( this.indicatorsIndexes, 0 );
    
    this.initNewRound();
  }

  switchAddersClickability() {
    this.adders.forEach( adder => adder.toggleClickPossibility() );
  }
  

  //round stages side methods
  
  initAdditionalValues() {
    this.results = this.defaults.results();
    this.drawnCards = this.defaults.hands();
    this.indicatorsIndexes = this.defaults.indicators();
    
    this.firstPairOfCards = []; 
    this.splitModeState = false;

    this.panel.initAdditionalValues();
  }

  activateBankDoubling = () => {
    const bankWrap = document.querySelector('.bank');
    const secondBank = bankWrap.querySelector('.bank__slot-row').cloneNode( true );

    Object.assign( secondBank.style, {
      position: 'absolute',
      bottom: '25px',
      left: '45px'
    });
    bankWrap.insertAdjacentElement('beforeend', secondBank);

    this.initAutoDraw( 'player', this.drawnCards.player.normal );
  }
  
  activateSplitDrawMode = () => {
    this.splitModeState = true;

    const caseFirstPairOfAces = this.drawnCards.player.normal.topaces;
    const standardSplitZoneValue = this.drawnCards.player.normal.value / 2;
    const acesSplitZoneValue = 11;
    
    const splitZones = [
      this.drawnCards.player.splitleft,
      this.drawnCards.player.splitright
    ];
    const eachSplitZoneValue = !caseFirstPairOfAces ? standardSplitZoneValue : acesSplitZoneValue ;
    
    splitZones.forEach( zone => zone.value = eachSplitZoneValue )

    if( caseFirstPairOfAces ) {
      splitZones.forEach( zone => zone.topaces = true );
      this.drawnCards.player.normal.topaces = false;
    }
  }
  
  defineRoundResults( playerCards ) {
    const defineWinner = function defineWinner( playerWon, dealerWon, nobodyWon ) {
      this.player = playerWon;
      this.dealer = dealerWon;
      this.tie = nobodyWon;
    }
    const dealerOverdraft = this.drawnCards.dealer.overdraft;
    const dealerValue = this.drawnCards.dealer.value;
    const dealerCount = this.drawnCards.dealer.count;
    
    const playerOverdraft = playerCards.overdraft;
    const playerValue = playerCards.value;
    const playerCount = playerCards.count;
    
    const player = new defineWinner ( 1, 0, 0 );
    const dealer = new defineWinner ( 0, 1, 0 );
    const tie =    new defineWinner ( 0, 0, 1 );
    
    let outputResult = 'attention';

    const caseOverdraft = playerOverdraft || dealerOverdraft;
    const caseValuesEquivalent = playerValue === dealerValue;
    
    if ( caseOverdraft ) {
      if ( dealerOverdraft ) outputResult = player;
      if ( playerOverdraft ) outputResult = dealer;
    }
    if ( !caseOverdraft ) {
      if ( caseValuesEquivalent ) {
        outputResult = tie;
        if ( playerValue === 21 ) {
          if ( playerCount < dealerCount ) {
            outputResult = player;
          }
          if ( playerCount > dealerCount ) {
            outputResult = dealer;
          }
        }
      }
      if ( !caseValuesEquivalent ){
        if ( playerValue > dealerValue ) outputResult = player;
        if ( playerValue < dealerValue ) outputResult = dealer;
      }
    }
    return outputResult;
  }

  defineIndicatorsIndexes( resultsState ) {
    if ( resultsState.player ) {
      return {
        player: 1,
        dealer: 2
      };
    }
    if ( resultsState.dealer ) {
      return {
        player: 2,
        dealer: 1
      };
    }
    if ( resultsState.tie ) {
      return {
        player: 0,
        dealer: 0
      };
    }
  }
  
  defineIndicatorsVisibilityByIndex = ( indexes, opacity ) => {
    const playerIndicators = document.querySelector('.indicator__player').children;
    const dealerIndicators = document.querySelector('.indicator__dealer').children;
    
    playerIndicators[ indexes.player ].style.opacity = opacity;
    dealerIndicators[ indexes.dealer ].style.opacity = opacity;
  }
  

  //card draw methods
  
  choosePlayerDrawMode( cardProps ) {
    if ( !this.splitModeState ) {
      this.initPlayerDrawNormal( cardProps );
      return;
    }
    if ( this.splitModeState ) {
      this.initPlayerDrawSplit( cardProps );
    }
  }
  
  initPlayerDrawNormal( cardProps ) {
    const hand = document.querySelector('.hand__player');
    const handRect = hand.getBoundingClientRect();
    const handCards = this.drawnCards.player.normal;
    
    const animationContext = {
      parent: hand,
      holder: handRect,
      count: handCards.count++,
      card: {
        elem: cardProps.card.elem,
        props: cardProps,
        margin: 60
      }
    };
    this.initPlayerCardTransition( animationContext );
    
    this.checkHandCondition( handCards, cardProps.card, 'player-normal' );
  }

  initPlayerDrawSplit( cardProps ) {
    const subhand = cardProps.below.closest('.subhand');
    const subhandRect = subhand.getBoundingClientRect();

    const caseSubhandLeft = subhand.classList.contains('subhand__left');

    const subhandCards = caseSubhandLeft
      ? this.drawnCards.player.splitleft
      : this.drawnCards.player.splitright;
      
    const animationContext = {
      parent: subhand,
      holder: subhandRect,
      count: subhandCards.count++,
      card: {
        elem: cardProps.card.elem,
        props: cardProps,
        margin: 18
      }
    };
    this.initPlayerCardTransition( animationContext );

    this.checkHandCondition( subhandCards, cardProps.card, 'player-split', caseSubhandLeft );
  }

  initAutoDraw = ( suffix, handCards ) => {
    const caseDealerDraw = suffix === 'dealer';
    const card = this.deck.defineTopCardData();
    const cardStyle = card.elem.style;
    const handRect = this.defineRectBySelector('.hand__' + suffix);
    const handRectSide = caseDealerDraw ? handRect.right : handRect.left ;
    const deckLandingZoneRect = this.defineRectBySelector('[data-deck-socket]');
    const deckLandingZoneRectSide = caseDealerDraw ? deckLandingZoneRect.right : deckLandingZoneRect.left ;
    const multiplier = caseDealerDraw ? 1 : -1 ;
    const note = caseDealerDraw ? '' : '-normal' ;
  
    document.querySelector('.hand__' + suffix).insertAdjacentElement('beforeend', card.elem );
  
    const cardStyleSide = multiplier * (handRectSide - deckLandingZoneRectSide) + 'px';
    const cardStyleTop = multiplier * (handRect.top - deckLandingZoneRect.top) + 'px';
  
    Object.assign( cardStyle, {
      left: cardStyleSide,
      top: cardStyleTop
    });
    const shiftX = -parseInt( cardStyleSide, 10 ) + handCards.count++ * 60 + 'px';
    const shiftY = -parseInt( cardStyleTop, 10 ) + 'px';
    
    this.launchCardAnimation( card.elem, shiftX, shiftY );
    this.checkHandCondition( handCards, card, suffix + note );
  }


  //hand condition control methods

  calculateCardValue( card, handCards ) {
    const inputValue = handCards.value;
    let outputValue = 10;

    const caseDigitalRank = typeof card.rank === 'number';
    const caseAceRank = card.rank === 'A';
    const caseTopAceInHand = handCards.topaces;
    const caseOverdraftAfterNextAce = inputValue + 11 > 21;
    const caseOverdraftAfterNextCard = inputValue + outputValue > 21;
    
    if ( caseDigitalRank ) {
      outputValue = card.rank;
    }
    if ( caseAceRank ) {
      if ( !caseOverdraftAfterNextAce ) {
        handCards.topaces = true;
      }
      outputValue = caseOverdraftAfterNextAce ? 1 : 11 ;
    }
    if ( caseOverdraftAfterNextCard && caseTopAceInHand ) {
      handCards.topaces = false;
      outputValue -= 10;
    }
    return outputValue;
  }

  checkHandCondition( handCards, card, label, caseSubhandLeft ) {
    if ( handCards.count < 8 ) {
      handCards.value += this.calculateCardValue( card, handCards );
    }
    if ( handCards.value > 21 ) {
      handCards.overdraft = true;
    }
    switch( label ) {
      case 'player-normal': {
        this.checkPlayerHandConditionOnNormalDraw( handCards, card );
        break;
      }
      case 'player-split': {
        this.checkPlayerHandConditionOnSplitDraw( handCards, card, caseSubhandLeft );
        break;
      }
      case 'dealer': {
        this.checkDealerHandCondition( handCards );
        break;
      }
    }
    const subhandSuffix = caseSubhandLeft ? '-left:' : '-right:' ;
    const suffix = label === 'player-split' ? subhandSuffix : ':' ;
    const text = label + suffix;

    console.log( text, handCards.value );
  }
  
  checkDealerHandCondition( handCards ) {
    const player = this.drawnCards.player;
    const casePlayerSplitOverdraft = player.splitleft.overdraft && player.splitright.overdraft;
    const casePlayerOverdraft = this.splitModeState ? casePlayerSplitOverdraft : player.normal.overdraft ;
  
    if ( handCards.value > 19 || casePlayerOverdraft ) {
      clearInterval( this.dealerDrawInterval );
      handCards.forbiddraw = true;
      
      this.initStageRoundResults();
    }
  }
  
  checkPlayerHandConditionOnNormalDraw( handCards, card ) {
    if ( handCards.count < 4 ) {
      this.initFirstPairOfCardsClickerReaction( handCards.count, card );
    }
    if ( handCards.value > 20 && !this.drawnCards.dealer.forbiddraw ) {
      this.initStageDealerDraw();
    }
  }
  
  checkPlayerHandConditionOnSplitDraw( subhandCards, card, caseSubhandLeft ) {
    const player = this.drawnCards.player;
    const anotherSubhandCards = !caseSubhandLeft ? player.splitleft : player.splitright ;
    const caseSubhandsOverdraftEdge = subhandCards.value > 20 && anotherSubhandCards.value > 20;
  
    if ( !this.drawnCards.dealer.forbiddraw && caseSubhandsOverdraftEdge ) {
      this.initStageDealerDraw();
    }
  }
  
  initFirstPairOfCardsClickerReaction = ( count, card ) => {
    switch( count ) {
      case 1: {
        this.firstPairOfCards[0] = card.rank; 
        
        this.clickers.doubled.toggleClickPossibility();
        this.clickers.hover.toggleClickPossibility();
        break;
      }
      case 2: {
        this.firstPairOfCards[1] = card.rank;
        
        if ( this.firstPairOfCards[0] === this.firstPairOfCards[1] ) {
          this.clickers.split.toggleClickPossibility();
        }
        if ( document.querySelector('.clicker-doubled .allow-click') ) {
          this.clickers.doubled.toggleClickPossibility();
        }
        this.clickers.check.toggleClickPossibility();
        break;
      }
      case 3: {
        if ( document.querySelector('.clicker-split .allow-click') ) {
          this.clickers.split.toggleClickPossibility();
        }
        break;
      }
    }
  }


  //card transition methods
  
  initPlayerCardTransition( animationContext ) {
    const card = animationContext.card;
    
    animationContext.parent.insertAdjacentElement('beforeend', card.elem );
    
    const cardLeft = parseInt( card.props.left, 10 ) - animationContext.holder.left + 1 + 'px';
    const cardTop = parseInt( card.props.top, 10 ) - animationContext.holder.top + 1 + 'px';
    
    Object.assign( card.elem.style, {
      left: cardLeft,
      top: cardTop
    });
    const shiftX = -parseInt( card.elem.style.left, 10 ) + animationContext.count * animationContext.card.margin + 'px';
    const shiftY = -parseInt( card.elem.style.top, 10 ) + 'px';
    
    this.launchCardAnimation( card.elem, shiftX, shiftY );
  }
  
  launchCardAnimation( elem, shiftX, shiftY ) {
    const flight = elem.animate(
      this.animations.card.flight.action( shiftX, shiftY ),
      this.animations.card.flight.props
    );
    flight.persist();
  }

  
  //utilities
  
  defineRectBySelector( selector ) {
    return document.querySelector( selector ).getBoundingClientRect();
  }
}
