import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { isMobile } from '../../../../common/helpers/apiHelpers';

const RecipeIngredients = ({ ingredients, isEditMode, isSocial }) =>
  !isEmpty(ingredients) && (
    <div className={isSocial ? 'flex' : ''}>
      {!isEditMode && (
        <div className="CompanyId__title">
          <FormattedMessage
            id="object_field_recipeIngredients"
            defaultMessage="Recipe ingredients"
          />
          :
        </div>
      )}
      {ingredients?.map((ingredient, i) => (
        <div key={ingredient} className={'field-website__title'}>
          <Link
            to={`/discover-objects/recipe?search=${ingredient}`}
            className={isSocial ? 'ml2' : 'CompanyId__wordbreak'}
          >
            {ingredient}
          </Link>
          {isSocial && !isMobile() && i !== ingredients.length - 1 && ', '}{' '}
        </div>
      ))}
    </div>
  );

RecipeIngredients.propTypes = {
  ingredients: PropTypes.arrayOf().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isSocial: PropTypes.bool.isRequired,
};
export default RecipeIngredients;
