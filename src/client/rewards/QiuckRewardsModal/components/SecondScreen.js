import React from 'react';
import {connect} from "react-redux";
import {getSelectedDish, getSelectedRestaurant
} from "../../../../store/quickRewards/quickRewardsSelectors";
import {getObjectName} from "../../../helpers/wObjectHelper";
import ImageSetter from "../../../components/ImageSetter/ImageSetter";
import TagsSelector from "../../../components/TagsSelector/TagsSelector";

const ModalSecondScreen = props => {
  return (
    <div>
      <p>
        Add minimum {props.selectedDish.requirements.minPhotos} original photos of <a href={props.selectedDish.defaultShowLink}>{getObjectName(props.selectedDish)}</a>
      </p>
      <ImageSetter
        onImageLoaded={() => {}}
        onLoadingImage={() => {}}
        isRequired
        isMultiple
      />
      <h4>Review content</h4>
      <input/>
      <TagsSelector
        // className="post-preview-topics"
        // disabled={isPublishing}
        label={'HashTags(topics)'}
        placeholder={'Add hashtags (without #) here'}
        // tags={topics}
        // validator={isTopicValid}
        // onChange={this.handleTopicsChange}
      />
    </div>
  )

};

export default connect(
  state => ({
    selectedRestaurant: getSelectedRestaurant(state),
    selectedDish: getSelectedDish(state),
  })
)(ModalSecondScreen);
