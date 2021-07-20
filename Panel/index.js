export default class Panel {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('panel');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.eventListeners();
  }
  
  layout() {
    const buttons = [ 'check', 'doubled', 'split', 'hover' ];
    const chips = [ 1, 5, 10, 25, 100 ];
    
    const layoutPanelButtons = buttons
      .map( suffix => `
        <div class="clicker" id="${ suffix }">
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
        <div class="adder" id="adder-${ code }">
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
    
    for (let clicker of clickers) clicker.addEventListener('pointerdown', this.onPointerDown);
  }
  
  onPointerDown = (event) => {
    event.preventDefault();
    
    switch( event.target.closest('.clicker').id ) {
      case 'check': this.act('check'); break;
      case 'doubled': this.act('doubled'); break;
      case 'split': this.act('split'); break;
      case 'hover': this.act('hover'); break;
    }
  }

  act( suffix ) {
    const clicker = this.elem.querySelector(`#${ suffix }`);
    
    const nonToggleBehavior = () => {
      this.switchback( clicker );
      document.removeEventListener('pointerup', nonToggleBehavior )
    }
    this.switchback( clicker );
    
    //this.elem.dispatchEvent( new CustomEvent(`${ suffix }`, { bubbles: true }) );
    
    if ( suffix == 'check' || suffix == 'doubled' ) document.addEventListener('pointerup', nonToggleBehavior );
  }
  
  switchback( clicker ) {
    const imgOn = clicker.firstElementChild.style;
    const imgOff = clicker.lastElementChild.style;
    
    imgOn.opacity === '0'
    ? ( imgOn.opacity = '1', imgOff.opacity = '0' )
    : ( imgOn.opacity = '0', imgOff.opacity = '1' ); 
  }
}
