import { isEmpty, get } from 'lodash';
import moment from 'moment/moment';
import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { injectIntl } from 'react-intl';
import withAuthActions from '../../../auth/withAuthActions';
import useTemplateProvider from '../../../../designTemplates/TemplateProvider';
import './SocialCampaignCard.less';
import useQuery from '../../../../hooks/useQuery';

const SocialCampaignCard = ({
  maxReward,
  sponsor,
  openDetailsModal,
  proposition,
  handleReserveForPopup,
  getProposition,
  propositionType,
  isSocialProduct,
  isCampaign,
  intl,
}) => {
  const templateComponents = useTemplateProvider();
  const SocialCampaignCardView = templateComponents?.SocialCampaignCardView;
  const minPhotos = proposition?.requirements?.minPhotos;
  const propositionContest = proposition.type === 'contests_object';
  const propositionGiveaway = proposition.type === 'giveaways_object';
  const isSpecialCampaign = propositionContest || propositionGiveaway;
  const isMention = proposition.type === 'mentions';
  const daysLeft =
    proposition?.nextEventDate && !isEmpty(proposition?.nextEventDate)
      ? Math.max(
          0,
          moment
            .utc(proposition.nextEventDate)
            .startOf('day')
            .diff(moment().startOf('day'), 'days'),
        )
      : null;

  const getCampaignText = (isGiveaway, days) => {
    if (days === 0) return isGiveaway ? ' - Today!' : ' - Win Today!';
    if (days === 1) return isGiveaway ? ' - 1 Day Left!' : ' - Win in 1 Day!';

    return isGiveaway ? ` - ${days} Days Left!` : ` - Win in ${days} Days!`;
  };

  const specialAmount = propositionContest
    ? get(proposition, ['contestRewards', 0, 'rewardInUSD'], maxReward)
    : maxReward;

  const buttonLabel =
    maxReward === proposition.minReward
      ? intl.formatMessage({ id: 'earn', defaultMessage: 'Earn' })
      : intl.formatMessage({ id: 'rewards_details_earn_up_to', defaultMessage: 'Earn up to' });
  const history = useHistory();
  const query = useQuery();
  let pathname = history.location.pathname?.includes('/rewards/')
    ? `${history.location.pathname}/eligible`
    : `/rewards/${proposition.reach?.[0] || 'global'}/all`;

  if (query.get('showAll')) {
    pathname = `${history.location.pathname}/all`;
  }
  const goToProducts = () => {
    history.push(`${pathname}/${proposition?.object?.author_permlink}`);
  };

  const getCampaignTitle = () => {
    if (isSpecialCampaign) {
      return {
        amount: specialAmount,
        text: propositionGiveaway ? 'Giveaway' : 'Contest',
        days: daysLeft !== null ? getCampaignText(propositionGiveaway, daysLeft) : null,
      };
    }

    return {
      amount: maxReward,
      minPhotos,
    };
  };

  if (!SocialCampaignCardView) return null;

  return (
    <SocialCampaignCardView
      maxReward={maxReward}
      sponsor={sponsor}
      openDetailsModal={openDetailsModal}
      proposition={proposition}
      handleReserveForPopup={handleReserveForPopup}
      getProposition={getProposition}
      propositionType={propositionType}
      isSocialProduct={isSocialProduct}
      isCampaign={isCampaign}
      minPhotos={minPhotos}
      propositionContest={propositionContest}
      propositionGiveaway={propositionGiveaway}
      isSpecialCampaign={isSpecialCampaign}
      isMention={isMention}
      daysLeft={daysLeft}
      getCampaignText={getCampaignText}
      specialAmount={specialAmount}
      buttonLabel={buttonLabel}
      goToProducts={goToProducts}
      getCampaignTitle={getCampaignTitle}
    />
  );
};

SocialCampaignCard.propTypes = {
  handleReserveForPopup: PropTypes.func.isRequired,
  openDetailsModal: PropTypes.func.isRequired,
  getProposition: PropTypes.func.isRequired,
  sponsor: PropTypes.string.isRequired,
  propositionType: PropTypes.string.isRequired,
  proposition: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  maxReward: PropTypes.number.isRequired,
  isSocialProduct: PropTypes.bool,
  isCampaign: PropTypes.bool,
};

SocialCampaignCard.defaultProps = {
  hovered: false,
};

export default withAuthActions(injectIntl(SocialCampaignCard));
