import React from 'react';
import { Tag } from 'antd';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { createQuery, parseQuery } from '../../../waivioApi/helpers';

const FiltersForMobile = ({ setVisible }) => {
  const history = useHistory();
  const filterList = Object.values(parseQuery(history.location.search)).reduce(
    (acc, curr) => [...acc, ...curr],
    [],
  );

  const deleteFilters = fil => {
    const h = Object.entries(parseQuery(history.location.search)).reduce((acc, curr) => {
      acc[curr[0]] = curr[1].filter(d => d !== fil);

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
    </div>
  );
};

FiltersForMobile.propTypes = {
  setVisible: PropTypes.func.isRequired,
};

export default FiltersForMobile;
