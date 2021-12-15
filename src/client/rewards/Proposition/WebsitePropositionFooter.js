import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

import useQuickRewards from '../../../hooks/useQuickRewards';
import withAuthActions from '../../auth/withAuthActions';

const WebsitePropositionFooter = props => {
  const { setDish, setRestaurant, openModal } = useQuickRewards();

  const handleClickProposButton = () =>
    props.onActionInitiated(() => {
      setRestaurant(props.restaurant);
      setDish(props.dish);
      openModal();
    });

  return (
    <div>
      <Button type="primary" onClick={handleClickProposButton}>
        <b>Submit</b> dish photo
      </Button>
    </div>
  );
};

WebsitePropositionFooter.propTypes = {
  restaurant: PropTypes.shape().isRequired,
  dish: PropTypes.shape().isRequired,
  onActionInitiated: PropTypes.func.isRequired,
};

export default withAuthActions(WebsitePropositionFooter);
