import { message } from 'antd';
import uuidv4 from 'uuid/v4';
import { isEmpty } from 'lodash';

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
  restaurantTags,
  businessTags,
  listAssociations,
  userName,
) => {
  const filteredObjects = objects?.filter(obj => checkedIds?.includes(obj.id));

  // eslint-disable-next-line no-return-await
  return await Promise.all(
    filteredObjects?.map(async object => {
      const waivioTags = isRestaurant(object) ? restaurantTags : businessTags;

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
  userName,
  locale,
  isEditor,
  isComment,
  setLoading,
  cancelModal,
  history,
) => {
  const businessObjects = [];
  const restaurantObjects = [];

  processedObjects.forEach(obj => {
    if (isRestaurant(obj)) {
      restaurantObjects.push(obj);
    } else {
      businessObjects.push(obj);
    }
  });

  const uploadedBusinessFile = handleArrayToFile(businessObjects);
  const businessFormData = new FormData();
  const uploadedRestaurantFile = handleArrayToFile(restaurantObjects);
  const restaurantFormData = new FormData();

  businessFormData.append('file', uploadedBusinessFile, `${uuidv4()}.json`);
  businessFormData.append('user', userName);
  businessFormData.append('locale', locale);
  businessFormData.append('objectType', 'business');
  businessFormData.append('authority', 'administrative');
  businessFormData.append('useGPT', true);
  businessFormData.append('forceImport', true);
  restaurantFormData.append('file', uploadedRestaurantFile, `${uuidv4()}-1.json`);
  restaurantFormData.append('user', userName);
  restaurantFormData.append('locale', locale);
  restaurantFormData.append('objectType', 'restaurant');
  restaurantFormData.append('authority', 'administrative');
  restaurantFormData.append('useGPT', true);
  restaurantFormData.append('forceImport', true);

  if (!isEmpty(businessObjects))
    uploadObject(businessFormData)
      .then(async res => {
        setLoading(false);
        cancelModal();

        if (!res.ok) {
          const errorText = res.message ? res.message : 'An error occurred';

          message.error(errorText);
        } else {
          cancelModal();
          message.success('Data import started successfully!');
          !isEditor && history.push('/data-import');
        }
      })
      .catch(error => {
        setLoading(false);
        message.error('Failed to upload. Please check your network connection.');
        console.error('Network Error:', error);
      });

  if (!isEmpty(restaurantObjects))
    uploadObject(restaurantFormData)
      .then(async res => {
        setLoading(false);

        // Since the response will be opaque, you cannot access its body
        if (!res.ok) {
          const errorText = res.message ? res.message : 'An error occurred';

          message.error(errorText);
        } else {
          cancelModal();
          message.success('Data import started successfully!');
          !isEditor && history.push('/data-import');
        }
      })
      .catch(error => {
        setLoading(false);
        message.error('Failed to upload. Please check your network connection.');
        console.error('Network Error:', error);
      });
};

export default null;
