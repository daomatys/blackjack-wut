import MyComponent from '../components.js';
import thatComponentStyleSheet from './panel.css' assert { type: 'css' };
import PanelAdderButton from '../button/__panel-adder/button__panel-adder.js';
import PanelClickerButton from '../button/__panel-clicker/button__panel-clicker.js';


export default class Panel extends MyComponent {
  
  constructor() {
    super();

    this.clickersNames = [ 'doubled', 'check', 'split', 'hover' ];
    this.chipsValues = [ 1, 5, 10, 25, 100 ];
    
    this.render();
    this.renderInnerElements();

    this.initEventListeners();
  }

  markup() {      
    const layoutChipMachine = this.chipsValues
      .map( code => `
        <div class="chip chip-armed chip-${ code }">
          <img src="src/assets/graphics/chips/chip_${ code }.png">
        </div>`)
      .join('');
      
    return `
      <div class="panel">
        <div class="panel__background">
          <img src="src/assets/graphics/panel.png">
        </div>
        <div class="panel__clickers"></div>
        <div class="panel__chip-machine">
          <div class="panel__chips">
            ${ layoutChipMachine }
          </div>
          <div class="panel__adders"></div>
        </div>
      </div>
    `;
  }

  render() {
    const selector = '[data-panel]'

    super.initializeComponent({
      stylesheet: thatComponentStyleSheet,
      wrapref: selector,
      markup: this.markup()
    });

    this.elem = this.defineElementByItsWrap( selector );
  }

  renderInnerElements() {
    this.clickersCollection = Object.fromEntries(
      this.clickersNames.reverse().map( 
        name => [ name, new PanelClickerButton( name ) ] 
      )
    );

    console.log(this.clickersCollection)
    this.chipsValues.reverse().forEach( value => new PanelAdderButton( value ) );
  }
  
  defineAdditionalValues() {
    this.chipsValuesCounters = [ 0, 0, 0, 0, 0 ];
    this.firstChipBet = false;
  }
  
  initEventListeners() {
    const tappables = this.elem.querySelectorAll('.js-tappable');
    
    tappables.forEach( tappable => tappable.addEventListener('pointerdown', this.actsOfButtons) );
  }
  
  actsOfButtons = event => {
    event.preventDefault();
    
    const aim = event.target;
    
    if ( aim.classList.contains('js-tappable') ) {
      switch ( aim.id ) {
        case 'doubled': {
          this.actDoubled();
          break;
        }
        case 'check': {
          this.actCheck();
          break;
        }
        case 'split': {
          this.actSplit();
          break;
        }
        case 'hover': {
          this.actHover();
          break;
        }
        default: {
          this.actAdder( aim.id );
        }
      }
    }
  }
  
  actDoubled = () => {
    this.clickersCollection.doubled.toggleClickPossibility();
  }
  
  actCheck = () => {
    document.body.dispatchEvent( 
      new CustomEvent('end-of-player-draw', { bubbles: true })
    );
    
    if ( this.elem.querySelector('.clicker-split .allow-click') ) {
      this.clickersCollection.split.toggleClickPossibility();
    }
  }
  
  actSplit = () => {
    document.body.dispatchEvent(
      new CustomEvent('split', { bubbles: true })
    );
    
    this.toggleSplitEntitiesClasses( true );
    this.clickersCollection.split.toggleClickPossibility();
    
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
  
  toggleSplitEntitiesClasses( includedHandClass ) {
    if ( includedHandClass ) {
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
    cards.forEach( card => card.addEventListener('pointerover', () => onHoverRotation( card ), { once: true }) );
  }
  
  actAdder = idRaw => {
    const id = idRaw.slice(6);
    const num = this.chipsValues.indexOf( parseInt( id, 10 ) );
    
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
    
    const shiftX = 0.5 * ++this.chipsValuesCounters[ num ] - parseInt( chipBet.style.left, 10 ) + 'px';
    const shiftY = - 2 * this.chipsValuesCounters[ num ] - parseInt( chipBet.style.top, 10 ) + 'px';
    
    const chipBetJump = chipBet.animate(
      this.animations.chip.jump.action( shiftX, shiftY ),
      this.animations.chip.jump.props
    );
    
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
}
