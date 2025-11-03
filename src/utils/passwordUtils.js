import zxcvbn from "zxcvbn";

// Minimum strength threshold (0–4)
const MIN_STRENGTH = 3;

// Detailed validator
export const validatePassword = (password) => {
  const analysis = zxcvbn(password);

  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    strength: analysis.score >= MIN_STRENGTH,
  };

  const valid = Object.values(rules).every(Boolean);
  return { valid, rules, score: analysis.score, feedback: analysis.feedback.suggestions };
};

export const getStrengthLabel = (score) => {
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  return labels[score] || "Very Weak";
};
