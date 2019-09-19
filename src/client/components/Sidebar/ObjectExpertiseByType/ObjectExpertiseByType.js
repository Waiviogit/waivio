import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import WeightTag from '../../WeightTag';
import './ObjectExpertiseByType.less';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';
import UserCard from '../../UserCard';
import { getObjectExpertiseByType } from '../../../../waivioApi/ApiClient';

const ObjectExpertiseByType = ({ match }) => {
  const typeName = match.params.typeName;
  const [objectsState, setObjectsState] = useState({
    experts: [],
    loading: true,
    skip: 0,
    limit: 5,
    hasNext: true,
  });
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line prefer-const
  let { skip, limit } = objectsState;

  const getExperts = () => {
    getObjectExpertiseByType(typeName, skip, limit)
      .then(data => {
        setObjectsState({
          ...objectsState,
          experts: [...objectsState.experts, ...data],
          skip: skip + limit,
          hasNext: data.length === 5,
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
          hasNext: data.length === 5,
        });
      })
      .catch(() => setObjectsState({ ...objectsState, hasNext: false, loading: false }));
    return () => setObjectsState({ experts: [], loading: true, skip: 0, limit: 5, hasNext: true });
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
        <React.Fragment>
          <h4 className="ObjectExpertiseByType__more">
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div onClick={() => setShowModal(true)} id="show_more_div">
              <FormattedMessage id="show_more" defaultMessage="Show more" />
            </div>
            <Link to={'/discover'}>
              <FormattedMessage id="explore" defaultMessage="Explore" />
            </Link>
          </h4>
        </React.Fragment>
      );

      const onWheelHandler = () => {
        if (objectsState.hasNext) {
          getExperts();
        }
      };

      renderCard = (
        <div className="SidebarContentBlock" key={typeName}>
          <h4 className="SidebarContentBlock__title">
            <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
            <FormattedMessage id="object_related" defaultMessage="Type Experts" />
          </h4>
          <div className="SidebarContentBlock__content">{renderObjects}</div>
          {renderButtons()}
          <div id="ObjectExpertiseByType__Modal" onWheel={onWheelHandler}>
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
  typeName: PropTypes.string.isRequired,
};

export default ObjectExpertiseByType;
