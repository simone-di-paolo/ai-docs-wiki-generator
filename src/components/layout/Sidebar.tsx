import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Folder, FileText, Loader2, Book } from 'lucide-react';
import { selectDocsTree, selectIsLoading, selectActiveDocPath, selectTargetOwner, selectTargetRepo, selectDocsContent } from '../../redux/selectors/appSelectors';
import { fetchActiveDoc } from '../../redux/actions/appActions';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch<any>();
    const docsTree = useSelector(selectDocsTree);
    const isLoading = useSelector(selectIsLoading);
    const activeDocPath = useSelector(selectActiveDocPath);
    const docsContent = useSelector(selectDocsContent);
    const owner = useSelector(selectTargetOwner);
    const repo = useSelector(selectTargetRepo);

    const handleFileClick = (item: any) => {
        if (item.type === 'file' && typeof item.path === 'string') {
            dispatch(fetchActiveDoc({ owner, repo, path: item.path }));

            // Scroll to section
            const elementId = `wiki-${item.path.replace(/[^a-zA-Z0-9-]/g, '-')}`;
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2><Book className="icon" size={20} /> Repository Explorer</h2>
                <span className="repo-badge">{owner}/{repo}</span>
            </div>

            <div className="file-tree">
                {isLoading && docsContent.length === 0 ? (
                    <div className="loading-state">
                        <Loader2 className="icon spin" size={18} />
                        Loading repository...
                    </div>
                ) : (
                    docsTree.map((item) => (
                        <div
                            key={item.sha}
                            className={`tree-item ${item.type} ${item.path === activeDocPath ? 'active' : ''}`}
                            onClick={() => handleFileClick(item)}
                        >
                            {item.type === 'dir' ? (
                                <Folder className="icon folder-icon" size={16} />
                            ) : (
                                <FileText className="icon file-icon" size={16} />
                            )}
                            <span className="item-name">
                                {item.type === 'dir'
                                    ? item.name.charAt(0).toUpperCase() + item.name.slice(1).replace(/-/g, ' ')
                                    : item.name}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
