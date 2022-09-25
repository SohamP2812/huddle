export const allFieldsFilled = (object: Object): boolean => {
  for (const property in object) {
    if (!property) return false;
  }

  return true;
};
