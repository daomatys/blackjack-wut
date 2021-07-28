export default class Panel {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('panel');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.eventListeners();
  }
  
  layout = () => {
    this.arrClickers = [ 'doubled', 'check', 'split', 'hover' ];
    this.arrChipsCounters = [ 0, 0, 0, 0, 0 ];
    this.arrChips = [ 1, 5, 10, 25, 100 ];
    
    const layoutPanelButtons = this.arrClickers
      .map( suffix => `
        <div class="clicker tap" id="${ suffix }">
          <img src="/assets/buttons/button_${ suffix }_off.png" style="display: inline">
          <img src="/assets/buttons/button_${ suffix }_on.png" style="display: none">
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
          <img src="/assets/buttons/adder_off.png" style="display: inline">
          <img src="/assets/buttons/adder_on.png" style="display: none">
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
    
    document.body.addEventListener('end-of-bet', () => {
      for (let adder of adders) adder.removeEventListener('pointerdown', this.actsOfButtons);
    }, { 
      once: true 
    });
  }
  
  changeButtonDisplayState = id => {
    const btn = this.elem.querySelector(`#${ id }`);
    
    const btnClickIllusion = () => {
      const imgOn = btn.firstElementChild.style;
      const imgOff = btn.lastElementChild.style;
      
      imgOn.display === 'none'
      ? ( imgOn.display = 'inline', imgOff.display = 'none' )
      : ( imgOn.display = 'none', imgOff.display = 'inline' ); 
    }
    btnClickIllusion();
    
    document.body.addEventListener('pointerup', btnClickIllusion, { once: true } );
  }
  
  actsOfButtons = event => {
    event.preventDefault();
    
    const id = event.target.closest('.tap').id;
    
    this.changeButtonDisplayState( id );
    
    switch ( id ) {
      case 'doubled': this.actDoubled(); break;
      case 'check': this.actCheck(); break;
      case 'split': this.actSplit(); break;
      case 'hover': this.actHover(); break;
      default: this.actAdder( id ); break;
    }
  }
  
  actDoubled = () => {
    
  }
  
  actCheck = () => {
    
  }
  
  actSplit = () => {
    document.body.dispatchEvent( new CustomEvent('split', { bubbles: true }) );
    
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
      transform: [
        'translateX( 270px )',
        'translateX( 60px )',
      ]
    }, {
      easing: 'ease',
      duration: 800,
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
        transform: [
          'scale( 1 )',
          'scale( 1.1 )',
          'perspective( 900px ) rotateY( 0.5turn ) scale( 1 )'
        ]
      }, {
        easing: 'ease',
        duration: 800,
        fill: 'both',
        composite: 'add'
      });
      rotation.persist();
    }
    for (let card of cards) card.addEventListener('pointerover', () => onHoverRotation( card ), { once: true });
  }
  
  actAdder = idRaw => {
    const id = idRaw.slice(6);
    const num = this.arrChips.indexOf( parseInt( id, 10 ) );
    
    const slot = document.getElementById(`slot-${ id }`);
    const chipBet = document.querySelector(`.chip-${ id }`).cloneNode( true );
    const chipArmed = document.querySelector(`.chip-armed.chip-${ id }`);
    
    chipBet.classList.replace('chip-armed', 'chip-bet');
    
    Object.assign( chipBet.style, {
      left: this.defineRect( chipBet ).left + 'px',
      top: this.defineRect( chipBet ).top + 'px',
    })
    
    slot.append( chipBet );

    Object.assign( chipBet.style, {
      left: parseInt( this.defineRect( chipArmed ).left, 10 ) - parseInt( this.defineRect( chipBet ).left, 10 ) + 'px',
      top: parseInt( this.defineRect( chipArmed ).top, 10 ) - parseInt( this.defineRect( chipBet ).top, 10 ) + 'px',
    });
    
    const shiftX = 0.5 * ++this.arrChipsCounters[ num ] - parseInt( chipBet.style.left, 10 ) + 'px';
    const shiftY = - 2 * this.arrChipsCounters[ num ] - parseInt( chipBet.style.top, 10 ) + 'px';
    
    const chipBetJump = chipBet.animate({
      transform: [
        'scale( 1 )',
        'perspective( 500px ) translate( 10px, -80px ) rotate3d( -1, -0.33, 0, 190deg ) scale( 1.26 )',
        `translate( ${ shiftX }, ${ shiftY } )`
      ]
    }, {
      easing: 'cubic-bezier( 0.01, -0.2, 0.28, 1.08 )',
      duration: 800,
      fill: 'both',
      composite: 'add'
    });
    
    const chipArmedEject = chipArmed.animate({
      transform: [
        'translateY( 90px ) rotate( -90deg )',
        'translateY( 0px )'
      ]
    }, {
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      duration: 800,
      fill: 'forwards',
      composite: 'replace'
    });
    
    chipBetJump.persist();
    chipArmedEject.persist();
    
    if ( !this.firstChipBet ) {
      this.elem.dispatchEvent( new CustomEvent('first-chip-bet', { bubbles: true }) );
      this.firstChipBet = true;
    }
  }
  
  defineRect = elem => elem.getBoundingClientRect();
}
