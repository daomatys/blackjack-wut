import Bank from '/src/components/bank/bank.js';
import Deck from '/src/components/deck/deck.js';
import Menu from '/src/components/menu/menu.js';
import Panel from '/src/components/panel/panel.js';
import Sidebar from '/src/components/sidebar/sidebar.js';
import DeckUnit from '/src/components/deck-unit/deck-unit.js';
import HandDealer from '/src/components/hand/__dealer/hand__dealer.js';
import HandPlayer from '/src/components/hand/__player/hand__player.js';

import animations from '/src/assets/lib/animations.js';
import defaults from '/src/assets/lib/defaults.js';


export default class Round {
  
  constructor() {
    this.defaults = defaults;
    this.animations = animations;
    
    this.initGeneralComponents();
    this.initControllableComponentsCollections();

    this.initNewRound();
    this.initNewRoundEventListeners();
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

  initControllableComponentsCollections() {
    this.clickers = this.panel.clickersCollection;
    this.adders = this.panel.addersCollection;
  }
  
  initNewRound = () => {
    this.deck = new Deck();
    
    this.panel.defineAdditionalValues();
    this.defineAdditionalValues();
  }
  
  initNewRoundEventListeners() {
    this.deck.elem
      .addEventListener('card-placed', ({ detail }) => this.choosePlayerDrawMode( detail ));
    
    document
      .addEventListener('split', this.activateSplitDrawMode, { once: true });
    
    document
      .addEventListener('first-chip-bet', this.initStageDeckReadyToLand, { once: true });
    
    document
      .addEventListener('end-of-player-draw', this.initStageDealerDraw, { once: true });
    
    document.querySelector('.deck-unit__game-starter')
      .addEventListener('click', this.initStagePlayerDraw, { once: true });
  }
  
  killLastRoundEventListeners() {
    this.deck.elem.removeEventListener('card-placed', ({ detail }) => this.choosePlayerDrawMode( detail ));
    
    document.removeEventListener('split', this.activateSplitDrawMode, { once: true });

    this.deck.killEventListeners();
  }
  
  //round stages section
  
  initStageDeckReadyToLand = () => {
    const starter = document.querySelector('.deck-unit__game-starter');
    
    this.starterAutoDimmer = starter.animate(
      this.animations.starter.autodim.action,
      this.animations.starter.autodim.props
    );
    starter.style.display = 'inline';
  }
  
  initStagePlayerDraw = () => {
    const starter = document.querySelector('.deck-unit__game-starter');
    
    this.switchAddersClickability();
    
    this.deckFalls = document.querySelector('.deck').animate( 
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
      this.launchDealerCardTransition();
      this.deck.initEventListeners();
    }
    this.starterDims.onfinish = () => starter.style.display = 'none';
  }
  
  initStageDealerDraw = () => {
    this.clickers.check.toggleClickPossibility();
    this.dealerDrawInterval = setInterval( this.launchDealerCardTransition, 700 );
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

      this.panel.toggleSplitEntitiesClasses( false );
    }

    this.indicatorsIndexes = this.defineRoundResultsIndication( this.results.normal );
    
    this.defineIndicatorsVisibilityByIndex( this.indicatorsIndexes, 1 );
    
    this.deck.initEventListeners();

    document.addEventListener('end-of-round', this.initStageRoundReset, { once: true });

    if ( !this.sidebar.elem.classList.contains('sidebar_ejected') ) {
      this.sidebar.shiftSidebar();
    }
  }

  defineRoundResultsIndication( resultsState ) {
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
      this.panel.toggleSplitEntitiesClasses( true );
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
    this.initNewRoundEventListeners();
  }

  switchAddersClickability() {
    this.adders.forEach( adder => adder.toggleClickPossibility() );
  }
  
  //round stage side methods
  
  defineAdditionalValues() {
    this.results = this.defaults.results();
    this.drawnCards = this.defaults.hands();
    this.indicatorsIndexes = this.defaults.indicators();
    
    this.firstPairOfCards = []; 
    this.splitModeState = false;
  }
  
  activateSplitDrawMode = () => {
    this.splitModeState = !this.splitModeState;
    
    const dividedNormalValue = this.drawnCards.player.normal.topaces === 0
      ? this.drawnCards.player.normal.value / 2
      : 11 ;
    
    this.drawnCards.player.splitleft.value = dividedNormalValue;
    this.drawnCards.player.splitright.value = dividedNormalValue;
  }
  
