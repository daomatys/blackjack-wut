import Card from '../Card/index.js';
import Deck from '../Deck/index.js';

export default class Table {

  constructor() {
    this.deck = new Deck();
    
    this.render();
  }
  
  async render() {
    this.dealerCardsCount = 0;
    
    this.incrust( this.deck.elem, 'deck' );
    await window.setTimeout( this.setNewDealerCard(), 1000 );
    await window.setTimeout( this.setNewDealerCard(), 1000 );
    
    this.eventListeners();
  }
  
  eventListeners() {
    this.deck
      .elem
      .addEventListener(
        'card-placed',
        ({ detail: data }) => this.setNewPlayerCard( data )
      );
  }
  
  getNewCard() {
    let i = this.getRandomInt( this.deck.cards.length );
    
    while ( this.deck.cards[i].drawn === true ) 
      i = this.getRandomInt( this.deck.cards.length );
    
    this.deck.cards[i].drawn = true;
    
    return new Card( this.deck.cards[i] );
  }
  
  setNewPlayerCard( cardCoords ) {
    const card = this.getNewCard();
    
    this.incrust( card.elem, 'hand-player' );
    
    Object.assign( card.elem.style, {
      left: cardCoords.left,
      top: cardCoords.top,
      transform: `
        translate(
          ${ 60 * ( this.deck.playerCardsCount + 1 ) - parseInt( cardCoords.left, 10 ) + 'px' },
          ${ document.querySelector('.hand__player').getBoundingClientRect().top - parseInt( cardCoords.top, 10 ) + 9 + 'px' }
        )`
    });
    card.elem.onclick = () => card.elem.querySelector('.card__title').classList.toggle('visible');
  }
  
  setNewDealerCard() {
    const card = this.getNewCard();
    
    this.incrust( card.elem, 'hand-dealer' );
    
    Object.assign( card.elem.style, {
      top: document.documentElement.clientHeight / 2 - 99 + 'px',
      left: document.documentElement.clientWidth / 2 - 69 + 'px',
      transform: `
        translate(
          ${ this.getRect('.hand__dealer').right - this.deck.deckSub('veiled').getBoundingClientRect().right - 60 * ( this.dealerCardsCount ) + 10 + 'px' },
          ${ this.getRect('.hand__dealer').top - this.deck.deckSub('veiled').getBoundingClientRect().top + 16 + 'px' }
        )`
    });
    if ( this.dealerCardsCount++ === 0 ) card.elem.querySelector('.card__title').classList.add('visible');
  }
  
  getRect = sel => document.querySelector( sel ).getBoundingClientRect()
  
  getRandomInt = num => Math.floor( Math.random() * Math.floor( num ) );
  
  incrust = ( block, suffix ) => document.querySelector(`[data-${ suffix }-holder]`).append( block );
  
}
