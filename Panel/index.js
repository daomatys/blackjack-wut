export default class Panel {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('panel');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.elem.addEventListener('pointerdown', this.onPointerDown);
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
        <div class="chip" id="c${ code }">
          <img src="/assets/chips/chip_${ code }.png">
          <button type="button" data-raise-${ code }>
          </button>
        </div>`)
      .join('');
    
    return `
      <div class="panel__buttons">
      ${ layoutPanelButtons }
      </div>
      
      <div class="panel__chip-machine">
      
      </div>`;
  }
  
  onPointerDown = ({target}) => {
    const id = target.closest('.clicker').id;
    
    switch( id ) {
      case 'check': this.act('check'); break;
      case 'doubled': this.act('doubled'); break;
      case 'split': this.act('split'); break;
      case 'hover': this.act('hover'); break;
    }
  }

  act( suffix ) {
    const clicker = this.elem.querySelector(`#${ suffix }`) 
    this.switchback( clicker );
    
    this.elem.dispatchEvent( new CustomEvent(`${ suffix }`, { bubbles: true }) );
    
    if ( suffix == 'check' || suffix == 'doubled' ) this.elem.onpointerup = () => this.switchback( clicker );

  }
  
  switchback( clicker ) {
    const imgOn = clicker.firstElementChild.style;
    const imgOff = clicker.lastElementChild.style;
    
    imgOn.opacity === '0'
    ? ( imgOn.opacity = '1', imgOff.opacity = '0' )
    : ( imgOn.opacity = '0', imgOff.opacity = '1' ); 
  }
}
