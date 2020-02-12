import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ObjectList from './ObjectList';
import SearchObjectsAutocomplete from '../components/EditorObject/SearchObjectsAutocomplete';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';

import './Objects.less';

const TabPane = Tabs.TabPane;

const ObjectsContainer = ({ history }) => {
  const handleSelectObject = selected => {
    if (selected) {
      history.push(`/object/${selected.id}`);
    }
  };

  return (
    <div className="Objects">
      <MobileNavigation />
      <div className="Objects__title">
        <SearchObjectsAutocomplete handleSelect={handleSelectObject} />
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span className="UserExpertise__item">
              <FormattedMessage id="hashtag_value_placeholder" defaultMessage="Hashtags" />
            </span>
          }
          key="1"
        >
          <div className="Objects__content">
            <ObjectList isOnlyHashtags />
          </div>
        </TabPane>
        <TabPane
          tab={
            <span className="UserExpertise__item">
              <FormattedMessage id="objects" defaultMessage="Objects" />
            </span>
          }
          key="2"
        >
          <div className="Objects__content">
            <ObjectList />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

ObjectsContainer.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default withRouter(ObjectsContainer);
