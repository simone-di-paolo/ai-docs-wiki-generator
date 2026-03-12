import { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeMermaid from 'rehype-mermaid';
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
  selectActiveCategory,
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
  const activeCategory = useSelector(selectActiveCategory);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const theme = useSelector(selectTheme);

  const [activeTab, setActiveTab] = useState<'article' | 'history'>('article');

  // Filter doc based on current category
  const currentDoc = useMemo(() => {
    return docsContent.find(doc => doc.path.includes(activeCategory));
  }, [docsContent, activeCategory]);


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
      ) : currentDoc ? (
        activeTab === 'article' ? (
          <div className="markdown-body">
              <section
                key={currentDoc.path}
                id={`wiki-${currentDoc.path.replace(/[^a-zA-Z0-9-]/g, '-')}`}
                data-path={currentDoc.path}
                className="doc-section"
                style={{ marginBottom: '4rem', paddingBottom: '2rem' }}
              >
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSlug, [rehypeMermaid, { strategy: 'img-svg' }]]}
                >
                  {currentDoc.content}
                </ReactMarkdown>
              </section>
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
