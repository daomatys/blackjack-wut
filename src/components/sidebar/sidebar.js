import MyComponent from '../components.js';
import thatComponentStyleSheet from './sidebar.css' assert { type: 'css' };
import SidebarButton from '../button/__sidebar/button__sidebar.js';


export default class Sidebar extends MyComponent {
  
  constructor() {
    super();
    
    this.render();
    this.renderInnerElements();

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

  renderInnerElements() {
    const buttonNames = [ 'next', 'menu', 'help' ];

    buttonNames.forEach( name => new SidebarButton( name ) );
  }
  
  initEventListeners() {
    this.elem.addEventListener('click', this.actsOfButtons);
  }
  
  actsOfButtons = event => {
    event.preventDefault();
    
    switch ( event.target.id ) {
      case 'sidebar': {
        this.shiftSidebar();
        break;
      }
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
    }
  }
  
  actNext() {
    this.elem.dispatchEvent( new CustomEvent('end-of-round', {bubbles: true}));
  }
  
  actMenu() {
    document.querySelector('#start-screen-menu').style.display = 'flex';
    document.querySelector('#blackjack-table').style.display = 'none';
  }
  
  actHelp() {
    
  }
  
  shiftSidebar() {
    this.elem.classList.toggle('sidebar_ejected');
  }
}
