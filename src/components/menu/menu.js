import MyComponent from '../components.js';
import thatComponentStyleSheet from './menu.css' assert { type: 'css' };


export default class Menu extends MyComponent {

  constructor() {
    super();

    this.elem = document.createElement('div');
    this.elem.classList.add('menu');
    
    this.render();
    this.initEventListeners();
  }
  
  markup() {
    return `
      <div class="menu__logo-wrap">
        <img class="menu__logo" src="src/assets/graphics/logos/logo.png">
      </div>
      <div class="menu__button-array">
        <div class="menu__button" id="menu-start">START</div>
        <div class="menu__button" id="menu-about">ABOUT</div>
        <a class="menu__button" href="https://github.com/daomatys/blackjack-wut" id="menu-home">HOME</div>
      </div>
    `;
  }

  render() {
    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      element: this.elem,
      markup: this.markup()
    });
  }
  
  initEventListeners() {
    const selectButton = name => this.elem.querySelector(`#menu-${ name }`)
    
    selectButton('start').addEventListener('pointerdown', this.start);
    selectButton('about').addEventListener('pointerdown', this.about);
  }
  
  start = () => {
    document.querySelector('#blackjack-table').style.display = 'inline';
    document.querySelector('#start-screen-menu').style.display = 'none';
  }
  
  about = () => {}
}
