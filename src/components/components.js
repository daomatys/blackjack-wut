export default class MyComponent {

  applyStyleSheet( componentStyleSheet ) {
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      componentStyleSheet
    ];
  }

  renderMarkup( element, markup ) {
    const insertMarkup = function( elem ) {
      elem.insertAdjacentHTML( 'afterbegin', markup );
    }

    if ( typeof selector === 'string' ) {
      document.querySelectorAll( element ).forEach( item => insertMarkup( item ) );
    } 
    
    if ( typeof selector !== 'string' ) {
      insertMarkup( element );
    }
  }

  incrustComponent( item ) {
    this.applyStyleSheet( item.stylesheet );
    this.renderMarkup( item.element, item.markup )
  }
}
