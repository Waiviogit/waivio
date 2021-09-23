import React, {useCallback, useEffect} from 'react';
import { connect } from 'react-redux';
import { debounce, get } from 'lodash';

import {
  getSelectedDish,
  getSelectedRestaurant,
} from '../../../../../store/quickRewards/quickRewardsSelectors';
import { getObjectName, parseWobjectField } from '../../../../helpers/wObjectHelper';
import ImageSetter from '../../../../components/ImageSetter/ImageSetter';
import TagsSelector from '../../../../components/TagsSelector/TagsSelector';

import './SecondScreen.less';

const ModalSecondScreen = props => {
  const requirements = get(props, 'selectedDish.propositions[0].requirements', null);

  useEffect(() => {
    const address = parseWobjectField(props.selectedRestaurant, 'address');

    if (address && address.city) {
      props.setTopic([...props.topics, address.city]);
    }
  }, []);

  const handleBodyChangeDebounce = useCallback(
    debounce(e => props.setBody(e), 300),
    [],
  );

  const handleBodyChange = e => handleBodyChangeDebounce(e.target.value);
  const handleImageLoaded = img => props.setImages(img);
  const handleTopicsChange = topic => props.setTopic(topic);

  return (
    <div className="SecondScreen">
      {requirements && (
        <p>
          Add minimum {requirements.minPhotos} original photos of{' '}
          <a href={props.selectedDish.defaultShowLink}>{getObjectName(props.selectedDish)}</a>
        </p>
      )}
      <ImageSetter onImageLoaded={handleImageLoaded} isRequired isMultiple />
      <h4>Review content</h4>
      <textarea onChange={handleBodyChange} className="SecondScreen__textarea" />
      <TagsSelector
        // disabled={isPublishing}
        label={'HashTags(topics)'}
        placeholder={'Add hashtags (without #) here'}
        tags={props.topics}
        onChange={handleTopicsChange}
      />
    </div>
  );
};

export default connect(state => ({
  selectedRestaurant: getSelectedRestaurant(state),
  selectedDish: getSelectedDish(state),
}))(ModalSecondScreen);
