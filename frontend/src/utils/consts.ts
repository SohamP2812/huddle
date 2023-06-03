export const sports = {
  nameToKey: {
    Basketball: 'BASKETBALL',
    Hockey: 'HOCKEY'
  },
  keyToName: {
    BASKETBALL: 'Basketball',
    HOCKEY: 'Hockey'
  }
}; 

export const eventTypes = {
  nameToKey: {
    Game: 'GAME',
    Practice: 'PRACTICE'
  },
  keyToName: {
    GAME: 'Game',
    PRACTICE: 'Practice'
  }
};

export const positions = {
  "BASKETBALL": {
    nameToKey: {
      "Unknown": "UNKNOWN",
      "Point Guard": "POINT_GUARD",
      "Shooting Guard": "SHOOTING_GUARD",
      "Small Forward": "SMALL_FORWARD",
      "Power Forward": "POWER_FORWARD",
      "Center": "CENTER",
    } as { [key: string]: string },
    keyToName: {
      UNKNOWN: "Unknown",
      POINT_GUARD: "Point Guard",
      SHOOTING_GUARD: "Shooting Guard",
      SMALL_FORWARD: "Small Forward",
      POWER_FORWARD: "Power Forward",
      CENTER: "Center",
    } as { [key: string]: string },
  },
  "HOCKEY": {
    nameToKey: {
      "Unknown": "UNKNOWN",
      "Left Wing": "LEFT_WING",
      "Right Wing": "RIGHT_WING",
      "Left Defense": "LEFT_DEFENSE",
      "Right Defense": "RIGHT_DEFENSE",
      "Goalie": "GOALIE",
      "Center": "CENTER",
    } as { [key: string]: string },
    keyToName: {
      UNKNOWN: "Unknown",
      LEFT_WING: "Left Wing",
      RIGHT_WING: "Right Wing", 
      LEFT_DEFENSE: "Left Defense",
      RIGHT_DEFENSE: "Right Defense",
      GOALIE: "Goalie",
      CENTER: "Center",
    } as { [key: string]: string },
  }
}

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const monthNamesShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
