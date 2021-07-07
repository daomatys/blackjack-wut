import Card from '../Card/index.js';
import Deck from '../Deck/index.js';

export default class Table {

  constructor() {
    this.deck = new Deck();
    this.deckCards = [];
    
    this.createCards();
    this.render();
  }
  
  createCards() {
    // (C)lubs (D)iamonds (H)earts (S)pades (4)
    // 2 3 4 5 6 7 8 9 10 J Q K A (13)
    
    const ranks = [ 'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K' ];
    const suits = [ 'C', 'D', 'H', 'S' ];
    
    for (let suit of suits) {
      for (let rank of ranks) {
        this.deckCards.push({
          rank: rank,
          suit: suit,
          drawn: false
        });
      }
    }
  }
  
  render() {
    const incrust = ( block, suffix ) => {
      document
        .querySelector(`[data-${ suffix }-holder]`)
        .append( block.elem );
    }
    incrust( this.deck, 'deck' );
  }
  
}