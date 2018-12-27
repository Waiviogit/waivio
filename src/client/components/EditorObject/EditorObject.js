import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Slider, Spin, Icon, Switch } from 'antd';
import './EditorObject.less';

@injectIntl
class EditorObject extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    wObject: PropTypes.shape().isRequired,
    objectsNumber: PropTypes.number.isRequired,
    isLinkedObjectsValid: PropTypes.bool.isRequired,
    handleCreateObject: PropTypes.func.isRequired,
    handleRemoveObject: PropTypes.func.isRequired,
    handleChangeInfluence: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      influenceValue: this.props.wObject.influence.value,
      isPostingOpen: true,
      isExtendingOpen: true,
      isCreating: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.objectsNumber !== this.props.objectsNumber) {
      this.handleChangeInfluence(this.props.wObject.influence.value);
    }
  }

  throttledChange = _.throttle(
    influence => this.props.handleChangeInfluence(this.props.wObject, influence),
    10,
  );

  handleChangeInfluence = influence => {
    const influenceValue =
      influence < this.props.wObject.influence.max ? influence : this.props.wObject.influence.max;
    this.setState({ influenceValue });
  };

  handleAfterChangeInfluence = influence => {
    this.props.handleChangeInfluence(this.props.wObject, influence);
  };

  handleCreateObject = () => {
    const { wObject, handleCreateObject } = this.props;
    const { isPostingOpen, isExtendingOpen } = this.state;
    wObject.isPostingOpen = isPostingOpen;
    wObject.isExtendingOpen = isExtendingOpen;
    this.setState({ isCreating: true });
    handleCreateObject(wObject);
  };
  toggleAccessPost = () => {
    this.setState({ isPostingOpen: !this.state.isPostingOpen });
  };
  toggleAccessExpand = () => {
    this.setState({ isExtendingOpen: !this.state.isExtendingOpen });
  };
  render() {
    const { influenceValue } = this.state;
    const { intl, wObject, handleRemoveObject, isLinkedObjectsValid } = this.props;
    return (
      <React.Fragment>
        <div
          className={classNames('editor-object', {
            'validation-error': wObject.isNew && !isLinkedObjectsValid,
          })}
        >
          <div className="editor-object__content">
            <div className="editor-object__content row">
              <img className="editor-object__avatar" src={wObject.avatar} alt={wObject.name} />
              <span className="editor-object__info">
                <span className="editor-object__info name">{wObject.name}</span>
                {Boolean(wObject.isNew && !wObject.isCreating) && (
                  <div className="editor-object__checkbox-line">
                    <div
                      className="editor-object__checkbox-wrap"
                      title={
                        this.state.isExtendingOpen
                          ? intl.formatMessage({
                              id: 'access_expand_tooltip1',
                              defaultMessage:
                                'Any user can suggest changing the display of the object (avatar, description, etc.). All users will be shown the option with the maximum number of votes.',
                            })
                          : intl.formatMessage({
                              id: 'access_expand_tooltip2',
                              defaultMessage:
                                'Only the creator, and the users added by him, can suggest changing the display of the object (avatar, description, etc.). All users will see the last proposed option.',
                            })
                      }
                    >
                      <span className="editor-object__checkbox-descr">
                        {intl.formatMessage({
                          id: 'access_expand',
                          defaultMessage: 'Everyone can expand',
                        })}
                      </span>
                      <Switch
                        defaultChecked={this.state.isExtendingOpen}
                        onChange={this.toggleAccessExpand}
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                      />
                    </div>
                    <div
                      className="editor-object__checkbox-wrap"
                      title={
                        this.state.isPostingOpen
                          ? intl.formatMessage({
                              id: 'access_post_tooltip1',
                              defaultMessage:
                                'Any user can add link to your object to the post. These posts will be visible in the object feed.',
                            })
                          : intl.formatMessage({
                              id: 'access_post_tooltip2',
                              defaultMessage:
                                'Only the creator, and the users added by him, can add link to object in posts.',
                            })
                      }
                    >
                      <span className="editor-object__checkbox-descr">
                        {intl.formatMessage({
                          id: 'access_post',
                          defaultMessage: 'Everyone can link posts',
                        })}
                      </span>
                      <Switch
                        defaultChecked={this.state.isPostingOpen}
                        onChange={this.toggleAccessPost}
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                      />
                    </div>
                  </div>
                )}
                {Boolean(wObject.descriptionShort) && (
                  <span className="editor-object__info description">
                    {wObject.descriptionShort}
                  </span>
                )}
              </span>
            </div>
            <div className="editor-object__content row slider">
              <span className="label">{`${influenceValue}%`}</span>
              <Slider
                min={1}
                max={100}
                value={influenceValue}
                disabled={wObject.influence.value === 100}
                onChange={this.handleChangeInfluence}
                onAfterChange={this.handleAfterChangeInfluence}
              />
            </div>
          </div>
          <div className="editor-object__controls">
            {Boolean(wObject.isNew && !wObject.isCreating) && (
              <div
                role="button"
                tabIndex={0}
                className="editor-object__control-item create"
                title={intl.formatMessage({
                  id: 'create_new_object_placeholder',
                  defaultMessage: "This object doesn't exist yet, but you can create it",
                })}
                onClick={this.handleCreateObject}
              >
                <Icon type="codepen" className="editor-object__control-item item-icon" />
                <span className="editor-object__control-item item-text">
                  {intl.formatMessage({ id: 'create', defaultMessage: 'Create' })}
                </span>
              </div>
            )}
            {wObject.isCreating ? (
              <Spin />
            ) : (
              <div
                role="button"
                tabIndex={0}
                className="editor-object__control-item delete"
                onClick={() => handleRemoveObject(wObject)}
              >
                <Icon type="delete" className="editor-object__control-item item-icon" />
                <span className="editor-object__control-item item-text">
                  {intl.formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
                </span>
              </div>
            )}
          </div>
        </div>
        {!isLinkedObjectsValid && wObject.isNew && (
          <div className="editor-object__validation-msg">
            {intl.formatMessage({
              id: 'editor_object_validation_message',
              defaultMessage: 'Object must be created before post the story',
            })}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default EditorObject;
