export default {
  deck: {
    fall: {
      action: {
        transform: [
          'translate( -280px, -600px ) scale( 2 )',
          'translate( 0px, 0px ) scale( 1 ) rotate( 360deg )'
        ]
      },
      props: {
        easing: 'cubic-bezier( 0.68, -0.6, 0.32, 1.1 )',
        duration: 800,
        fill: 'forwards',
        composite: 'replace'
      }
    },
    remove: {
      action: {
        transform: 'translate( 0px, -600px ) scale( 2 ) rotate( 360deg )'
      },
      props: {
        easing: 'cubic-bezier( 0.68, 0, 0.32, 1.1 )',
        duration: 800,
        fill: 'forwards',
        composite: 'replace'
      }
    }
  },
  
  card: {
    scale: {
      action: ( num ) => ({
        transform: `scale(${ num })`
      }),
      props: {
        easing: 'ease',
        duration: 200,
        fill: 'both',
        composite: 'replace'
      }
    },
    onhover: {
      action: {
        transform: [
          'scale( 1 )',
          'scale( 1.1 )',
          'perspective( 900px ) rotateY( 0.5turn ) scale( 1 )'
        ]
      },
      props: {
        easing: 'ease',
        duration: 800,
        fill: 'both',
        composite: 'add'
      }
    },
    
    splitting: {
      action: {
        transform: [
          'translateX( 270px )',
          'translateX( 60px )',
        ]
      },
      props: {
        easing: 'ease',
        duration: 800,
        fill: 'both',
        composite: 'add'
      }
    },
    
    remove: {
      action: {
        transform: 'translateX( 2000px )'
      },
      props: {
        easing: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
        duration: 1000,
        fill: 'both',
        composite: 'add'
      }
    },

    flight: {
      action: ( shiftX, shiftY ) => ({
        transform: [
          'scale( 1.05 )',
          `perspective( 900px ) scale( 1 ) translate( ${ shiftX }, ${ shiftY } ) rotateY( 0.5turn )`
        ]
      }),
      props: {
        easing: 'ease',
        duration: 1000,
        fill: 'both',
        composite: 'replace'
      }
    }
  },
  
  bank: {
    shift: {
      action: {
        transform: 'translateY(-100px)'
      },
      props: {
        easing: 'ease',
        duration: 500,
        fill: 'both',
        composite: 'add'
      }
    }
  },
  
  starter: {
    autodim: {
      action: {
        opacity: [ 0, 1, 0 ]
      },
      props: {
        duration: 4000,
        iterations: Infinity,
        composite: 'replace'
      }
    },
    
    dim: {
      action: {
        opacity: 0
      },
      props: {
        duration: 300,
        fill: 'both',
        composite: 'replace'
      }
    }
  },
  
  chip: {
    eject: {
      action: {
        transform: [
          'translateY( 90px ) rotate( -90deg )',
          'translateY( 0px )'
        ]
      },
      props: {
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        duration: 800,
        fill: 'forwards',
        composite: 'replace'
      }
    },
    jump: {
      action: ( shiftX, shiftY ) => ({
        transform: [
          `scale( 1 ) translate( ${ shiftX }, ${ shiftY } )`,
          'perspective( 500px ) translate( -10px, -10px ) rotate3d( -1, -0.33, 0, 190deg ) scale( 1.26 )',
          'translate( 0px, 0px )'
        ]
      }),
      props: {
        easing: 'cubic-bezier( 0.01, -0.2, 0.28, 1.08 )',
        duration: 800,
        fill: 'both',
        composite: 'add'
      }
    }
  },
  
  table: {
    shake: {
      action: {
        transform: [
          'translate( 0px, 0px ) rotate( 0deg )',
          'translate( 1px, 1px ) rotate( 0deg )',
          'translate( -1px, -2px ) rotate( -1deg )',
          'translate( -3px, 0px ) rotate( 1deg )',
          'translate( 3px, 2px ) rotate( 0deg )',
          'translate( 1px, -1px ) rotate( 1deg )',
          'translate( -1px, 2px ) rotate( -1deg )',
          'translate( -3px, 1px ) rotate( 0deg )',
          'translate( 3px, 1px ) rotate( -1deg )',
          'translate( -1px, -1px ) rotate( 1deg )',
          'translate( 1px, 2px ) rotate( 0deg )',
          'translate( 1px, -2px ) rotate( -1deg )',
          'translate( 0px, 0px ) rotate( 0deg )'
        ]
      },
      props: {
        easing: 'ease',
        delay: 700,
        duration: 200,
        fill: 'both',
        composite: 'add'
      }
    }
  }
}
