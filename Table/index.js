import Round from '../Round/index.js';
import Panel from '../Panel/index.js';
import Menu from '../Menu/index.js';

export default class Table {

  constructor() {
    this.createNewRound();
    this.render();
  }
  
  createNewRound = () => {
    this.round = new Round();
    this.panel = new Panel();
    this.menu = new Menu();
  }
  
  render() {
    document.querySelector('[data-panel]').append( this.panel.elem );
    document.querySelector('[data-menu]').append( this.menu.elem );
  }
}
