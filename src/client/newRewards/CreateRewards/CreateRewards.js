import { get, includes, isEmpty, map, size, uniqBy } from 'lodash';
import React from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form, message } from 'antd';
import {
  createNewCampaing,
  getAuthorsChildWobjects,
  getNewCampaingById,
  getObjectsByIds,
  updateCampaing,
} from '../../../waivioApi/ApiClient';
import * as apiConfig from '../../../waivioApi/config.json';
import { NEW_PATH_NAME_MANAGE } from '../../../common/constants/rewards';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '../../../store/authStore/authSelectors';
import CreateFormRenderer from '../../rewards/Create-Edit/CreateFormRenderer';
import { getMinExpertise, getMinExpertisePrepared } from '../../rewards/rewardsHelper';
import { getRate, getRewardFund } from '../../../store/appStore/appSelectors';
import '../../rewards/Create-Edit/CreateReward.less';
import { getTokenBalance, getTokenRates } from '../../../store/walletStore/walletActions';

const initialState = {
  campaignName: '',
  campaignType: '',
  budget: null,
  reward: null,
  primaryObject: {},
  secondaryObjectsList: [],
  pageObjects: [],
  sponsorsList: [],
  reservationPeriod: 7,
  compensationAccount: {},
  loading: false,
  parentPermlink: '',
  targetDays: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  },
  receiptPhoto: false,
  minPhotos: 2,
  minExpertise: 0,
  minFollowers: 0,
  minPosts: 0,
  eligibleDays: 15,
  description: '',
  expiredAt: null,
  usersLegalNotice: '',
  agreement: {},
  commissionAgreement: 5,
  iAgree: false,
  campaignId: '',
  isDuplicate: false,
  isOpenAddChild: false,
  currency: 'USD',
  payoutToken: 'WAIV',
};

