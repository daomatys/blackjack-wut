export default function( componentStylesheet ) {
  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    componentStylesheet
  ];
}
