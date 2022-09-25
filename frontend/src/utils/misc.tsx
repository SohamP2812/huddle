export const allFieldsFilled = (object: object): boolean => {
  for (const property in object) {
    if (!object[property as keyof typeof object]) return false;
  }

  return true;
};
