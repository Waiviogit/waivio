import React, { useEffect, useState } from 'react';
import { Form, message, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { filter } from 'lodash';
import classNames from 'classnames';
import AppendFormFooter from '../AppendModal/AppendFormFooter';
import LANGUAGES from '../../../common/translations/languages';
import { getLanguageText } from '../../../common/translations';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { getVotePercent } from '../../../store/settingsStore/settingsSelectors';
import { setEditMode } from '../../../store/wObjectStore/wobjActions';
import { appendObject } from '../../../store/appendStore/appendActions';
import { getAppendData, getObjectName } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { objectFields } from '../../../common/constants/listOfFields';
import { getSuitableLanguage } from '../../../store/reducers';

const AppendWebpageModal = ({
  intl,
  objName,
  showModal,
  hideModal,
  form,
  wObject,
  webpageBody,
}) => {
  const defaultVotePercent = useSelector(getVotePercent);
  const locale = useSelector(getUsedLocale);
  const userName = useSelector(getAuthenticatedUserName);
  const usedLocale = useSelector(getSuitableLanguage);
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [voteWorth, setVoteWorth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [votePercent, setVotePercent] = useState(defaultVotePercent / 100 || 100);
  const dispatch = useDispatch();
  const disabledSubmit = webpageBody?.length > 65280;

  const calculateVoteWorth = (value, voteWorthVal) => {
    setVotePercent(value);
    setVoteWorth(voteWorthVal);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setLoading(true);
    form.validateFieldsAndScroll((err, values) => {
      const { follow } = values;

      if (!err) {
        const pageContentField = {
          name: objectFields.webpage,
          body: webpageBody,
          locale: currentLocale,
        };
        const langReadable = filter(LANGUAGES, { id: currentLocale })[0].name;

        const bodyMessage = `@${userName} added webpage (${langReadable}): Webpage ${moment(
          Date.now(),
        ).format('YYYY-MM-DD HH:mm:ss')}`;
        const postData = getAppendData(userName, wObject, bodyMessage, pageContentField);

        dispatch(
          appendObject(postData, {
            follow,
            votePercent: Number(
              BigNumber(votePercent)
                .multipliedBy(100)
                .toFixed(0),
            ),
            isLike: true,
            isObjectPage: true,
          }),
        )
          .then(() => {
            message.success(
              intl.formatMessage(
                {
                  id: 'added_field_to_wobject',
                  defaultMessage: `You successfully have added the {field} field to {wobject} object`,
                },
                {
                  field: objectFields.pageContent,
                  wobject: getObjectName(wObject),
                },
              ),
            );
            dispatch(setEditMode(false));
            hideModal();
            setLoading(false);
          })
          .catch(() => {
            message.error(
              intl.formatMessage({
                id: 'couldnt_append',
                defaultMessage: "Couldn't add the field to object.",
              }),
            );
          });
      }
    });
  };

  const languageOptions = LANGUAGES.map(lang => (
    <Select.Option key={lang.id} value={lang.id}>
      {getLanguageText(lang)}
    </Select.Option>
  ));

  useEffect(() => {
    calculateVoteWorth(votePercent);
  }, [objName]);

  return (
    <Modal
      title={`${intl.formatMessage({
        id: 'suggestion_add_field',
        defaultMessage: 'Update object',
      })}: ${objName}`}
      footer={null}
      visible={showModal}
      onCancel={hideModal}
      maskClosable={false}
      width={767}
    >
      <Form className="AppendForm" layout="vertical" onSubmit={handleSubmit}>
        <div className="ant-form-item-label label AppendForm__appendTitles">
          <FormattedMessage id="suggest1" defaultMessage="I suggest to add field" />
        </div>
        <Form.Item>
          <Select
            disabled
            style={{ width: '100%' }}
            value={intl.formatMessage({
              id: 'object_field_webpage',
              defaultMessage: 'Webpage',
            })}
            dropdownClassName="AppendForm__drop-down"
          />
        </Form.Item>

        <div className={classNames('ant-form-item-label AppendForm__appendTitles', {})}>
          <FormattedMessage id="suggest2" defaultMessage="With language" />
        </div>
        <Form.Item>
          <Select
            onChange={val => setCurrentLocale(val)}
            defaultValue={locale || usedLocale}
            style={{ width: '100%' }}
            dropdownClassName="AppendForm__drop-down"
          >
            {languageOptions}
          </Select>
        </Form.Item>
        {disabledSubmit && (
          <p className={'error-text'}>
            {' '}
            The webpage content is too long. The maximum allowed length is 65,280 symbols.
          </p>
        )}
        <AppendFormFooter
          loading={loading}
          calcVote={calculateVoteWorth}
          form={form}
          handleSubmit={handleSubmit}
          votePercent={votePercent}
          voteWorth={voteWorth}
          selectWobj={wObject}
          disabled={disabledSubmit}
        />
      </Form>
    </Modal>
  );
};

AppendWebpageModal.propTypes = {
  intl: PropTypes.shape(),
  form: PropTypes.shape(),
  wObject: PropTypes.shape(),
  objName: PropTypes.string.isRequired,
  webpageBody: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default Form.create()(injectIntl(AppendWebpageModal));
