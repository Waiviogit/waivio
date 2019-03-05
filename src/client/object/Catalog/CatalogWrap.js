import { Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import { isEmpty, map, forEach } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import CatalogItem from './CatalogItem';
import { getFieldWithMaxWeight } from '../wObjectHelper';
import { getClientWObj } from '../../adapters';
import { objectFields } from '../../../common/constants/listOfFields';
import AddItemModal from './AddItemModal/AddItemModal';
import CreateObjectModal from '../../post/CreateObjectModal/CreateObject';
import { getObject } from '../../../../src/waivioApi/ApiClient';
import * as wobjectActions from '../../../client/object/wobjectsActions';
import * as notificationActions from '../../../client/app/Notification/notificationActions';
import './CatalogWrap.less';

const sortItems = items =>
  items && !isEmpty(items)
    ? items.sort((a, b) => {
        if (a.object_type !== 'list' && b.object_type === 'list') return 1;
        if (a.object_type === 'list' && b.object_type !== 'list') return -1;
        return 0;
      })
    : items;

@withRouter
@injectIntl
@connect(
  null,
  {
    createObject: wobjectActions.createWaivioObject,
    notify: notificationActions.notify,
  },
)
class CatalogWrap extends React.Component {
  static propTypes = {
    wobject: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    isEditMode: PropTypes.bool.isRequired,
    createObject: PropTypes.func.isRequired,
    notify: PropTypes.func,
  };
  static defaultProps = {
    wobject: {},
    notify: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      breadcrumb: [
        { name: getFieldWithMaxWeight(props.wobject, objectFields.name), link: props.match.url },
      ],
      listItems:
        (props.wobject && props.wobject.listItems && sortItems(props.wobject.listItems)) || [],
    };
  }

  componentDidMount() {
    const { match, history } = this.props;
    if (this.props.match.params.itemId) {
      history.push(`/object/${match.params.name}/list`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match !== this.props.match) {
      const nextTarget = nextProps.match.url.split('/').pop();
      if (nextTarget === 'list') {
        if (nextProps.wobject && nextProps.wobject.listItems) {
          this.setState({
            listItems: sortItems(nextProps.wobject.listItems),
            breadcrumb: [
              {
                name: getFieldWithMaxWeight(nextProps.wobject, objectFields.name),
                link: nextProps.match.url,
              },
            ],
          });
        }
      } else if (nextTarget !== this.props.match.params.itemId) {
        getObject(nextTarget).then(res => {
          const listItems = (res && res.listItems && sortItems(res.listItems)) || [];
          this.setState(prevState => {
            let breadcrumb = [];
            if (prevState.breadcrumb.some(crumb => crumb.link.includes(nextTarget))) {
              forEach(prevState.breadcrumb, crumb => {
                breadcrumb.push(crumb);
                return !crumb.link.includes(nextTarget);
              });
            } else {
              breadcrumb = [
                ...prevState.breadcrumb,
                { name: getFieldWithMaxWeight(res, objectFields.name), link: nextProps.match.url },
              ];
            }
            return {
              listItems,
              breadcrumb,
            };
          });
        });
      }
    }
  }

  handleCreateObject = (wobj, follow) => {
    const { intl, notify, createObject } = this.props;
    createObject(wobj, follow)
      .then(() =>
        notify(
          intl.formatMessage({
            id: 'create_object_success',
            defaultMessage: 'Object has been created',
          }),
          'success',
        ),
      )
      .catch(() =>
        notify(
          intl.formatMessage({
            id: 'create_object_error',
            defaultMessage: 'Something went wrong. Object is not created',
          }),
          'error',
        ),
      );
  };

  render() {
    const { listItems, breadcrumb } = this.state;
    const { isEditMode, wobject, intl, match } = this.props;
    const listBaseUrl = `/object/${match.params.name}/list`;

    return (
      <React.Fragment>
        {isEditMode && (
          <div className="CatalogWrap__add-item">
            <AddItemModal wobject={wobject} />
            <CreateObjectModal handleCreateObject={this.handleCreateObject} />
          </div>
        )}
        <div className="CatalogWrap">
          <div className="CatalogWrap__breadcrumb">
            <Breadcrumb separator={'>'}>
              {map(breadcrumb, crumb => (
                <Breadcrumb.Item key={`crumb-${crumb.name}`}>
                  <Link
                    className="CatalogWrap__breadcrumb__link"
                    to={{ pathname: crumb.link }}
                    title={`${intl.formatMessage({ id: 'GoTo', defaultMessage: 'Go to' })} ${
                      crumb.name
                    }`}
                  >
                    {crumb.name}
                  </Link>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
          {listItems.length ? (
            <div>
              {!isEmpty(listItems) ? (
                map(listItems, listItem => {
                  const linkTo =
                    listItem.object_type === 'list'
                      ? { pathname: `${listBaseUrl}/${listItem.author_permlink}` }
                      : { pathname: `/object/${listItem.author_permlink}` };
                  return (
                    <div key={`category-${listItem.author_permlink}`}>
                      <Link
                        to={linkTo}
                        title={`${intl.formatMessage({
                          id: 'GoTo',
                          defaultMessage: 'Go to',
                        })} ${getFieldWithMaxWeight(listItem, objectFields.name)}`}
                      >
                        <CatalogItem wobject={getClientWObj(listItem)} />
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div>
                  {intl.formatMessage({
                    id: 'emptyList',
                    defaultMessage: 'This list is empty',
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {intl.formatMessage({ id: 'emptyList', defaultMessage: 'This list is empty' })}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default CatalogWrap;
