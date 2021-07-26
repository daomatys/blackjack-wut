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
    document.querySelector('#start-menu').style.transform = 'translateX( -2000px )';
    
    const deckFallsDown = document.querySelector('.deck').animate({
      transform: ['translate( -280px, -600px ) scale( 2 )', 'translate( 0px, 0px ) scale( 1 ) rotate( 360deg )']
    }, {
      easing: 'cubic-bezier(0.68, -0.6, 0.32, 1.1)',
      duration: 800,
      fill: 'forwards',
      composite: 'add'
    });
    deckFallsDown.persist();
    
    const tableShakes = document.querySelector('html').animate([
      { transform: 'translate(1px, 1px) rotate(0deg)' },
      { transform: 'translate(-1px, -2px) rotate(-1deg)' },
      { transform: 'translate(-3px, 0px) rotate(1deg)' },
      { transform: 'translate(3px, 2px) rotate(0deg)' },
      { transform: 'translate(1px, -1px) rotate(1deg)' },
      { transform: 'translate(-1px, 2px) rotate(-1deg)' },
      { transform: 'translate(-3px, 1px) rotate(0deg)' },
      { transform: 'translate(3px, 1px) rotate(-1deg)' },
      { transform: 'translate(-1px, -1px) rotate(1deg)' },
      { transform: 'translate(1px, 2px) rotate(0deg)' },
      { transform: 'translate(1px, -2px) rotate(-1deg)' },
      { transform: 'translate(0px, 0px) rotate(0deg)' },
    ], {
      easing: 'ease',
      delay: 710,
      duration: 200,
      fill: 'both',
      composite: 'add'
    });
    
  }
}