import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import WeightTag from '../../WeightTag';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';
import UserCard from '../../UserCard';
import { getObjectExpertiseByType } from '../../../../waivioApi/ApiClient';
import './ObjectExpertiseByType.less';

const OBJECTS_COUNT = 5;

const initialState = {
  experts: [],
  loading: true,
  skip: 0,
  limit: OBJECTS_COUNT,
  hasNext: true,
};

const initialModalState = {
  experts: [],
  loading: true,
  skip: 0,
  limit: OBJECTS_COUNT,
  hasNext: true,
};

const ObjectExpertiseByType = ({ match }) => {
  const typeName = match.params.typeName;
  const [objectsState, setObjectsState] = useState(initialState);
  const [objectsModalState, setModalObjectsState] = useState(initialModalState);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line prefer-const
  let { skip, limit } = objectsState;
  const getExperts = () => {
    getObjectExpertiseByType(typeName, objectsModalState.skip, objectsModalState.limit)
      .then(data => {
        setModalObjectsState({
          ...objectsModalState,
          experts: [...objectsModalState.experts, ...data],
          skip: objectsModalState.skip + objectsModalState.limit,
          hasNext: data.length === OBJECTS_COUNT,
        });
      })
      .catch(() => setModalObjectsState({ ...objectsModalState, hasNext: false, loading: false }));
  };

  const showMoreExperts = () => {
    getObjectExpertiseByType(typeName, skip, limit)
      .then(data => {
        setObjectsState({
          ...objectsState,
          experts: [...objectsState.experts, ...data],
          skip: objectsState.skip + objectsState.limit,
          hasNext: data.length === OBJECTS_COUNT,
        });
      })
      .catch(() => setObjectsState({ ...objectsState, hasNext: false, loading: false }));
  };

  useEffect(() => {
    skip = 0;
    getObjectExpertiseByType(typeName, skip, limit)
      .then(data => {
        setObjectsState({
          ...objectsState,
          experts: [...data],
          skip: skip + limit,
          loading: false,
          hasNext: data.length === OBJECTS_COUNT,
        });
      })
      .catch(() => setObjectsState({ ...initialState, loading: false }));

    getObjectExpertiseByType(typeName, objectsModalState.skip, objectsModalState.limit)
      .then(data => {
        setModalObjectsState({
          ...objectsModalState,
          experts: [...data],
          skip: objectsModalState.skip + objectsModalState.limit,
          loading: false,
          hasNext: data.length === OBJECTS_COUNT,
        });
      })
      .catch(() => setModalObjectsState({ ...initialModalState, loading: false }));

    return () => setObjectsState(initialState);
  }, [match.params.typeName]);

  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;

  if (!objectsState.loading) {
    if (!_.isEmpty(objectsState.experts)) {
      const renderObjects = objectsState.experts
        .slice(0, skip)
        .map(expert => (
          <UserCard
            key={expert.name}
            user={expert}
            showFollow={false}
            alt={<WeightTag weight={expert.weight} />}
          />
        ));

      const renderObjectsModal = objectsModalState.experts.map(expert => (
        <UserCard
          key={expert.name}
          user={expert}
          showFollow={false}
          alt={<WeightTag weight={expert.weight} />}
        />
      ));

      const renderButtons = () => (
        <div className="ObjectExpertiseByType__buttons-wrapper">
          <div className="ObjectExpertiseByType__buttons-wrapper-item">
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div onClick={() => setShowModal(true)} id="show_more_div">
              <FormattedMessage id="show_all" defaultMessage="Show All" />
            </div>
          </div>
          <div
            className="ObjectExpertiseByType__buttons-wrapper-item"
            onClick={showMoreExperts}
            role="presentation"
          >
            <FormattedMessage id="show_more" defaultMessage="Show more" />
          </div>
        </div>
      );

      const onWheelHandler = () => {
        if (objectsModalState.hasNext) {
          getExperts();
        }
      };

      renderCard = (
        <div className="SidebarContentBlock" key={typeName}>
          <h4 className="SidebarContentBlock__title">
            <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
            <FormattedMessage id="type_experts" defaultMessage="Type Experts" />
          </h4>
          <div className="SidebarContentBlock__content">{renderObjects}</div>
          {renderButtons()}
          <div id="ObjectExpertiseByType__Modal" onWheel={_.throttle(onWheelHandler, 120)}>
            <Modal
              title="Related"
              visible={showModal}
              onOk={() => setShowModal(false)}
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
};

export default ObjectExpertiseByType;
