import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { has } from 'lodash';
import { connect } from 'react-redux';
import PostContent from '../../../post/PostContent';
import PinButton from '../../../widgets/PinButton';
import { handlePinPost } from '../../../../store/postsStore/postActions';

import { getObject } from '../../../../store/wObjectStore/wObjectSelectors';

import { getVotePercent } from '../../../../store/settingsStore/settingsSelectors';
import { getPinnedPostsUrls } from '../../../../store/feedStore/feedSelectors';
import {
  getAuthenticatedUser,
  getIsAuthenticated,
} from '../../../../store/authStore/authSelectors';
import './RecipePost.less';

const RecipePost = ({
  recipePost,
  user,
  signature,
  pinnedPostsUrls,
  userVotingPower,
  wobject,
  handlePinRecipePost,
  isAuth,
}) => {
  const match = useRouteMatch();
  const currentUserPin = pinnedPostsUrls?.includes(recipePost.url);
  const tooltipTitle = (
    <FormattedMessage
      id={currentUserPin ? 'unpin' : 'pin'}
      defaultMessage={currentUserPin ? 'Unpin' : 'Pin'}
    />
  );
  const pinClassName =
    recipePost?.pin || (has(recipePost, 'currentUserPin') && !recipePost.currentUserPin)
      ? 'pin-grey'
      : 'pin-outlined';

  return (
    <div className={'RecipePost'}>
      {isAuth && (
        <div className="RecipePost__pin-wrap">
          <PinButton
            tooltipTitle={tooltipTitle}
            handlePinPost={handlePinRecipePost}
            userVotingPower={userVotingPower}
            wobject={wobject}
            pinnedPostsUrls={pinnedPostsUrls}
            match={match}
            currentUserPin={currentUserPin}
            user={user}
            post={recipePost}
            pinClassName={pinClassName}
          />
        </div>
      )}
      <span className={'StoryFull__title'}>Top Recipe</span>
      <PostContent
        isRecipe
        isThread={false}
        content={recipePost}
        signature={signature}
        isOriginalPost={match?.params.original}
      />
    </div>
  );
};

RecipePost.propTypes = {
  recipePost: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  pinnedPostsUrls: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  signature: PropTypes.string.isRequired,
  handlePinRecipePost: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired,
  userVotingPower: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  userVotingPower: getVotePercent(state),
  wobject: getObject(state),
  pinnedPostsUrls: getPinnedPostsUrls(state),
  user: getAuthenticatedUser(state),
  isAuth: getIsAuthenticated(state),
});

const mapDispatchToProps = {
  handlePinRecipePost: handlePinPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipePost);
