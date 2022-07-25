export const isSet = (value: unknown): boolean => {
  if (typeof value === 'object') {
    return value !== null && value !== undefined;
  }

  if (typeof value === 'string') {
    return value !== null && value !== undefined && value !== undefined && (value as any).length > 0;
  }

  if (typeof value === 'number') {
    return value !== null && value !== undefined;
  }

  return value !== null && value !== undefined;
};
