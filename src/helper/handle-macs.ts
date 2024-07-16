export const handleMacs = (params: any) => {
  const dataParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      dataParams[key] = encodeURIComponent(JSON.stringify(value));
    } else {
      dataParams[key] = encodeURIComponent(value as string);
    }
  }

  const queryString = Object.entries(dataParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return queryString;
};
