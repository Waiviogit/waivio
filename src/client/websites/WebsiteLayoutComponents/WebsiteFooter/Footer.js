import React from 'react';
import PropTypes from "prop-types";
import {injectIntl} from "react-intl";
import { footerLinks } from '../../constants/links';

import './Footer.less';

const WebsiteFooter = ({intl}) => (
  <div className="wrapper">
    <footer className="Footer">
      {Object.keys(footerLinks).map(section => (
        <div key={section} className="Footer__list">
          <span>{section}</span>
          <div>
            {footerLinks[section].map(linkInfo => (
              <a key={linkInfo.name} href={linkInfo.link}>
                {intl.formatMessage({id: linkInfo.id, defaultMessage: linkInfo.name})}
              </a>
            ))}
          </div>
        </div>
      ))}
    </footer>
  </div>
);

WebsiteFooter.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(WebsiteFooter);
