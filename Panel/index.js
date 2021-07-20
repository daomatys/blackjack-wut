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
  
  actsOfButtons = (event) => {
    event.preventDefault();
    
    const id = event.target.closest('.tap').id;
    
    this.act( id );
  }

  act( suffix ) {
    const btn = this.elem.querySelector(`#${ suffix }`);
    
    const nonToggleBehavior = () => {
      this.switchback( btn );
      document.removeEventListener('pointerup', nonToggleBehavior )
    }
    this.switchback( btn );
    
    this.elem.dispatchEvent( new CustomEvent(`${ suffix }`, { bubbles: true }) );
    
    if ( !(suffix === 'split' || suffix === 'hover') ) document.addEventListener('pointerup', nonToggleBehavior );
  }
  
  switchback( btn ) {
    const imgOn = btn.firstElementChild.style;
    const imgOff = btn.lastElementChild.style;
    
    imgOn.opacity === '0'
    ? ( imgOn.opacity = '1', imgOff.opacity = '0' )
    : ( imgOn.opacity = '0', imgOff.opacity = '1' ); 
  }
}
