import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { addNewBlock } from '../../model';
import { Block } from '../../util/constants';

@injectIntl
export default class ImageButton extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    setEditorState: PropTypes.func.isRequired,
    getEditorState: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick() {
    this.input.value = null;
    this.input.click();
  }

  /*
  This is an example of how an image button can be added
  on the side control. This Button handles the image addition locally
  by creating an object url. You can override this method to upload
  images to your server first, then get the image url in return and then
  add to the editor.
  */
  onChange(e) {
    // e.preventDefault();
    const file = e.target.files[0];
    if (file.type.indexOf('image/') === 0) {
      // console.log(this.props.getEditorState());
      // eslint-disable-next-line no-undef
      const src = URL.createObjectURL(file);
      this.props.setEditorState(
        addNewBlock(this.props.getEditorState(), Block.IMAGE, {
          src,
        }),
      );
    }
    this.props.close();
  }

  render() {
    return (
      <button
        className="md-sb-button action-btn"
        type="button"
        onClick={this.onClick}
        title={this.props.intl.formatMessage({ id: 'image', defaultMessage: 'Add an image' })}
      >
        <i className="iconfont icon-picture" />
        <input
          type="file"
          accept="image/*"
          ref={c => {
            this.input = c;
          }}
          onChange={this.onChange}
          style={{ display: 'none' }}
        />
      </button>
    );
  }
}
