import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, FileText } from 'lucide-react';

import type { AppDispatch } from './redux/store';
import { fetchDocs } from './redux/actions/appActions';
import { setActiveDocPath } from './redux/actions/appActions';
import {
  selectTargetOwner,
  selectTargetRepo,
  selectDocsTree,
  selectIsLoading,
  selectError,
  selectDocsContent,
  selectActiveDocPath,
  selectTheme
} from './redux/selectors/appSelectors';
import RevisionHistory from './components/RevisionHistory';
import AppLayout from './components/layout/AppLayout';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const repoOwner = useSelector(selectTargetOwner);
  const repoName = useSelector(selectTargetRepo);
  const docsTree = useSelector(selectDocsTree);
  const docsContent = useSelector(selectDocsContent);
  const activeDocPath = useSelector(selectActiveDocPath);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const theme = useSelector(selectTheme);

  const [activeTab, setActiveTab] = useState<'article' | 'history'>('article');

  useEffect(() => {
    if (repoOwner && repoName && docsTree.length === 0) {
      dispatch(fetchDocs({ owner: repoOwner, repo: repoName }));
    }
  }, [dispatch, repoOwner, repoName, docsTree.length]);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  const observer = useRef<IntersectionObserver | null>(null);

  // If activeDocContent changes (meaning user picked a new file), reset to article tab
  useEffect(() => {
    if (activeDocPath) {
      setActiveTab('article');
    }
  }, [activeDocPath]);

  // Intersection Observer to track scroll positions
  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const path = entry.target.getAttribute('data-path');
          if (path) {
            dispatch(setActiveDocPath(path));
          }
        }
      });
    }, {
      root: document.querySelector('.documentation-container'), // Watch scroll inside this area
      rootMargin: '-10% 0px -70% 0px', // Trigger when element is near top
      threshold: 0
    });

    const sections = document.querySelectorAll('.doc-section');
    sections.forEach(section => observer.current?.observe(section));

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [docsContent, dispatch]);

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      hasActiveDoc={docsContent.length > 0}
    >
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isLoading && docsContent.length === 0 ? (
        <div className="empty-state">
          <Loader2 size={48} className="spin" />
          <p>Loading repository and documentation...</p>
        </div>
      ) : docsContent.length > 0 ? (
        activeTab === 'article' ? (
          <div className="markdown-body">
            {docsContent.map((doc) => (
              <section
                key={doc.path}
                id={`wiki-${doc.path.replace(/[^a-zA-Z0-9-]/g, '-')}`}
                data-path={doc.path}
                className="doc-section"
                style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-muted)' }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {doc.content}
                </ReactMarkdown>
              </section>
            ))}
          </div>
        ) : (
          <RevisionHistory />
        )
      ) : (
        <div className="empty-state">
          <div className="icon-wrapper">
            <FileText size={64} />
          </div>
          <h3>Welcome to your AI Code Wiki</h3>
          <p>No documentation found or please select a source.</p>
        </div>
      )}
    </AppLayout>
  );
}

export default App;
