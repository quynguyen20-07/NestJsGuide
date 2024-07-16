import jsMd5 from 'js-md5';

export const createSign = (params: Record<string, any>, key: string): Record<string, any> => {
  const sortedParams = params
    ? Object.keys(params)
        .filter((key) => params[key] !== '')
        .sort()
        .reduce((result, key) => {
          result[key] = params[key];
          return result;
        }, {})
    : null;

  const stringA = sortedParams
    ? Object.entries(sortedParams)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}=${JSON.stringify(value)}`;
          } else {
            return `${key}=${value}`;
          }
        })
        .join('&')
    : null;

  const stringSignTemp = String((stringA && stringA + '&key=' + key) || 'key=' + key);

  const signValue = jsMd5(stringSignTemp).toUpperCase();

  return signValue;
};

export const generateRandomString = async (length: number) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
};
