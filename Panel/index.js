export default class Panel {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('panel');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.eventListeners();
  }
  
  initCounters() {

  }
  
  layout = () => {
    this.arrClickers = [ 'doubled', 'check', 'split', 'hover' ];
    this.arrChipsCounters = [ 0, 0, 0, 0, 0 ];
    this.arrChips = [ 1, 5, 10, 25, 100 ];
    
    const layoutPanelButtons = this.arrClickers
      .map( suffix => `
        <div class="clicker tap" id="${ suffix }">
          <img src="/assets/buttons/button_${ suffix }_off.png">
          <img src="/assets/buttons/button_${ suffix }_on.png" style="opacity:0">
        </div>`)
      .join('');
      
    const layoutChipMachine = this.arrChips
      .map( code => `
        <div class="chip chip-armed chip-${ code }">
          <img src="/assets/chips/chip_${ code }.png">
        </div>`)
      .join('');
      
    const layoutAdderBar = this.arrChips 
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
  
  
  //button actions on scrolldown
  
  
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
    
    rightCard.style.top = cardSplitted.top;
    
    const splitting = rightCard.animate({
      transform: 'translateX(-1px)'
    }, {
      easing: 'ease',
      duration: 500,
      fill: 'both',
      composite: 'add'
    });
    
    splitting.persist();
  }
  
  
  actHover() {
    const cards = document
      .querySelector('.hand__player')
      .querySelectorAll('.card');
    
    const onHoverRotation = card => {
      
      const rotation = card.animate({
        transform: [ 'scale(1)' ,'scale(1.1)', 'perspective( 500px ) rotateY( 0.5turn ) scale(1)' ]
      }, {
        easing: 'ease',
        duration: 1000,
        fill: 'both',
        composite: 'add'
      });
      
      rotation.persist();
    }
    for (let card of cards) card.addEventListener('pointerover', () => onHoverRotation( card ), { once: true });
  }
  
  
  actAdder = suffix => {
    const id = suffix.slice(6);
    
    const slot = document.getElementById(`slot-${ id }`);
    
    const chipBet = document.querySelector(`.chip-${ id }`).cloneNode( true );
    const chipArmed = document.querySelector(`.chip-armed.chip-${ id }`);
    
    chipBet.classList.replace('chip-armed', 'chip-bet');
    
    slot.append( chipBet );
    
    Object.assign( chipBet.style, {
      left: parseInt( this.getRect( chipArmed ).left, 10 ) - parseInt( this.getRect( chipBet ).left, 10 ) + 'px',
      top: parseInt( this.getRect( chipArmed ).top, 10 ) - parseInt( this.getRect( chipBet ).top, 10 ) + 'px',
    });
    
    const num = this.arrChips.indexOf( parseInt( id, 10 ) );
    
    const shiftX = 0.5 * ++this.arrChipsCounters[ num ] - parseInt( chipBet.style.left, 10 ) + 'px';
    const shiftY = - 2 * this.arrChipsCounters[ num ] - parseInt( chipBet.style.top, 10 ) + 'px';
    
    const chipBetJump = chipBet.animate({
      transform: [`translate( ${ shiftX }, ${ shiftY } )`]
    }, {
      easing: 'ease',
      duration: 600,
      fill: 'both',
      composite: 'add'
    });
    chipBetJump.persist();
    
    //chipArmed.style.top = '-90px';
    
    const chipArmedEject = chipArmed.animate({
      transform: ['translateY(90px) rotate(-90deg)', 'translateY(0px)']
    }, {
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      duration: 600,
      fill: 'forwards',
      composite: 'add'
    });
    chipArmedEject.persist();
  }
  
  
  //end of button actions
  
  getRect = elem => elem.getBoundingClientRect();
  
  getRandomInt = num => Math.floor( Math.random() * Math.floor( num ) );
}
