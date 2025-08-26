import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { cleanIngredientString } from '../../../social-gifts/SocialProduct/socialProductHelper';
import { getShowPostModal } from '../../../../store/appStore/appSelectors';

const RecipeIngredients = ({ ingredients, isEditMode, isSocial }) => {
  const showPostModal = useSelector(getShowPostModal);

  return (
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
                  <span {...(showPostModal ? {} : { itemProp: 'recipeIngredient' })}>
                    {ingredient}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

RecipeIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isSocial: PropTypes.bool,
};
export default RecipeIngredients;
