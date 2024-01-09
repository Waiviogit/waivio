import { USER_AGENT } from '../../common/constants/ssrData';
import { botStatistics, botAgent, sitemap } from '../seo-service/seoServiceApi';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3({
  forcePathStyle: false,
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'nyc3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const isSearchBot = async req => {
  const userAgent = req.get(USER_AGENT);
  if (!userAgent) return false;
  return botAgent.userAgentExists({ userAgent });
};
const getUrl = req => `${req.hostname}${req.url}`;

export const getCachedPage = async req => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CACHE_PAGE_BUCKET,
      Key: getUrl(req),
    });

    const response = await s3Client.send(command);
    const page = await response.Body.transformToString();

    return page;
  } catch (error) {
    return '';
  }
};

export const setCachedPage = async ({ page, req }) => {
  try {
    const url = getUrl(req);

    await s3Client.putObject({
      Body: page,
      Key: url,
      Bucket: process.env.CACHE_PAGE_BUCKET,
      ContentType: 'text/html',
    });
  } catch (error) {}
};

export const updateBotCount = async req => {
  const userAgent = req.get(USER_AGENT);

  await botStatistics.addVisit({ userAgent });
};
export const getSitemap = async req => {
  const name = req.url.replace('/', '').replace(/\.xml/, '');

  return sitemap.getSitemap({
    host: req.headers.host,
    name,
  });
};
