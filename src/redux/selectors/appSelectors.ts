import type { RootState } from '../reducers';

export const selectTargetOwner = (state: RootState) => state.app.targetRepoOwner;
export const selectTargetRepo = (state: RootState) => state.app.targetRepoName;
export const selectDocsTree = (state: RootState) => state.app.docsTree;
export const selectDocsContent = (state: RootState) => state.app.docsContent;
export const selectActiveDocPath = (state: RootState) => state.app.activeDocPath;
export const selectActiveDocHistory = (state: RootState) => state.app.activeDocHistory;
export const selectIsLoadingHistory = (state: RootState) => state.app.isLoadingHistory;
export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectError = (state: RootState) => state.app.error;
export const selectTheme = (state: RootState) => state.app.theme;
export const selectIsHistoryLoading = (state: RootState) => state.app.isLoadingHistory;
export const selectAppLoading = (state: RootState) => state.app.isLoading;