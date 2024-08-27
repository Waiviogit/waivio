import React, { useState } from 'react';
import { Icon, message, Modal, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import { getAppHost } from '../../../store/appStore/appSelectors';

import './EmailDraft.less';

const EmailDraft = ({ accessExtend, email, name, permlink, mapObjPermlink }) => {
  const host = useSelector(getAppHost);
  const mapLink = mapObjPermlink;
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const handleCopy = field => message.success(`Copy ${field}`);
  const subjectText = `Boost Visibility for ${name} with a Simple Backlink to ${host}`;
  const bodyText = `We are excited to inform you that ${name} is now featured on ${host}! You can view your listing here:

https//:{host}/${permlink}

Additionally, ${name} can be also found on our interactive map:

{{map-link}}

To ensure your listing is accurate and comprehensive, please review it and let us know if any updates are needed.

Proposal: We would like to offer you an opportunity for increased visibility! 

If you add a link to ${host} from any page on your website, we will feature ${name} prominently on our map, enhancing its visibility and attracting more potential visitors.
If you’re interested, simply add the link to ${host} and email us the page URL where the link is placed.

We look forward to your response and hope to collaborate for mutual benefit.

Kind regards,

The ${host} Team`;

  return (
    <div className={'BusinessObject__email mb5px'}>
      <Icon type="mail" className="text-icon email" />
      <span>
        {accessExtend ? email : <a href={`mailto:${email}`}> {email}</a>}
        <Tooltip
          placement="topLeft"
          title={
            <span onClick={() => setShowModal(true)}>
              <Icon type="user" /> Request backlink
            </span>
          }
          overlayClassName="EmailDraft__tooltip"
          overlayStyle={{ top: '10px' }}
        >
          <Icon type="ellipsis" />
        </Tooltip>
      </span>
      <Modal
        className={'EmailDraft'}
        title={'Post draft'}
        visible={showModal}
        onCancel={closeModal}
        footer={null}
      >
        <p>
          <b>To: </b>
          {email}
          <CopyToClipboard text={email} onCopy={() => handleCopy('email')}>
            <Icon type="copy" />
          </CopyToClipboard>
        </p>
        <p>
          <b>Subject: </b>
          {subjectText}
          <CopyToClipboard text={subjectText} onCopy={() => handleCopy('subject')}>
            <Icon type="copy" />
          </CopyToClipboard>
        </p>
        <div>
          <p>
            <b>Email body: </b>We are excited to inform you that {name} is now featured on {host}!
            You can view your listing here:
          </p>
          <p>
            https//:{host}/{permlink}
          </p>
          {mapLink && (
            <React.Fragment>
              {' '}
              <p>Additionally, {name} can be also found on our interactive map:</p>
              <p>{mapLink}</p>
            </React.Fragment>
          )}
          <p>
            To ensure your listing is accurate and comprehensive, please review it and let us know
            if any updates are needed.
          </p>
          <p>Proposal: We would like to offer you an opportunity for increased visibility!</p>
          <p>
            If you add a link to {host} from any page on your website, we will feature {name}{' '}
            prominently on our {mapLink ? 'map' : 'site'}, enhancing its visibility and attracting
            more potential visitors.
          </p>
          <p>
            If you’re interested, simply add the link to {host} and email us the page URL where the
            link is placed.
          </p>
          <p>We look forward to your response and hope to collaborate for mutual benefit.</p>
          <p>Kind regards,</p>
          <p>
            The {host} Team{' '}
            <CopyToClipboard text={bodyText} onCopy={() => handleCopy('text')}>
              <Icon type="copy" />
            </CopyToClipboard>
          </p>
        </div>
      </Modal>
    </div>
  );
};

EmailDraft.propTypes = {
  accessExtend: PropTypes.bool,
  email: PropTypes.string,
  name: PropTypes.string,
  mapObjPermlink: PropTypes.string,
  permlink: PropTypes.string,
};

export default EmailDraft;