  defineRoundResults( playerCards ) {
    const defineWinner = function( playerWon, dealerWon, nobodyWon ) {
      this.player = playerWon,
      this.dealer = dealerWon,
      this.tie = nobodyWon
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
  
  defineIndicatorsVisibilityByIndex = ( indexes, opacity ) => {
    const playerIndicators = document.querySelector('.indicator__player').children;
    const dealerIndicators = document.querySelector('.indicator__dealer').children;
    
    playerIndicators[ indexes.player ].style.opacity = opacity;
    dealerIndicators[ indexes.dealer ].style.opacity = opacity;
  }
  
  //card animation methods
  
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
    }
    this.initPlayerCardTransition( animationContext );
    
    if ( handCards.count < 4 ) {
      this.initFirstPairOfCardsClickerReaction( handCards.count, cardProps.card );
    }
    if ( handCards.count < 8 ) {
      handCards.value += this.calculateCardValue( cardProps.card, handCards.value );
    }
    if ( handCards.value > 20 && !this.drawnCards.dealer.forbiddraw ) {
      this.deck.killEventListeners();
      this.initStageDealerDraw();
      
      if ( handCards.value > 21 ) {
        handCards.overdraft = true;
      }
    }
    console.log( 'playa:', handCards.value );
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
  
  initPlayerDrawSplit( cardProps ) {
    const subhand = cardProps.below.closest('.subhand');
    const subhandRect = subhand.getBoundingClientRect();
    
    const subhandCards = subhand.classList.contains('subhand__left') 
      ? this.drawnCards.player.splitleft
      : this.drawnCards.player.splitright;
    
    const subsideCards = subhand.classList.contains('subhand__right') 
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
    }
    this.initPlayerCardTransition( animationContext );
    
    if ( subhandCards.count < 8 ) {
      subhandCards.value += this.calculateCardValue( cardProps.card, subhandCards.value );
    }
    if ( !this.drawnCards.dealer.forbiddraw ) {
      if ( subhandCards.value > 20 && subsideCards.value > 20 ) {
        this.initStageDealerDraw();
        this.deck.killEventListeners();
      }
      if ( subhandCards.value > 21 ) {
        subhandCards.overdraft = true;
        subhand.classList.remove('allow-drop');
      }
    }
    console.log('playa:', subhandCards.value);
  }
  
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
  
  launchDealerCardTransition = () => {
    const card = this.deck.topCardData();
    const handDealerRect = this.defineRectBySelector('.hand__dealer');
    const deckLandingZoneRect = this.defineRectBySelector('[data-deck-socket]');
    
    document.querySelector('.hand__dealer').insertAdjacentElement('afterbegin', card.elem );
    
    const cardStyle = card.elem.style;
    const cardStyleRight = handDealerRect.right - deckLandingZoneRect.right + 'px';
    const cardStyleTop = handDealerRect.top - deckLandingZoneRect.top + 'px';
    
    Object.assign( cardStyle, {
      left: cardStyleRight,
      top: cardStyleTop
    });
    const shiftX = -parseInt( cardStyleRight, 10 ) + this.drawnCards.dealer.count * 60 + 'px';
    const shiftY = -parseInt( cardStyleTop, 10 ) + 'px';
    
    this.launchCardAnimation( card.elem, shiftX, shiftY );

    ++this.drawnCards.dealer.count;
    
    const handCards = this.drawnCards.dealer;
    
    if ( handCards.count < 8 ) {
      handCards.value += this.calculateCardValue( card, handCards.value );
    }

    if ( handCards.value > 19 || this.drawnCards.player.normal.overdraft ) {
      clearInterval( this.dealerDrawInterval );
      
      handCards.forbiddraw = true;
      
      if ( handCards.value > 21 ) {
        this.drawnCards.dealer.overdraft = true;
      }
      this.initStageRoundResults();
    }
    console.log('dealer:', handCards.value);
  }
  
  launchCardAnimation( elem, shiftX, shiftY ) {
    const flight = elem.animate(
      this.animations.card.flight.action( shiftX, shiftY ),
      this.animations.card.flight.props
    );
    flight.persist();
  }
  
  calculateCardValue( card, inputValue ) {
    let outputValue = 10;

    const caseDigitalRank = typeof card.rank === 'number';
    const caseAceRank = card.rank === 'A';
    const caseOverdraftAfterNextAce = inputValue + 11 > 21;
    const caseOverdraftAfterNextCard = outputValue + inputValue > 21;
    const casePlayerDrawHappend = card.elem.closest('.hand__player');
    const casePlayerDrawWithTopAces = casePlayerDrawHappend && this.drawnCards.player.normal.topaces > 0;
    const caseDealerDrawWithTopAces = card.elem.closest('.hand__dealer') && this.drawnCards.dealer.topaces > 0;
    
    if ( caseDigitalRank ) {
      outputValue = card.rank;
    }

    if ( caseAceRank ) {
      if ( caseOverdraftAfterNextAce ) {
        outputValue = 1;
      }
      if ( !caseOverdraftAfterNextAce ) {
        if ( casePlayerDrawHappend ) {
          ++this.drawnCards.player.normal.topaces
        }
        if ( !casePlayerDrawHappend ) {
          ++this.drawnCards.dealer.topaces;
        }
        outputValue = 11; 
      }
    }

    if ( caseOverdraftAfterNextCard ) {
      if ( casePlayerDrawWithTopAces ) {
        --this.drawnCards.player.normal.topaces;
        outputValue -= 10;
      }
      if ( caseDealerDrawWithTopAces ) {
        --this.drawnCards.dealer.topaces;
        outputValue -= 10;
      }
    }
    
    return outputValue;
  }
  
  //utilities
  
  defineRectBySelector( selector ) {
    return document.querySelector( selector ).getBoundingClientRect();
  }
}
