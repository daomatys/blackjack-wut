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
        <img src="/assets/logo-4.png">
      </div>
      <div class="menu__button-array">
        <div class="menu__button" id="menu-start">START</div>
        <div class="menu__button" id="menu-about">ABOUT</div>
        <div class="menu__button" id="menu-home">HOME</div>
      </div>
    `;
  }
  
  eventListeners() {
    const getButton = name => this.elem.querySelector(`#menu-${ name }`)
    
    getButton('start').addEventListener('pointerdown', this.start);
    getButton('about').addEventListener('pointerdown', this.about);
    getButton('home').addEventListener('pointerdown', this.home);
  }
  
  start = () => {
    document.querySelector('#blackjack-table').style.display = 'inline';
    document.querySelector('#start-screen-menu').style.display = 'none';
    
    const deckInitHiddenPosition = document.querySelector('.deck').animate({
      transform: 'translate( -280px, -600px )'
    }, {
      fill: 'forwards',
      composite: 'add'
    });
    deckInitHiddenPosition.persist();
    
  }
}