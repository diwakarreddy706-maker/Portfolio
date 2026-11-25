/**
 * ICU Demo Risk Logic
 * Transparent, rule-based clinical scoring model for the interactive demonstration.
 *
 * DISCLAIMER (Permanently displayed):
 * SIMULATED DEMO. Illustrative logic only. Fictional patients.
 * Not a medical device. Not clinically validated. Not medical advice.
 */

export interface IcuVitals {
  heartRate: number; // beats per minute (bpm)
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  spO2: number; // % oxygen saturation
  temperature: number; // degrees Celsius (°C)
}

export type RiskLevel = "Low" | "Elevated" | "High";

export interface DemoRiskResult {
  level: RiskLevel;
  score: number; // 0 to 100
  reasons: string[];
}

/**
 * Transparent Clinical Demo Threshold Constants
 * All thresholds are centralized here for clarity and easy calibration.
 */
export const DEMO_THRESHOLDS = {
  heartRate: {
    tachycardia: 110, // > 110 bpm indicates significant tachycardia
    mildTachycardia: 100, // > 100 bpm mild tachycardia
    bradycardia: 55, // < 55 bpm bradycardia
  },
  bloodPressure: {
    systolicHypotension: 100, // < 100 mmHg indicates low perfusion / septic shock risk
    systolicSevereHypotension: 90, // < 90 mmHg critical hypotension
    diastolicLow: 60, // < 60 mmHg
  },
  spO2: {
    hypoxia: 92, // < 92% abnormal oxygenation
    criticalHypoxia: 88, // < 88% severe hypoxemia
  },
  temperature: {
    fever: 38.0, // > 38.0 °C systemic inflammatory response
    highFever: 38.8, // > 38.8 °C high fever
    hypothermia: 36.0, // < 36.0 °C hypothermic sepsis manifestation
  },
} as const;

/**
 * Pure function computing demo sepsis risk score and explanatory clinical reasons.
 * Uses transparent rule-based logic without hidden heuristics.
 */
export function computeDemoRisk(vitals: IcuVitals): DemoRiskResult {
  const reasons: string[] = [];
  let score = 12; // Baseline low-risk score for resting physiology

  // 1. Heart Rate Evaluation (Tachycardia / Bradycardia)
  if (vitals.heartRate >= DEMO_THRESHOLDS.heartRate.tachycardia) {
    score += 26;
    reasons.push(
      `Heart rate elevated above ${DEMO_THRESHOLDS.heartRate.tachycardia} bpm (${Math.round(vitals.heartRate)} bpm)`
    );
  } else if (vitals.heartRate >= DEMO_THRESHOLDS.heartRate.mildTachycardia) {
    score += 14;
    reasons.push(
      `Heart rate mildly elevated at ${Math.round(vitals.heartRate)} bpm (above ${DEMO_THRESHOLDS.heartRate.mildTachycardia} bpm)`
    );
  } else if (vitals.heartRate < DEMO_THRESHOLDS.heartRate.bradycardia) {
    score += 15;
    reasons.push(
      `Heart rate low: ${Math.round(vitals.heartRate)} bpm (below ${DEMO_THRESHOLDS.heartRate.bradycardia} bpm)`
    );
  }

  // 2. Systolic Blood Pressure Evaluation (Hypotension)
  if (vitals.bloodPressureSystolic <= DEMO_THRESHOLDS.bloodPressure.systolicSevereHypotension) {
    score += 28;
    reasons.push(
      `Systolic BP critically low at ${Math.round(vitals.bloodPressureSystolic)} mmHg (below ${DEMO_THRESHOLDS.bloodPressure.systolicSevereHypotension} mmHg)`
    );
  } else if (vitals.bloodPressureSystolic < DEMO_THRESHOLDS.bloodPressure.systolicHypotension) {
    score += 18;
    reasons.push(
      `Systolic BP below ${DEMO_THRESHOLDS.bloodPressure.systolicHypotension} mmHg (${Math.round(vitals.bloodPressureSystolic)} mmHg)`
    );
  }

  // 3. Oxygen Saturation Evaluation (Hypoxia)
  if (vitals.spO2 <= DEMO_THRESHOLDS.spO2.criticalHypoxia) {
    score += 30;
    reasons.push(
      `Severe hypoxia: SpO2 at ${Math.round(vitals.spO2)}% (critically below ${DEMO_THRESHOLDS.spO2.criticalHypoxia}%)`
    );
  } else if (vitals.spO2 < DEMO_THRESHOLDS.spO2.hypoxia) {
    score += 20;
    reasons.push(
      `SpO2 below ${DEMO_THRESHOLDS.spO2.hypoxia}% (${Math.round(vitals.spO2)}%)`
    );
  }

  // 4. Body Temperature Evaluation (Fever / Hypothermia)
  if (vitals.temperature >= DEMO_THRESHOLDS.temperature.highFever) {
    score += 22;
    reasons.push(
      `High fever: Temperature at ${vitals.temperature.toFixed(1)}°C (above ${DEMO_THRESHOLDS.temperature.highFever}°C)`
    );
  } else if (vitals.temperature >= DEMO_THRESHOLDS.temperature.fever) {
    score += 14;
    reasons.push(
      `Temperature elevated above ${DEMO_THRESHOLDS.temperature.fever}°C (${vitals.temperature.toFixed(1)}°C)`
    );
  } else if (vitals.temperature <= DEMO_THRESHOLDS.temperature.hypothermia) {
    score += 20;
    reasons.push(
      `Temperature hypothermic below ${DEMO_THRESHOLDS.temperature.hypothermia}°C (${vitals.temperature.toFixed(1)}°C)`
    );
  }

  // 5. Combined Clinical Warning: Tachycardia + Hypotension (Shock Index)
  if (
    vitals.heartRate >= DEMO_THRESHOLDS.heartRate.tachycardia &&
    vitals.bloodPressureSystolic < DEMO_THRESHOLDS.bloodPressure.systolicHypotension
  ) {
    score += 10;
    reasons.push(
      `Concomitant tachycardia and hypotension indicating hemodynamic instability`
    );
  }

  // Clamp score strictly between 0 and 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  let level: RiskLevel = "Low";
  if (finalScore >= 65) {
    level = "High";
  } else if (finalScore >= 35) {
    level = "Elevated";
  }

  if (reasons.length === 0) {
    reasons.push("All monitored physiological parameters are within standard baseline clinical range.");
  }

  return {
    level,
    score: finalScore,
    reasons,
  };
}
