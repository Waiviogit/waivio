import React from 'react';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { isEmpty, map, get, includes, isNumber } from 'lodash';
import { Link } from 'react-router-dom';
import OBJECT_TYPE from '../../object/const/objectTypes';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import TargetDaysTable from './TargetDaysTable/TargetDaysTable';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ReviewItem from './ReviewItem';
import { validatorMessagesCreator, validatorsCreator } from './validators';
import fieldsData from './fieldsData';
import { getObjectName, getObjectType } from '../../../common/helpers/wObjectHelper';
import { currencyTypes } from '../../websites/constants/currencyTypes';
import {
  getTokenRatesInUSD,
  getUserCurrencyBalance,
} from '../../../store/walletStore/walletSelectors';
import Loading from '../../components/Icon/Loading';
import ItemTypeSwitcher from '../Mention/ItemTypeSwitcher';

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
    payoutToken,
    reachType,
    agreement,
    qualifiedPayoutToken,
  } = props;
  const currentItemId = get(match, ['params', 'campaignId']);
  const currencyInfo = useSelector(state => getUserCurrencyBalance(state, 'WAIV'));
  const rates = useSelector(state => getTokenRatesInUSD(state, 'WAIV'));
  const isCreateDublicate =
    get(match, ['params', '0']) === 'createDuplicate' ||
    get(match, ['params', '0']) === 'duplicate';
  const messages = validatorMessagesCreator(handlers.messageFactory, payoutToken);
  const validators = validatorsCreator(
    payoutToken,
    user,
    messages,
    getFieldValue,
    primaryObject,
    secondaryObjectsList,
    props.currency,
    currencyInfo,
    rates,
  );
  const fields = fieldsData(handlers.messageFactory, validators, user.name, props.currency);
  const isDuplicate = includes(get(match, ['params', '0']), 'createDuplicate');
  const disabled = (isDisabled && !isDuplicate && !isEmpty(campaignId)) || loading;
  let userBalance = parseFloat(user.balance);

  if (payoutToken !== 'HIVE') {
    userBalance = currencyInfo ? currencyInfo?.balance : null;
  }

  const notEnoughMoneyWarn =
    isNumber(userBalance) && userBalance <= 0 ? (
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

  const sponsorsIdsToOmit = !isEmpty(sponsorsList)
    ? map(sponsorsList, obj => obj.account || obj)
    : [];

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

  const pageObjectsIdsToOmit = !isEmpty(pageObjects)
    ? map(pageObjects, obj => obj.author_permlink)
    : [];

  const renderPageObjectsList = !isEmpty(pageObjects)
    ? map(pageObjects, obj => (
        <ReviewItem
          key={obj.author_permlink}
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

  if (!campaignName && (currentItemId || isCreateDublicate)) return <Loading />;

  return (
    <div className="CreateRewardForm">
      {notEnoughMoneyWarn}
      <Form
        layout="vertical"
        onSubmit={handlers.handleSubmit}
        className={loading && 'CreateReward__loading'}
      >
        <Form.Item>
          {!isCreateDublicate && currentItemId ? (
            <div
              role="presentation"
              className="CreateReward__createDuplicate"
              onClick={handleCreateDuplicate}
            >
              <div className="CreateReward__first">*</div>
              <div className="CreateReward__second">
                {fields.campaignName.label}{' '}
                {
                  <Link to={`/rewards/duplicate/${currentItemId}`} title="Create a duplicate">
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
            validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
            rules: fields.campaignName.rules,
            initialValue: campaignName,
          })(<Input disabled={disabled} autoFocus />)}
          <div className="CreateReward__field-caption">{fields.campaignName.caption}</div>
        </Form.Item>
        <Form.Item label={fields.campaignType.label}>
          {getFieldDecorator(fields.campaignType.name, {
            rules: fields.campaignType.rules,
            validateTrigger: ['onSubmit', 'onChange', 'onBlur'],
            initialValue: campaignType,
          })(
            <Select
              placeholder={fields.campaignType.select}
              onChange={handlers.handleSelectChange}
              disabled={disabled}
            >
              {fields.campaignType.options.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.message}
                </Option>
              ))}
            </Select>,
          )}
          <div className="CreateReward__field-caption">{fields.campaignType.caption}</div>
        </Form.Item>
        <Form.Item label={fields.campaignReach.label}>
          {getFieldDecorator(fields.campaignReach.name, {
            rules: fields.campaignReach.rules,
            validateTrigger: ['onSubmit', 'onChange', 'onBlur'],
            initialValue: reachType,
          })(
            <Select
              placeholder={fields.campaignReach.select}
              onChange={handlers.handleSelectReach}
              disabled={disabled}
            >
              {fields.campaignReach.options.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.message}
                </Option>
              ))}
            </Select>,
          )}
          <div className="CreateReward__field-caption">{fields.campaignReach.caption}</div>
        </Form.Item>
        <Form.Item label={fields.baseCurrency.label}>
          {getFieldDecorator(fields.baseCurrency.name, {
            rules: fields.baseCurrency.rules,
            initialValue: props.currency,
            validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
          })(
            <Select onChange={handlers.handleCurrencyChanges} disabled={disabled}>
              {currencyTypes.map(currency => (
                <Option key={currency} value={currency}>
                  {currency}
                </Option>
              ))}
            </Select>,
          )}
          <div className="CreateReward__field-caption">{fields.baseCurrency.caption}</div>
        </Form.Item>
        <Form.Item label={fields.baseCryptocurrency.label}>
          {getFieldDecorator(fields.baseCryptocurrency.name, {
            rules: fields.baseCryptocurrency.rules,
            initialValue: props.payoutToken,
            validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
          })(
            <Select onChange={handlers.handleCryptocurrencyChanges} disabled>
              {['HIVE', 'WAIV'].map(currency => (
                <Option key={currency} value={currency}>
                  {currency}
                </Option>
              ))}
            </Select>,
          )}
          <div className="CreateReward__field-caption">{fields.baseCryptocurrency.caption}</div>
        </Form.Item>

        <Form.Item label={fields.budget.label}>
          {getFieldDecorator(fields.budget.name, {
            rules: fields.budget.rules,
            initialValue: budget,
            validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
          })(<Input type="number" disabled={disabled} step={0.1} />)}
          <div className="CreateReward__field-caption">{fields.budget.caption}</div>
        </Form.Item>

        <Form.Item label={fields.reward.label}>
          {getFieldDecorator(fields.reward.name, {
            rules: fields.reward.rules,
            initialValue: reward,
            validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
          })(<Input type="number" disabled={disabled} step={0.1} />)}
          <div className="CreateReward__field-caption">{fields.reward.caption}</div>
          <span className="CreateReward__field-exceed ">
            {Number(getFieldValue('budget')) < Number(getFieldValue('reward')) &&
              messages.rewardToBudget}
          </span>
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
            validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
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
            validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
          })(
            getFieldValue('type') === 'mentions' ? (
              <ItemTypeSwitcher obj={primaryObject} setPrimaryObject={handlers.setPrimaryObject} />
            ) : (
              <SearchObjectsAutocomplete
                allowClear={false}
                itemsIdsToOmit={handlers.getObjectsToOmit()}
                style={{ width: '100%' }}
                placeholder={fields.primaryObject.placeholder}
                handleSelect={handlers.setPrimaryObject}
                disabled={disabled}
                autoFocus={false}
              />
            ),
          )}
          <div className="CreateReward__field-caption">{fields.primaryObject.caption}</div>
          <div className="CreateReward__objects-wrap">{renderPrimaryObject}</div>
        </Form.Item>

        <Form.Item
          label={
            <span>
              {fields.secondaryObject.label}{' '}
              {!isEmpty(primaryObject) && getObjectType(primaryObject) !== 'list' && (
                <React.Fragment>
                  (
                  <span
                    role="presentation"
                    className="CreateReward__addChild"
                    onClick={handlers.openModalAddChildren}
                  >
                    {fields.addChildrenModalTitle.text}
                  </span>
                  )
                </React.Fragment>
              )}
            </span>
          }
        >
          {getFieldDecorator(fields.secondaryObject.name, {
            initialValue: secondaryObjectsList,
            // rules: fields.secondaryObject.rules,
            validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
          })(
            getFieldValue('type') === 'mentions' ? (
              <ItemTypeSwitcher
                obj={null}
                setPrimaryObject={handlers.handleAddSecondaryObjectToList}
              />
            ) : (
              <SearchObjectsAutocomplete
                allowClear={false}
                itemsIdsToOmit={handlers.getObjectsToOmit()}
                style={{ width: '100%' }}
                handleSelect={handlers.handleAddSecondaryObjectToList}
                disabled={disabled || isEmpty(primaryObject)}
                parentPermlink={parentPermlink}
                autoFocus={false}
              />
            ),
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
          {getFieldDecorator(fields.agreement.name, {
            initialValue: agreement,
          })(
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
        {getFieldValue('type') === 'mentions' && (
          <Form.Item>
            {getFieldDecorator(fields.checkboxOnly.name, {
              valuePropName: 'checked',
              initialValue: qualifiedPayoutToken,
            })(
              <Checkbox defaultChecked disabled={disabled}>
                <span className="CreateReward__item-title" style={{ color: '#000' }}>
                  {fields.checkboxOnly.textBeforeLink}
                </span>
              </Checkbox>,
            )}
          </Form.Item>
        )}
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
            initialValue: expiredAt || moment().add(2, 'days'),
          })(
            <DatePicker
              allowClear={false}
              disabledDate={currDate =>
                moment()
                  .add(1, 'days')
                  .unix() > currDate.unix()
              }
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
      <Modal
        visible={props.isOpenAddChild}
        title={fields.addChildrenModalTitle.text}
        onOk={handlers.addAllObjectChildren}
        className={'CreateReward__modal'}
        onCancel={handlers.closeModalAddChildren}
      >
        {fields.addChildrenModalBodyFirstPart.text} <b>{getObjectName(primaryObject)}</b>{' '}
        {fields.addChildrenModalBodySecondPart.text}
      </Modal>
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
  campaignType: null,
  qualifiedPayoutToken: true,
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
  isOpenAddChild: false,
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
  qualifiedPayoutToken: PropTypes.bool,
  minPhotos: PropTypes.number,
  minExpertise: PropTypes.number,
  minFollowers: PropTypes.number,
  minPosts: PropTypes.number,
  eligibleDays: PropTypes.number,
  description: PropTypes.string,
  expiredAt: PropTypes.shape(),
  usersLegalNotice: PropTypes.string,
  commissionAgreement: PropTypes.number,
  handlers: PropTypes.shape({
    handleAddSponsorToList: PropTypes.func.isRequired,
    handleCurrencyChanges: PropTypes.func.isRequired,
    removeSponsorObject: PropTypes.func.isRequired,
    setPrimaryObject: PropTypes.func.isRequired,
    removePrimaryObject: PropTypes.func.isRequired,
    handleAddSecondaryObjectToList: PropTypes.func.isRequired,
    removeSecondaryObject: PropTypes.func.isRequired,
    handleSelectReach: PropTypes.func.isRequired,
    handleSetCompensationAccount: PropTypes.func.isRequired,
    removeCompensationAccount: PropTypes.func.isRequired,
    handleAddPageObject: PropTypes.func.isRequired,
    handleCryptocurrencyChanges: PropTypes.func.isRequired,
    removePageObject: PropTypes.func.isRequired,
    setTargetDays: PropTypes.func.isRequired,
    getObjectsToOmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleSelectChange: PropTypes.func.isRequired,
    messageFactory: PropTypes.func.isRequired,
    openModalAddChildren: PropTypes.func.isRequired,
    closeModalAddChildren: PropTypes.func.isRequired,
    addAllObjectChildren: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape(),
  sponsorsList: PropTypes.arrayOf(PropTypes.shape()),
  agreement: PropTypes.arrayOf(PropTypes.shape()),
  secondaryObjectsList: PropTypes.arrayOf(PropTypes.shape()),
  pageObjects: PropTypes.arrayOf(PropTypes.shape()),
  compensationAccount: PropTypes.shape(),
  primaryObject: PropTypes.shape(),
  loading: PropTypes.bool.isRequired,
  parentPermlink: PropTypes.string,
  currency: PropTypes.string.isRequired,
  reachType: PropTypes.string.isRequired,
  payoutToken: PropTypes.string.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  campaignId: PropTypes.string,
  isDisabled: PropTypes.bool,
  isOpenAddChild: PropTypes.bool,
  match: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  handleCreateDuplicate: PropTypes.func,
};

export default injectIntl(CreateFormRenderer);
