import MyComponent from '../components.js';
import thatComponentStyleSheet from './menu.css' assert { type: 'css' };
import ModalWindow from '../modal-window/modal-window.js';

import modalWindowsTexts from '../../assets/lib/modalWindowsTexts.js';


export default class Menu extends MyComponent {

  constructor() {
    super();

    this.text = modalWindowsTexts.about;

    this.render();
    this.renderSideComponents();

    this.initEventListeners();
  }
  
  markup() {
    return `
      <div class="menu">
        <div class="menu__logo-wrap">
          <img class="menu__logo" src="src/assets/graphics/logos/logo.png">
        </div>
        <div class="menu__button-array">
          <div class="menu__button" id="menu-start">START</div>
          <div class="menu__button" id="menu-about">ABOUT</div>
          <a class="menu__button" href="https://github.com/daomatys/blackjack-wut" id="menu-home">HOME</div>
        </div>
      </div>
    `;
  }

  render() {
    const selector = '[data-menu]';

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    this.elem = this.defineElementByItsWrap( selector );
  }

  renderSideComponents() {
    this.modalAbout = new ModalWindow( this.text, '#modal-about');
  }
  
  initEventListeners() {
    const selectButton = name => this.elem.querySelector(`#menu-${ name }`);
    
    selectButton('start').addEventListener('pointerdown', this.start);
    selectButton('about').addEventListener('pointerdown', this.about);
  }
  
  start() {
    document.querySelector('#start-screen-menu').style.display = 'none';
    document.querySelector('#blackjack-table').style.display = 'flex';
  }
  
  about = () => {
    this.modalAbout.switchWindowVisibilityState();
  }
}
