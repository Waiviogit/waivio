import React from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import './CatalogItem.less';
import { getClientWObj } from '../../adapters';

@injectIntl
class CatalogItem extends React.Component {
  static propTypes = {
    catalogItem: PropTypes.shape().isRequired,
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
    const { catalogItem } = this.props;
    const wobject = _.isEmpty(catalogItem.object_links)
      ? {}
      : getClientWObj(catalogItem.object_links[0].wobject);
    // const pathName = `/object/${wobject.author_permlink}/catalog`;
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
              <div className="catalog-item__truncated">{catalogItem.body}</div>
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
