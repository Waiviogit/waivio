import React from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { EditorBlock, EditorState, SelectionState, Modifier } from 'draft-js';
import PropTypes from 'prop-types';
import { without, concat, map, times } from 'lodash';
import { Map } from 'immutable';
import Dropzone from 'react-dropzone';

const urlCreator = window.URL || window.webkitURL;

export default class EditorSlider extends React.Component {
  /**
   * Validates passed properties
   */
  static propTypes = {
    block: PropTypes.shape(),
    blockProps: PropTypes.shape(),
  };

  static defaultProps = {
    block: {},
    blockProps: {},
  };

  constructor(props) {
    super(props);

    this.editorContainerWidth = 578;

    this.slideBack = this.slideBack.bind(this);
    this.slideForward = this.slideForward.bind(this);
    this.remove = this.remove.bind(this);
    this.onAddingSlide = this.onAddingSlide.bind(this);
    this.onSettingsIconClick = this.onSettingsIconClick.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.removeSlide = this.removeSlide.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);

    this.onChange = this.props.blockProps.setEditorState;

    this.state = {
      activeSlideIndex: 0,
      filesLoaded: false,
      displaySettings: false,
      slidesPreview: [],
    };
  }

  onAddingSlide(files) {
    this.setState({
      filesLoaded: false,
      slidesPreview: concat(
        this.state.slidesPreview,
        map(files, file => urlCreator.createObjectURL(file)),
      ),
    });
  }

  onSettingsIconClick() {
    this.setState({ displaySettings: true });
    const data = this.props.block.getData();
    const slides = data.get('slides');

    this.setState({
      activeSlideIndex: 0,
      displaySettings: true,
      slidesPreview: slides.map(slide => slide.url),
    });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      slidesPreview: arrayMove(this.state.slidesPreview, oldIndex, newIndex),
    });
  };

  setActiveIndex(activeSlideIndex) {
    this.setState({
      activeSlideIndex,
    });
  }

  remove() {
    const editorState = this.props.blockProps.getEditorState();
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const keyAfter = content.getKeyAfter(this.props.block.key);
    const keyBefore = content.getKeyBefore(this.props.block.key);
    const blockMap = content.getBlockMap().delete(this.props.block.key);

    const withoutAtomicBlock = content.merge({
      blockMap,
      selectionAfter: selection,
    });

    const newState = EditorState.push(editorState, withoutAtomicBlock, 'remove-range');

    const newSelection = new SelectionState({
      anchorKey: keyAfter || keyBefore || 0,
      anchorOffset: 0,
      focusKey: keyAfter || keyBefore || 0,
      focusOffset: 0,
    });

    const newEditorState = EditorState.forceSelection(newState, newSelection);

    this.onChange(newEditorState);
  }

  removeSlide(removedSlideIndex) {
    const currentSlidesPreview = this.state.slidesPreview.slice();
    const removedSlide = currentSlidesPreview[removedSlideIndex];

    setTimeout(() => {
      this.setState({
        slidesPreview: without(currentSlidesPreview, removedSlide),
      });
    }, 0);
  }

  slideBack() {
    if (this.state.displaySettings) {
      return;
    }

    const data = this.props.block.getData();
    const slides = data.get('slides');
    const slidesLength = slides.length;
    const { activeSlideIndex } = this.state;

    const newActiveIndex = (activeSlideIndex + slidesLength - 1) % slidesLength;

    this.setActiveIndex(newActiveIndex);
  }

  slideForward() {
    if (this.state.displaySettings) {
      return;
    }

    const data = this.props.block.getData();
    const slides = data.get('slides');
    const slidesLength = slides.length;
    const { activeSlideIndex } = this.state;

    const newActiveIndex = (activeSlideIndex + slidesLength + 1) % slidesLength;

    this.setActiveIndex(newActiveIndex);
  }

  updateData(data) {
    const editorState = this.props.blockProps.getEditorState();
    const content = editorState.getCurrentContent();

    const selection = new SelectionState({
      anchorKey: this.props.block.key,
      anchorOffset: 0,
      focusKey: this.props.block.key,
      focusOffset: this.props.block.getLength(),
    });

    const newContentState = Modifier.mergeBlockData(content, selection, data);
    const newEditorState = EditorState.push(editorState, newContentState);

    setTimeout(() => this.props.blockProps.setEditorState(newEditorState));
  }

  closeSettings() {
    this.setState({ displaySettings: false });

    const slides = this.state.slidesPreview.slice().map(url => ({ url }));

    this.updateData(new Map({ slides }));
  }

  /**
   * Renders 'EditorSlider' component
   */
  render() {
    const { activeSlideIndex, displaySettings, slidesPreview } = this.state;

    const SortableItem = new SortableElement(({ value, itemsLength }) => (
      <div className="slide-preview-wrapper">
        <img
          style={{ width: this.editorContainerWidth / itemsLength }}
          className="slide-preview-image"
          src={value}
          alt=""
        />
      </div>
    ));

    const SortableList = new SortableContainer(({ items }) => (
      <ul className="slides">
        {items.map((value, index) => (
          <SortableItem
            // eslint-disable-next-line react/no-array-index-key
            key={`item-${index}`}
            index={index}
            itemIndex={index}
            itemsLength={items.length}
            value={value}
          />
        ))}
      </ul>
    ));

    const slides = this.props.block.getData().get('slides');

    return (
      <div className="c-image-slider">
        {!displaySettings && slides && slides.length ? (
          <i
            className="icon icon-settings"
            role="button"
            tabIndex={0}
            onClick={this.onSettingsIconClick}
          />
        ) : null}
        {!displaySettings && slides && slides.length ? (
          <i className="icon icon-close" role="button" tabIndex={0} onClick={this.remove} />
        ) : null}
        {slides && !!slides.length && (
          <div>
            <div className="slides-container">
              <div className="slides" style={{ left: `-${activeSlideIndex * 100}%` }}>
                {displaySettings && (
                  <div className="settings-container">
                    {
                      <i
                        className="icon icon-close"
                        role="button"
                        tabIndex={0}
                        onClick={this.closeSettings}
                      />
                    }
                    <div className="slides-preview-container">
                      <div className="slides-preview-inner">
                        <div className="settings-title">
                          Change order, remove or
                          <Dropzone
                            accept="image/*"
                            style={{ display: 'inline' }}
                            onDrop={this.onAddingSlide}
                          >
                            &nbsp;<span className="accent">add</span>&nbsp;
                          </Dropzone>
                          slides
                        </div>
                        <div style={{ position: 'relative' }}>
                          <SortableList
                            items={slidesPreview}
                            onSortEnd={this.onSortEnd()}
                            helperClass="g-sortable-helper"
                            axis="x"
                          />
                          {slidesPreview.length > 2 &&
                            times(slidesPreview.length).map(index => (
                              <i
                                role="button"
                                tabIndex={0}
                                style={{
                                  top: 0,
                                  left: index * (this.editorContainerWidth / slidesPreview.length),
                                }}
                                key={index}
                                className="icon icon-close"
                                onClick={this.removeSlide(index)}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {slides.map((slide, index) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="slide"
                  >
                    <div className="slide-inner">
                      <img src={slide.url} alt="" />
                    </div>
                  </div>
                ))}
              </div>
              <div role="button" tabIndex={0} className="arrow left" onClick={this.slideBack}>
                <div className="chevron-arrow-left" />
              </div>
              <div role="button" tabIndex={0} className="arrow right" onClick={this.slideForward}>
                <div className="chevron-arrow-right" />
              </div>
            </div>
            <div className="slider-footer">
              <div className="slides-text-container">
                <div className="slide-text">
                  <EditorBlock {...this.props} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
