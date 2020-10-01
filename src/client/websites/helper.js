export const getAvailableStatus = status => {
  switch (status) {
    case 200:
      return {
        intl: { defaultMessage: 'Available', id: 'available' },
        status,
      };
    case 409:
      return {
        intl: { defaultMessage: 'Subdomain already exists', id: 'subdomain_already_exists' },
      };
    default:
      return null;
  }
};

export default null;
