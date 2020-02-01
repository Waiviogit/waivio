import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import UserCard from '../../UserCard';
import api from '../../../../investarena/configApi/apiResources';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';
import ProfitabilityTag from '../../profitabilityTag';

const mostProfitableUsers = ({ chartid }) => {
  const [state, setState] = useState({ performers: [], loading: true, isModalOpen: false });

  useEffect(() => {
    if (chartid) {
      api.performers
        .getMostProfitableUsers(chartid)
        .then(data => setState({performers: data, loading: false}));
    }
  }, [chartid]);

  const { performers, loading, isModalOpen } = state;

  let spinner = null;
  if (loading) spinner = <RightSidebarLoading />;

  return !_.isEmpty(performers) ? (
    <div className="SidebarContentBlock">
      <h4 className="SidebarContentBlock__title">
        <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
        <FormattedMessage id="object_profitability" defaultMessage="Top performers" />
      </h4>
      <div className="SidebarContentBlock__content">
        {_.map(_.slice(performers, 0, 5), u => (
          <UserCard
            key={u.name}
            user={u}
            showFollow={false}
            alt={<ProfitabilityTag prof={u.totalProfitability} />}
          />
        ))}
      </div>
      <h4 className="ObjectsRelated__more">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div onClick={() => setState({ ...state, isModalOpen: true })} id="show_more_div">
          <FormattedMessage id="show_more" defaultMessage="Show more" />
        </div>
      </h4>
      <Modal
        title="Most profitable performers"
        visible={isModalOpen}
        footer={null}
        onCancel={() => setState({ ...state, isModalOpen: false })}
        id="MostProfitableUsers__Modal"
      >
        {_.map(performers, u => (
          <UserCard
            key={u.name}
            user={u}
            showFollow={false}
            alt={<ProfitabilityTag prof={u.totalProfitability} />}
          />
        ))}
      </Modal>
    </div>
  ) : (
    spinner
  );
};

mostProfitableUsers.propTypes = {
  chartid: PropTypes.string.isRequired,
};

export default mostProfitableUsers;
