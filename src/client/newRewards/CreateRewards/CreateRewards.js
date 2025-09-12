import { get, includes, isEmpty, map, size, uniqBy } from 'lodash';
import React from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form, message } from 'antd';
import timezones from '../../../common/constants/timezones';
import {
  createNewCampaing,
  getAuthorsChildWobjects,
  getNewCampaingById,
  getObjectsByIds,
  getUsers,
  updateCampaing,
} from '../../../waivioApi/ApiClient';
import * as apiConfig from '../../../waivioApi/config.json';
import { PATH_NAME_MANAGE } from '../../../common/constants/rewards';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '../../../store/authStore/authSelectors';
import CreateFormRenderer from '../../rewards/Create-Edit/CreateFormRenderer';
import {
  getMinExpertise,
  getMinExpertisePrepared,
  campaignTypes,
} from '../../rewards/rewardsHelper';
import { getCurrentCurrency, getRate, getRewardFund } from '../../../store/appStore/appSelectors';
import { getTokenBalance, getTokenRates } from '../../../store/walletStore/walletActions';
import { parseJSON } from '../../../common/helpers/parseJSON';

import '../../rewards/Create-Edit/CreateReward.less';

const initialState = {
  campaignName: '',
  campaignType: 'reviews',
  budget: null,
  reward: null,
  primaryObject: {},
  secondaryObjectsList: [],
  contestJudgesAccount: [],
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
    currency: getCurrentCurrency(state),
  }),
  { getTokenBalance, getTokenRates },
)
class CreateRewards extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    locale: PropTypes.string,
    user: PropTypes.shape(),
    currency: PropTypes.shape().isRequired,
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

  constructor(props) {
    super(props);

    this.state = { ...initialState, currency: props.currency.type || 'USD' };
  }

  componentDidMount = async () => {
    this.getCampaingDetailAndSetInState();
    this.props.getTokenBalance('WAIV', this.props.userName);
    this.props.getTokenRates('WAIV');
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
      const reqItemIsUser = campaign.requiredObject[0] === '@';
      const secondaryItems = campaign.objects.reduce(
        (acc, curr) => {
          if (curr[0] === '@') {
            return {
              ...acc,
              users: [...acc.users, curr.replace('@', '')],
            };
          }

          return {
            ...acc,
            wobjects: [...acc.wobjects, curr],
          };
        },
        { users: [], wobjects: [] },
      );

      const isExpired =
        campaign.status === 'expired' || moment(campaign.expiredAt).unix() < moment().unix();
      const isDuplicate = this.props.match.params?.[0] === 'duplicate';
      const isDisabled = campaign.status !== 'pending' && !isDuplicate;
      let authorPermlinks = [...campaign.agreementObjects, ...secondaryItems.wobjects];

      if (!reqItemIsUser) {
        authorPermlinks = [campaign.requiredObject, ...authorPermlinks];
      }

      const combinedObjects = !isEmpty(authorPermlinks)
        ? await getObjectsByIds({
            authorPermlinks,
            limit: size(authorPermlinks),
          })
        : null;

      let primaryObject = null;
      let secondaryObjects = [];

      if (reqItemIsUser) {
        const userList = await getUsers({
          listUsers: [campaign.requiredObject.replace('@', ''), ...secondaryItems.users],
        }).then(res =>
          res?.users.map(user => {
            const profile = user?.posting_json_metadata
              ? parseJSON(user.posting_json_metadata)?.profile
              : null;

            return {
              name: user.name,
              object_type: 'user',
              avatar: user?.profile_image,
              description: profile?.about,
              author_permlink: user.name,
            };
          }),
        );

        secondaryObjects = userList.filter(user => secondaryItems.users?.includes(user.name));
        primaryObject = userList.find(
          user => user.name === campaign.requiredObject.replace('@', ''),
        );
      } else {
        primaryObject = combinedObjects.wobjects.find(
          wobj => wobj.author_permlink === campaign.requiredObject,
        );
      }

      const sponsors = campaign.matchBots;

      if (!isEmpty(secondaryItems.wobjects)) {
        secondaryObjects = [
          ...secondaryObjects,
          ...combinedObjects?.wobjects.filter(
            wobj =>
              includes(secondaryItems.wobjects, wobj.author_permlink) &&
              wobj.author_permlink !== primaryObject.author_permlink,
          ),
        ];
      }

      const agreementObjects = !isEmpty(combinedObjects?.wobjects)
        ? combinedObjects.wobjects.filter(wobj =>
            campaign.agreementObjects.some(
              agreementObject => agreementObject === wobj.author_permlink,
            ),
          )
        : null;

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
          reachType: campaign.reach,
          budget: campaign.budget.toString(),
          reward: campaign.reward ? campaign.reward.toString() : '0',
          primaryObject: values[0],
          winners: campaign?.winnersNumber,
          durationDays: campaign?.durationDays,
          recurrenceRule: campaign?.recurrenceRule,
          secondaryObjectsList: values[1].map(obj => obj),
          contestJudgesAccount: campaign?.contestJudges
            ? campaign?.contestJudges?.filter(acc => acc !== this.props.userName)
            : undefined,
          pageObjects: !isEmpty(values[2]) ? values[2] : [],
          sponsorsList: !isEmpty(sponsors) ? values[3] : [],
          reservationPeriod: campaign.countReservationDays,
          contestRewards: campaign.contestRewards,
          receiptPhoto: campaign.requirements.receiptPhoto,
          minExpertise,
          minFollowers: campaign.userRequirements.minFollowers,
          timezone: campaign.timezone,
          minPosts: campaign.userRequirements.minPosts,
          targetDays: campaign.reservationTimetable,
          minPhotos: campaign.requirements.minPhotos,
          ...([
            campaignTypes.MENTIONS,
            campaignTypes.CONTESTS_OBJECT,
            campaignTypes.GIVEAWAYS_OBJECT,
          ].includes(campaign.type)
            ? { qualifiedPayoutToken: campaign.qualifiedPayoutToken }
            : {}),
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
    const requiredObject =
      data.primaryObject.object_type === 'user'
        ? `@${data.primaryObject.name}`
        : data.primaryObject.author_permlink;

    const objects = isEmpty(data.secondaryObject)
      ? [requiredObject]
      : map(data.secondaryObject, o =>
          o.object_type === 'user' ? `@${o.account || o.name}` : o.author_permlink,
        );
    const agreementObjects = size(pageObjects) ? map(pageObjects, o => o.author_permlink) : [];
    const matchBots = Array.isArray(data.sponsorsList)
      ? map(data.sponsorsList, o => o.account || o)
      : [];
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    const minExpertise = getMinExpertisePrepared({
      minExpertise: data.minExpertise,
      rewardFund,
      rate,
    });
    let budget = Number(data.budget);
    let contestRewards = null;
    let winnersNumber = Number(data?.winnersNumber);

    if (data.type === campaignTypes.CONTESTS_OBJECT) {
      budget = Number(data.reward1) + Number(data.reward2) + Number(data.reward3);
      winnersNumber = 1;
      contestRewards = [
        {
          place: 1,
          reward: Number(data?.reward1),
        },
      ];

      if (Number(data.reward2)) {
        winnersNumber = +1;
        contestRewards.push({
          place: 2,
          reward: Number(data?.reward2),
        });
      }

      if (Number(data.reward3)) {
        contestRewards.push({
          place: 3,
          reward: Number(data?.reward3),
        });
        winnersNumber = +1;
      }
    }

    if (data.type === campaignTypes.GIVEAWAYS_OBJECT) {
      budget = data.winnersNumber * data.reward;
    }

    const preparedObject = {
      requiredObject,
      guideName: userName,
      name: data.campaignName,
      app: appName,
      type: data.type,
      reach: data.reach,
      ...(data.timezone
        ? { timezone: timezones?.find(o => o.label === data.timezone)?.value }
        : {}),
      budget,
      reward: Number(data.reward) || 0,
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
      countReservationDays: +data.reservationPeriod,
      ...(data.durationDays ? { durationDays: +data.durationDays } : {}),
      ...(winnersNumber ? { winnersNumber } : {}),
      recurrenceRule: data.recurrenceRule,
      ...([
        campaignTypes?.MENTIONS,
        campaignTypes.CONTESTS_OBJECT,
        campaignTypes.GIVEAWAYS_OBJECT,
      ].includes(data.type)
        ? { qualifiedPayoutToken: data.qualifiedPayoutToken }
        : {}),
      ...(data.type === campaignTypes?.CONTESTS_OBJECT
        ? {
            contestRewards,
            contestJudges: [userName, ...this.state?.contestJudgesAccount],
          }
        : {}),
    };

    if (data.description) preparedObject.description = data.description;
    if (this.props.match?.params?.[0] === 'details') preparedObject._id = campaignId;

    return preparedObject;
  };

  manageRedirect = () => this.props.history.push(PATH_NAME_MANAGE);

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
        {
          primaryObject: obj,
          parentPermlink: obj?.object_type === 'user' ? `@${obj?.account}` : obj.author_permlink,
        },
        { primaryObject: obj },
      );
    },

    removePrimaryObject: () => {
      this.handleSetState({ primaryObject: {} }, { primaryObject: {} });
    },

    handleSelectChange: () => {
      this.handleSetState(
        { primaryObject: {}, parentPermlink: '', secondaryObjectsList: [] },
        { primaryObject: {}, secondaryObject: [] },
      );
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

    handleSetContestJudges: obj => {
      this.handleSetState(
        { contestJudgesAccount: [...this.state.contestJudgesAccount, obj?.account] },
        { contestJudgesAccount: [...this.state.contestJudgesAccount, obj?.account] },
      );
    },

    removeContestJudgesAccount: obj => {
      this.handleSetState(
        { contestJudgesAccount: this.state.contestJudgesAccount.filter(f => f !== obj) },
        { contestJudgesAccount: this.state.contestJudgesAccount.filter(f => f !== obj) },
      );
    },

    handleAddPageObject: obj => {
      this.setState({ pageObjects: [...this.state.pageObjects, obj] }, () =>
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

      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err && !isEmpty(values.primaryObject)) {
          const isDetails = this.props.match?.params?.[0] === 'details';
          const submitMethod = isDetails ? updateCampaing : createNewCampaing;

          submitMethod(this.prepareSubmitData(values, this.props.userName), this.props.userName)
            .then(res => {
              if (res.message) {
                message.error(res.message);
              } else {
                message.success(
                  `Rewards campaign ${values.campaignName} ${
                    isDuplicate ? 'has been created' : 'has been updated'
                  }`,
                );
                this.manageRedirect();
              }
            })
            .catch(() => {
              message.error(`Campaign ${values.campaignName} has been rejected`);
            });
        }
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

    handleSelectReach: reach => this.setState(() => ({ reach })),

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
      contestJudgesAccount,
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
      reachType,
      qualifiedPayoutToken,
      winners,
      durationDays,
      recurrenceRule,
      contestRewards,
      timezone,
    } = this.state;

    return (
      <CreateFormRenderer
        match={match}
        handlers={this.handlers}
        campaignName={campaignName}
        timezone={timezone}
        campaignType={campaignType}
        reachType={reachType}
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
        contestJudgesAccount={contestJudgesAccount}
        qualifiedPayoutToken={qualifiedPayoutToken}
        campaignId={campaignId}
        iAgree={iAgree}
        eligibleDays={eligibleDays}
        isDisabled={isDisabled}
        winners={winners}
        durationDays={durationDays}
        recurrenceRule={recurrenceRule}
        contestRewards={contestRewards}
        isDuplicate={isDuplicate}
        isOpenAddChild={this.state.isOpenAddChild}
        currency={this.state.currency}
        payoutToken={this.state.payoutToken}
        locale={this.props.locale}
      />
    );
  }
}

export default CreateRewards;
