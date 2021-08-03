import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const SectionTitle = ({ intl, isOpen, nameKey, defaultName, sectionId, toggleSection }) => {
  const handleToggleSection = () => toggleSection(sectionId);

  return (
    <div className="Sidenav__title-wrap" onClick={handleToggleSection} role="presentation">
      <div className="Sidenav__title-item">
        {intl.formatMessage({ id: nameKey, defaultMessage: defaultName })}:
      </div>
      <div className="Sidenav__title-icon">
        {!isOpen ? (
          <i className="iconfont icon-addition" />
        ) : (
          <i className="iconfont icon-offline" />
        )}
      </div>
    </div>
  );
};

SectionTitle.propTypes = {
  intl: PropTypes.shape().isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleSection: PropTypes.func.isRequired,
  sectionId: PropTypes.string.isRequired,
  defaultName: PropTypes.string.isRequired,
  nameKey: PropTypes.string.isRequired,
};

export default injectIntl(SectionTitle);
