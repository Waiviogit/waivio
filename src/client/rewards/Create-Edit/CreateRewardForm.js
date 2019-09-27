import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import { Form, message } from 'antd';
import { createCampaign, getCampaignById, getObjectsByIds } from '../../../waivioApi/ApiClient';
import './CreateReward.less';
import CreateFormRenderer from './CreateFormRenderer';
import { getClientWObj } from '../../adapters';

@withRouter
@Form.create()
@injectIntl
class CreateRewardForm extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    user: PropTypes.shape(),
    form: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    currentSteemDollarPrice: PropTypes.number,
  };
  static defaultProps = {
    userName: '',
    user: {},
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
    reservationPeriod: 1,
    compensationAccount: {},
    loading: false,
    parentPermlink: '',
    targetDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    minPhotos: 0,
    minSteemReputation: 25,
    minExpertise: 0,
    minFollowers: 0,
    minPosts: 0,
    description: '',
    expiredAt: null,
    usersLegalNotice: '',
    agreement: {},
    commissionToWaivio: 5,
    campaignId: null,
    isCampaignActive: false,

    // confirmDirty: false,
    // autoCompleteResult: [],
    // isModalEligibleUsersOpen: false,
    // hasRequireObject: false,
    // hasReviewObject: false,
  };

  componentDidMount = async () => {
    if (this.props.match.params.campaignId) {
      const campaign = await getCampaignById(this.props.match.params.campaignId);

      let primaryObject = await getObjectsByIds({
        authorPermlinks: [campaign.campaign.requiredObject],
      });
      primaryObject = getClientWObj(primaryObject.wobjects[0]);

      let secondaryObjects = await getObjectsByIds({
        authorPermlinks: [...campaign.campaign.objects],
      });
      secondaryObjects = secondaryObjects.wobjects.map(obj => getClientWObj(obj));

      let sponsors = [];
      if (!_.isEmpty(campaign.campaign.match_bots)) {
        sponsors = await getObjectsByIds({ authorPermlinks: [...campaign.campaign.match_bots] });
        sponsors = sponsors.wobjects.map(obj => getClientWObj(obj));
      }
      const expiredAt = moment(new Date(campaign.campaign.expired_at));

      const isCampaignActive = campaign.campaign.status === 'active';

      console.log(isCampaignActive);

      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        campaignName: campaign.campaign.name,
        campaignType: campaign.campaign.type,
        budget: campaign.campaign.budget,
        reward: campaign.campaign.reward,
        primaryObject,
        secondaryObjectsList: secondaryObjects,
        sponsorsList: sponsors,
        reservationPeriod: campaign.campaign.count_reservation_days,
        minFollowers: campaign.campaign.userRequirements.minFollowers,
        minPosts: campaign.campaign.userRequirements.minPosts,
        targetDays: campaign.campaign.reservation_timetable,
        minPhotos: campaign.campaign.requirements.minPhotos,
        description: campaign.campaign.description,
        expiredAt,
        // eslint-disable-next-line no-underscore-dangle
        campaignId: campaign.campaign._id,
        isCampaignActive,

        // usersLegalNotice: data.,
        // agreement: data.,
        // commissionToWaivio: data.
        // minSteemReputation: data.,
        // minExpertise: data.ll,
        // compensationAccount: data.,
        // pageObjects: data.,
      });
    }
  };

  checkOptionFields = () => {
    const { setFieldsValue, getFieldValue } = this.props.form;

    if (getFieldValue('minPhotos') === '') setFieldsValue({ minPhotos: 0 });

    if (getFieldValue('minSteemReputation') === '') setFieldsValue({ minSteemReputation: -100 });

    if (getFieldValue('minFollowers') === '') setFieldsValue({ minFollowers: 0 });

    if (getFieldValue('minPosts') === '') setFieldsValue({ minPosts: 0 });
  };

  prepareSubmitData = (data, userName) => {
    const objects = _.map(data.secondaryObject, o => o.id);
    const pageObjects = data.agreement.length !== 0 ? _.map(data.agreement.length, o => o.id) : [];
    const sponsorAccounts = _.map(data.sponsorsList, o => o.account);

    return {
      requiredObject: data.primaryObject.author_permlink,
      guideName: userName,
      name: data.campaignName,
      description: data.description,
      type: data.type,
      budget: data.budget,
      reward: data.reward,
      requirements: { minPhotos: data.minPhotos },
      blacklist_users: [],
      whitelist_users: [],
      count_reservation_days: data.reservationPeriod,
      userRequirements: {
        minFollowers: data.minFollowers,
        minPosts: data.minPosts,
        minExpertise: data.minExpertise,
        minSteemReputation: data.minSteemReputation,
      },
      usersLegalNotice: data.usersLegalNotice,
      commissionAgreement: data.commissionAgreement,
      objects,
      pageObjects,
      compensationAccount: data.compensationAccount && data.compensationAccount.account,
      match_bots: sponsorAccounts,
      // eslint-disable-next-line no-underscore-dangle
      expired_at: data.expiredAt._d,
      reservation_timetable: data.targetDays,
      id: this.state.campaignId,
    };
  };

  manageRedirect = () => {
    this.props.history.push('/rewards/manage');
  };

  handlers = {
    handleAddSponsorToList: async obj => {
      const sponsors = [...this.state.sponsorsList, obj];
      if (sponsors.length <= 5) {
        await this.setState({
          sponsorsList: [...sponsors],
        });
        this.props.form.setFieldsValue({ sponsorsList: this.state.sponsorsList });
      }
    },

    removeSponsorObject: async obj => {
      await this.setState(prevState => {
        const objectList = prevState.sponsorsList.filter(el => el.account !== obj.account);
        return {
          sponsorsList: objectList,
        };
      });
      this.props.form.setFieldsValue({ sponsorsList: this.state.sponsorsList });
    },

    setPrimaryObject: obj => {
      this.setState({
        primaryObject: obj,
        // hasRequireObject: false,
        parentPermlink: obj.author_permlink,
      });
      this.props.form.setFieldsValue({ primaryObject: obj });
    },

    removePrimaryObject: () => {
      this.setState({
        primaryObject: {},
        // hasRequireObject: true
      });
      this.props.form.setFieldsValue({ primaryObject: {} });
    },

    handleAddSecondaryObjectToList: async obj => {
      await this.setState({
        secondaryObjectsList: [...this.state.secondaryObjectsList, obj],
        // hasReviewObject: false,
      });
      this.props.form.setFieldsValue({ secondaryObject: this.state.secondaryObjectsList });
    },

    removeSecondaryObject: async obj => {
      await this.setState(prevState => {
        const objectList = prevState.secondaryObjectsList.filter(el => el.id !== obj.id);
        return {
          secondaryObjectsList: objectList,
          // hasReviewObject: !objectList.length,
        };
      });
      this.props.form.setFieldsValue({ secondaryObject: this.state.secondaryObjectsList });
    },

    handleSetCompensationAccount: obj => {
      this.setState({ compensationAccount: obj });
      this.props.form.setFieldsValue({ compensationAccount: obj });
    },

    removeCompensationAccount: () => {
      this.setState({ compensationAccount: {} });
      this.props.form.setFieldsValue({ compensationAccount: {} });
    },

    handleAddPageObject: async obj => {
      await this.setState({
        pageObjects: [...this.state.pageObjects, obj],
      });
      this.props.form.setFieldsValue({ agreement: this.state.pageObjects });
    },

    removePageObject: async obj => {
      await this.setState(prevState => {
        const objectList = prevState.pageObjects.filter(el => el.id !== obj.id);
        return {
          pageObjects: objectList,
        };
      });
      this.props.form.setFieldsValue({ agreement: this.state.pageObjects });
    },

    setTargetDays: targetDay => async () => {
      await this.setState({
        targetDays: {
          ...this.state.targetDays,
          [targetDay]: !this.state.targetDays[targetDay],
        },
      });
      this.props.form.setFieldsValue({ targetDays: this.state.targetDays });
    },

    getObjectsToOmit: () => {
      const objectsToOmit = [];
      if (!_.isEmpty(this.state.primaryObject)) {
        objectsToOmit.push(this.state.primaryObject.id);
      }
      if (!_.isEmpty(this.state.secondaryObjectsList)) {
        _.map(this.state.secondaryObjectsList, obj => objectsToOmit.push(obj.id));
      }
      return objectsToOmit;
    },

    handleSubmit: e => {
      this.setState({ loading: true });
      e.preventDefault();
      this.checkOptionFields();
      this.props.form.validateFieldsAndScroll((err, values) => {
        console.log('Submit', values);
        if (!err && !_.isEmpty(values.primaryObject) && !_.isEmpty(values.secondaryObject)) {
          createCampaign(this.prepareSubmitData(values, this.props.userName))
            .then(data => {
              message.success(`'${values.campaignName}' rewards campaign has been created.`);
              this.setState({
                propositions: data.campaigns,
                hasMore: data.hasMore,
                loading: false,
              });
              this.manageRedirect();
            })
            .catch(error => {
              console.log(error);
              message.error(`${values.campaignName}'rewards campaign has been rejected`);
              this.setState({ loading: false });
            });
        }
        if (err) {
          this.setState({ loading: false });
        }
        this.setState({
          // hasRequireObject: _.isEmpty(this.state.primaryObject),
          // hasReviewObject: _.isEmpty(this.state.secondaryObjectsList),
          loading: false,
        });
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

    // handleDeleteObjectFromList: obj => {
    //   let secondaryObjectsList = this.state.secondaryObjectsList;
    //   secondaryObjectsList = _.filter(secondaryObjectsList, o => o.id !== obj.id);
    //   this.setState({secondaryObjectsList});
    // },

    // toggleModalEligibleUsers: () => this.setState({isModalEligibleUsersOpen: !this.state.isModalEligibleUsersOpen}),

    // handleConfirmBlur: e => {
    //   const {value} = e.target;
    //   this.setState({confirmDirty: this.state.confirmDirty || !!value});
    // },

    // handleWebsiteChange: value => {
    //   let autoCompleteResult;
    //   if (!value) {
    //     autoCompleteResult = [];
    //   } else {
    //     autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    //   }
    //   this.setState({autoCompleteResult});
    // },
  };

  render() {
    const { user, currentSteemDollarPrice } = this.props;
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
      commissionToWaivio,
      isCampaignActive,
      loading,
      parentPermlink,
      targetDays,
      minPhotos,
      minSteemReputation,
      minExpertise,
      minFollowers,
      minPosts,
      description,
      expiredAt,
      usersLegalNotice,
      agreement,
      campaignId,
    } = this.state;

    return (
      <CreateFormRenderer
        handlers={this.handlers}
        campaignName={campaignName}
        campaignType={campaignType}
        budget={budget}
        reward={reward}
        reservationPeriod={reservationPeriod}
        targetDays={targetDays}
        minPhotos={minPhotos}
        minSteemReputation={minSteemReputation}
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
        getFieldDecorator={this.props.form.getFieldDecorator}
        getFieldValue={this.props.form.getFieldValue}
        commissionToWaivio={commissionToWaivio}
        campaignId={campaignId}
        isCampaignActive={isCampaignActive}
      />
    );
  }
}

export default CreateRewardForm;
