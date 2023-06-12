import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { getPropositionsKey } from '../../../../common/helpers/newRewardsHelper';
import Proposition from '../../../newRewards/reuseble/Proposition/Proposition';

const ProductRewardCard = ({ reward, isSocialProduct }) => (
  <div className="ProductRewardCard">
    {!isEmpty(reward?.secondary) &&
      reward?.secondary?.map((proposition, i) => (
        <Proposition
          isSocialProduct={isSocialProduct}
          key={getPropositionsKey(proposition, i)}
          proposition={proposition}
        />
      ))}
  </div>
);

ProductRewardCard.propTypes = {
  reward: PropTypes.arrayOf().isRequired,
  isSocialProduct: PropTypes.bool,
};

export default ProductRewardCard;
