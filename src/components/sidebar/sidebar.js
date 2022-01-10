import MyComponent from '../components.js';
import thatComponentStyleSheet from './sidebar.css' assert { type: 'css' };
import SidebarButton from '../button/__sidebar/button__sidebar.js';
import ModalWindow from '/src/components/modal-window/modal-window.js';

import defaults from '/src/assets/lib/defaults.js';


export default class Sidebar extends MyComponent {
  
  constructor() {
    super();

    this.text = defaults.texts.help;
    
    this.render();
    this.renderInnerComponents();
    this.renderSideComponents();

    this.initEventListeners();
  }
  
  markup() {
    return `
      <div class="sidebar">
        <div class="sidebar__background" id="sidebar">
          <img src="src/assets/graphics/sidebar.png">
        </div>
        <div class="sidebar__buttons-row"></div>
      </div>
    `;
  }

  render() {
    const selector = '[data-sidebar]';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    this.elem = this.defineElementByItsWrap( selector );
  }

  renderInnerComponents() {
    const buttonNames = [ 'help', 'menu', 'next' ];
    buttonNames.forEach( name => new SidebarButton( name ) );
  }
  
  renderSideComponents() {
    this.modalHelp = new ModalWindow( this.text, '#modal-help');
  }
  
  initEventListeners() {
    this.elem.addEventListener('click', this.actsOfButtons);
  }
  
  actsOfButtons = event => {
    event.preventDefault();
    
    switch ( event.target.id ) {
      case 'sidebar-next': {
        this.actNext();
        break;
      }
      case 'sidebar-menu': {
        this.actMenu();
        break;
      }
      case 'sidebar-help': {
        this.actHelp();
        break;
      }
      case 'sidebar': {
        this.shiftSidebar();
        break;
      }
    }
  }
  
  actNext() {
    this.elem.dispatchEvent(
      new CustomEvent('end-of-round', {bubbles: true})
    );
  }
  
  actMenu() {
    document.querySelector('#start-screen-menu').style.display = 'flex';
    document.querySelector('#blackjack-table').style.display = 'none';
  }
  
  actHelp() {
    this.modalHelp.switchWindowVisibilityState();
  }
  
  shiftSidebar() {
    this.elem.classList.toggle('sidebar_ejected');
  }
}
