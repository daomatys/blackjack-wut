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
      ${ layoutChipMachine }
      </div>`;
  }
  
  onPointerDown = ({target}) => {
    const aim = target.closest('.clicker');
    
    if ( aim ) this.buttonProcesses( aim ); 
  }

  buttonProcesses( aim ) {
    if ( aim.classList.contains('check') ) this.check( aim );
    if ( aim.classList.contains('doubled') ) this.doubled( aim );
    if ( aim.classList.contains('split') ) this.split( aim );
    if ( aim.classList.contains('hover') ) this.hover( aim );
  }
  
  check( aim ) {
    this.setCommonBehavior( aim, 'check' );
    
    this.elem.dispatchEvent( new CustomEvent('check', { bubbles: true }) );
  }
  
  doubled( aim ) {
    this.setCommonBehavior( aim, 'doubled' );
    
    this.elem.dispatchEvent( new CustomEvent('doubled', { bubbles: true }) );
  }
  
  split( aim ) {
    this.setToggleBehavior( aim, 'split' );
    
    this.elem.dispatchEvent( new CustomEvent('split', { bubbles: true }) );
  }
  
  hover( aim ) {
    this.setToggleBehavior( aim, 'hover' );
    
    this.elem.dispatchEvent( new CustomEvent('hover', { bubbles: true }) );
  }
  
  setCommonBehavior( btn, suffix ) {
    btn.onpointerdown = () => btn.firstChild.src = "/assets/buttons/button_${ suffix }_on";
    btn.onpointerup = () => btn.firstChild.src = "/assets/buttons/button_${ suffix }_off";
  }
  
  setToggleBehavior( btn, suffix ) {
    btn.onclick = () => btn.firstChild.src = 
      btn.firstChild.src === "/assets/buttons/button_${ suffix }_on"
        ? "/assets/buttons/button_${ suffix }_off"
        : "/assets/buttons/button_${ suffix }_on";
  }
  
}
