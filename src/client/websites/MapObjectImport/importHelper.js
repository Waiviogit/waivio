import { message } from 'antd';
import uuidv4 from 'uuid/v4';
import { isEmpty, isNil } from 'lodash';

import { formBusinessObjects, handleArrayToFile } from '../../components/Maps/mapHelpers';
import { uploadObject } from '../../../waivioApi/importApi';
import {
  getObjectInfo,
  getObjectsForMapImportAvatars,
  getObjPermlinkByCompanyId,
} from '../../../waivioApi/ApiClient';
import { createWaivioObject } from '../../../store/wObjectStore/wobjectsActions';
import { getAppendData } from '../../../common/helpers/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import { appendObject } from '../../../store/appendStore/appendActions';
import { handleObjectSelect } from '../../../store/slateEditorStore/editorActions';

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
  setLoading,
  cancelModal,
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
export const prepareAndImportObjects = (
  isRestaurant,
  isEditor,
  setLoading,
  cancelModal,
  history,
  objects,
  checkedIds,
  restaurantTags,
  businessTags,
  listAssociations,
  dispatch,
  locale,
  userName,
  objectTypes,
  intl,
) => {
  prepareObjects(
    objects,
    checkedIds,
    isRestaurant,
    restaurantTags,
    businessTags,
    listAssociations,
    userName,
  ).then(async processedObjects => {
    if (isEditor) {
      const type = isRestaurant(processedObjects[0]) ? 'restaurant' : 'business';
      const selectedType = objectTypes[type];
      const objData = {
        ...processedObjects[0],
        type,
        id: processedObjects[0]?.name,
        parentAuthor: selectedType.author,
        parentPermlink: selectedType.permlink,
      };
      const { companyIdType, companyId } = objData?.companyIds[0];
      const existWobjPermlink = (await getObjPermlinkByCompanyId(companyId, companyIdType))?.result;

      if (!isEmpty(existWobjPermlink) && !isNil(existWobjPermlink)) {
        const objsForEditor = await getObjectInfo([existWobjPermlink]);
        const importedObj = { ...objsForEditor?.wobjects[0], object_type: type };

        dispatch(handleObjectSelect(importedObj, false, intl));
        cancelModal();
      } else {
        dispatch(createWaivioObject(objData)).then(res => {
          const { parentPermlink, parentAuthor } = res;
          const comanyIdBody = JSON.stringify(objData?.companyIds[0]);

          dispatch(
            appendObject(
              getAppendData(
                userName,
                {
                  id: parentPermlink,
                  author: parentAuthor,
                  creator: userName,
                  name: objData.name,
                  locale,
                  author_permlink: parentPermlink,
                },
                '',
                {
                  name: objectFields.companyId,
                  body: comanyIdBody,
                  locale,
                },
              ),
            ),
          ).then(async r => {
            const objsForEditor = await getObjectInfo([r?.parentPermlink]);
            const importedObj = { ...objsForEditor?.wobjects[0], object_type: type };

            dispatch(handleObjectSelect(importedObj, false, intl));
            if (r?.transactionId) {
              importData(
                processedObjects,
                isRestaurant,
                userName,
                locale,
                isEditor,
                setLoading,
                cancelModal,
              );
            }
          });
        });
      }
    } else {
      importData(
        processedObjects,
        isRestaurant,
        userName,
        locale,
        isEditor,
        setLoading,
        cancelModal,
      );
    }
  });
};

export default null;
