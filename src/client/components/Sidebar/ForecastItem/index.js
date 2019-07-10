import {connect} from 'react-redux';
import React from 'react';
import _ from 'lodash';
import {makeGetQuoteSettingsState} from '../../../../investarena/redux/selectors/quotesSettingsSelectors';
import {makeGetQuoteState} from '../../../../investarena/redux/selectors/quotesSelectors';
import {makeGetPermlinkFromPostsState} from '../../../../investarena/redux/selectors/postsSelectors';
import ForecastItem from './ForecastItem';

const ForecastItemContainer = props => <ForecastItem {...props} />;
const mapState = () => {
  const getQuoteState = makeGetQuoteState();
  const getQuoteSettingsState = makeGetQuoteSettingsState();
  const getPermlinkFromPosts = makeGetPermlinkFromPostsState();
  return (state, ownProps) => ({
    quote: getQuoteState(state, ownProps),
    quoteSettings: getQuoteSettingsState(state, ownProps),
    permlink:
      state.posts.list && _.find(state.posts.list, 'forecast')
        ? getPermlinkFromPosts(state, ownProps)
        : {},
    isSignIn: false,
  });
};

export default connect(mapState)(ForecastItemContainer);
