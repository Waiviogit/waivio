import React from 'react';
import { footerLinks } from '../../constants/links';

import './Footer.less';

const WebsiteFooter = () => (
  <footer className="Footer">
    {Object.keys(footerLinks).map(section => (
      <div key={section} className="Footer__list">
        <span>{section}</span>
        <div>
          {footerLinks[section].map(linkInfo => (
            <a key={linkInfo.name} href={linkInfo.link}>
              {linkInfo.name}
            </a>
          ))}
        </div>
      </div>
    ))}
  </footer>
);

export default WebsiteFooter;
