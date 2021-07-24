export default class Menu {

  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('menu');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.eventListeners();
  }
  
  layout() {
    return `
      <div class="menu__logo">
        <img src="/assets/logo.png">
      </div>
      <div class="menu__buttons">
        <div class="menu__button" id="menu-button-start">START</div>
        <div class="menu__button" id="menu-button-about">ABOUT</div>
        <div class="menu__button" id="menu-button-home">HOME</div>
      </div>
    `;
  }
  
  eventListeners() {
    this.elem.querySelector('#menu-button-start').addEventListener('pointerdown', this.start);
    this.elem.querySelector('#menu-button-about').addEventListener('pointerdown', this.about);
    this.elem.querySelector('#menu-button-home').addEventListener('pointerdown', this.home);
  }
  
  start = () => {
    document.querySelector('#blackjack-table').style.opacity = 1;
    document.querySelector('#start-menu').style.transform = 'translateX(-2000px)';
  }
}