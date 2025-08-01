import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { has, noop } from 'lodash';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import RewardsHeader from '../RewardsHeader';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import DetailsModal from '../../DetailsModal/DetailsModal';
import PropositionFooter from './PropositionFooter';
import SocialCampaignCard from '../../../social-gifts/ShopObjectCard/ProductRewardCard/SocialCampaignCard';
import { reserveProposition } from '../../../../store/newRewards/newRewardsActions';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { parseJSON } from '../../../../common/helpers/parseJSON';

import './Proposition.less';

const Proposition = ({
  handleReportClick,
  proposition,
  type,
  getProposition,
  hovered,
  isSocialProduct,
  isRejected,
  socialMap,
}) => {
  const dispatch = useDispatch();
  const authUserName = useSelector(getAuthenticatedUserName);

  if (!proposition?.object && !proposition?.user && proposition?.type !== 'giveaways') return null;

  let mainItem = proposition.object;

  if ((proposition.user || !proposition.object?.object_type) && proposition?.type !== 'giveaways') {
    const user = proposition.user || proposition.object;
    const profile = user?.posting_json_metadata
      ? parseJSON(user.posting_json_metadata)?.profile
      : null;

    mainItem = {
      name: user.name,
      object_type: 'user',
      avatar: user.profile_image,
      description: profile?.about,
      author_permlink: user.name,
    };
  }

  if (proposition?.type === 'giveaways') {
    const user = proposition?.user || proposition?.object;
    const profile = user?.posting_json_metadata
      ? parseJSON(user.posting_json_metadata)?.profile
      : null;

    mainItem = {
      name: proposition?.giveawayPostTitle || proposition?.name,
      object_type: 'post',
      author: proposition?.guideName,
      avatar: user?.profile_image,
      description: profile?.about,
      author_permlink: proposition?.giveawayPermlink,
    };
  }
  const [openDetails, setOpenDitails] = useState(false);
  const onOpenDetailsModal = () => {
    if (proposition.type === 'giveaways') {
      window.location = `/@${proposition.guideName}/${proposition.giveawayPermlink}`;
    } else setOpenDitails(true);
  };
  const propositionType =
    proposition.reserved || proposition?.reviewStatus === 'assigned' ? 'reserved' : type;

  const propositionClassList = classNames('Proposition-new', {
    'Proposition-new--hovered': hovered,
  });
  const handleReserveForPopup = () => dispatch(reserveProposition(proposition, authUserName));

  return (
    <>
      {isSocialProduct ? (
        <SocialCampaignCard
          isSocialProduct={isSocialProduct}
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
            socialMap={socialMap}
            wObject={mainItem}
            withRewards
            rewardPrice={proposition.rewardInUSD}
            payoutToken={proposition.payoutToken}
            isReserved={propositionType === 'reserved'}
            handleReportClick={handleReportClick}
            isRejected={isRejected}
            passedParent={
              !has(proposition?.requiredObject, 'author_permlink') ||
              proposition?.requiredObject?.author_permlink === mainItem.author_permlink
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
          isSocialProduct={isSocialProduct}
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
    giveawayPermlink: PropTypes.string,
    giveawayPostTitle: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    reviewStatus: PropTypes.string,
    reserved: PropTypes.bool,
    commentsCount: PropTypes.number,
    payoutTokenRateUSD: PropTypes.number,
    countReservationDays: PropTypes.number,
    totalPayed: PropTypes.number,
    payoutToken: PropTypes.string,
    object: PropTypes.shape({
      author_permlink: PropTypes.string,
      object_type: PropTypes.string,
    }),
    user: PropTypes.shape({
      posting_json_metadata: PropTypes.string,
      name: PropTypes.string,
      profile_image: PropTypes.string,
    }),
    requiredObject: PropTypes.shape(),
    requirements: PropTypes.shape({
      minPhotos: PropTypes.number,
    }),
    _id: PropTypes.string,
  }).isRequired,
  hovered: PropTypes.bool,
  isSocialProduct: PropTypes.bool,
  isRejected: PropTypes.bool,
  socialMap: PropTypes.bool,
  type: PropTypes.string,
  getProposition: PropTypes.func,
  handleReportClick: PropTypes.func,
};

Proposition.defaultProps = {
  getProposition: noop,
  type: '',
  hovered: false,
  socialMap: false,
  isRejected: false,
  handleReportClick: null,
};

export default Proposition;
