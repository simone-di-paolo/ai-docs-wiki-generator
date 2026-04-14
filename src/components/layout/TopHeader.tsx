import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectActiveCategory } from '../../redux/selectors/appSelectors';
import { setActiveCategory } from '../../redux/actions/appActions';
import './TopHeader.scss';

const TopHeader: React.FC = () => {
    const dispatch = useDispatch();
    const activeCategory = useSelector(selectActiveCategory);

    const categories: Array<{ id: 'architettura' | 'funzionale' | 'sviluppo', label: string }> = [
        { id: 'architettura', label: 'Architecture' },
        { id: 'funzionale', label: 'Functional' },
        { id: 'sviluppo', label: 'Development' }
    ];

    return (
        <div className="top-header-tabs">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => dispatch(setActiveCategory(cat.id))}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
};

export default TopHeader;
