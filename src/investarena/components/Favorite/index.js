import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import Favorite from './Favorite';
import { makeIsFavoriteState } from '../../redux/selectors/favoriteQuotesSelectors';
import { singleton } from '../../platform/singletonPlatform';
import { toggleModal } from '../../redux/actions/modalsActions';

const propTypes = {
    updateFavorite: PropTypes.func.isRequired,
    quoteSecurity: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired
};

const FavoriteContainer = (props) => <Favorite {...props}/>;

FavoriteContainer.propTypes = propTypes;

const mapState = () => {
    const getIsFavoriteState = makeIsFavoriteState();
    return (state, ownProps) => ({
            isFavorite: getIsFavoriteState(state, ownProps),
        });
};

function mergeProps (stateProps, dispatchProps, ownProps) {
    const { dispatch } = dispatchProps;
    const { quoteSecurity } = ownProps;
    return {
        ...stateProps,
        ...ownProps,
        updateFavorite: () => {
            // if (isSignIn) {
             //   singleton.platform.updateFavorite(quoteSecurity);
            // } else {
            //     dispatch(toggleModal('authorizeSinglePost'));
            // }
        }
    };
}

export default connect(mapState, null, mergeProps)(FavoriteContainer);
