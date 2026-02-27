import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDocsFolder, fetchFileContent, fetchFileHistory } from '../../services/githubService';

export const setTargetRepo = createAction<{ owner: string; repo: string }>('app/setTargetRepo');
export const setDocsTree = createAction<any[]>('app/setDocsTree');
export const setAppLoading = createAction<boolean>('app/setAppLoading');
export const setAppError = createAction<string | null>('app/setAppError');

export const fetchDocs = createAsyncThunk(
    'app/fetchDocs',
    async ({ owner, repo }: { owner: string; repo: string }) => {
        const data = await fetchDocsFolder(owner, repo);
        return data; // Array of file/folder objects
    }
);

export const fetchActiveDoc = createAsyncThunk(
    'app/fetchActiveDoc',
    async ({ owner, repo, path }: { owner: string; repo: string; path: string }, { dispatch }) => {
        // 1. Fetch file content
        const content = await fetchFileContent(owner, repo, path);

        // 2. Fetch history concurrently when a file is clicked, but handled in a separate thunk/action
        dispatch(fetchActiveDocHistory({ owner, repo, path }));

        return { path, content };
    }
);

export const fetchActiveDocHistory = createAsyncThunk(
    'app/fetchActiveDocHistory',
    async ({ owner, repo, path }: { owner: string; repo: string; path: string }) => {
        const history = await fetchFileHistory(owner, repo, path);
        return history;
    }
);
