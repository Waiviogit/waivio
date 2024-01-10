import React from 'react';
import { useParams } from 'react-router';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import './FavoritesMobileSidenav.less';

const FavoritesMobileSidenav = ({ objectTypes, setVisible, visible, intl }) => {
  const { name, objectType } = useParams();

  const modalBody = () => (
    <div>
      <b className="FavoritesMobileSidenav__maindepName">Objects</b>
      {objectTypes?.map(type => (
        <div
          key={type}
          className="FavoritesMobileSidenav__depName ttc"
          onClick={() => setVisible(false)}
        >
          <NavLink
            to={`/@${name}/favorites/${type}`}
            isActive={() => objectType === type}
            className="FavoritesMobileSidenav__depName"
            activeClassName="FavoritesMobileSidenav__depName--open"
          >
            {intl.formatMessage({
              id: `object_type_${type}`,
              defaultMessage: type,
            })}
          </NavLink>
        </div>
      ))}
    </div>
  );

  return (
    <React.Fragment>
      <div className="FavoritesMobileSidenav__mobileCrumbs" onClick={() => setVisible(true)}>
        <b>Objects</b> (<span className="FavoritesMobileSidenav__select">Select</span>)
      </div>
      <Modal onCancel={() => setVisible(false)} visible={visible} footer={null}>
        {modalBody()}
      </Modal>
    </React.Fragment>
  );
};

FavoritesMobileSidenav.propTypes = {
  setVisible: PropTypes.func,
  objectTypes: PropTypes.arrayOf(),
  intl: PropTypes.shape(),
  visible: PropTypes.bool,
};

export default injectIntl(FavoritesMobileSidenav);
