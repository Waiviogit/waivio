import React, { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import { debounce } from 'lodash';

import {
  addWebAdministrator,
  deleteWebAdministrator,
  getWebAdministrators,
} from '../../../../store/websiteStore/websiteActions';
import {
  getAdministrators,
  getWebsiteLoading,
} from '../../../../store/websiteStore/websiteSelectors';
import { affiliateCodesConfig } from './constants';
import {
  getAffiliateCodesForWebsite,
  safeAffiliateCodesForWebsite,
} from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

import './AffiliateCodes.less';

export const AffiliateCodes = ({ intl, match, location }) => {
  const userName = useSelector(getAuthenticatedUserName);
  const host = match.params.site;
  const [links, setLinks] = useState([]);
  const [save, setSave] = useState(false);

  useEffect(() => {
    getAffiliateCodesForWebsite(userName, host).then(res => {
      setLinks(
        res.links.map(link => ({
          affiliateCode: link.affiliateCode,
          countryCode: link.countryCode,
          host: link.host,
          type: link.type,
        })),
      );
    });
  }, [location.pathname]);

  const handleLinkChange = useCallback(
    debounce((type, countryCode, value) => {
      const copyLinks = [...links];
      const findedIndx = copyLinks.findIndex(
        link => link.type === type && link.countryCode === countryCode,
      );

      copyLinks.splice(findedIndx, 1, {
        ...copyLinks[findedIndx],
        affiliateCode: value,
      });

      setLinks(copyLinks);
    }, 300),
    [links],
  );

  const saveAffiliate = () => {
    setSave(true);
    safeAffiliateCodesForWebsite(userName, host, links).then(() => {
      setSave(false);
    });
  };

  return (
    <div className="AffiliateCodes">
      <h1 className="AffiliateCodes__mainTitle">
        {intl.formatMessage({
          id: 'affiliate_codes',
          defaultMessage: 'Affiliate codes',
        })}
      </h1>
      {affiliateCodesConfig.map(affiliate => (
        <div className="AffiliateCodes__block" key={affiliate.title}>
          <h3 className="AffiliateCodes__title">{affiliate.title}</h3>
          <p>{intl.formatMessage(affiliate.descriptionIntl)}</p>
          <div className="AffiliateCodes__list">
            {links.map(link => (
              <div key={link[1]}>
                <h3>{affiliate.linksByCountry[link.countryCode]}:</h3>
                <Input
                  onChange={e =>
                    handleLinkChange(
                      affiliate.title.toLowerCase(),
                      link.countryCode,
                      e.target.value,
                    )
                  }
                  defaultValue={link.affiliateCode}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button loading={save} onClick={saveAffiliate} type="primary">
        Save
      </Button>
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
  location: PropTypes.shape().isRequired,
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
    getWebAdmins: getWebAdministrators,
    addWebAdmins: addWebAdministrator,
    deleteWebAdmins: deleteWebAdministrator,
  },
)(withRouter(injectIntl(AffiliateCodes)));
