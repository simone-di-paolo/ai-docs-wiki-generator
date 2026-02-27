import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDocsFolder, fetchFileContent, fetchFileHistory } from '../../services/githubService';

export const setTargetRepo = createAction<{ owner: string; repo: string }>('app/setTargetRepo');
export const setDocsTree = createAction<any[]>('app/setDocsTree');
export const setAppLoading = createAction<boolean>('app/setAppLoading');
export const setActiveDocPath = createAction<string | null>('app/setActiveDocPath');
export const setAppError = createAction<string | null>('app/setAppError');
export const toggleTheme = createAction('app/toggleTheme');

export const fetchDocs = createAsyncThunk(
    'app/fetchDocs',
    async ({ owner, repo }: { owner: string; repo: string }) => {
        const allDocs: { path: string, name: string, content: string }[] = [];
        const tree: any[] = [];

        async function scanFolder(path: string = 'docs') {
            const data = await fetchDocsFolder(owner, repo, path);

            // Add items to the tree (flat for now or could be structured)
            tree.push(...data);

            const mdFiles = data.filter((item: any) => item.type === 'file' && item.name.endsWith('.md'));
            const subFolders = data.filter((item: any) => item.type === 'dir');

            // Fetch contents of MD files in this folder
            const contents = await Promise.all(
                mdFiles.map(async (file: any) => {
                    const content = await fetchFileContent(owner, repo, file.path);
                    return { path: file.path, name: file.name, content };
                })
            );
            allDocs.push(...contents);

            // Recursively scan subfolders
            for (const folder of subFolders) {
                await scanFolder(folder.path);
            }
        }

        await scanFolder();

        return { tree, contents: allDocs };
    }
);

export const fetchActiveDoc = createAsyncThunk(
    'app/fetchActiveDoc',
    async ({ owner, repo, path }: { owner: string; repo: string; path: string }, { dispatch }) => {
        // Just trigger the history fetch, content is already there
        dispatch(fetchActiveDocHistory({ owner, repo, path }));
        return { path };
    }
);

export const fetchActiveDocHistory = createAsyncThunk(
    'app/fetchActiveDocHistory',
    async ({ owner, repo, path }: { owner: string; repo: string; path: string }) => {
        const history = await fetchFileHistory(owner, repo, path);
        return history;
    }
);
