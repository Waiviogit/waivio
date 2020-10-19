import React from 'react';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty, map, get, includes } from 'lodash';
import { Link } from 'react-router-dom';
import OBJECT_TYPE from '../../object/const/objectTypes';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import TargetDaysTable from './TargetDaysTable/TargetDaysTable';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ReviewItem from './ReviewItem';
import { validatorMessagesCreator, validatorsCreator } from './validators';
import fieldsData from './fieldsData';

const { Option } = Select;

const CreateFormRenderer = props => {
  const {
    match,
    handlers,
    campaignName,
    campaignType,
    budget,
    reward,
    reservationPeriod,
    targetDays,
    receiptPhoto,
    minPhotos,
    minExpertise,
    minFollowers,
    minPosts,
    eligibleDays,
    description,
    expiredAt,
    usersLegalNotice,
    agreement,
    currentSteemPrice,
    user,
    sponsorsList,
    compensationAccount,
    primaryObject,
    secondaryObjectsList,
    pageObjects,
    loading,
    parentPermlink,
    getFieldDecorator,
    getFieldValue,
    commissionAgreement,
    campaignId,
    isDisabled,
    intl,
    handleCreateDuplicate,
  } = props;

  const currentItemId = get(match, ['params', 'campaignId']);
  const messages = validatorMessagesCreator(handlers.messageFactory);
  const validators = validatorsCreator(
    user,
    currentSteemPrice,
    messages,
    getFieldValue,
    primaryObject,
    secondaryObjectsList,
    compensationAccount,
  );
  const fields = fieldsData(handlers.messageFactory, validators, user.name);
  const isDuplicate = includes(get(match, ['params', '0']), 'createDuplicate');
  const disabled = (isDisabled && !isDuplicate && !isEmpty(campaignId)) || loading;

  const notEnoughMoneyWarn =
    parseFloat(user.balance) <= 0 ? (
      <div className="notEnoughMoneyWarn">
        {handlers.messageFactory(
          'balance_more_than_zero',
          'Campaign could not be created. Your balance should be more than zero.',
        )}
      </div>
    ) : null;

  const renderCompensationAccount =
    !isEmpty(compensationAccount) && compensationAccount.account ? (
      <div className="CreateReward__objects-wrap">
        <ReviewItem
          key={compensationAccount}
          object={compensationAccount}
          loading={loading}
          removeReviewObject={handlers.removeCompensationAccount}
          isUser
        />
      </div>
    ) : null;

  const sponsorsIdsToOmit = !isEmpty(sponsorsList) ? map(sponsorsList, obj => obj.account) : [];

  const renderSponsorsList = !isEmpty(sponsorsList)
    ? map(sponsorsList, sponsor => (
        <ReviewItem
          key={sponsor.account}
          object={sponsor}
          loading={loading}
          removeReviewObject={handlers.removeSponsorObject}
          isUser
        />
      ))
    : null;

  const renderPrimaryObject = !isEmpty(primaryObject) && (
    <ReviewItem
      key={primaryObject.id}
      object={primaryObject}
      loading={disabled}
      removeReviewObject={handlers.removePrimaryObject}
    />
  );

  const renderSecondaryObjects = !isEmpty(secondaryObjectsList)
    ? map(secondaryObjectsList, obj => (
        <ReviewItem
          key={obj.id}
          object={obj}
          loading={disabled}
          removeReviewObject={handlers.removeSecondaryObject}
        />
      ))
    : null;

  const pageObjectsIdsToOmit = !isEmpty(pageObjects) ? map(pageObjects, obj => obj.id) : [];

  const renderPageObjectsList = !isEmpty(pageObjects)
    ? map(pageObjects, obj => (
        <ReviewItem
          key={obj.id}
          object={obj}
          loading={disabled}
          removeReviewObject={handlers.removePageObject}
        />
      ))
    : null;

  const button = campaignId ? (
    <div className="CreateReward__block-button">
      <Button type="primary" htmlType="submit" loading={loading} disabled={disabled}>
        {fields.editButton.text}
      </Button>
      <span>{fields.editButton.spanText}</span>
    </div>
  ) : (
    <div className="CreateReward__block-button">
      <Button type="primary" htmlType="submit" loading={loading} disabled={disabled}>
        {fields.createButton.text}
      </Button>
      <span>{fields.createButton.spanText}</span>
    </div>
  );

  return (
    <div className="CreateRewardForm">
      {notEnoughMoneyWarn}

      <Form
        layout="vertical"
        onSubmit={handlers.handleSubmit}
        className={loading && 'CreateReward__loading'}
      >
        <Form.Item>
          {!isEmpty(match.params) ? (
            <div
              role="presentation"
              className="CreateReward__createDuplicate"
              onClick={handleCreateDuplicate}
            >
              <div className="CreateReward__first">*</div>
              <div className="CreateReward__second">
                {fields.campaignName.label}{' '}
                {
                  <Link to={`/rewards/createDuplicate/${currentItemId}`} title="Create a duplicate">
                    ({fields.createDuplicate.text})
                  </Link>
                }
              </div>
            </div>
          ) : (
            <div className="CreateReward__createDuplicate">
              <div className="CreateReward__first">*</div>
              <div className="CreateReward__second">{fields.campaignName.label}</div>
            </div>
          )}
          {getFieldDecorator(fields.campaignName.name, {
            rules: fields.campaignName.rules,
            initialValue: campaignName,
          })(<Input disabled={disabled} autoFocus />)}
          <div className="CreateReward__field-caption">{fields.campaignName.caption}</div>
        </Form.Item>

        <Form.Item label={fields.campaignType.label}>
          {getFieldDecorator(fields.campaignType.name, {
            rules: fields.campaignType.rules,
            initialValue: campaignType,
          })(
            <Select
              placeholder={fields.campaignType.select}
              onChange={handlers.handleSelectChange}
              disabled={disabled}
            >
              <Option value="reviews">{fields.campaignType.options.reviews}</Option>
            </Select>,
          )}
          <div className="CreateReward__field-caption">{fields.campaignType.caption}</div>
        </Form.Item>

        <Form.Item label={fields.budget.label}>
          {getFieldDecorator(fields.budget.name, {
            rules: fields.budget.rules,
            initialValue: budget,
          })(<Input type="number" disabled={disabled} step={0.1} />)}
          <div className="CreateReward__field-caption">{fields.budget.caption}</div>
        </Form.Item>

        <Form.Item label={fields.reward.label}>
          {getFieldDecorator(fields.reward.name, {
            rules: fields.reward.rules,
            initialValue: reward,
          })(<Input type="number" disabled={disabled} step={0.1} />)}
          <div className="CreateReward__field-caption">{fields.reward.caption}</div>
        </Form.Item>

        <Form.Item label={fields.sponsorsList.label}>
          {getFieldDecorator(fields.sponsorsList.name, {
            initialValue: sponsorsList,
          })(
            <SearchUsersAutocomplete
              allowClear={false}
              disabled={disabled}
              handleSelect={handlers.handleAddSponsorToList}
              itemsIdsToOmit={sponsorsIdsToOmit}
              placeholder={fields.sponsorsList.placeholder}
              style={{ width: '100%' }}
              autoFocus={false}
            />,
          )}
          <div className="CreateReward__field-caption">{fields.sponsorsList.caption}</div>
          <div className="CreateReward__objects-wrap">{renderSponsorsList}</div>
        </Form.Item>

        <Form.Item label={fields.compensationAccount.label}>
          {getFieldDecorator(fields.compensationAccount.name, {
            initialValue: compensationAccount,
          })(
            <SearchUsersAutocomplete
              allowClear={false}
              disabled={disabled}
              handleSelect={handlers.handleSetCompensationAccount}
              placeholder={fields.compensationAccount.placeholder}
              style={{ width: '100%' }}
              autoFocus={false}
            />,
          )}
          <div className="CreateReward__field-caption">{fields.compensationAccount.caption}</div>
          <div className="CreateReward__objects-wrap">{renderCompensationAccount}</div>
        </Form.Item>

        <Form.Item label={fields.reservationPeriod.label}>
          {getFieldDecorator(fields.reservationPeriod.name, {
            rules: fields.reservationPeriod.rules,
            initialValue: reservationPeriod,
          })(<Input type="number" disabled={disabled} />)}
          <div className="CreateReward__field-caption">{fields.reservationPeriod.caption}</div>
        </Form.Item>

        <Form.Item label={fields.targetDays.label}>
          {getFieldDecorator(fields.targetDays.name, { initialValue: targetDays })(
            <TargetDaysTable
              setTargetDays={handlers.setTargetDays}
              initialValues={targetDays}
              disabled={disabled}
            />,
          )}
          <div className="CreateReward__field-caption">{fields.targetDays.caption}</div>
        </Form.Item>

        <div className="CreateReward__block-title">
          {handlers.messageFactory('eligible_reviews', 'Eligible reviews (post requirements)')}:
        </div>

        <Form.Item label={fields.minPhotos.label}>
          {getFieldDecorator(fields.minPhotos.name, {
            rules: fields.minPhotos.rules,
            initialValue: minPhotos,
          })(<Input type="number" disabled={disabled} />)}
        </Form.Item>

        <Form.Item className="CreateReward__photo-receipt">
          {getFieldDecorator(fields.checkboxReceiptPhoto.name, {
            valuePropName: fields.checkboxReceiptPhoto.valuePropName,
            initialValue: receiptPhoto,
          })(
            <Checkbox disabled={disabled}>
              <span className="CreateReward__item-title huge-text">
                {fields.checkboxReceiptPhoto.title}
              </span>
            </Checkbox>,
          )}
          <div className="CreateReward__field-caption">{fields.checkboxReceiptPhoto.caption}</div>
        </Form.Item>

        <Form.Item
          label={<span className="CreateReward__label">{fields.primaryObject.label}</span>}
        >
          {getFieldDecorator(fields.primaryObject.name, {
            rules: fields.primaryObject.rules,
            initialValue: primaryObject,
          })(
            <SearchObjectsAutocomplete
              allowClear={false}
              itemsIdsToOmit={handlers.getObjectsToOmit()}
              style={{ width: '100%' }}
              placeholder={fields.primaryObject.placeholder}
              handleSelect={handlers.setPrimaryObject}
              disabled={disabled}
              autoFocus={false}
            />,
          )}
          <div className="CreateReward__field-caption">{fields.primaryObject.caption}</div>
          <div className="CreateReward__objects-wrap">{renderPrimaryObject}</div>
        </Form.Item>

        <Form.Item
          label={<span className="CreateReward__label">{fields.secondaryObject.label}</span>}
        >
          {getFieldDecorator(fields.secondaryObject.name, {
            rules: fields.secondaryObject.rules,
            initialValue: secondaryObjectsList,
          })(
            <SearchObjectsAutocomplete
              allowClear={false}
              itemsIdsToOmit={handlers.getObjectsToOmit()}
              style={{ width: '100%' }}
              handleSelect={handlers.handleAddSecondaryObjectToList}
              disabled={disabled || isEmpty(primaryObject)}
              parentPermlink={parentPermlink}
              autoFocus={false}
            />,
          )}
          <div className="CreateReward__field-caption">{fields.secondaryObject.caption}</div>
          <div className="CreateReward__objects-wrap">{renderSecondaryObjects}</div>
        </Form.Item>

        <Form.Item label={fields.description.label}>
          {getFieldDecorator(fields.description.name, {
            rules: fields.description.rules,
            initialValue: description,
          })(<Input.TextArea disabled={disabled} />)}
          <div className="CreateReward__field-caption">{fields.description.caption}</div>
        </Form.Item>

        <div className="CreateReward__block-title">
          {handlers.messageFactory('eligible_users', 'Eligible users')}:
        </div>
        <p>
          {handlers.messageFactory(
            'eligiblity_warn',
            'User eligibility criteria will be verified at the time of reward reservation only.',
          )}
        </p>
        <br />

        <Form.Item label={fields.minExpertise.label}>
          {getFieldDecorator(fields.minExpertise.name, {
            rules: fields.minExpertise.rules,
            initialValue: minExpertise,
          })(<Input type="number" disabled={disabled} />)}
          <div className="CreateReward__field-caption">{fields.minExpertise.caption}</div>
        </Form.Item>

        <Form.Item label={fields.minFollowers.label}>
          {getFieldDecorator(fields.minFollowers.name, {
            rules: fields.minFollowers.rules,
            initialValue: minFollowers,
          })(<Input type="number" disabled={disabled} />)}
          <div className="CreateReward__field-caption">{fields.minFollowers.caption}</div>
        </Form.Item>

        <Form.Item label={fields.minPosts.label}>
          {getFieldDecorator(fields.minPosts.name, {
            rules: fields.minPosts.rules,
            initialValue: minPosts,
          })(<Input type="number" disabled={disabled} />)}
          <div className="CreateReward__field-caption">{fields.minPosts.caption}</div>
        </Form.Item>

        <Form.Item label={fields.eligibleDays.label}>
          {getFieldDecorator(fields.eligibleDays.name, {
            rules: fields.eligibleDays.rules,
            initialValue: eligibleDays,
          })(<Input type="number" disabled={disabled} />)}
          <div className="CreateReward__field-caption">{fields.eligibleDays.caption}</div>
        </Form.Item>

        <Form.Item>
          <h3 className="CreateReward header">{fields.legalInfo.header}</h3>
          <p>{fields.legalInfo.p_1}</p>
          <br />
          <p>{fields.legalInfo.p_2}</p>
        </Form.Item>

        <Form.Item label={fields.agreement.label}>
          {getFieldDecorator(fields.agreement.name, { initialValue: agreement })(
            <SearchObjectsAutocomplete
              className="menu-item-search"
              itemsIdsToOmit={pageObjectsIdsToOmit}
              placeholder={fields.agreement.placeholder}
              handleSelect={handlers.handleAddPageObject}
              objectType={OBJECT_TYPE.PAGE}
              disabled={disabled}
              autoFocus={false}
            />,
          )}
          <div className="CreateReward__objects-wrap">{renderPageObjectsList}</div>
        </Form.Item>

        <Form.Item label={fields.usersLegalNotice.label}>
          {getFieldDecorator(fields.usersLegalNotice.name, {
            rules: fields.usersLegalNotice.rules,
            initialValue: usersLegalNotice,
          })(<Input.TextArea disabled={disabled} />)}
          <div className="CreateReward__field-caption">{fields.usersLegalNotice.caption}.</div>
        </Form.Item>

        <Form.Item>
          {getFieldDecorator(fields.checkboxAgree.name, {
            rules: fields.checkboxAgree.rules,
            valuePropName: fields.checkboxAgree.valuePropName,
          })(
            <Checkbox disabled={disabled}>
              <span className="CreateReward__item-title ant-form-item-required">
                {fields.checkboxAgree.textBeforeLink}
                <Link to={fields.checkboxAgree.link.to}>{fields.checkboxAgree.link.text} </Link>
                {fields.checkboxAgree.textAfterLink}
              </span>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item label={fields.expiredAt.label}>
          {getFieldDecorator(fields.expiredAt.name, {
            rules: fields.expiredAt.rules,
            initialValue: expiredAt,
          })(
            <DatePicker
              allowClear={false}
              disabled={disabled}
              placeholder={intl.formatMessage({
                id: 'date_picker_placeholder',
                defaultMessage: 'Select date',
              })}
            />,
          )}
        </Form.Item>

        <Form.Item label={fields.commissionAgreement.label}>
          {getFieldDecorator(fields.commissionAgreement.name, {
            rules: fields.commissionAgreement.rules,
            initialValue: commissionAgreement,
          })(
            <InputNumber
              className="CreateReward ant-input-number"
              min={5}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              initialValue={commissionAgreement}
              disabled={disabled}
            />,
          )}
          <div className="CreateReward__field-caption">{fields.commissionAgreement.caption}</div>
        </Form.Item>
        {button}
      </Form>
    </div>
  );
};

CreateFormRenderer.defaultProps = {
  currentSteemPrice: 0,
  campaignData: {},
  user: {},
  sponsorsList: [],
  secondaryObjectsList: [],
  pageObjects: [],
  compensationAccount: {},
  primaryObject: {},
  parentPermlink: '',
  campaignName: '',
  campaignType: '',
  budget: 0,
  reward: 0,
  reservationPeriod: 7,
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
  minPhotos: 0,
  minExpertise: 0,
  minFollowers: 0,
  minPosts: 0,
  eligibleDays: 0,
  description: '',
  expiredAt: null,
  usersLegalNotice: '',
  agreement: null,
  commissionAgreement: 5,
  campaignId: null,
  iAgree: false,
  isDisabled: false,
  handleCreateDuplicate: () => {},
};

CreateFormRenderer.propTypes = {
  campaignName: PropTypes.string,
  campaignType: PropTypes.string,
  budget: PropTypes.number,
  reward: PropTypes.number,
  reservationPeriod: PropTypes.number,
  targetDays: PropTypes.shape(),
  receiptPhoto: PropTypes.bool,
  minPhotos: PropTypes.number,
  minExpertise: PropTypes.number,
  minFollowers: PropTypes.number,
  minPosts: PropTypes.number,
  eligibleDays: PropTypes.number,
  description: PropTypes.string,
  expiredAt: PropTypes.shape(),
  usersLegalNotice: PropTypes.string,
  agreement: PropTypes.shape(),
  commissionAgreement: PropTypes.number,
  handlers: PropTypes.shape({
    handleAddSponsorToList: PropTypes.func.isRequired,
    removeSponsorObject: PropTypes.func.isRequired,
    setPrimaryObject: PropTypes.func.isRequired,
    removePrimaryObject: PropTypes.func.isRequired,
    handleAddSecondaryObjectToList: PropTypes.func.isRequired,
    removeSecondaryObject: PropTypes.func.isRequired,
    handleSetCompensationAccount: PropTypes.func.isRequired,
    removeCompensationAccount: PropTypes.func.isRequired,
    handleAddPageObject: PropTypes.func.isRequired,
    removePageObject: PropTypes.func.isRequired,
    setTargetDays: PropTypes.func.isRequired,
    getObjectsToOmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleSelectChange: PropTypes.func.isRequired,
    messageFactory: PropTypes.func.isRequired,
  }).isRequired,
  currentSteemPrice: PropTypes.number,
  user: PropTypes.shape(),
  sponsorsList: PropTypes.arrayOf(PropTypes.shape()),
  secondaryObjectsList: PropTypes.arrayOf(PropTypes.object),
  pageObjects: PropTypes.arrayOf(PropTypes.object),
  compensationAccount: PropTypes.shape(),
  primaryObject: PropTypes.shape(),
  loading: PropTypes.bool.isRequired,
  parentPermlink: PropTypes.string,
  getFieldValue: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  campaignId: PropTypes.string,
  isDisabled: PropTypes.bool,
  match: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  handleCreateDuplicate: PropTypes.func,
};

export default injectIntl(CreateFormRenderer);