@withRouter
@Form.create()
@injectIntl
@connect(
  state => ({
    locale: getLocale(state),
    userName: getAuthenticatedUserName(state),
    user: getAuthenticatedUser(state),
    rate: getRate(state),
    rewardFund: getRewardFund(state),
  }),
  { getTokenBalance, getTokenRates },
)
class CreateRewards extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    locale: PropTypes.string,
    user: PropTypes.shape(),
    form: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
    rewardFund: PropTypes.shape().isRequired,
    getTokenBalance: PropTypes.func.isRequired,
    getTokenRates: PropTypes.func.isRequired,
  };
  static defaultProps = {
    userName: '',
    locale: '',
    user: {},
    usedLocale: 'en-US',
    form: {},
  };
  state = initialState;

  componentDidMount = async () => {
    this.getCampaingDetailAndSetInState();
    this.props.getTokenBalance('WAIV', this.props.userName);
    this.props.getTokenRates('WAIV', this.props.userName);
  };

  componentDidUpdate(prevProps) {
    const { campaign } = this.state;
    const matchPath = get(this.props.match, ['params', '0']);

    if (campaign)
      if (prevProps.match.params[0] !== matchPath) {
        const isDuplicate = includes(matchPath, 'duplicate');
        const isDetails = includes(matchPath, 'details');
        const isCreate = includes(matchPath, 'create');

        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ loading: true });

        if (isCreate)
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState(initialState);
        if (isDetails) this.getCampaingDetailAndSetInState();
        if (isDuplicate)
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            isDuplicate,
            isDisabled: false,
            loading: false,
            campaignName: `Copy ${campaign.name}`,
          });
      }
  }

  getCampaingDetailAndSetInState = async () => {
    if (this.props.match.params.campaignId) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ loading: true });

      const campaign = await getNewCampaingById(this.props.match.params.campaignId);
      const isExpired =
        campaign.status === 'expired' || moment(campaign.expiredAt).unix() < moment().unix();
      const isDuplicate = this.props.match.params?.[0] === 'duplicate';
      const isDisabled = campaign.status !== 'pending' && !isDuplicate;
      const authorPermlinks = [
        campaign.requiredObject,
        ...campaign.agreementObjects,
        // ...campaign.matchBots,
        ...campaign.objects,
      ];
      const combinedObjects = await getObjectsByIds({
        authorPermlinks,
        limit: size(authorPermlinks),
      });

      const sponsors = campaign.matchBots;
      const primaryObject = combinedObjects.wobjects.find(
        wobj => wobj.author_permlink === campaign.requiredObject,
      );
      const secondaryObjects = combinedObjects.wobjects.filter(wobj =>
        includes(campaign.objects, wobj.author_permlink),
      );
      const agreementObjects = combinedObjects.wobjects.find(
        wobj => wobj.author_permlink === campaign.agreementObjects[0],
      );

      const minExpertise = getMinExpertise({
        campaignMinExpertise: campaign.userRequirements.minExpertise,
        rewardFundRecentClaims: this.props.rewardFund.recent_claims,
        rewardFundRewardBalance: this.props.rewardFund.reward_balance,
        rate: this.props.rate,
      });

      Promise.all([primaryObject, secondaryObjects, agreementObjects, sponsors]).then(values => {
        this.setState({
          campaign,
          currency: campaign.currency,
          iAgree: true,
          loading: false,
          campaignName: `${isDuplicate ? `Copy ${campaign.name}` : campaign.name}`,
          campaignType: campaign.type,
          budget: campaign.budget.toString(),
          reward: campaign.reward.toString(),
          primaryObject: values[0],
          secondaryObjectsList: values[1].map(obj => obj),
          pageObjects: !isEmpty(values[2]) ? [values[2]] : [],
          sponsorsList: !isEmpty(sponsors) ? values[3] : [],
          reservationPeriod: campaign.countReservationDays,
          receiptPhoto: campaign.requirements.receiptPhoto,
          minExpertise,
          minFollowers: campaign.userRequirements.minFollowers,
          minPosts: campaign.userRequirements.minPosts,
          targetDays: campaign.reservationTimetable,
          minPhotos: campaign.requirements.minPhotos,
          description: campaign.description,
          commissionAgreement: parseInt(campaign.commissionAgreement * 100, 10),
          campaignId: campaign._id,
          compensationAccount: {
            account: campaign.compensationAccount,
          },
          eligibleDays: campaign.frequencyAssign,
          usersLegalNotice: campaign.usersLegalNotice,
          expiredAt: isExpired ? moment().add(2, 'days') : moment(campaign.expiredAt),
          isDuplicate,
          isDisabled,
        });
      });
    }
  };

  prepareSubmitData = (data, userName) => {
    const { campaignId, pageObjects } = this.state;
    const { rewardFund, rate } = this.props;
    const objects = map(data.secondaryObject, o => o.author_permlink);
    const agreementObjects = size(pageObjects) ? map(pageObjects, o => o.author_permlink) : [];
    const matchBots = data.sponsorsList;
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    const minExpertise = getMinExpertisePrepared({
      minExpertise: data.minExpertise,
      rewardFund,
      rate,
    });

    const preparedObject = {
      requiredObject: data.primaryObject.author_permlink,
      guideName: userName,
      name: data.campaignName,
      app: appName,
      type: data.type,
      budget: Number(data.budget),
      reward: Number(data.reward),
      requirements: {
        minPhotos: +data.minPhotos,
        receiptPhoto: data.receiptPhoto,
      },
      userRequirements: {
        minFollowers: +data.minFollowers,
        minPosts: +data.minPosts,
        minExpertise: +minExpertise,
      },
      commissionAgreement: data.commissionAgreement / 100,
      objects,
      agreementObjects,
      compensationAccount: data?.compensationAccount?.account ?? '',
      usersLegalNotice: data.usersLegalNotice || '',
      currency: data.baseCurrency,
      payoutToken: this.state.payoutToken,
      matchBots,
      expiredAt: data.expiredAt._d,
      reservationTimetable: data.targetDays,
      frequencyAssign: +data.eligibleDays,
      countReservationDays: data.reservationPeriod,
    };

    if (data.description) preparedObject.description = data.description;
    if (this.props.match?.params?.[0] === 'details') preparedObject._id = campaignId;

    return preparedObject;
  };

  manageRedirect = () => this.props.history.push(NEW_PATH_NAME_MANAGE);

  handleSetState = (stateData, callbackData) => {
    const { setFieldsValue } = this.props.form;

    this.setState({ ...stateData }, () => setFieldsValue(callbackData));
  };

  handlers = {
    handleAddSponsorToList: obj => {
      const sponsors = [...this.state.sponsorsList, obj];

      this.setState({ sponsorsList: [...sponsors] }, () =>
        this.props.form.setFieldsValue({ sponsorsList: this.state.sponsorsList }),
      );
    },

    removeSponsorObject: obj => {
      this.setState(
        prevState => {
          const objectList = prevState.sponsorsList.filter(el => el !== obj);

          return {
            sponsorsList: objectList,
          };
        },
        () => this.props.form.setFieldsValue({ sponsorsList: this.state.sponsorsList }),
      );
    },

    setPrimaryObject: obj => {
      this.handleSetState(
        { primaryObject: obj, parentPermlink: obj.author_permlink },
        { primaryObject: obj },
      );
    },

    removePrimaryObject: () => {
      this.handleSetState({ primaryObject: {} }, { primaryObject: {} });
    },

    handleAddSecondaryObjectToList: obj => {
      this.setState({ secondaryObjectsList: [...this.state.secondaryObjectsList, obj] }, () =>
        this.props.form.setFieldsValue({ secondaryObject: this.state.secondaryObjectsList }),
      );
    },

    removeSecondaryObject: obj => {
      this.setState(
        prevState => {
          const objectList = prevState.secondaryObjectsList.filter(
            el => el.author_permlink !== obj.author_permlink,
          );

          return {
            secondaryObjectsList: objectList,
          };
        },
        () => this.props.form.setFieldsValue({ secondaryObject: this.state.secondaryObjectsList }),
      );
    },

    handleSetCompensationAccount: obj => {
      this.handleSetState({ compensationAccount: obj }, { compensationAccount: obj });
    },

    removeCompensationAccount: () => {
      this.handleSetState({ compensationAccount: {} }, { compensationAccount: {} });
    },

    handleAddPageObject: obj => {
      this.setState({ pageObjects: [obj] }, () =>
        this.props.form.setFieldsValue({ agreement: this.state.pageObjects }),
      );
    },

    removePageObject: obj => {
      this.setState(
        prevState => {
          const objectList = prevState.pageObjects.filter(
            el => el.author_permlink !== obj.author_permlink,
          );

          return {
            pageObjects: objectList,
          };
        },
        () => this.props.form.setFieldsValue({ agreement: this.state.pageObjects }),
      );
    },

    setTargetDays: targetDay => () => {
      this.setState(
        {
          targetDays: { ...this.state.targetDays, [targetDay]: !this.state.targetDays[targetDay] },
        },
        () => this.props.form.setFieldsValue({ targetDays: this.state.targetDays }),
      );
    },

    openModalAddChildren: () => {
      this.setState({ isOpenAddChild: true });
    },

    closeModalAddChildren: () => {
      this.setState({ isOpenAddChild: false });
    },

    addAllObjectChildren: async () => {
      const children = await getAuthorsChildWobjects(
        this.state.primaryObject.author_permlink,
        0,
        0,
        this.props.locale,
        'list',
      );

      await this.setState(
        prevState => ({
          isOpenAddChild: false,
          secondaryObjectsList: uniqBy([...prevState.secondaryObjectsList, ...children], '_id'),
        }),
        () => this.props.form.setFieldsValue({ secondaryObject: this.state.secondaryObjectsList }),
      );
    },

    getObjectsToOmit: () => {
      const objectsToOmit = [];

      if (!isEmpty(this.state.primaryObject)) {
        objectsToOmit.push(this.state.primaryObject.author_permlink);
      }
      if (!isEmpty(this.state.secondaryObjectsList)) {
        map(this.state.secondaryObjectsList, obj => objectsToOmit.push(obj.author_permlink));
      }

      return objectsToOmit;
    },

    handleSubmit: e => {
      const { isDuplicate } = this.state;

      e.preventDefault();
      // this.checkOptionFields();
      this.setState({ loading: true });
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err && !isEmpty(values.primaryObject) && !isEmpty(values.secondaryObject)) {
          const isDetails = this.props.match?.params?.[0] === 'details';
          const submitMethod = isDetails ? updateCampaing : createNewCampaing;

          submitMethod(this.prepareSubmitData(values, this.props.userName), this.props.userName)
            .then(() => {
              message.success(
                `Rewards campaign ${values.campaignName} ${
                  isDuplicate ? 'has been created' : 'has been updated'
                }`,
              );
              this.manageRedirect();
            })
            .catch(() => {
              message.error(`Campaign ${values.campaignName} has been rejected`);
            });
        }

        this.setState({ loading: false });
      });
    },

    messageFactory: (id, defaultMessage, options = {}) => {
      const { intl } = this.props;

      return intl.formatMessage(
        {
          id,
          defaultMessage,
        },
        options,
      );
    },

    handleCurrencyChanges: currency => this.setState(() => ({ currency })),

    handleCryptocurrencyChanges: payoutToken => this.setState(() => ({ payoutToken })),
  };

  render() {
    const { user, form, match } = this.props;
    const {
      campaignName,
      campaignType,
      budget,
      reward,
      primaryObject,
      secondaryObjectsList,
      pageObjects,
      sponsorsList,
      reservationPeriod,
      compensationAccount,
      commissionAgreement,
      loading,
      parentPermlink,
      targetDays,
      receiptPhoto,
      minPhotos,
      minExpertise,
      minFollowers,
      minPosts,
      description,
      expiredAt,
      usersLegalNotice,
      agreement,
      campaignId,
      iAgree,
      eligibleDays,
      isDisabled,
      isDuplicate,
    } = this.state;

    return (
      <CreateFormRenderer
        match={match}
        handlers={this.handlers}
        campaignName={campaignName}
        campaignType={campaignType}
        budget={budget}
        reward={reward}
        reservationPeriod={reservationPeriod}
        targetDays={targetDays}
        receiptPhoto={receiptPhoto}
        minPhotos={minPhotos}
        minExpertise={minExpertise}
        minFollowers={minFollowers}
        minPosts={minPosts}
        description={description}
        expiredAt={expiredAt}
        usersLegalNotice={usersLegalNotice}
        agreement={agreement}
        user={user}
        sponsorsList={sponsorsList}
        compensationAccount={compensationAccount}
        primaryObject={primaryObject}
        secondaryObjectsList={secondaryObjectsList}
        pageObjects={pageObjects}
        loading={loading}
        parentPermlink={parentPermlink}
        getFieldDecorator={form.getFieldDecorator}
        getFieldValue={form.getFieldValue}
        commissionAgreement={commissionAgreement}
        campaignId={campaignId}
        iAgree={iAgree}
        eligibleDays={eligibleDays}
        isDisabled={isDisabled}
        isDuplicate={isDuplicate}
        isOpenAddChild={this.state.isOpenAddChild}
        currency={this.state.currency}
        payoutToken={this.state.payoutToken}
      />
    );
  }
}

export default CreateRewards;
