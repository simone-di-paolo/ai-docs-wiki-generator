import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Loader2, ListTree, ChevronRight } from 'lucide-react';
import GithubSlugger from 'github-slugger';
import { selectIsLoading, selectDocsContent, selectActiveCategory } from '../../redux/selectors/appSelectors';
import './Sidebar.scss';

// Type for a parsed heading
const Sidebar: React.FC = () => {
    const isLoading = useSelector(selectIsLoading);
    const docsContent = useSelector(selectDocsContent);
    const activeCategory = useSelector(selectActiveCategory);

    // Get the content for the currently active tab
    const currentDoc = useMemo(() => {
        return docsContent.find(doc => doc.path.includes(activeCategory));
    }, [docsContent, activeCategory]);

    // Parse Markdown to extract headings
    const headings = useMemo(() => {
        if (!currentDoc?.content) return [];
        
        const slugger = new GithubSlugger();
        const headingRegex = /^(#{1,4})\s+(.+)$/gm;
        const matches = [];
        let match;

        while ((match = headingRegex.exec(currentDoc.content)) !== null) {
            matches.push({
                level: match[1].length,
                text: match[2].trim(),
                id: slugger.slug(match[2].trim())
            });
        }
        return matches;
    }, [currentDoc]);

    const handleScrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const topOffset = 80; // Offset for fixed top header area
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - topOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            // Update URL hash without jumping
            window.history.pushState(null, '', `#${id}`);
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2><ListTree className="icon" size={20} /> ON THIS PAGE</h2>
            </div>

            <div className="toc-content">
                {isLoading && docsContent.length === 0 ? (
                    <div className="loading-state">
                        <Loader2 className="icon spin" size={18} />
                        Loading contents...
                    </div>
                ) : headings.length > 0 ? (
                    <ul className="toc-list">
                        {headings.map((heading, index) => (
                            <li 
                                key={`${heading.id}-${index}`} 
                                className={`toc-item level-${heading.level}`}
                            >
                                <a 
                                    href={`#${heading.id}`}
                                    onClick={(e) => handleScrollToHeading(e, heading.id)}
                                >
                                    {heading.level > 1 && <ChevronRight size={14} className="bullet-icon"/>}
                                    {heading.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="empty-state-sidebar">
                        No headings found in this document.
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;

