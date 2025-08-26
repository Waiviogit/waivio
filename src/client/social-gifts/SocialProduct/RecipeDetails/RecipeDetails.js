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
  nutrition,
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
    {nutrition && <SocialListItem fieldName={recipeFields.nutrition} field={nutrition} />}
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
  calories: PropTypes.string,
  nutrition: PropTypes.string,
  cookingTime: PropTypes.string,
  recipeIngredients: PropTypes.shape(),
  wobject: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  productIdBody: PropTypes.arrayOf(PropTypes.shape()),
  departments: PropTypes.arrayOf(),
  isEditMode: PropTypes.bool.isRequired,
};
export default RecipeDetails;
