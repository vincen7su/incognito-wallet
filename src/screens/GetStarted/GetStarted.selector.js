import { createSelector } from 'reselect';

export const getStartedSelector = createSelector(
  (state) => state.getStarted,
  (getStarted) => getStarted,
);

export const wizardSelector = createSelector(
  getStartedSelector,
  (getStarted) => getStarted?.showWizard,
);