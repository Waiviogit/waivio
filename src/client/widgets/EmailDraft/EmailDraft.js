import React, {useState} from 'react';
import {Icon, Input, message, Modal} from "antd";
import PropTypes from "prop-types";
import {CopyToClipboard} from "react-copy-to-clipboard";

const EmailDraft = (
  {
    accessExtend,
    email,
    name,
    host,
    objLink,
    mapLink
  }
) => {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const handleCopy = (field) => message.success(`Copy ${field}`);
  const subjectText = `Boost Visibility for ${name} with a Simple Backlink to ${host}`;

  return (
    <div className={'BusinessObject__email mb5px'}>
      <Icon type="mail" className="text-icon email"/>
      <span>{accessExtend ? email : <a href={`mailto:${email}`}> {email}</a>}</span>
      <span onClick={() => setShowModal(true)}><Icon type="ellipsis"/></span>
      <Modal
        title={'Post draft'}
        visible={showModal}
        onCancel={closeModal}
      >
        <p><b>To:{' '}</b>
          <CopyToClipboard text={email} onCopy={() => handleCopy('email')}>
            <span>{email} <Icon type="copy" /></span>
          </CopyToClipboard>
        </p>
        <p><b>Subject:{' '}</b>
          <CopyToClipboard text={subjectText} onCopy={() => handleCopy('subject')}>
            <span>{subjectText} <Icon type="copy" /></span>
          </CopyToClipboard>
          </p>

        <div>
          We are excited to inform you that {name} is now featured on {host}! You can view your listing here:

          {objLink}

          Additionally, {name} can be also found on our interactive map:

          {mapLink}

          To ensure your listing is accurate and comprehensive, please review it and let us know if any updates are
          needed.

          Proposal: We would like to offer you an opportunity for increased visibility!

          If you add a link to {host} from any page on your website, we will feature {name} prominently on our map,
          enhancing its visibility and attracting more potential visitors.
          If you’re interested, simply add the link to {host} and email us the page URL where the link is placed.

          We look forward to your response and hope to collaborate for mutual benefit.

          Kind regards,

          The {host} Team
        </div>

      </Modal>
    </div>
  );
};

EmailDraft.propTypes = {
  accessExtend: PropTypes.bool,
  email: PropTypes.string,
  name: PropTypes.string,
  host: PropTypes.string,
  objLink: PropTypes.string,
  mapLink: PropTypes.string
}

export default EmailDraft;
