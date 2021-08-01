export default {
  deck: {
    fall: {
      action: {
        transform: [
          'scale( 2 ) rotate( 180deg )', 
          'translate( 280px, 600px ) scale( 1 ) rotate( -360deg )'
        ]
      },
      props: {
        easing: 'cubic-bezier(0.68, -0.6, 0.32, 1.1)',
        duration: 800,
        fill: 'forwards',
        composite: 'add'
      }
    }
  },
  
  bankcaller: {
    dim: {
      action: {
        opacity: 0
      },
      props: {
        duration: 300,
        fill: 'forwards',
        composite: 'replace'
      }
    }
  },
  
  table: {
    shake: {
      action: {
        transform: [
          'translate(0px, 0px) rotate(0deg)',
          'translate(1px, 1px) rotate(0deg)',
          'translate(-1px, -2px) rotate(-1deg)',
          'translate(-3px, 0px) rotate(1deg)',
          'translate(3px, 2px) rotate(0deg)',
          'translate(1px, -1px) rotate(1deg)',
          'translate(-1px, 2px) rotate(-1deg)',
          'translate(-3px, 1px) rotate(0deg)',
          'translate(3px, 1px) rotate(-1deg)',
          'translate(-1px, -1px) rotate(1deg)',
          'translate(1px, 2px) rotate(0deg)',
          'translate(1px, -2px) rotate(-1deg)',
          'translate(0px, 0px) rotate(0deg)'
        ]
      },
      props: {
        easing: 'ease',
        delay: 710,
        duration: 200,
        fill: 'both',
        composite: 'add'
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
  }
}