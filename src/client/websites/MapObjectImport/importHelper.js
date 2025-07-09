import { message } from 'antd';
import uuidv4 from 'uuid/v4';

import { formBusinessObjects, handleArrayToFile } from '../../components/Maps/mapHelpers';
import { uploadObject } from '../../../waivioApi/importApi';
import { getObjectsForMapImportAvatars } from '../../../waivioApi/ApiClient';

export const getAvatar = async ({ detailsPhotos, user }) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const photo of detailsPhotos) {
    // eslint-disable-next-line no-await-in-loop
    const { result: photoString, error: photoError } = await getObjectsForMapImportAvatars(
      user,
      photo.name,
    );

    if (photoError || !photoString) {
      // eslint-disable-next-line no-continue
      continue;
    }

    return photoString;
  }

  return '';
};
export const prepareObjects = async (
  objects,
  checkedIds,
  isRestaurant,
  isPlace,
  restaurantTags,
  businessTags,
  placeTags,
  listAssociations,
  userName,
) => {
  const filteredObjects = objects?.filter(obj => checkedIds?.includes(obj.id));

  // eslint-disable-next-line no-return-await
  return await Promise.all(
    filteredObjects?.map(async object => {
      let waivioTags = businessTags;

      if (isRestaurant(object)) {
        waivioTags = restaurantTags;
      }

      const processed = formBusinessObjects({
        object,
        waivio_tags: waivioTags,
        listAssociations,
      });

      const avatar = await getAvatar({
        detailsPhotos: object?.photos ?? [],
        user: userName,
      });

      if (avatar) {
        processed.primaryImageURLs = [avatar];
      }

      return processed;
    }),
  );
};

export const importData = (
  processedObjects,
  isRestaurant,
  isPlace,
  userName,
  locale,
  isEditor,
  isComment,
  setLoading,
  cancelModal,
  history,
) => {
  const groupedObjects = {
    restaurant: [],
    place: [],
    business: [],
  };

  processedObjects.forEach(obj => {
    if (isRestaurant(obj)) {
      groupedObjects.restaurant.push(obj);
    } else if (isPlace(obj)) {
      groupedObjects.place.push(obj);
    } else {
      groupedObjects.business.push(obj);
    }
  });

  const uploadByType = (type, objects) => {
    if (!objects || objects.length === 0) return;

    const file = handleArrayToFile(objects);
    const formData = new FormData();
    const filenameSuffix = `-${type}.json`;

    formData.append('file', file, `${uuidv4()}${filenameSuffix}`);
    formData.append('user', userName);
    formData.append('locale', locale);
    formData.append('objectType', type);
    formData.append('authority', 'administrative');
    formData.append('useGPT', true);
    formData.append('forceImport', true);

    uploadObject(formData)
      .then(async res => {
        setLoading(false);
        cancelModal();

        if (!res.ok) {
          message.error(res.message || 'An error occurred');
        } else {
          message.success('Data import started successfully!');
          if (!isEditor) history.push('/data-import');
        }
      })
      .catch(error => {
        setLoading(false);
        message.error('Failed to upload. Please check your network connection.');
        console.error(`Network Error [${type}]:`, error);
      });
  };

  setLoading(true);
  uploadByType('business', groupedObjects.business);
  uploadByType('place', groupedObjects.place);
  uploadByType('restaurant', groupedObjects.restaurant);
};

export default null;
