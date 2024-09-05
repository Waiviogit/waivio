import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import SocialListItem from '../SocialListItem/SocialListItem';
import { recipeFields } from '../../../../common/constants/listOfFields';
import RecipeIngredients from '../../../app/Sidebar/RecipeIngredients/RecipeIngredients';
import ProductId from '../../../app/Sidebar/ProductId';
import Department from '../../../object/Department/Department';

const RecipeDetails = ({
  calories,
  cookingTime,
  recipeIngredients,
  isEditMode,
  productIdBody,
  departments,
  wobject,
  history,
}) => (
  <div>
    {calories && <SocialListItem fieldName={recipeFields.calories} field={calories} />}
    {cookingTime && <SocialListItem fieldName={recipeFields.cookingTime} field={cookingTime} />}
    {!isEmpty(recipeIngredients) && (
      <RecipeIngredients isSocial ingredients={recipeIngredients} isEditMode={isEditMode} />
    )}
    {!isEmpty(productIdBody) && (
      <div style={{ marginBottom: '8px' }}>
        <ProductId
          isSocialGifts
          isEditMode={false}
          authorPermlink={wobject.author_permlink}
          productIdBody={productIdBody}
        />
      </div>
    )}
    {!isEmpty(departments) && (
      <Department
        isRecipe
        isSocialGifts
        departments={departments}
        isEditMode={false}
        history={history}
        wobject={wobject}
      />
    )}
  </div>
);

RecipeDetails.propTypes = {
  calories: PropTypes.string.isRequired,
  cookingTime: PropTypes.string.isRequired,
  recipeIngredients: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  productIdBody: PropTypes.arrayOf().isRequired,
  departments: PropTypes.arrayOf().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};
export default RecipeDetails;
