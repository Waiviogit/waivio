import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

function leftPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetLeft + leftPosition(domElt.offsetParent);
}

export default class ReduxInfiniteScroll extends React.Component {
  constructor(props) {
    super(props);
    this.scrollFunction = this.scrollListener.bind(this);
  }

  componentDidMount() {
    this.attachScrollListener();
  }

  componentDidUpdate() {
    this.attachScrollListener();
  }

  _findElement() {
    if (typeof window !== 'undefined')
      return this.props.elementIsScrollable ? ReactDOM.findDOMNode(this) : window;
  }

  attachScrollListener() {
    if (!this.props.hasMore || this.props.loadingMore) return;
    let el = this._findElement();
    el.addEventListener('scroll', this.scrollFunction, true);
    el.addEventListener('resize', this.scrollFunction, true);
    this.scrollListener();
  }

  _elScrollListener() {
    let el = ReactDOM.findDOMNode(this);

    if (this.props.horizontal) {
      let leftScrollPos = el.scrollLeft;
      let totalContainerWidth = el.scrollWidth;
      let containerFixedWidth = el.offsetWidth;
      let rightScrollPos = leftScrollPos + containerFixedWidth;

      return totalContainerWidth - rightScrollPos;
    }

    let topScrollPos = el?.scrollTop;
    let totalContainerHeight = el?.scrollHeight;
    let containerFixedHeight = el?.offsetHeight;
    let bottomScrollPos = topScrollPos + containerFixedHeight;

    return totalContainerHeight - bottomScrollPos;
  }

  _windowScrollListener() {
    if (typeof window !== 'undefined') {
      let el = ReactDOM.findDOMNode(this);

      if (this.props.horizontal) {
        let windowScrollLeft =
          window.pageXOffset !== undefined
            ? window.pageXOffset
            : document &&
              (document.documentElement || document.body?.parentNode || document.body).scrollLeft;
        let elTotalWidth = leftPosition(el) + el.offsetWidth;

        return elTotalWidth - windowScrollLeft - window.innerWidth;
      }

      let windowScrollTop =
        window.pageYOffset !== undefined
          ? window.pageYOffset
          : document &&
            (document.documentElement || document.body?.parentNode || document.body).scrollTop;
      let elTotalHeight = topPosition(el) + el?.offsetHeight;

      return elTotalHeight - windowScrollTop - window.innerHeight;
    }
  }

  scrollListener() {
    // This is to prevent the upcoming logic from toggling a load more before
    // any data has been passed to the component
    if (this._totalItemsSize() <= 0) return;

    let bottomPosition = this.props.elementIsScrollable
      ? this._elScrollListener()
      : this._windowScrollListener();

    if (bottomPosition < Number(this.props.threshold)) {
      this.detachScrollListener();
      try {
        this.props.loadMore();
      } catch (error) {}
    }
  }

  detachScrollListener() {
    let el = this._findElement();
    el.removeEventListener('scroll', this.scrollFunction, true);
    el.removeEventListener('resize', this.scrollFunction, true);
  }

  _renderOptions() {
    return this.props.children.concat(this.props.items);
  }

  _totalItemsSize() {
    let totalSize;
    totalSize += this.props.children.size || this.props.children.length;
    totalSize += this.props.items.size || this.props.items.length;
    return totalSize;
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  _assignHolderClass() {
    let additionalClass;
    additionalClass =
      typeof this.props.className === 'function' ? this.props.className() : this.props.className;

    return 'redux-infinite-scroll ' + additionalClass;
  }

  render() {
    const Holder = this.props.holderType;
    return (
      <Holder className={this._assignHolderClass()} style={{ height: this.props.containerHeight }}>
        {this._renderOptions()}
        {this.props.loadingMore && this.props.loader}
      </Holder>
    );
  }
}

ReduxInfiniteScroll.propTypes = {
  elementIsScrollable: PropTypes.bool,
  containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  threshold: PropTypes.number,
  horizontal: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadingMore: PropTypes.bool,
  loader: PropTypes.any,
  showLoader: PropTypes.bool,
  loadMore: PropTypes.func.isRequired,
  items: PropTypes.node,
  children: PropTypes.node,
  holderType: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  isCurrentUser: PropTypes.bool,
};

ReduxInfiniteScroll.defaultProps = {
  className: '',
  elementIsScrollable: true,
  containerHeight: '100%',
  threshold: 100,
  horizontal: false,
  hasMore: true,
  loadingMore: false,
  loader: <div style={{ textAlign: 'center' }}>Loading...</div>,
  showLoader: true,
  holderType: 'div',
  children: [],
  items: [],
  isCurrentUser: false,
};
