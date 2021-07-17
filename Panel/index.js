export default class Panel {
  
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('panel');
    this.elem.insertAdjacentHTML('afterbegin', this.layout());
    
    this.elem.addEventListener('click', this.onClick);
  }
  
  layout() {
    const buttons = [ 'check', 'doubled', 'split', 'hover' ];
    const chips = [ 1, 5, 10, 25, 100 ];
    
    const layoutPanelButtons = buttons
      .map( suffix => `
        <div class="panel__button-${ suffix }>
          <button type="button" data-${ suffix }>
            <img src="/assets/buttons/button_${ suffix }_on.png">
            <img src="/assets/buttons/button_${ suffix }_off.png">
          </button>
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
      <img src="/assets/panel.png">
      
      <div class="panel__buttons">
      ${ layoutPanelButtons }
      </div>
      
      <div class="panel__chip-machine>
      ${ layoutChipMachine }
      </div>`;
  }
  
  onClick = ({target}) => { if ( target.closest('button') ) buttonProcesses( target.closest('button') ); }

  buttonProcesses( aim ) {
    if ( aim.dataset.check ) this.elem.dispatchEvent( new CustomEvent('check', { bubbles: true } ) );
    
    if ( aim.dataset.doubled ) this.elem.dispatchEvent( new CustomEvent('doubled', { bubbles: true } ) );
    
    if ( aim.dataset.split ) this.elem.dispatchEvent( new CustomEvent('split', { bubbles: true } ) );
    
    if ( aim.dataset.hover ) this.elem.dispatchEvent( new CustomEvent('hover', { bubbles: true } ) );
  }
  
}
