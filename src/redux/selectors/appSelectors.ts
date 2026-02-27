import type { RootState } from '../reducers';

export const selectTargetRepo = (state: RootState) => ({
    owner: state.app.targetOwner,
    repo: state.app.targetRepo,
});

export const selectDocsTree = (state: RootState) => state.app.docsTree;
export const selectActiveDoc = (state: RootState) => state.app.activeDoc;
export const selectActiveDocHistory = (state: RootState) => state.app.activeDocHistory;
export const selectAppLoading = (state: RootState) => state.app.isLoading;
export const selectIsHistoryLoading = (state: RootState) => state.app.isLoadingHistory;
export const selectAppError = (state: RootState) => state.app.error;
