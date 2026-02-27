import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/appActions';

export interface AppState {
    targetRepoOwner: string;
    targetRepoName: string;
    docsTree: any[];
    docsContent: { path: string; name: string; content: string }[];
    activeDocPath: string | null;
    activeDocHistory: any[];
    isLoading: boolean;
    isLoadingHistory: boolean;
    error: string | null;
    theme: 'light' | 'dark';
}

const initialState: AppState = {
    targetRepoOwner: import.meta.env.VITE_TARGET_REPO_OWNER || '',
    targetRepoName: import.meta.env.VITE_TARGET_REPO_NAME || '',
    docsTree: [],
    docsContent: [],
    activeDocPath: null,
    activeDocHistory: [],
    isLoading: false,
    isLoadingHistory: false,
    error: null,
    theme: 'light',
};

export const appReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(actions.setTargetRepo, (state, action) => {
            state.targetRepoOwner = action.payload.owner;
            state.targetRepoName = action.payload.repo;
        })
        .addCase(actions.setDocsTree, (state, action) => {
            state.docsTree = action.payload;
        })
        .addCase(actions.setAppLoading, (state, action) => {
            state.isLoading = action.payload;
        })
        .addCase(actions.setActiveDocPath, (state, action) => {
            state.activeDocPath = action.payload;
        })
        .addCase(actions.setAppError, (state, action) => {
            state.error = action.payload;
        })
        .addCase(actions.toggleTheme, (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        })
        // Thunks for fetching Tree
        .addCase(actions.fetchDocs.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(actions.fetchDocs.fulfilled, (state, action) => {
            state.isLoading = false;
            state.docsTree = action.payload.tree;
            state.docsContent = action.payload.contents;
        })
        .addCase(actions.fetchDocs.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to fetch docs';
        })
        // Thunks for fetching active File
        .addCase(actions.fetchActiveDoc.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.activeDocHistory = []; // Reset history when loading a new doc
        })
        .addCase(actions.fetchActiveDoc.fulfilled, (state, action) => {
            state.isLoading = false;
            state.activeDocPath = action.payload.path;
        })
        .addCase(actions.fetchActiveDoc.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to fetch the file';
        })
        // Thunks for fetching doc History
        .addCase(actions.fetchActiveDocHistory.pending, (state) => {
            state.isLoadingHistory = true;
            state.error = null;
        })
        .addCase(actions.fetchActiveDocHistory.fulfilled, (state, action) => {
            state.isLoadingHistory = false;
            state.activeDocHistory = action.payload;
        })
        .addCase(actions.fetchActiveDocHistory.rejected, (state, action) => {
            state.isLoadingHistory = false;
            state.error = action.error.message || 'Failed to fetch the file history';
        });
});
