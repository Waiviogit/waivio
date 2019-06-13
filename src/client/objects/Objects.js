import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import ObjectContent from './ObjectContent';
import Affix from '../components/Utils/Affix';
import SearchObjectsAutocomplete from '../components/EditorObject/SearchObjectsAutocomplete';
import './Objects.less';

const TabPane = Tabs.TabPane;

const Objects = ({ intl, history }) => {
  const handleSelectObject = selected => {
    if (selected) {
      history.push(`/object/${selected.id}`);
    }
  };
  return (
    <div className="shifted">
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'objects_title', defaultMessage: 'objects_title' })} - Waivio
        </title>
      </Helmet>
      <div className="feed-layout container">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className="Objects">
          <div className="Objects__title">
            <div className="Objects__message">
              <FormattedMessage id="objects_title" defaultMessage="Discover more objects" />
            </div>
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
                <ObjectContent isOnlyHashtags />
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
                <ObjectContent />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

Objects.propTypes = {
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default injectIntl(withRouter(Objects));
