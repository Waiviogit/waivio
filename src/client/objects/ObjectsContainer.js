import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ObjectList from './ObjectList';
import SearchObjectsAutocomplete from '../components/EditorObject/SearchObjectsAutocomplete';
import SidenavDiscoverObjects from '../discoverObjects/SidenavDiscoverObjects';
import './Objects.less';

const TabPane = Tabs.TabPane;

const ObjectsContainer = ({ history }) => {
  const handleSelectObject = selected => {
    if (selected) {
      history.push(`/object/${selected.id}`);
    }
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="Objects">
      <div className="discover-objects-header">
        <div className="flex justify-between">
          <span className="discover-objects-header__title">
            <span className="discover-objects-header__topic ttc">
              <FormattedMessage id="objects" defaultMessage="Objects" />
            </span>
            <span className="ttc">: All</span>&nbsp;
            <span className="discover-objects-header__selector">
              (
              <span className="underline" role="presentation" onClick={() => setShowModal(true)}>
                <FormattedMessage id="change" defaultMessage="change" />
              </span>
              )
            </span>
          </span>
        </div>
      </div>
      <Modal
        className="discover-filters-modal"
        footer={null}
        title="title"
        closable
        visible={showModal}
        onCancel={() => setShowModal(false)}
      >
        <SidenavDiscoverObjects withTitle={false} />
      </Modal>
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
