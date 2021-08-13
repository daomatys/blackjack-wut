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
        <img src="/assets/graphics/logos/logo.png">
      </div>
      <div class="menu__button-array">
        <div class="menu__button" id="menu-start">START</div>
        <div class="menu__button" id="menu-about">ABOUT</div>
        <div class="menu__button" id="menu-home">HOME</div>
      </div>
    `;
  }
  
  eventListeners() {
    const selectButton = name => this.elem.querySelector(`#menu-${ name }`)
    
    selectButton('start').addEventListener('pointerdown', this.start);
    selectButton('about').addEventListener('pointerdown', this.about);
    selectButton('home').addEventListener('pointerdown', this.home);
  }
  
  start = () => {
    document.querySelector('#blackjack-table').style.display = 'inline';
    document.querySelector('#start-screen-menu').style.display = 'none';
  }
}
