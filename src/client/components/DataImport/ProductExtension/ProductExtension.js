import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import './ProductExtension.less';

const ProductExtension = ({ intl }) => (
  <div className="ProductExtension">
    <h2>{intl.formatMessage({ id: 'product_extension', defaultMessage: 'Product extension' })}</h2>
    <p className="ProductExtension__description">
      {intl.formatMessage({
        id: 'product_extension_description',
        defaultMessage:
          "The Product Extension is a Chrome browser extension designed to efficiently scrape Amazon pages and extract crucial information tailored to Waivio's requirements. By effortlessly parsing through a product page, this extension gathers relevant data such as product names, prices, avatars, and more. After processing the collected information, it generates a compatible output file.",
      })}
    </p>

    <b>Installation instructions:</b>
    <p className="ProductExtension__list">
      <ol>
        <li className="ProductExtension__list-item">
          Download the archive{' '}
          <a download="" href={'/docs/dist.7z'}>
            file
          </a>
          .
        </li>
        <li className="ProductExtension__list-item">
          Extract the contents of the archive into a chosen folder.
        </li>
        <li className="ProductExtension__list-item">
          Open the Chrome extensions page by navigating to chrome://extensions/ in your browser.
        </li>
        <li className="ProductExtension__list-item">
          Enable Developer Mode by toggling the switch located in the top-right corner of the page.
        </li>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <li className="ProductExtension__list-item">Click the "Load unpacked" button.</li>
        <li className="ProductExtension__list-item">
          Locate and select the extension directory containing the previously downloaded file.
        </li>
        <li className="ProductExtension__list-item">
          The Waivio Product Extension should now appear on your extensions page, ready for use.
        </li>
      </ol>
    </p>
    <b>Extension features:</b>
    <p className="ProductExtension__list">
      <ul>
        <li className="ProductExtension__list-ordered-item">
          <span className="ProductExtension__list-item-underline">Get JSON </span>: users can
          receive a .json file containing the Amazon page information.
        </li>
        <li className="ProductExtension__list-ordered-item">
          <span className="ProductExtension__list-item-underline"> Get XLSX </span>: users can
          download an .xlsx file in a tabular format.
        </li>
        <li className="ProductExtension__list-ordered-item">
          <span className="ProductExtension__list-item-underline"> Copy to clipboard </span>: page
          information can be copied to the clipboard for easy insertion into Google Sheets. This
          option copies the data without field names.
        </li>
      </ul>
    </p>
    <b>Link information:</b>
    <p>
      Please note that in order for the extension to work correctly, the Amazon page link should
      look as follows:{' '}
      <span className="ProductExtension__link-example">https://www.amazon.com/dp/ASIN_NUMBER</span>
    </p>

    <p>
      <div> Here, amazon.com can be replaced with any Amazon regional site as well.</div>
      <div>All unnecessary information must be removed manually from the link.</div>
      <div>Examples:</div>
      <div>https://www.amazon.pl/dp/B01LYYIMIO</div>
      <div>https://www.amazon.com/dp/B0BPSNYSDC</div>
    </p>

    <p>
      <b>Version:</b>
      <ul>
        <li> Last updated date: 05/18/2023</li>
        <li> Current file for download:</li>
        <button className="Follow mt2">
          <a download="" href={'/docs/dist.7z'}>
            Download file
          </a>
        </button>
      </ul>
    </p>
    <p>
      Please note that after each of our updates, you need to reinstall the extension or refresh the
      file and extension to use the most current version.
      <div>
        {' '}
        Product extension original repository
        <a
          href="https://github.com/Waiviogit/waivio-import-extension"
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          GitHub
        </a>
        .
      </div>
    </p>
  </div>
);

ProductExtension.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(ProductExtension);
