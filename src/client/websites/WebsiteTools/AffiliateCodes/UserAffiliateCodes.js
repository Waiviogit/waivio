import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import { getAuthenticatedUser } from '../../../../store/authStore/authSelectors';
import { getVotePercent } from '../../../../store/settingsStore/settingsSelectors';
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
import './AffiliateCodes.less';

export const UserAffiliateCodes = ({
  intl,
  form,
  appendWobject,
  rejectCode,
  affiliateObjects,
  setAffiliateObjs,
  resetAffiliateObjs,
  user,
  langReadable,
  userUpVotePower,
}) => {
  const [openAppendModal, setOpenAppendModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedObj, setSelectedObj] = useState({});
  const { getFieldDecorator, getFieldValue } = form;

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
        Enter your affiliate program codes from various platforms, including Amazon.com,
        Walmart.com, and others. These codes will be automatically integrated into the &apos;Buy
        Now&apos; links across your profile, posts and comments. This ensures you earn affiliate
        commissions from sales initiated by your readers and followers.
      </p>

      <p>
        Take advantage of the geo-targeting feature by entering affiliate codes for
        location-specific shops, such as Amazon.ca, Amazon.co.uk, and more. These codes will direct
        users based on their geographical location, thereby maximizing your potential affiliate
        revenues.
      </p>

      <p>
        {' '}
        For a seamless and uninterrupted user experience, we also recommend checking and confirming
        the Product IDs on the referenced products.
      </p>

      <h3>Find affiliate program</h3>
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
        rejectCode={rejectCode}
        context={undefined}
      />
      <AffiliateCodesModal
        user={user}
        form={form}
        appendWobject={appendWobject}
        setOpenAppendModal={setOpenAppendModal}
        setLoading={setLoading}
        langReadable={langReadable}
        userUpVotePower={userUpVotePower}
        intl={intl}
        loading={loading}
        getFieldDecorator={getFieldDecorator}
        getFieldValue={getFieldValue}
        context={user.name}
        codeContext={'PERSONAL'}
        openAppendModal={openAppendModal}
        selectedObj={selectedObj}
      />
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
  affiliateObjects: PropTypes.arrayOf(),
  rejectCode: PropTypes.func,
  setAffiliateObjs: PropTypes.func,
  resetAffiliateObjs: PropTypes.func,
  langReadable: PropTypes.string,
  userUpVotePower: PropTypes.number,
};

export default connect(
  state => ({
    affiliateObjects: getAffiliateObjects(state),
    langReadable: getUsedLocale(state),
    user: getAuthenticatedUser(state),
    userUpVotePower: getVotePercent(state),
  }),
  {
    rejectCode: affiliateCodeVoteAppend,
    appendWobject: appendObject,
    setAffiliateObjs: setAffiliateObjects,
    resetAffiliateObjs: resetAffiliateObjects,
  },
)(withRouter(injectIntl(Form.create()(UserAffiliateCodes))));
