import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import PostContent from '../../../post/PostContent';

const RecipePost = ({ recipePost, signature }) => {
  const match = useRouteMatch();

  return (
    <div>
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
  signature: PropTypes.string.isRequired,
};

export default RecipePost;
