import Card from '../Card/index.js';
import Deck from '../Deck/index.js';

export default class Table {

  constructor() {
    this.deck = new Deck();
    
    this.render();
    this.eventListeners();
  }
  
  getRandomInt = num => Math.floor( Math.random() * Math.floor( num ) );
  
  incrust = ( block, suffix ) => document.querySelector(`[data-${ suffix }-holder]`).append( block.elem );
  
  render() {
    this.incrust( this.deck, 'deck' );
  }
  
  setNewPlayerCard( newCardCoords ) {
    let i = this.getRandomInt( this.deck.cards.length );
    
    while ( this.deck.cards[i].drawn === true ) 
      i = this.getRandomInt( this.deck.cards.length );
    
    this.deck.cards[i].drawn = true;
    
    const newCard = new Card( this.deck.cards[i] );
    
    this.incrust( newCard, 'playahand' );
    
    newCard.elem.style.left = newCardCoords.left;
    newCard.elem.style.top = newCardCoords.top;
  }
  
  eventListeners() {
    
    this.deck
      .elem
      .addEventListener('card-placed', ({ detail: data }) => this.setNewPlayerCard( data ));
  }
  
}