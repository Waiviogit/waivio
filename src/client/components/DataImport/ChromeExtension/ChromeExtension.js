import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import './ChromeExtension.less';

const FILE_ZIP = 'https://waivio.nyc3.digitaloceanspaces.com/extension.zip';
const FILE_RAR = 'https://waivio.nyc3.digitaloceanspaces.com/extension.tar';

const ChromeExtension = ({ intl }) => (
  <div className="ChromeExtension">
    <h2>{intl.formatMessage({ id: 'chrome_extension', defaultMessage: 'Chrome extension' })}</h2>
    <p className="ChromeExtension__description">
      {intl.formatMessage({
        id: 'chrome_extension_description',
        defaultMessage:
          "The Waivio Chrome Extension is a browser extension designed to efficiently scrape Amazon pages and extract crucial information tailored to Waivio's requirements. By effortlessly parsing through a product page, this extension gathers relevant data such as product names, prices, avatars, and more. After processing the collected information, it generates a compatible output file.",
      })}
    </p>

    <b>Installation instructions:</b>
    <p className="ChromeExtension__list">
      <ol>
        <li className="ChromeExtension__list-item">
          Download the archive file (
          <a download="" href={FILE_ZIP}>
            .zip
          </a>
          ,
          <a download="" href={FILE_RAR}>
            {' '}
            .tar
          </a>
          ).
        </li>
        <li className="ChromeExtension__list-item">
          Extract the contents of the archive into a chosen folder.
        </li>
        <li className="ChromeExtension__list-item">
          Open the Chrome extensions page by navigating to chrome://extensions/ in your browser.
        </li>
        <li className="ChromeExtension__list-item">
          Enable Developer Mode by toggling the switch located in the top-right corner of the page.
        </li>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <li className="ChromeExtension__list-item">Click the "Load unpacked" button.</li>
        <li className="ChromeExtension__list-item">
          Locate and select the extension directory containing the previously downloaded file.
        </li>
        <li className="ChromeExtension__list-item">
          The Waivio Chrome Extension should now appear on your extensions page, ready for use.
        </li>
      </ol>
    </p>
    <b>Extension features:</b>
    <p className="ChromeExtension__list">
      <ul>
        <li className="ChromeExtension__list-ordered-item">
          <span className="ChromeExtension__list-item-underline">Get JSON</span>: users can receive
          a .json file containing the Amazon page information.
        </li>
        <li className="ChromeExtension__list-ordered-item">
          <span className="ChromeExtension__list-item-underline"> Get XLSX</span>: users can
          download an .xlsx file in a tabular format.
        </li>
        <li className="ChromeExtension__list-ordered-item">
          <span className="ChromeExtension__list-item-underline"> Copy to clipboard</span>: page
          information can be copied to the clipboard for easy insertion into Google Sheets. This
          option copies the data without field names.
        </li>
        <li className="ChromeExtension__list-ordered-item">
          <span className="ChromeExtension__list-item-underline"> Scan for ASINs</span>: tool can
          scan any Amazon URL and extract ASIN numbers of products from that webpage. It generates a
          search query for Datafiniti&apos;s product search API tab, downloads the file, and also
          instantly copies the information to the clipboard.
        </li>{' '}
        <li className="ChromeExtension__list-ordered-item">
          <span className="ChromeExtension__list-item-underline"> Import to Waivio</span>: tool
          scans the Amazon URL, generates the required file, and immediately initiates the import to
          Waivio under the currently logged-in user.
        </li>
      </ul>
    </p>
    <b>Link information:</b>
    <p>
      Please note that in order for the extension to work correctly, the Amazon page link should
      look as follows:{' '}
      <span className="ChromeExtension__link-example">https://www.amazon.com/dp/ASIN_NUMBER</span>
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
        <li> Last updated date: 05/24/2023</li>
        <li> Current file for download:</li>
        <button className="ant-btn ant-btn-primary mt2 ">
          <a download="" href={FILE_ZIP}>
            Download file .zip
          </a>
        </button>
        <button className="ant-btn ant-btn-primary mt2 ml2">
          <a download="" href={FILE_RAR}>
            Download file .tar
          </a>
        </button>
      </ul>
    </p>
    <p>
      Please note that after each of our updates, you need to reinstall the extension or refresh the
      file and extension to use the most current version.
      <div>
        {' '}
        The Waivio Chrome Extension original repository
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

ChromeExtension.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(ChromeExtension);
