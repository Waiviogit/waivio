import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { cleanIngredientString } from '../../../social-gifts/SocialProduct/socialProductHelper';

const RecipeIngredients = ({ ingredients, isEditMode, isSocial }) =>
  !isEmpty(ingredients) && (
    <div className={isSocial ? 'paddingBottom' : ''}>
      {!isEditMode && (
        <div className="CompanyId__title">
          <FormattedMessage
            id="object_field_recipeIngredients"
            defaultMessage="Recipe ingredients"
          />
          :
        </div>
      )}
      <div>
        <ul>
          {ingredients?.map((ingredient, i) => (
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={`${ingredient}-${i}`}
              className={'field-website__title'}
              style={{ listStyle: 'inside' }}
            >
              <Link
                to={`/discover-objects/recipe?search=${cleanIngredientString(ingredient)}`}
                className={'CompanyId__wordbreak-word'}
              >
                <span itemProp="recipeIngredient">{ingredient}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

RecipeIngredients.propTypes = {
  ingredients: PropTypes.arrayOf().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isSocial: PropTypes.bool,
};
export default RecipeIngredients;
