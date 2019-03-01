import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import './CatalogItem.less';

@injectIntl
class CatalogItem extends React.Component {
  static propTypes = {
    wobject: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isPostingOpen: true,
      isExtendingOpen: true,
      isModalOpen: false,
    };
  }

  render() {
    const { wobject } = this.props;
    return (
      <React.Fragment>
        <div
          className="catalog-item__wrapper"
          style={{
            backgroundImage: `url(${wobject.background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="catalog-item__content">
            <div className="catalog-item__info">
              <div className="catalog-item__truncated">{wobject.name}</div>
            </div>
            {wobject.avatar ? (
              <img className="catalog-item__avatar" src={wobject.avatar} alt={wobject.name} />
            ) : (
              <div className="catalog-item__avatar" />
            )}
            {/* <i className="iconfont icon-more catalog-item__more" /> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CatalogItem;
