import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Form, message } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { get, isEmpty, isNil } from 'lodash';
import { getAuthenticatedUser, isGuestUser } from '../../../../store/authStore/authSelectors';
import { affiliateCodeVoteAppend, appendObject } from '../../../../store/appendStore/appendActions';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';
import { getAffiliateObjects } from '../../../../store/affiliateCodes/affiliateCodesSelectors';
import {
  resetAffiliateObjects,
  setAffiliateObjects,
} from '../../../../store/affiliateCodes/affiliateCodesActions';
import AffiliateCodesModal from './AffiliateCodesModal';
import AffiliateCodesList from './AffiliateCodesList';
import AffiliateCodesAutoComplete from './AffiliateCodesAutoComplete';
import { objectFields } from '../../../../common/constants/listOfFields';
import { getNewPostData } from './affiliateCodesHelper';
import { getObjectName } from '../../../../common/helpers/wObjectHelper';

import './AffiliateCodes.less';

const guestUpVotingPower = 10000;

export const UserAffiliateCodes = ({
  intl,
  form,
  appendWobject,
  voteAppend,
  affiliateObjects,
  setAffiliateObjs,
  resetAffiliateObjs,
  user,
  langReadable,
}) => {
  const [openAppendModal, setOpenAppendModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedObj, setSelectedObj] = useState({});
  const { getFieldValue } = form;
  const isGuest = useSelector(isGuestUser);
  const userUpVotePower = 100;
  const addAffilicateCode = (dup, data, formValues) => {
    if (dup) {
      return voteAppend(
        dup.author,
        selectedObj.author_permlink,
        dup.permlink,
        isGuest ? guestUpVotingPower : userUpVotePower,
        user.name,
        undefined,
      );
    }

    return appendWobject(data, {
      votePercent: isGuest ? guestUpVotingPower : data.votePower,
      follow: formValues.follow,
      isLike: data.isLike,
      isObjectPage: false,
      isUpdatesPage: false,
      host: undefined,
    });
  };

  const onSubmit = formValues => {
    const currObj = affiliateObjects?.find(obj => obj.name === selectedObj.name);
    // eslint-disable-next-line array-callback-return,consistent-return
    const duplicate = currObj?.affiliateCodeFields?.find(update => {
      if (update.name === 'affiliateCode') {
        const affCode = JSON.parse(update?.body)[1];

        return affCode === formValues.affiliateCode;
      }
    });
    const postData = getNewPostData(
      formValues,
      langReadable,
      user,
      selectedObj,
      'PERSONAL',
      isGuest ? guestUpVotingPower : userUpVotePower,
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const data of postData) {
      const field = getFieldValue('currentField');

      setLoading(true);
      addAffilicateCode(duplicate, data, formValues)
        .then(res => {
          setOpenAppendModal(false);
          setLoading(false);
          form.setFieldsValue({ [objectFields.affiliateCode]: [] });

          const mssg = get(res, ['value', 'message']);

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
                  field: getFieldValue('currentField'),
                  wobject: getObjectName(selectedObj),
                },
              ),
            );
          }
        })
        .catch(error => {
          console.error('Component error:', error);
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

  useEffect(() => {
    if (!isEmpty(user.name) && !isNil(user.name)) {
      setAffiliateObjs(user.name, undefined);
    }

    return () => resetAffiliateObjs();
  }, [user.name]);

  return (
    <div className="AffiliateCodes">
      <h1 className="AffiliateCodes__mainTitle">
        {intl.formatMessage({
          id: 'affiliate_codes',
          defaultMessage: 'Affiliate codes',
        })}{' '}
        for @{user.name}
      </h1>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <p>
        {' '}
        {intl.formatMessage({
          id: 'affiliate_codes_enter_code_text_part1',
          defaultMessage:
            "Enter your affiliate program codes from various platforms, including Amazon.com, Walmart.com, and others. These codes will be automatically integrated into the 'Buy Now' links across your profile, posts and comments. This ensures you earn affiliate commissions from sales initiated by your readers and followers.",
        })}
      </p>

      <p>
        {' '}
        {intl.formatMessage({
          id: 'affiliate_codes_enter_code_text_part2',
          defaultMessage:
            'Take advantage of the geo-targeting feature by entering affiliate codes for location-specific shops, such as Amazon.ca, Amazon.co.uk, and more. These codes will direct users based on their geographical location, thereby maximizing your potential affiliate revenues.',
        })}
      </p>

      <p>
        {' '}
        {intl.formatMessage({
          id: 'affiliate_codes_enter_code_text_part3',
          defaultMessage:
            'For a seamless and uninterrupted user experience, we also recommend checking and confirming the Product IDs on the referenced products.',
        })}
      </p>

      <h3>
        {intl.formatMessage({
          id: 'find_affiliate_program',
          defaultMessage: 'Find affiliate program',
        })}
      </h3>
      <AffiliateCodesAutoComplete
        setOpenAppendModal={setOpenAppendModal}
        affiliateObjects={affiliateObjects}
        setSelectedObj={setSelectedObj}
      />
      <h3>
        <FormattedMessage id="affiliate_codes" defaultMessage="Affiliate codes" />:
      </h3>
      <AffiliateCodesList
        user={user}
        affiliateObjects={affiliateObjects}
        rejectCode={voteAppend}
        context={undefined}
        setSelectedObj={setSelectedObj}
        setFieldsValue={c =>
          form.setFieldsValue({
            [objectFields.affiliateCode]: c,
          })
        }
        onSubmit={onSubmit}
        validateFieldsAndScroll={form.validateFieldsAndScroll}
        getFieldDecorator={form.getFieldDecorator}
        wobjName={getObjectName(selectedObj)}
      />
      {openAppendModal && (
        <AffiliateCodesModal
          form={form}
          setOpenAppendModal={setOpenAppendModal}
          intl={intl}
          loading={loading}
          context={`@${user.name}`}
          openAppendModal={openAppendModal}
          onSubmit={onSubmit}
          selectedObj={selectedObj}
        />
      )}
    </div>
  );
};

UserAffiliateCodes.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  form: PropTypes.shape(),
  user: PropTypes.shape(),
  appendWobject: PropTypes.func,
  affiliateObjects: PropTypes.arrayOf(PropTypes.shape()),
  voteAppend: PropTypes.func,
  setAffiliateObjs: PropTypes.func,
  resetAffiliateObjs: PropTypes.func,
  langReadable: PropTypes.string,
};

export default connect(
  state => ({
    affiliateObjects: getAffiliateObjects(state),
    langReadable: getUsedLocale(state),
    user: getAuthenticatedUser(state),
  }),
  {
    voteAppend: affiliateCodeVoteAppend,
    appendWobject: appendObject,
    setAffiliateObjs: setAffiliateObjects,
    resetAffiliateObjs: resetAffiliateObjects,
  },
)(withRouter(injectIntl(Form.create()(UserAffiliateCodes))));
