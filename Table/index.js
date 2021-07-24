import Round from '../Round/index.js';
import Panel from '../Panel/index.js';
import Menu from '../Menu/index.js';

export default class Table {

  constructor() {
    this.round = new Round();
    this.panel = new Panel();
    this.menu = new Menu();
    
    this.deck = this.round.deck;
    
    this.render();
  }
  
  render() {
    document.querySelector('[data-zone-deck]').append( this.deck.elem );
    document.querySelector('[data-panel]').append( this.panel.elem );
    document.querySelector('[data-menu]').append( this.menu.elem );
  }
  
}
