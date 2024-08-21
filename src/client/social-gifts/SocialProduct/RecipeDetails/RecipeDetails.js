import React from 'react';
import PropTypes from 'prop-types';
import SocialListItem from '../SocialListItem/SocialListItem';
import { recipeFields } from '../../../../common/constants/listOfFields';

const RecipeDetails = ({ calories, cookingTime }) => (
  <div>
    {calories && <SocialListItem fieldName={recipeFields.calories} field={calories} />}
    {cookingTime && <SocialListItem fieldName={recipeFields.cookingTime} field={cookingTime} />}
  </div>
);

RecipeDetails.propTypes = {
  calories: PropTypes.string.isRequired,
  cookingTime: PropTypes.string.isRequired,
};
export default RecipeDetails;
