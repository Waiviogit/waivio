import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import {
  Form,
  message,
} from 'antd';
import { createCampaign, getCampaignById } from '../../../waivioApi/ApiClient';
import './CreateReward.less';
import CreateFormRenderer from './CreateFormRenderer';

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
    currentSteemDollarPrice: PropTypes.number,
  };
  static defaultProps = {
    userName: '',
    user: {},
    form: {},
    currentSteemDollarPrice: 0,
  };
  state = {
    campaignData: null,
    confirmDirty: false,
    autoCompleteResult: [],
    objectsToAction: [],
    sponsorsToAction: [],
    primaryObject: {},
    pageObjects: [],
    isModalEligibleUsersOpen: false,
    hasRequireObject: false,
    hasReviewObject: false,
    loading: false,
    parentPermlink: '',
    compensationAccount: {},
    targetDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  };

  componentDidMount() {
    if (this.props.params === 'edit') {
      const campaignData = getCampaignById(this.props.params.campaignId);
      this.setState({campaignData})
    }
  }

  checkOptionFields = () => {
    const {setFieldsValue, getFieldValue} =  this.props.form;

    if (getFieldValue('minPhotos') === '') setFieldsValue({ minPhotos: 0 });

    if (getFieldValue('minSteemReputation') === '') setFieldsValue({ minSteemReputation: -100 });

    if (getFieldValue('minFollowers') === '') setFieldsValue({ minFollowers: 0 });

    if (getFieldValue('minPosts') === '') setFieldsValue({ minPosts: 0 });

  };

  prepareSubmitData = (data, userName) => {
    const objects = _.map(data.secondaryObject, o => o.id);
    const pageObjects =
    data.agreement.length !== 0 ? _.map(data.agreement.length, o => o.id) : [];
    const sponsorAccounts = _.map(data.findSponsors, o => o.account);
    return {
      requiredObject: data.primaryObject.author_permlink,
      guideName: userName,
      name: data.campaignName,
      description: data.description,
      type: data.type,
      budget: data.budget,
      reward: data.reward,
      requirements: {minPhotos: data.minPhotos},
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
      sponsorAccounts,
      expired_at: data.expiredAt.format(),
      targetDays: data.targetDays,
    };
  };

  manageRedirect = () => {
    this.props.history.push('/rewards/manage');
  };

  handlers = {
    handleAddSponsorToList: async obj => {
      const sponsors = [...this.state.sponsorsToAction, obj];
      if (sponsors.length <= 5) {
        await this.setState({
          sponsorsToAction: sponsors,
        });
        this.props.form.setFieldsValue({findSponsors: this.state.sponsorsToAction})
      }
    },

    removeSponsorObject: async obj => {
      await this.setState(prevState => {
        const objectList = prevState.sponsorsToAction.filter(el => el.account !== obj.account);
        return {
          sponsorsToAction: objectList,
        };
      });
      this.props.form.setFieldsValue({findSponsors: this.state.sponsorsToAction})
    },

    setPrimaryObject : obj => {
      this.setState({
        primaryObject: obj,
        hasRequireObject: false,
        parentPermlink: obj.author_permlink,
      });
      this.props.form.setFieldsValue({primaryObject: obj})
    },

    removePrimaryObject: () => {
      this.setState({primaryObject: {}, hasRequireObject: true});
      this.props.form.setFieldsValue({primaryObject: {}})
    },

    handleAddSecondaryObjectToList: async obj => {
      await this.setState({
        objectsToAction: [...this.state.objectsToAction, obj],
        hasReviewObject: false,
      });
      this.props.form.setFieldsValue({secondaryObject: this.state.objectsToAction})
    },

    removeSecondaryObject: async obj => {
      await this.setState(prevState => {
        const objectList = prevState.objectsToAction.filter(el => el.id !== obj.id);
        return {
          objectsToAction: objectList,
          hasReviewObject: !objectList.length,
        };
      });
      this.props.form.setFieldsValue({secondaryObject: this.state.objectsToAction})
    },

    handleSetCompensationAccount: obj => {
      this.setState({compensationAccount: obj});
      this.props.form.setFieldsValue({compensationAccount: obj})
    },

    removeCompensationAccount: () => {
      this.setState({compensationAccount: {}});
      this.props.form.setFieldsValue({compensationAccount: {}})
    },

    handleAddPageObject: async obj => {
      await this.setState({
        pageObjects: [...this.state.pageObjects, obj],
      });
      this.props.form.setFieldsValue({agreement: this.state.pageObjects})
    },

    removePageObject: async obj => {
      await this.setState(prevState => {
        const objectList = prevState.pageObjects.filter(el => el.id !== obj.id);
        return {
          pageObjects: objectList,
        };
      });
      this.props.form.setFieldsValue({agreement: this.state.pageObjects})
    },

    setTargetDays : targetDay => async () => {
      await this.setState({
        targetDays: {
          ...this.state.targetDays,
          [targetDay]: !this.state.targetDays[targetDay],
        },
      });
      this.props.form.setFieldsValue({setTargetDays: this.state.targetDays})
    },

    getObjectsToOmit: () => {
      const objectsToOmit = [];
      if (!_.isEmpty(this.state.primaryObject)) {
        objectsToOmit.push(this.state.primaryObject.id);
      }
      if (!_.isEmpty(this.state.objectsToAction)) {
        _.map(this.state.objectsToAction, obj => objectsToOmit.push(obj.id));
      }
      return objectsToOmit;
    },

    handleSubmit: e => {
      this.setState({loading: true});
      e.preventDefault();
      this.checkOptionFields();
      this.props.form.validateFieldsAndScroll((err, values) => {
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
              this.setState({loading: false});
            });
        }
        if (err) {
          this.setState({loading: false});
        }
        this.setState({
          hasRequireObject: _.isEmpty(this.state.primaryObject),
          hasReviewObject: _.isEmpty(this.state.objectsToAction),
          loading: false,
        });
      });
    },

    toggleModalEligibleUsers: () => this.setState({isModalEligibleUsersOpen: !this.state.isModalEligibleUsersOpen}),

    handleConfirmBlur: e => {
      const {value} = e.target;
      this.setState({confirmDirty: this.state.confirmDirty || !!value});
    },

    handleWebsiteChange: value => {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
      }
      this.setState({autoCompleteResult});
    },

    handleSelectChange: () => {},

    handleDeleteObjectFromList: obj => {
      let objectsToAction = this.state.objectsToAction;
      objectsToAction = _.filter(objectsToAction, o => o.id !== obj.id);
      this.setState({objectsToAction});
    },

    messageFactory: (id, defaultMessage) => {
      const {intl} = this.props;
      return intl.formatMessage({
        id,
        defaultMessage
      })
    },
  };

  render() {
    const {user, currentSteemDollarPrice } = this.props;
    const { loading, sponsorsToAction, compensationAccount, primaryObject, objectsToAction, pageObjects, hasRequireObject, parentPermlink, hasReviewObject, campaignData } = this.state;

    return (
        <CreateFormRenderer
          campaignData={campaignData}
          handlers={this.handlers}
          currentSteemDollarPrice={currentSteemDollarPrice}
          user={user}
          sponsorsToAction={sponsorsToAction}
          compensationAccount={compensationAccount}
          primaryObject={primaryObject}
          objectsToAction={objectsToAction}
          pageObjects={pageObjects}
          loading={loading}
          hasRequireObject={hasRequireObject}
          parentPermlink={parentPermlink}
          hasReviewObject={hasReviewObject}
          getFieldDecorator={this.props.form.getFieldDecorator}
          getFieldValue={this.props.form.getFieldValue}
        />
    );
  }
}

export default CreateRewardForm;
