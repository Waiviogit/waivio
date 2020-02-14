import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import WeightTag from '../../WeightTag';
import { getAuthorsChildWobjects } from '../../../../waivioApi/ApiClient';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';
import ObjectCard from '../ObjectCard';

import './ObjectsRelated.less';

const ObjectsRelated = ({ wobject }) => {
  const [objectsState, setObjectsState] = useState({
    objects: [],
    loading: true,
    skip: 0,
    hasNext: true,
  });
  const [showModal, setShowModal] = useState(false);
  // const [skipValue, setSkipValue] = useState(0);

  const getInitialWobjects = () => {
    getAuthorsChildWobjects(wobject.author_permlink, objectsState.skip, 5)
      .then(data =>
        setObjectsState({
          objects: [...data],
          loading: false,
          skip: 5,
          hasNext: data.length === 5,
        }),
      )
      .catch(() => setObjectsState({ loading: false }));
  };

  const getWobjects = () => {
    getAuthorsChildWobjects(wobject.author_permlink, objectsState.skip, 5)
      .then(data => {
        setObjectsState({
          objects: [...objectsState.objects, ...data],
          skip: objectsState.skip + 5,
          hasNext: data.length === 5,
        });
      })
      .catch(() => setObjectsState({ ...objectsState, hasNext: false }));
  };

  useEffect(() => {
    getInitialWobjects();
    return () => setObjectsState({ objects: [], loading: true, skip: 0, hasNext: true });
  }, [wobject.author_permlink]);

  let renderCard = <RightSidebarLoading id="RightSidebarLoading" />;

  if (!objectsState.loading) {
    if (!_.isEmpty(objectsState.objects)) {
      const renderObjects = objectsState.objects
        .slice(0, 5)
        .map(item => (
          <ObjectCard
            key={item.author_permlink}
            wobject={item}
            showFollow={false}
            alt={<WeightTag weight={item.weight} />}
            isNewWindow={false}
            id="ObjectCard"
          />
        ));

      const renderObjectsModal = objectsState.objects.map(item => (
        <ObjectCard
          key={item.author_permlink}
          wobject={item}
          showFollow={false}
          alt={<WeightTag weight={item.weight} />}
          isNewWindow={false}
        />
      ));

      const renderButtons = () => (
        <h4 className="ObjectsRelated__more">
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div onClick={() => setShowModal(true)} id="show_more_div">
            <FormattedMessage id="show_more" defaultMessage="Show more" />
          </div>
        </h4>
      );

      const onWheelHandler = () => {
        if (objectsState.hasNext) {
          getWobjects();
        }
      };

      renderCard = (
        <div className="SidebarContentBlock" data-test="objectsRelatedComponent">
          <h4 className="SidebarContentBlock__title">
            <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
            <FormattedMessage id="related_to_object" defaultMessage="Related" />
          </h4>
          <div className="SidebarContentBlock__content">{renderObjects}</div>
          {renderButtons()}
          <div onWheel={_.throttle(onWheelHandler, 100)}>
            <Modal
              title="Related"
              visible={showModal}
              footer={null}
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

ObjectsRelated.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  wobject: PropTypes.shape().isRequired,
};

export default ObjectsRelated;
