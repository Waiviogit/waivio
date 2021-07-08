import { isEmpty, map, includes, get, size, uniqBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, message } from 'antd';
import {
  createCampaign,
  getAuthorsChildWobjects,
  getCampaignById,
  getObjectsByIds,
} from '../../../waivioApi/ApiClient';
import CreateFormRenderer from './CreateFormRenderer';
import { AppSharedContext } from '../../Wrapper';
import * as apiConfig from '../../../waivioApi/config.json';
import { getMinExpertise, getMinExpertisePrepared } from '../rewardsHelper';
import {
  PATH_NAME_MANAGE,
  CAMPAIGN_STATUS,
  isDisabledStatus,
} from '../../../common/constants/rewards';
import { getRate, getRewardFund } from '../../../store/appStore/appSelectors';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';

import './CreateReward.less';

@withRouter
@Form.create()
@injectIntl
@connect(
  state => ({
    rate: getRate(state),
    rewardFund: getRewardFund(state),
    createDuplicate: false,
    campaign: {},
    locale: getLocale(state),
  }),
  {},
)
class CreateRewardForm extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    locale: PropTypes.string,
    user: PropTypes.shape(),
    form: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    currentSteemDollarPrice: PropTypes.number,
    /* from context */
    rate: PropTypes.number.isRequired,
    rewardFund: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    userName: '',
    locale: '',
    user: {},
    usedLocale: 'en-US',
    form: {},
    currentSteemDollarPrice: 0,
  };
  state = {
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
  };

  componentDidMount = async () => {
    const { rate, rewardFund } = this.props;

    if (this.props.match.params.campaignId) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ loading: true });

      const campaign = await getCampaignById(this.props.match.params.campaignId);
      const isExpired = campaign.status === 'expired';
      const expiredAt = isExpired
        ? moment(new Date().toISOString())
        : moment(new Date(campaign.expired_at));
      const matchPath = get(this.props.match, ['params', '0']);
      const isDuplicate = includes(matchPath, 'createDuplicate');
      const isDisabled =
        includes(isDisabledStatus, campaign.status) || campaign.status !== CAMPAIGN_STATUS.pending;
      let combinedObjects;
      let sponsors;

      const secondaryObjectsPermlinks = !isEmpty(campaign.objects)
        ? map(campaign.objects, obj => obj.author_permlink)
        : [];

      let authorPermlinks = [];

      const agreementObject = get(campaign, 'agreementObjects[0]', '');

      if (!isEmpty(campaign.match_bots)) {
        authorPermlinks = [
          ...campaign.match_bots,
          campaign.requiredObject.author_permlink,
          ...secondaryObjectsPermlinks,
        ];

        // eslint-disable-next-line no-unused-expressions
        agreementObject && authorPermlinks.push(agreementObject);

        combinedObjects = await getObjectsByIds({
          authorPermlinks,
          limit: size(authorPermlinks),
        });

        sponsors = combinedObjects.wobjects.filter(wobj =>
          includes(campaign.match_bots, wobj.author_permlink),
        );
      } else {
        authorPermlinks = [campaign.requiredObject.author_permlink, ...secondaryObjectsPermlinks];
        // eslint-disable-next-line no-unused-expressions
        agreementObject && authorPermlinks.push(agreementObject);
        combinedObjects = await getObjectsByIds({
          authorPermlinks,
          limit: size(authorPermlinks),
        });
      }

      const primaryObject = combinedObjects.wobjects.find(
        wobj => wobj.author_permlink === campaign.requiredObject.author_permlink,
      );

      const secondaryObjects = combinedObjects.wobjects.filter(wobj =>
        includes(secondaryObjectsPermlinks, wobj.author_permlink),
      );

      const agreementObjects = combinedObjects.wobjects.find(
        wobj => wobj.author_permlink === campaign.agreementObjects[0],
      );

      const rewardFundRecentClaims = rewardFund.recent_claims;
      const rewardFundRewardBalance = rewardFund.reward_balance;
      const campaignMinExpertise = campaign.userRequirements.minExpertise;

      const minExpertise = getMinExpertise({
        campaignMinExpertise,
        rewardFundRecentClaims,
        rewardFundRewardBalance,
        rate,
      });

      Promise.all([primaryObject, secondaryObjects, agreementObjects, sponsors]).then(values => {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          campaign,
          iAgree: true,
          loading: false,
          campaignName: `${this.state.createDuplicate ? `Copy ${campaign.name}` : campaign.name}`,
          campaignType: campaign.type,
          budget: campaign.budget.toString(),
          reward: campaign.reward.toString(),
          primaryObject: values[0],
          secondaryObjectsList: values[1].map(obj => obj),
          pageObjects: !isEmpty(values[2]) ? [values[2]] : [],
          sponsorsList: !isEmpty(sponsors) ? values[2] : [],
          reservationPeriod: campaign.count_reservation_days,
          receiptPhoto: campaign.requirements.receiptPhoto,
          minExpertise,
          minFollowers: campaign.userRequirements.minFollowers,
          minPosts: campaign.userRequirements.minPosts,
          targetDays: campaign.reservation_timetable,
          minPhotos: campaign.requirements.minPhotos,
          description: campaign.description,
          commissionAgreement: parseInt(campaign.commissionAgreement * 100, 10),
          // eslint-disable-next-line no-underscore-dangle
          campaignId: campaign._id,
          compensationAccount: {
            account: campaign.compensationAccount,
          },
          eligibleDays: campaign.frequency_assign,
          usersLegalNotice: campaign.usersLegalNotice,
          expiredAt,
          isDuplicate,
          isDisabled,
        });
        if (campaign.match_bots.length) {
          this.setState({
            sponsorsList: campaign.match_bots.map(matchBotAccount => ({
              account: matchBotAccount,
            })),
          });
        }
      });
    }
  };

  componentDidUpdate(prevProps) {
    const { campaign, createDuplicate } = this.state;
    const matchPath = get(this.props.match, ['params', '0']);

    if (createDuplicate && campaign)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ campaignName: `Copy ${campaign.name}`, createDuplicate: false });
    if (prevProps.match.params[0] !== matchPath) {
      const isDuplicate = includes(matchPath, 'createDuplicate');

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isDuplicate });
    }
  }

  checkOptionFields = () => {
    const { setFieldsValue, getFieldValue } = this.props.form;

    if (getFieldValue('minPhotos') === '') setFieldsValue({ minPhotos: 0 });

    if (getFieldValue('minFollowers') === '') setFieldsValue({ minFollowers: 0 });

    if (getFieldValue('minPosts') === '') setFieldsValue({ minPosts: 0 });

    if (getFieldValue('eligibleDays') === '') setFieldsValue({ eligibleDays: 0 });
  };

  prepareSubmitData = (data, userName) => {
    const { campaignId, pageObjects, isDuplicate } = this.state;
    const { rate, rewardFund } = this.props;
    const objects = map(data.secondaryObject, o => o.author_permlink);
    const agreementObjects = size(pageObjects) ? map(pageObjects, o => o.author_permlink) : [];
    const sponsorAccounts = map(data.sponsorsList, o => o.account);
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    const minExpertise = Number(data.minExpertise);
    const minExpertisePrepared = getMinExpertisePrepared({ minExpertise, rewardFund, rate });

    const preparedObject = {
      requiredObject: data.primaryObject.author_permlink,
      guideName: userName,
      name: data.campaignName,
      app: appName,
      type: data.type,
      budget: data.budget,
      reward: data.reward,
      requirements: {
        minPhotos: data.minPhotos,
        receiptPhoto: data.receiptPhoto,
      },
      blacklist_users: [],
      whitelist_users: [],
      count_reservation_days: data.reservationPeriod,
      userRequirements: {
        minFollowers: data.minFollowers,
        minPosts: data.minPosts,
        minExpertise: minExpertisePrepared,
      },
      frequency_assign: data.eligibleDays,
      commissionAgreement: data.commissionAgreement / 100,
      objects,
      agreementObjects,
      compensationAccount:
        data.compensationAccount && data.compensationAccount.account
          ? data.compensationAccount.account
          : '',
      usersLegalNotice: data.usersLegalNotice ? data.usersLegalNotice : '',
      match_bots: sponsorAccounts,
      // eslint-disable-next-line no-underscore-dangle
      expired_at: data.expiredAt._d,
      reservation_timetable: data.targetDays,
    };

    if (data.description) preparedObject.description = data.description;
    if (campaignId && !isDuplicate) preparedObject.id = campaignId;

    return preparedObject;
  };

  manageRedirect = () => {
    this.props.history.push(PATH_NAME_MANAGE);
  };

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
          const objectList = prevState.sponsorsList.filter(el => el.account !== obj.account);

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
      this.checkOptionFields();
      this.setState({ loading: true });
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err && !isEmpty(values.primaryObject) && !isEmpty(values.secondaryObject)) {
          createCampaign(this.prepareSubmitData(values, this.props.userName))
            .then(() => {
              message.success(
                `Rewards campaign ${values.campaignName} ${
                  isDuplicate ? 'has been created' : 'has been updated'
                }`,
              );
              this.setState({ loading: false });
              this.manageRedirect();
            })
            .catch(() => {
              message.error(`Campaign ${values.campaignName} has been rejected`);
              this.setState({ loading: false });
            });
        }
        if (err) {
          this.setState({ loading: false });
        }
        this.setState({ loading: false });
      });
    },

    messageFactory: (id, defaultMessage) => {
      const { intl } = this.props;

      return intl.formatMessage({
        id,
        defaultMessage,
      });
    },

    handleSelectChange: () => {},
  };

  handleCreateDuplicate = () => {
    this.setState({ createDuplicate: true });
  };

  render() {
    const { user, currentSteemDollarPrice, form, match } = this.props;
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
        currentSteemDollarPrice={currentSteemDollarPrice}
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
        handleCreateDuplicate={this.handleCreateDuplicate}
        isOpenAddChild={this.state.isOpenAddChild}
      />
    );
  }
}

export default props => (
  <AppSharedContext.Consumer>
    {context => <CreateRewardForm {...props} {...context} />}
  </AppSharedContext.Consumer>
);
