// Access to the Electron desktop app, when we are running inside it.
// In a normal browser window.yoda does not exist, so every helper
// becomes a harmless no-op and the web app works on its own.
const yoda = typeof window !== "undefined" ? window.yoda : undefined;

export const isDesktop = Boolean(yoda?.isDesktop);

const noop = () => {};
const noopSubscribe = () => noop;

export const desktop = {
  setSession: (session) => yoda?.setSession(session),
  clearSession: () => yoda?.clearSession(),

  showPet: () => yoda?.showPet(),
  hidePet: () => yoda?.hidePet(),
  setPetExpanded: (expanded) => yoda?.setPetExpanded(expanded),
  getPetVisible: () => yoda?.getPetVisible() ?? Promise.resolve(false),
  onPetVisibility: yoda?.onPetVisibility ?? noopSubscribe,

  timer: {
    start: (phase) => yoda?.timer.start(phase),
    pause: () => yoda?.timer.pause(),
    reset: () => yoda?.timer.reset(),
    getState: () => yoda?.timer.getState() ?? Promise.resolve(null),
    onState: yoda?.timer.onState ?? noopSubscribe,
  },

  onMessage: yoda?.onMessage ?? noopSubscribe,
  onTimerDone: yoda?.onTimerDone ?? noopSubscribe,

  quit: () => yoda?.quit(),
};
