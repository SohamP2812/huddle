export const allFieldsFilled = (object: Object): boolean => {
  for (const property in object) {
    if (!object[property as keyof typeof object]) return false;
  }

  return true;
};

export const isObjectDiff = (object1: Object, object2: Object): boolean => {
  for (const property in object1) {
    if (
      property in object2 &&
      object1[property as keyof typeof object1] !==
        object2[property as keyof typeof object2]
    ) {
      return true;
    }
  }

  return false;
};

export const stringToJSDate = (dateString: string) => {
  return new Date(dateString);
};
