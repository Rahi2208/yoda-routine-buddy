// Shown in the speech bubble when you double-click YODA.
export const AFFIRMATIONS = [
  "You're doing amazing!",
  "One small step is still a step.",
  "Look how far you've come today.",
  "You don't have to be perfect to be proud.",
  "Deep breath. You've got this.",
  "Progress over perfection, always.",
  "Your future self says thank you.",
  "Hard things get easier when you start.",
  "I believe in you. Like, a lot.",
  "Done is better than perfect.",
  "You're allowed to rest, too.",
  "Every bug you fix makes you sharper.",
  "Slow progress is still progress.",
  "You showed up. That counts.",
  "Proud of you for trying.",
];

export function randomAffirmation(previous) {
  const options = AFFIRMATIONS.filter((text) => text !== previous);
  return options[Math.floor(Math.random() * options.length)];
}
