import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import WeightTag from '../../WeightTag';
import './ObjectExpertiseByType.less';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';
import UserCard from '../../UserCard';

const ObjectExpertiseByType = ({ typeName }) => {
  console.log('Type Name:', typeName);

  // eslint-disable-next-line no-unused-vars
  const [objectsState, setObjectsState] = useState({
    experts: [
      { name: 'blocktrades', weight: 1505893859.8626847 },
      { name: 'zaku', weight: 1306784628.9575205 },
      { name: 'exyle', weight: 1151773051.6096184 },
      { name: 'ocd', weight: 975369373.4495138 },
      { name: 'steemmonsters', weight: 895798629.6185874 },
    ],
    loading: false,
    skip: 0,
    hasNext: true,
  });
  const [showModal, setShowModal] = useState(false);

  const getExperts = () => {
    // getObjectsExpertiseByType(typeName, objectsState.skip, 5)
    //   .then(data => {
    //     setObjectsState({
    //       experts: [...objectsState.experts, ...data],
    //       skip: objectsState.skip + 5,
    //       hasNext: data.length === 5,
    //     });
    //   })
    //   .catch(() => setObjectsState({ ...objectsState, hasNext: false }));
  };

  useEffect(() => {
    // getExperts();
    // return () => setObjectsState({ experts: [], loading: true, skip: 0, hasNext: true });
  }, []);

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
            <div>
              <FormattedMessage id="explore" defaultMessage="Explore" />
            </div>
          </h4>
        </React.Fragment>
      );

      const onWheelHandler = () => {
        if (objectsState.hasNext) {
          getExperts();
        }
      };

      renderCard = (
        <div className="SidebarContentBlock" data-test="objectsRelatedComponent">
          <h4 className="SidebarContentBlock__title">
            <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
            <FormattedMessage id="object_related" defaultMessage="Related" />
          </h4>
          <div className="SidebarContentBlock__content">{renderObjects}</div>
          {renderButtons()}
          <div onWheel={onWheelHandler}>
            <Modal
              title="Related"
              visible={showModal}
              onOk={() => setShowModal(false)}
              onCancel={() => setShowModal(false)}
              id="ObjectRelated__Modal"
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
