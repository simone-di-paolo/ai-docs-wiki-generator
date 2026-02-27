import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/appActions';

interface AppState {
    targetOwner: string | null;
    targetRepo: string | null;
    docsTree: any[];
    activeDoc: { path: string; content: string } | null;
    activeDocHistory: any[];
    isLoadingHistory: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AppState = {
    targetOwner: import.meta.env.VITE_TARGET_REPO_OWNER || null,
    targetRepo: import.meta.env.VITE_TARGET_REPO_NAME || null,
    docsTree: [],
    activeDoc: null,
    activeDocHistory: [],
    isLoadingHistory: false,
    isLoading: false,
    error: null,
};

export const appReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(actions.setTargetRepo, (state, action) => {
            state.targetOwner = action.payload.owner;
            state.targetRepo = action.payload.repo;
        })
        .addCase(actions.setDocsTree, (state, action) => {
            state.docsTree = action.payload;
        })
        .addCase(actions.setAppLoading, (state, action) => {
            state.isLoading = action.payload;
        })
        .addCase(actions.setAppError, (state, action) => {
            state.error = action.payload;
        })
        // Thunks for fetching Tree
        .addCase(actions.fetchDocs.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(actions.fetchDocs.fulfilled, (state, action) => {
            state.isLoading = false;
            state.docsTree = action.payload;
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
            state.activeDoc = action.payload;
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
