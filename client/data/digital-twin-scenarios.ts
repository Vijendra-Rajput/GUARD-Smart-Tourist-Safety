export const SCENARIOS = {
  SafeDay: {
    label: "Safe Day",
    // hours 0..8
    hours: [
      { risk: 12, heat: [0, 0, 0] },
      { risk: 15, heat: [0, 0, 0] },
      { risk: 10, heat: [0, 0, 0] },
      { risk: 8, heat: [0, 0, 0] },
      { risk: 9, heat: [0, 0, 0] },
      { risk: 11, heat: [0, 0, 0] },
      { risk: 13, heat: [0, 0, 0] },
      { risk: 10, heat: [0, 0, 0] },
      { risk: 9, heat: [0, 0, 0] },
    ],
  },
  FestivalEvening: {
    label: "Festival Evening",
    hours: [
      { risk: 35, heat: [0, 1, 0] },
      { risk: 48, heat: [0, 1, 0] },
      { risk: 62, heat: [0, 1, 1] },
      { risk: 70, heat: [0, 1, 1] },
      { risk: 78, heat: [1, 1, 1] },
      { risk: 74, heat: [1, 1, 1] },
      { risk: 69, heat: [1, 1, 1] },
      { risk: 64, heat: [1, 1, 1] },
      { risk: 58, heat: [0, 1, 1] },
    ],
  },
  HeavyRain: {
    label: "Heavy Rain",
    hours: [
      { risk: 28, heat: [0, 0, 0] },
      { risk: 42, heat: [0, 1, 0] },
      { risk: 55, heat: [0, 1, 1] },
      { risk: 68, heat: [1, 1, 1] },
      { risk: 81, heat: [1, 1, 1] },
      { risk: 76, heat: [1, 1, 1] },
      { risk: 72, heat: [1, 1, 1] },
      { risk: 65, heat: [1, 1, 0] },
      { risk: 60, heat: [1, 1, 0] },
    ],
  },
};

export const SCENARIO_KEYS = Object.keys(SCENARIOS) as (keyof typeof SCENARIOS)[];
