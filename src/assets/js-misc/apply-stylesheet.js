export default function( componentStyleSheet ) {
  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    componentStyleSheet
  ];
}
