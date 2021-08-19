import animations from '../assets/js-misc/animations.js';

export default class Panel {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('panel');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.animations = animations;
    
    this.eventListeners();
  }
  
  defineAdditionalValues() {
    this.arrChipsCounters = [ 0, 0, 0, 0, 0 ];
    this.firstChipBet = false;
  }
  
  layout = () => {
    this.arrClickers = [ 'doubled', 'check', 'split', 'hover' ];
    this.arrChips = [ 1, 5, 10, 25, 100 ];
    
    const layoutPanelButtons = this.arrClickers
      .map( suffix => `
        <div class="clicker__container clicker-${ suffix }">
          <div class="clicker tap" id="${ suffix }">
            <img src="assets/graphics/buttons/button_${ suffix }_off.png" style="display: inline">
            <img src="assets/graphics/buttons/button_${ suffix }_on.png" style="display: none">
          </div>
          <div class="clicker__fake deny-click">
            <img src="assets/graphics/buttons/button_inactive.png">
          </div>
        </div>`)
      .join('');
      
    const layoutChipMachine = this.arrChips
      .map( code => `
        <div class="chip chip-armed chip-${ code }">
          <img src="assets/graphics/chips/chip_${ code }.png">
        </div>`)
      .join('');
      
    const layoutAdderBar = this.arrChips 
      .map( code => `
        <div class="adder__container adder-${ code }">
          <div class="adder tap" id="adder-${ code }">
            <img src="assets/graphics/buttons/adder_off.png" style="display: inline">
            <img src="assets/graphics/buttons/adder_on.png" style="display: none">
          </div>
          <div class="adder__fake allow-click">
            <img src="assets/graphics/buttons/adder_inactive.png">
          </div>
        </div>`)
      .join('');
      
    const layoutAssembled = `
      <div class="panel__background">
        <img src="assets/graphics/panel.png">
      </div>
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
    
    return layoutAssembled;
  }
  
  eventListeners() {
    const taps = this.elem.querySelectorAll('.tap');
    
    for (let tap of taps) tap.addEventListener('pointerdown', this.actsOfButtons);
  }
  
  changeButtonDisplayState = id => {
    const btn = this.elem.querySelector(`#${ id }`);
    
    const btnClickIllusion = () => {
      const imgOff = btn.firstElementChild;
      const imgOn = btn.lastElementChild;
      
      imgOn.style.display === 'none'
      ? ( imgOn.style.display = 'inline', imgOff.style.display = 'none' )
      : ( imgOn.style.display = 'none', imgOff.style.display = 'inline' );
    }
    btnClickIllusion();
    
    document.addEventListener('pointerup', btnClickIllusion, { once: true } );
  }
  
  actsOfButtons = event => {
    event.preventDefault();
    
    const aim = event.target;
    
    if ( aim.classList.contains('tap') ) {
      this.changeButtonDisplayState( aim.id );
      
      switch ( aim.id ) {
        case 'doubled': this.actDoubled(); break;
        case 'check': this.actCheck(); break;
        case 'split': this.actSplit(); break;
        case 'hover': this.actHover(); break;
        default: this.actAdder( aim.id ); break;
      }
    }
  }
  
  actDoubled = () => {
    this.toggleClickerClickPossibility('doubled');
  }
  
  actCheck = () => {
    document.body.dispatchEvent( new CustomEvent('end-of-player-draw', { bubbles: true }) );
    
    this.toggleClickerClickPossibility('check');
  }
  
  actSplit = () => {
    document.body.dispatchEvent( new CustomEvent('split', { bubbles: true }) );
    
    this.toggleSplitEntitiesClasses( true );
    this.toggleClickerClickPossibility('split');
    
    const hand = document.querySelector('.hand__player');
    const subhandLeft = hand.querySelector('.subhand__left');
    const subhandRight = hand.querySelector('.subhand__right');
    
    const cardSplitted = { 
      left: hand.lastChild.getBoundingClientRect().left,
      top: hand.lastChild.getBoundingClientRect().top 
    };
    subhandRight.append( hand.lastChild );
    subhandLeft.append( hand.lastChild );
    
    const rightCard = subhandRight.lastChild;
    
    rightCard.style.top = cardSplitted.top;
    
    const splitting = rightCard.animate(
      this.animations.card.splitting.action,
      this.animations.card.splitting.props,
    );
    splitting.persist();
  }
  
  toggleSplitEntitiesClasses( includeHandClass ) {
    if ( includeHandClass ) {
      document.querySelector('.hand__player').classList.toggle('allow-drop');
    }
    document.querySelector('.subhand__left').classList.toggle('allow-drop');
    document.querySelector('.subhand__right').classList.toggle('allow-drop');
  }
  
  actHover() {
    const cards = document.querySelectorAll('.hand__player .card');
    
    const onHoverRotation = card => {
      const rotation = card.animate(
        this.animations.card.onhover.action,
        this.animations.card.onhover.props,
      );
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
    });
    
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
    
    const chipArmedEject = chipArmed.animate(
      this.animations.chip.eject.action,
      this.animations.chip.eject.props
    );
    
    chipBetJump.persist();
    chipArmedEject.persist();
    
    if ( !this.firstChipBet ) {
      this.elem.dispatchEvent( new CustomEvent('first-chip-bet', { bubbles: true }) );
      this.firstChipBet = true;
    }
  }
  
  defineRect = elem => elem.getBoundingClientRect();
  
  toggleClickerClickPossibility = suffix => {
    const element = document.querySelector(`.clicker-${ suffix }`).lastElementChild;
    
    element.classList.toggle('deny-click');
    element.classList.toggle('allow-click');
  }
}
