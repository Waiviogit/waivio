import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { getChromeExtensionVersion } from '../../../../waivioApi/ApiClient';
import './ChromeExtension.less';

const FILE_ZIP = 'https://waivio.nyc3.digitaloceanspaces.com/extension.zip';
const FILE_RAR = 'https://waivio.nyc3.digitaloceanspaces.com/extension.tar';

const ChromeExtension = ({ intl }) => {
  const [currentVersion, setCurrentVersion] = useState('');

  useEffect(() => {
    getChromeExtensionVersion().then(res => setCurrentVersion(res));
  }, []);

  return (
    <div className="ChromeExtension">
      <h2>{intl.formatMessage({ id: 'chrome_extension', defaultMessage: 'Chrome extension' })}</h2>
      <p className="ChromeExtension__description">
        {intl.formatMessage({
          id: 'chrome_extension_description',
          defaultMessage:
            "The Waivio Chrome Extension is a browser tool designed to efficiently scrape Amazon, Sephora, Walmart and AliExpress pages to extract crucial information tailored to Waivio's requirements. By effortlessly parsing through a product page, this extension gathers relevant data such as product names, prices, avatars, and more. After processing the collected information, it generates a compatible output file.",
        })}
      </p>

      <b>
        {intl.formatMessage({
          id: 'chrome_extension_installation_title',
          defaultMessage: 'Installation instruction',
        })}
        :
      </b>
      <p className="ChromeExtension__list">
        <ol>
          <li className="ChromeExtension__list-item">
            {intl.formatMessage({
              id: 'chrome_extension_download_file',
              defaultMessage: 'Download the archive file',
            })}{' '}
            (
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
            {intl.formatMessage({
              id: 'chrome_extension_extract_contents',
              defaultMessage: 'Extract the contents of the archive into a chosen folder',
            })}
            .
          </li>
          <li className="ChromeExtension__list-item">
            {intl.formatMessage({
              id: 'chrome_extension_open_chrome',
              defaultMessage: 'Open the Chrome extensions page by navigating to',
            })}{' '}
            chrome://extensions/ in your browser.
          </li>
          <li className="ChromeExtension__list-item">
            {intl.formatMessage({
              id: 'chrome_extension_enable_mode',
              defaultMessage:
                'Enable Developer Mode by toggling the switch located in the top-right corner of the page',
            })}
            .
          </li>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <li className="ChromeExtension__list-item">
            {intl.formatMessage({
              id: 'chrome_extension_click_load',
              defaultMessage: 'Click the "Load unpacked" button',
            })}
            .
          </li>
          <li className="ChromeExtension__list-item">
            {intl.formatMessage({
              id: 'chrome_extension_locate_file',
              defaultMessage:
                'Locate and select the extension directory containing the previously downloaded file',
            })}
            .
          </li>
          <li className="ChromeExtension__list-item">
            {intl.formatMessage({
              id: 'chrome_extension_appear',
              defaultMessage:
                'The Waivio Chrome Extension should now appear on your extensions page, ready for use',
            })}
            .
          </li>
        </ol>
      </p>
      <p>
        <b>{intl.formatMessage({ id: 'chrome_extension_version', defaultMessage: 'Version' })}:</b>
        <ul>
          <li>
            {intl.formatMessage({
              id: 'chrome_extension_current_version',
              defaultMessage: 'Current version',
            })}
            : <span>{currentVersion}</span>
          </li>
          <button className="ant-btn ant-btn-primary mt2 ">
            <a download="" href={FILE_ZIP}>
              {intl.formatMessage({
                id: 'chrome_extension_download_file_button',
                defaultMessage: 'Download file',
              })}{' '}
              .zip
            </a>
          </button>
          <button className="ant-btn ant-btn-primary mt2 ml2">
            <a download="" href={FILE_RAR}>
              {intl.formatMessage({
                id: 'chrome_extension_download_file_button',
                defaultMessage: 'Download file',
              })}{' '}
              .tar
            </a>
          </button>
        </ul>
      </p>
      <p>
        {intl.formatMessage({
          id: 'chrome_extension_reinstall_note',
          defaultMessage:
            'Please note that after each of our updates, you need to reinstall the extension or refresh the file and extension to use the most current version',
        })}
        .
        <div>
          {' '}
          {intl.formatMessage({
            id: 'chrome_extension_repository',
            defaultMessage: 'The Waivio Chrome Extension original repository',
          })}
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
      <b>
        {intl.formatMessage({
          id: 'chrome_extension_features_title',
          defaultMessage: 'Extension features',
        })}
        :
      </b>
      <p className="ChromeExtension__list">
        <ul>
          <li className="ChromeExtension__list-ordered-item">
            <span className="ChromeExtension__list-item-underline">
              {intl.formatMessage({ id: 'chrome_extension_create', defaultMessage: 'Create' })} JSON
            </span>
            :{' '}
            {intl.formatMessage({
              id: 'chrome_extension_receive_file',
              defaultMessage: 'users can receive a .json file containing the page information',
            })}
            .
          </li>
          <li className="ChromeExtension__list-ordered-item">
            <span className="ChromeExtension__list-item-underline">
              {intl.formatMessage({ id: 'chrome_extension_create', defaultMessage: 'Create' })} XLSX
            </span>
            :{' '}
            {intl.formatMessage({
              id: 'chrome_extension_download_table',
              defaultMessage: 'users can download an .xlsx file in a tabular format',
            })}
            .
          </li>
          <li className="ChromeExtension__list-ordered-item">
            <span className="ChromeExtension__list-item-underline">
              {intl.formatMessage({
                id: 'chrome_extension_copy_to_clipboard',
                defaultMessage: 'Copy to clipboard',
              })}
            </span>
            :{' '}
            {intl.formatMessage({
              id: 'chrome_extension_about_copy_to_clipboard',
              defaultMessage:
                'page information can be copied to the clipboard for easy insertion into Google Sheets. This option copies the data without field names',
            })}
            .
          </li>
          <li className="ChromeExtension__list-ordered-item">
            <span className="ChromeExtension__list-item-underline">
              {intl.formatMessage({
                id: 'chrome_extension_scan',
                defaultMessage: 'Scan for ASINs',
              })}
            </span>
            :{' '}
            {intl.formatMessage({
              id: 'chrome_extension_about_scan',
              defaultMessage:
                "tool can scan any Amazon URL and extract ASIN numbers of products from that webpage. It generates a search query for Datafiniti's product search API tab, downloads the file, and also instantly copies the information to the clipboard",
            })}
            .
          </li>{' '}
          <li className="ChromeExtension__list-ordered-item">
            <span className="ChromeExtension__list-item-underline">
              {intl.formatMessage({
                id: 'chrome_extension_upload',
                defaultMessage: 'Upload to Waivio',
              })}
            </span>
            :{' '}
            {intl.formatMessage({
              id: 'chrome_extension_about_upload',
              defaultMessage:
                'tool scans the URL, generates the required file, and immediately initiates the import to Waivio under the currently logged-in user',
            })}
            .
          </li>
          <li className="ChromeExtension__list-ordered-item">
            <span className="ChromeExtension__list-item-underline">
              {intl.formatMessage({
                id: 'chrome_extension_create_draft',
                defaultMessage: 'Create post draft',
              })}
            </span>
            :{' '}
            {intl.formatMessage({
              id: 'chrome_extension_about_create_draft',
              defaultMessage: 'tool can create a post based on a YouTube video using ChatGPT',
            })}
            .
          </li>
          <li className="ChromeExtension__list-ordered-item">
            <span className="ChromeExtension__list-item-underline">Create recipe draft</span>: tool
            can generate a recipe post based on a YouTube video using ChatGPT.
          </li>
          <li className="ChromeExtension__list-ordered-item">
            <span className="ChromeExtension__list-item-underline">Re-post</span>: tool can create a
            post draft using video content without rewriting it, allowing the user to publish it
            directly on Waivio.
          </li>
        </ul>
      </p>
    </div>
  );
};

ChromeExtension.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(ChromeExtension);
