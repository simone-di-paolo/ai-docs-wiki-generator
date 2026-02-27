import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Book, FileText, Folder, Loader2, Clock, AlignLeft } from 'lucide-react';

import type { AppDispatch } from './redux/store';
import { fetchDocs, fetchActiveDoc } from './redux/actions/appActions';
import {
  selectTargetRepo,
  selectDocsTree,
  selectAppLoading,
  selectAppError,
  selectActiveDoc
} from './redux/selectors/appSelectors';
import RevisionHistory from './components/RevisionHistory';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const repo = useSelector(selectTargetRepo);
  const docsTree = useSelector(selectDocsTree);
  const activeDoc = useSelector(selectActiveDoc);
  const isLoading = useSelector(selectAppLoading);
  const error = useSelector(selectAppError);

  const [activeTab, setActiveTab] = useState<'article' | 'history'>('article');

  // Fetch the initial docs folder on mount
  const repoOwner = repo.owner;
  const repoName = repo.repo;

  useEffect(() => {
    if (repoOwner && repoName && docsTree.length === 0) {
      dispatch(fetchDocs({ owner: repoOwner, repo: repoName }));
    }
  }, [dispatch, repoOwner, repoName, docsTree.length]);

  const handleFileClick = (item: any) => {
    if (item.type === 'file' && typeof item.path === 'string') {
      dispatch(fetchActiveDoc({ owner: repo.owner!, repo: repo.repo!, path: item.path }));
      setActiveTab('article'); // Reset back to article reading view when a new file is clicked
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2><Book className="icon" size={24} /> Wiki Explorer</h2>
          <span className="repo-badge">{repo.owner}/{repo.repo}</span>
        </div>

        <div className="file-tree">
          {isLoading && !activeDoc && docsTree.length === 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Loader2 className="icon" size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Loading...
            </div>
          ) : (
            docsTree.map((item) => (
              <div
                key={item.sha}
                className={`tree-item ${activeDoc?.path === item.path ? 'active' : ''}`}
                onClick={() => handleFileClick(item)}
              >
                {item.type === 'dir' ? (
                  <Folder className="icon" size={18} />
                ) : (
                  <FileText className="icon" size={18} />
                )}
                <span>{item.name}</span>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="topbar">
          <span className="file-info">
            {activeDoc ? `Reading: ${activeDoc.path}` : 'Select a document'}
          </span>

          {activeDoc && (
            <div className="tabs">
              <button
                className={activeTab === 'article' ? 'active' : ''}
                onClick={() => setActiveTab('article')}
              >
                <AlignLeft size={16} /> Article
              </button>
              <button
                className={activeTab === 'history' ? 'active' : ''}
                onClick={() => setActiveTab('history')}
              >
                <Clock size={16} /> History
              </button>
            </div>
          )}
        </div>

        <div className="reader-area">
          {error && (
            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {isLoading && activeDoc ? (
            <div className="empty-state">
              <Loader2 size={48} style={{ animation: 'spin 1s linear infinite' }} />
              <p>Loading document...</p>
            </div>
          ) : activeDoc ? (
            activeTab === 'article' ? (
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeDoc.content}
                </ReactMarkdown>
              </div>
            ) : (
              <RevisionHistory />
            )
          ) : (
            <div className="empty-state">
              <FileText size={64} />
              <h3>Welcome to your AI Code Wiki</h3>
              <p>Select a markdown file from the sidebar to start reading.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
