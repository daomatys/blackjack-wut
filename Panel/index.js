export default class Panel {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('panel');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.eventListeners();
  }
  
  layout() {
    const clickers = [ 'doubled', 'check', 'split', 'hover' ];
    const chips = [ 1, 5, 10, 25, 100 ];
    
    const layoutPanelButtons = clickers
      .map( suffix => `
        <div class="clicker tap" id="${ suffix }">
          <img src="/assets/buttons/button_${ suffix }_off.png">
          <img src="/assets/buttons/button_${ suffix }_on.png" style="opacity:0">
        </div>`)
      .join('');
      
    const layoutChipMachine = chips
      .map( code => `
        <div class="chip" id="chip-${ code }">
          <img src="/assets/chips/chip_${ code }.png">
        </div>`)
      .join('');
      
    const layoutAdderBar = chips 
      .map( code => `
        <div class="adder tap" id="adder-${ code }">
          <img src="/assets/buttons/adder_off.png">
          <img src="/assets/buttons/adder_on.png" style="opacity:0">
        </div>`)
      .join('');
      
    return `
      <div class="panel__clickers">
      ${ layoutPanelButtons }
      </div>
      <div class="panel__chip-machine">
        <div class="panel__chips">
          ${ layoutChipMachine }
        </div>
        <div class="panel__adders">
          ${ layoutAdderBar }
        </div>
      </div>`;
  }
  
  eventListeners() {
    const clickers = this.elem.querySelectorAll('.clicker');
    const adders = this.elem.querySelectorAll('.adder');
    
    for (let clicker of clickers) clicker.addEventListener('pointerdown', this.actsOfButtons);
    for (let adder of adders) adder.addEventListener('pointerdown', this.actsOfButtons);
  }
  
  actsOfButtons = event => {
    event.preventDefault();
    
    const id = event.target.closest('.tap').id;
    
    this.act( id );
  }

  act( suffix ) {
    const btn = this.elem.querySelector(`#${ suffix }`);
    
    this.switchback( btn );
    
    const btnRelease = () => {
      this.switchback( btn );
      document.removeEventListener('pointerup', btnRelease )
    }
    document.addEventListener('pointerup', btnRelease );
    
    switch (suffix) {
      case 'doubled': this.actDoubled(); break;
      case 'check': this.actCheck(); break;
      case 'split': this.actSplit(); break;
      case 'hover': this.actHover(); break;
      default: this.actAdder( suffix ); break;
    }
  }
  
  switchback( btn ) {
    const imgOn = btn.firstElementChild.style;
    const imgOff = btn.lastElementChild.style;
    
    imgOn.opacity === '0'
    ? ( imgOn.opacity = '1', imgOff.opacity = '0' )
    : ( imgOn.opacity = '0', imgOff.opacity = '1' ); 
  }
  
  actDoubled = () => {
    
  }
  
  actCheck = () => {
    
  }
  
  actSplit = () => {
    document.body.dispatchEvent( new CustomEvent('split', {bubbles: true}) );
    
    const subHands = `
      <div class="subhand subhand__left"></div>
      <div class="subhand subhand__right"></div>`;
    
    const hand = document.querySelector('.hand__player');
    
    hand.insertAdjacentHTML('afterbegin', subHands);
    
    const cardSplitted = { 
      left: hand.lastChild.getBoundingClientRect().left,
      top: hand.lastChild.getBoundingClientRect().top 
    };
    hand.querySelector('.subhand__right').append( hand.lastChild );
    hand.querySelector('.subhand__left').append( hand.lastChild );
    
    const rightCard = hand.querySelector('.subhand__right').lastChild;
    
    rightCard.style = 'left: -210px; transform: rotateY( -0.5turn );';
    
    rightCard.animate({
      transform: 'translateX(-360px)'
    }, {
      easing: 'ease',
      duration: 800,
      fill: 'both',
      composite: 'add'
    });
  }
  
  actHover() {
    const cards = document
      .querySelector('.hand__player')
      .querySelectorAll('.card');
    
    const onHover = card => {
      card.animate({
        transform: [ 'scale(1)', 'scale(1.1)', 'perspective( 500px ) rotateY( -0.5turn )' ]
      }, {
        easing: 'ease',
        duration: 800,
        fill: 'both',
        composite: 'add'
      });
    }
    for (let card of cards) card.addEventListener('pointerover', () => onHover( card ), { once: true });
  }
  
  actAdder = id => {
    
  }
}
