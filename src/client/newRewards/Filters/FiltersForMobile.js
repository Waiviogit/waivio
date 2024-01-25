import React, { useMemo } from 'react';
import { Tag, Modal } from 'antd';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { createQuery, parseQuery } from '../../../waivioApi/helpers';
import WobjectShopFilter from '../../object/ObjectTypeShop/WobjectShopFilter';
import GlobalShopFilters from '../../Shop/ShopFilters/GlobalShopFilters';
import UserFilters from '../../Shop/ShopFilters/UserFilters';

const FiltersForMobile = ({ type, setVisible, user, visible }) => {
  const history = useHistory();
  const match = useRouteMatch();

  const filterList = Object.values(parseQuery(history.location.search)).reduce(
    (acc, curr) => [...acc, ...curr],
    [],
  );

  const filter = useMemo(() => {
    const closeFilter = () => setVisible(false);

    switch (type) {
      case 'user':
        return <UserFilters name={user} onClose={closeFilter} />;

      case 'wobject':
        return <WobjectShopFilter name={user} onClose={closeFilter} />;

      default:
        return <GlobalShopFilters onClose={closeFilter} />;
    }
  }, [type, match.params.name, match.params.department]);

  const deleteFilters = fil => {
    const h = Object.entries(parseQuery(history.location.search)).reduce((acc, curr) => {
      const value = curr[1].filter(d => d !== fil);

      if (isEmpty(value)) {
        delete acc[curr[0]];

        return acc;
      }

      acc[curr[0]] = value;

      return acc;
    }, {});

    history.push(`?${createQuery(h)}`);
  };

  return (
    <div className={'RewardLists__filterButton'}>
      Filters:{' '}
      {filterList.map(f => (
        <Tag key={f} closable onClose={() => deleteFilters(f)}>
          {f}
        </Tag>
      ))}{' '}
      <span className={'RewardLists__filterButton--withUnderline'} onClick={() => setVisible(true)}>
        add
      </span>
      <Modal visible={visible} onCancel={() => setVisible(false)} onOk={() => setVisible(false)}>
        {filter}
      </Modal>
    </div>
  );
};

FiltersForMobile.propTypes = {
  setVisible: PropTypes.func.isRequired,
  type: PropTypes.string,
  user: PropTypes.string,
  visible: PropTypes.bool,
};

export default FiltersForMobile;
