import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import SocialListItem from '../SocialListItem/SocialListItem';
import { recipeFields } from '../../../../common/constants/listOfFields';
import RecipeIngredients from '../../../app/Sidebar/RecipeIngredients/RecipeIngredients';

const RecipeDetails = ({ calories, cookingTime, recipeIngredients, isEditMode }) => (
  <div>
    {calories && <SocialListItem fieldName={recipeFields.calories} field={calories} />}
    {cookingTime && <SocialListItem fieldName={recipeFields.cookingTime} field={cookingTime} />}
    {!isEmpty(recipeIngredients) && (
      <RecipeIngredients ingredients={recipeIngredients} isEditMode={isEditMode} />
    )}
  </div>
);

RecipeDetails.propTypes = {
  calories: PropTypes.string.isRequired,
  cookingTime: PropTypes.string.isRequired,
  recipeIngredients: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};
export default RecipeDetails;
