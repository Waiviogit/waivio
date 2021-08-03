import React from 'react';
import PropTypes from 'prop-types';

import SectionOneItem from '../SectionOneItem';

const SectionItems = ({ sections }) => (
  <React.Fragment>
    {sections.map(section => (
      <SectionOneItem
        key={section.path}
        isShow={section.isShow}
        path={section.path}
        sectionItemNameId={section.sectionItemNameId}
        sectionItemName={section.sectionItemName}
      />
    ))}
  </React.Fragment>
);

SectionItems.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape()),
};

SectionItems.defaultProps = {
  sections: [],
};

export default SectionItems;
