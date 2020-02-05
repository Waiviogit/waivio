import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import WeightTag from '../../WeightTag';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';
import UserCard from '../../UserCard';
import { getObjectExpertiseByType } from '../../../../waivioApi/ApiClient';
import './ObjectExpertiseByType.less';

const initialState = {
  experts: [],
  loading: true,
};

const ObjectExpertiseByType = ({ match, intl }) => {
  const typeName = match.params.typeName;
  const [objectsState, setObjectsState] = useState(initialState);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getObjectExpertiseByType(typeName, 0, 30)
      .then(data => {
        setObjectsState({ experts: [...data], loading: false });
      })
      .catch(() => setObjectsState({ ...initialState, loading: false }));
    return () => setObjectsState(initialState);
  }, [match.params.typeName]);

  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;

  if (!objectsState.loading) {
    if (!_.isEmpty(objectsState.experts)) {
      const renderObjects = objectsState.experts
        .slice(0, 5)
        .map(expert => (
          <UserCard
            key={expert.name}
            user={expert}
            showFollow={false}
            alt={<WeightTag weight={expert.weight} />}
          />
        ));

      const renderObjectsModal = objectsState.experts.map(expert => (
        <UserCard
          key={expert.name}
          user={expert}
          showFollow={false}
          alt={<WeightTag weight={expert.weight} />}
        />
      ));

      const renderButtons = () => (
        <h4 className="ObjectExpertiseByType__more">
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <a onClick={() => setShowModal(true)} id="show_more_div">
            {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })}
          </a>
        </h4>
      );

      renderCard = (
        <div className="SidebarContentBlock" key={typeName}>
          <div className="SidebarContentBlock__title">
            <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
            {intl.formatMessage({ id: 'type_experts', defaultMessage: 'Type Experts' })}
          </div>
          <div className="SidebarContentBlock__content">{renderObjects}</div>
          {renderButtons()}
          <div id="ObjectExpertiseByType__Modal">
            <Modal
              title={intl.formatMessage({ id: 'type_experts', defaultMessage: 'Type Experts' })}
              visible={showModal}
              footer={null}
              onCancel={() => setShowModal(false)}
            >
              {renderObjectsModal}
            </Modal>
          </div>
        </div>
      );
    } else {
      renderCard = null;
    }
  }

  return renderCard;
};

ObjectExpertiseByType.propTypes = {
  match: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ObjectExpertiseByType);
