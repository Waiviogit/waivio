import _ from "lodash";
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import Favorite from './Favorite';
import { makeIsFavoriteState } from '../../redux/selectors/favoriteQuotesSelectors';
import { singleton } from '../../platform/singletonPlatform';
// import { toggleModal } from '../../redux/actions/modalsActions';
import {getIsAuthenticated} from "../../../client/reducers";
import {getPlatformNameState} from "../../redux/selectors/platformSelectors";
import {setFavoritesLS} from "../../helpers/localStorageHelpers";
import {updateFavorite} from "../../redux/actions/favoriteQuotesActions";

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
            isSignIn: getIsAuthenticated(state),
            isPlatformConnect: getPlatformNameState(state) !== 'widgets'
        });
};

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { isSignIn, isPlatformConnect} = stateProps;
    const { quoteSecurity } = ownProps;
    const { dispatch } = dispatchProps;
  return {
        ...stateProps,
        ...ownProps,
        updateFavorite: () => {
            if (isSignIn && isPlatformConnect) {
               singleton.platform.updateFavorite(quoteSecurity);
            } else {
              dispatch(updateFavorite(quoteSecurity));
              setFavoritesLS(quoteSecurity)
            }
        }
    };
}

export default connect(mapState, null, mergeProps)(FavoriteContainer);
