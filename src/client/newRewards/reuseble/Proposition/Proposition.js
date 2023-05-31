import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { has, noop } from 'lodash';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import RewardsHeader from '../RewardsHeader';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import DetailsModal from '../../DetailsModal/DetailsModal';
import PropositionFooter from './PropositionFooter';
import { getIsSocial } from '../../../../store/appStore/appSelectors';
import SocialCampaignCard from '../../../social-gifts/ShopObjectCard/ProductRewardCard/SocialCampaignCard';
import { reserveProposition } from '../../../../store/newRewards/newRewardsActions';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

import './Proposition.less';

const Proposition = ({ proposition, type, getProposition, hovered }) => {
  const isSocialGifts = useSelector(getIsSocial);
  const dispatch = useDispatch();
  const authUserName = useSelector(getAuthenticatedUserName);

  if (!proposition?.object) return null;
  const [openDetails, setOpenDitails] = useState(false);
  const onOpenDetailsModal = () => setOpenDitails(true);
  const propositionType =
    proposition.reserved || proposition?.reviewStatus === 'assigned' ? 'reserved' : type;

  const propositionClassList = classNames('Proposition-new', {
    'Proposition-new--hovered': hovered,
  });
  const handleReserveForPopup = () => dispatch(reserveProposition(proposition, authUserName));

  return (
    <>
      {isSocialGifts ? (
        <SocialCampaignCard
          maxReward={proposition.rewardInUSD}
          sponsor={proposition.guideName}
          proposition={proposition}
          getProposition={getProposition}
          propositionType={propositionType}
          handleReserveForPopup={handleReserveForPopup}
          openDetailsModal={onOpenDetailsModal}
        />
      ) : (
        <div className={propositionClassList}>
          <div className="Proposition-new__header">
            <RewardsHeader proposition={proposition} />
          </div>
          <ObjectCardView
            wObject={proposition.object}
            withRewards
            rewardPrice={proposition.rewardInUSD}
            payoutToken={proposition.payoutToken}
            isReserved={propositionType === 'reserved'}
            passedParent={
              !has(proposition?.requiredObject, 'author_permlink') ||
              proposition?.requiredObject?.author_permlink === proposition.object.author_permlink
                ? null
                : proposition?.requiredObject
            }
            rate={proposition.payoutTokenRateUSD}
          />
          <PropositionFooter
            type={propositionType}
            countReservationDays={proposition?.countReservationDays}
            commentsCount={proposition?.commentsCount}
            openDetailsModal={onOpenDetailsModal}
            proposition={proposition}
            getProposition={getProposition}
          />
        </div>
      )}
      {openDetails && (
        <DetailsModal
          proposition={{ ...proposition, reserved: propositionType === 'reserved' }}
          isModalDetailsOpen={openDetails}
          toggleModal={() => setOpenDitails(!openDetails)}
          reserveOnClickHandler={() => setOpenDitails(false)}
        />
      )}
    </>
  );
};

Proposition.propTypes = {
  proposition: PropTypes.shape({
    rewardInUSD: PropTypes.number,
    guideName: PropTypes.string,
    reviewStatus: PropTypes.string,
    reserved: PropTypes.bool,
    commentsCount: PropTypes.number,
    payoutTokenRateUSD: PropTypes.number,
    countReservationDays: PropTypes.number,
    totalPayed: PropTypes.number,
    payoutToken: PropTypes.string,
    object: PropTypes.shape({
      author_permlink: PropTypes.string,
    }),
    requiredObject: PropTypes.shape(),
    requirements: PropTypes.shape({
      minPhotos: PropTypes.number,
    }),
    _id: PropTypes.string,
  }).isRequired,
  hovered: PropTypes.bool,
  type: PropTypes.string,
  getProposition: PropTypes.func,
};

Proposition.defaultProps = {
  getProposition: noop,
  type: '',
  hovered: false,
};

export default Proposition;
