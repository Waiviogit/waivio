import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Button, Form, Input, message, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get, has, isEmpty } from 'lodash';
import {
  addWebAdministrator,
  deleteWebAdministrator,
  getWebAdministrators,
} from '../../../../store/websiteStore/websiteActions';
import {
  getAdministrators,
  getWebsiteLoading,
} from '../../../../store/websiteStore/websiteSelectors';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import { objectFields } from '../../../../common/constants/listOfFields';
import { getObjectName } from '../../../../common/helpers/wObjectHelper';
import { getAuthenticatedUser } from '../../../../store/authStore/authSelectors';
import { getVotePercent } from '../../../../store/settingsStore/settingsSelectors';
import { affiliateCodeVoteAppend, appendObject } from '../../../../store/appendStore/appendActions';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';
import { getAffiliateObjectForWebsite } from '../../../../waivioApi/ApiClient';
import './AffiliateCodes.less';
import ObjectAvatar from '../../../components/ObjectAvatar';

export const AffiliateCodes = ({ intl, match, form, appendWobject, rejectCode }) => {
  const [affiliateObjects, setAffiliateObjects] = useState([]);
  const [openAppendModal, setOpenAppendModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedObj, setSelectedObj] = useState({});
  const { getFieldDecorator, getFieldValue, validateFieldsAndScroll, setFieldsValue } = form;
  const user = useSelector(getAuthenticatedUser);
  const userUpVotePower = useSelector(getVotePercent);
  const langReadable = useSelector(getUsedLocale);
  const site = match.params.site;
  const emptyCodes = affiliateObjects.every(obj => !has(obj, 'affiliateCode'));
  const codesClassList = classNames('AffiliateCodes__object-table', {
    'AffiliateCodes__table-empty': emptyCodes,
  });
  const handleSelectObject = obj => {
    setSelectedObj(obj);
    setOpenAppendModal(true);
  };
  const getNewPostData = formValues => {
    const { body, preview, currentField, currentLocale, follow, ...rest } = formValues;
    const fieldBody = [];
    const postData = [];
    const getAppendMsg = author =>
      `@${author} added ${objectFields.affiliateCode} (${langReadable}): ${
        formValues[objectFields.affiliateCode]
      }`;

    fieldBody.push(rest[currentField]);
    fieldBody.forEach(bodyField => {
      const data = {};

      data.author = user.name;
      data.isLike = true;
      data.parentAuthor = selectedObj.author;
      data.parentPermlink = selectedObj.author_permlink;
      data.body = getAppendMsg(data.author, bodyField);

      data.title = '';
      const affiliateCodeBody = JSON.stringify([site, formValues[objectFields.affiliateCode]]);

      data.field = {
        name: objectFields.affiliateCode,
        locale: langReadable,
        body: affiliateCodeBody,
      };

      data.permlink = `${data.author}-${Math.random()
        .toString(36)
        .substring(2)}`;
      data.lastUpdated = Date.now();

      data.wobjectName = getObjectName(selectedObj);
      data.votePower = userUpVotePower;

      postData.push(data);
    });

    return postData;
  };
  const onSubmit = formValues => {
    const postData = getNewPostData(formValues);

    // eslint-disable-next-line no-restricted-syntax
    for (const data of postData) {
      const field = form.getFieldValue('currentField');

      setLoading(true);
      appendWobject(data, {
        votePercent: data.votePower,
        follow: formValues.follow,
        isLike: data.isLike,
        isObjectPage: false,
        isUpdatesPage: false,
      })
        .then(r => {
          setAffiliateObjects([
            ...affiliateObjects,
            {
              ...selectedObj,
              permlink: data.permlink,
              affiliateCode: JSON.stringify([site, getFieldValue(objectFields.affiliateCode)]),
            },
          ]);
          const mssg = get(r, ['value', 'message']);

          if (mssg) {
            message.error(mssg);
          } else {
            message.success(
              intl.formatMessage(
                {
                  id: `added_field_to_wobject_${field}`,
                  defaultMessage: `You successfully have added the {field} field to {wobject} object`,
                },
                {
                  field: form.getFieldValue('currentField'),
                  wobject: getObjectName(selectedObj),
                },
              ),
            );
            setOpenAppendModal(false);
            setFieldsValue({ [objectFields.affiliateCode]: '' });
          }
          setLoading(false);
        })
        .catch(() => {
          message.error(
            intl.formatMessage({
              id: 'couldnt_append',
              defaultMessage: "Couldn't add the field to object.",
            }),
          );

          setLoading(false);
          setOpenAppendModal(false);
        });
    }
  };
  const handleSubmit = event => {
    if (event) event.preventDefault();
    validateFieldsAndScroll((err, values) => {
      onSubmit(values);
    });
  };

  const hideModal = () => {
    setFieldsValue({ [objectFields.affiliateCode]: '' });
    setOpenAppendModal(false);
  };
  const deleteCode = obj => {
    setAffiliateObjects(affiliateObjects.filter(o => o.author_permlink !== obj.author_permlink));
    // eslint-disable-next-line array-callback-return,consistent-return
    const currUpdate = obj.affiliateCodeFields.find(update => {
      if (update.name === 'affiliateCode') {
        const AffCode = JSON.parse(update?.body)[1];

        return AffCode === JSON.parse(obj?.affiliateCode)[1];
      }
    });

    rejectCode(currUpdate.author, obj.author_permlink, currUpdate.permlink, 1);
  };

  useEffect(() => {
    getAffiliateObjectForWebsite(user.name, site).then(res => setAffiliateObjects(res));
  }, [site]);

  return (
    <div className="AffiliateCodes">
      <h1 className="AffiliateCodes__mainTitle">
        {intl.formatMessage({
          id: 'affiliate_codes',
          defaultMessage: 'Affiliate codes',
        })}
      </h1>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <p>
        Enter your affiliate program codes from various platforms, including Amazon.com,
        Walmart.com, and others. These codes will be automatically integrated into the &apos;Buy
        Now&apos; links across your website&apos;s product listings. This ensures you earn affiliate
        commissions from all sales initiated by your website visitors.
      </p>

      <p>
        Take advantage of the geo-targeting feature by entering affiliate codes for
        location-specific shops, such as Amazon.ca, Amazon.co.uk, and more. These codes will direct
        traffic based on the geographical location of your website visitors, thereby maximizing your
        potential affiliate revenues.
      </p>

      <p>
        {' '}
        For a seamless and uninterrupted user experience, we also recommend checking and confirming
        the Product IDs on your products.
      </p>

      <h3>Find affiliate program</h3>

      <SearchObjectsAutocomplete
        objectType={'affiliate'}
        handleSelect={handleSelectObject}
        placeholder={'Find'}
      />

      <h3>
        <FormattedMessage id="affiliate_codes" defaultMessage="Affiliate codes" />:
      </h3>
      <div className={codesClassList}>
        {emptyCodes ? (
          <FormattedMessage id={'aff_codes_empty'} defaultMessage={'No affiliate codes added.'} />
        ) : (
          // eslint-disable-next-line array-callback-return,consistent-return
          affiliateObjects.map(obj => {
            if (obj.affiliateCode) {
              const affiliateCode = JSON.parse(obj.affiliateCode);

              return (
                <div key={obj._id} className="AffiliateCodes__object">
                  <span className="AffiliateCodes__object-info">
                    <ObjectAvatar size={50} item={obj} />
                    <div className="AffiliateCodes__object-info-text">
                      <span>{obj.name}</span>
                      <div className="AffiliateCodes__aff-code">{affiliateCode[1]}</div>
                    </div>
                  </span>
                  <Button type="primary" onClick={() => deleteCode(obj)}>
                    <FormattedMessage id="delete" defaultMessage="Delete" />
                  </Button>
                </div>
              );
            }
          })
        )}
      </div>

      <Modal
        title={`${intl.formatMessage({
          id: 'suggestion_add_field',
          defaultMessage: 'Update object',
        })}: ${selectedObj.name}`}
        footer={null}
        visible={openAppendModal}
        onCancel={hideModal}
        maskClosable={false}
        width={600}
      >
        <Form className="AppendForm" layout="vertical" onSubmit={handleSubmit}>
          <>
            Affiliate code:
            <Form.Item>
              {getFieldDecorator(objectFields.affiliateCode, {
                // rules: getFieldRules(objectFields.affiliateCode),
              })(
                <Input
                  autoFocus
                  placeholder={intl.formatMessage({
                    id: 'my_affiliate_code',
                    defaultMessage: 'My affiliate code',
                  })}
                />,
              )}
            </Form.Item>
            <div className={'mt3'}>
              <p>{`CONTEXT: ${site}`}</p>
            </div>
          </>
          <Form.Item className="AppendForm__bottom__submit">
            <Button className="AppendForm__cancel mr2" type="secondary" onClick={hideModal}>
              <FormattedMessage id={'cancel'} defaultMessage={'Cancel'} />
            </Button>
            <Button
              className="AppendForm__submit"
              type="primary"
              loading={loading}
              disabled={isEmpty(getFieldValue(objectFields.affiliateCode)) || loading}
              onClick={handleSubmit}
            >
              <FormattedMessage
                id={loading ? 'post_send_progress' : 'append_send'}
                defaultMessage={loading ? 'Submitting' : 'Suggest'}
              />
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

AffiliateCodes.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
  form: PropTypes.shape(),
  appendWobject: PropTypes.func,
  rejectCode: PropTypes.func,
};

AffiliateCodes.defaultProps = {
  admins: [],
};

export default connect(
  state => ({
    admins: getAdministrators(state),
    isLoading: getWebsiteLoading(state),
  }),
  {
    rejectCode: affiliateCodeVoteAppend,
    appendWobject: appendObject,
    getWebAdmins: getWebAdministrators,
    addWebAdmins: addWebAdministrator,
    deleteWebAdmins: deleteWebAdministrator,
  },
)(withRouter(injectIntl(Form.create()(AffiliateCodes))));
