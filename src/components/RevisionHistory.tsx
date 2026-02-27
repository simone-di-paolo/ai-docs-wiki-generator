import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveDocHistory, selectIsHistoryLoading } from '../redux/selectors/appSelectors';
import { GitCommit, Loader2, User } from 'lucide-react';
import './RevisionHistory.scss';

const RevisionHistory: React.FC = () => {
    const history = useSelector(selectActiveDocHistory);
    const isLoading = useSelector(selectIsHistoryLoading);

    if (isLoading) {
        return (
            <div className="history-empty-state">
                <Loader2 size={32} className="spinner" />
                <p>Fetching revision history...</p>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="history-empty-state">
                <GitCommit size={32} />
                <p>No history found for this document.</p>
            </div>
        );
    }

    return (
        <div className="revision-history">
            <div className="timeline">
                {history.map((commitData: any, index: number) => {
                    const commit = commitData.commit;
                    const author = commit.author;
                    const date = new Date(author.date);

                    return (
                        <div key={commitData.sha} className="timeline-item">
                            <div className="timeline-marker">
                                <div className="dot"></div>
                                {index < history.length - 1 && <div className="line"></div>}
                            </div>

                            <div className="timeline-content">
                                <div className="commit-header">
                                    <span className="commit-message">{commit.message}</span>
                                    <a
                                        href={commitData.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="commit-sha"
                                    >
                                        {commitData.sha.substring(0, 7)}
                                    </a>
                                </div>

                                <div className="commit-meta">
                                    <div className="author-info">
                                        {commitData.author?.avatar_url ? (
                                            <img src={commitData.author.avatar_url} alt="avatar" className="avatar" />
                                        ) : (
                                            <User size={14} className="icon-fallback" />
                                        )}
                                        <span className="author-name">{author.name}</span>
                                    </div>
                                    <span className="commit-date">
                                        {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RevisionHistory;
