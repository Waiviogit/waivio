import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import './Favorite.less';

const propTypes = {
    updateFavorite: PropTypes.func.isRequired,
    quoteSecurity: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired
};

export const Favorite = ({intl, isFavorite, updateFavorite}) => {
    const classIsFavorite = isFavorite ? 'st-icon-favorite-true' : 'st-icon-favorite-false';
    const handleClickUpdateFavorite = () => updateFavorite();
    return (
        <div
          title={intl.formatMessage(isFavorite ? { id: 'tips.removeFromFavorites', defaultMessage: 'Remove from favorites' }
                  : {id: 'tips.addToFavorites', defaultMessage: 'Add to favorites'})}
          className={classIsFavorite}
          onClick={handleClickUpdateFavorite}
        >
            <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
        </div>
    );
};

Favorite.propTypes = propTypes;

export default injectIntl(Favorite);
