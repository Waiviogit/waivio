import cachePageModel from '../schemas/cachePageSchema';

const findOne = async ({ filter, projection, options }) => {
  try {
    const result = await cachePageModel.findOne(filter, projection, options).lean();
    return { result };
  } catch (error) {
    return { error };
  }
};

const findPageByUrl = async ({ url }) => {
  const { result } = await findOne({ filter: url });
  return result?.data ?? '';
};

const createPage = async ({ url, page }) => {
  try {
    return {
      result: await cachePageModel.create({
        url,
        page,
      }),
    };
  } catch (error) {
    return { error };
  }
};

export default {
  findPageByUrl,
  createPage,
  findOne,
};
