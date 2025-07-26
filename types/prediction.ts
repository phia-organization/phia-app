export interface Prediction {
  url?: string;
  predicted_ph: number;
  rgbs: {
    q1: {
      r: number;
      g: number;
      b: number;
    };
    q2: {
      r: number;
      g: number;
      b: number;
    };
    q3: {
      r: number;
      g: number;
      b: number;
    };
    q4: {
      r: number;
      g: number;
      b: number;
    };
  };
}
