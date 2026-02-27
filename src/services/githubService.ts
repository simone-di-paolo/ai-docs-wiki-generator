const GITHUB_API_URL = 'https://api.github.com';

const getHeaders = () => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };
};

export const fetchDocsFolder = async (owner: string, repo: string, path: string = 'docs') => {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

export const fetchFileContent = async (owner: string, repo: string, path: string) => {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Decode base64 content
    let content = decodeURIComponent(escape(atob(data.content)));

    // Remove enclosing markdown code blocks if the AI generated them by mistake
    const codeBlockMatch = content.match(/^```(?:markdown|md)?\s*([\s\S]*?)\s*```$/i);
    if (codeBlockMatch) {
        content = codeBlockMatch[1];
    }

    return content;
};

export const fetchFileHistory = async (owner: string, repo: string, path: string) => {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/commits?path=${path}`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};
