
export const EventColors: any = {
    red: {
      primary: 'white',
      secondary: '#ff4d4d'
    },
    blue: {
      primary: 'black',
      secondary: '#b3c6ff'
    },
    yellow: {
      primary: 'black',
      secondary: '#ffff66'
    },
    green: {
        primary: 'white',
        secondary: '#009900'
    }
  };

  export function mapToColor(eventType: number): any {
    switch (eventType) {
        case 1: {
            return EventColors.red;
        }
        case 2: {
            return EventColors.yellow;
        }
        case 3: {
            return EventColors.green;
        }
        case 4: {
            return EventColors.blue;
        }
        default: {
            return EventColors.red;
        }
    }
  }
