import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import SocialListItem from '../SocialListItem/SocialListItem';
import { recipeFields } from '../../../../common/constants/listOfFields';
import RecipeIngredients from '../../../app/Sidebar/RecipeIngredients/RecipeIngredients';
import ProductId from '../../../app/Sidebar/ProductId';

const RecipeDetails = ({
  calories,
  cookingTime,
  recipeIngredients,
  isEditMode,
  productIdBody,
  authorPermlink,
}) => (
  <div>
    {calories && <SocialListItem fieldName={recipeFields.calories} field={calories} />}
    {cookingTime && <SocialListItem fieldName={recipeFields.cookingTime} field={cookingTime} />}
    {!isEmpty(recipeIngredients) && (
      <RecipeIngredients ingredients={recipeIngredients} isEditMode={isEditMode} />
    )}
    {!isEmpty(productIdBody) && (
      <div style={{ marginBottom: '8px' }}>
        <ProductId
          isSocialGifts
          isEditMode={false}
          authorPermlink={authorPermlink}
          productIdBody={productIdBody}
        />
      </div>
    )}
  </div>
);

RecipeDetails.propTypes = {
  calories: PropTypes.string.isRequired,
  cookingTime: PropTypes.string.isRequired,
  authorPermlink: PropTypes.string.isRequired,
  recipeIngredients: PropTypes.shape().isRequired,
  productIdBody: PropTypes.arrayOf().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};
export default RecipeDetails;
