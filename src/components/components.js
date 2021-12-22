export default class MyComponent {

  applyStyleSheet( componentStyleSheet ) {
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      componentStyleSheet
    ];
  }

  applyMarkup( element, markup ) {
    const insertMarkup = function( elem ) {
      elem.insertAdjacentHTML( 'afterbegin', markup );
    }

    if ( typeof element === 'string' ) {
      document
        .querySelectorAll( element )
        .forEach( item => insertMarkup( item ) );
    } 
    
    if ( typeof element !== 'string' ) {
      insertMarkup( element );
    }
  }

  initializeComponent( item ) {
    this.applyStyleSheet( item.stylesheet );
    this.applyMarkup( item.element, item.markup )
  }
}
