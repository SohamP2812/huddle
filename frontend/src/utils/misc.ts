export const allFieldsFilled = <T>(object: T): boolean => {
  for (const property in object) {
    if (!object[property as keyof T]) return false;
  }

  return true;
};

export const isObjectDiff = <T>(object1: T, object2: T): boolean => {
  for (const property in object1) {
    if (
      property in object2 &&
      object1[property as keyof T] !== object2[property as keyof T]
    ) {
      return true;
    }
  }

  return false;
};

export const isArrayDiff = <T>(array1: Array<T>, array2: Array<T>) => {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (array2.includes(element)) {
        return false;
      }

      return true;
    });
  }

  return true;
};

export const stringToJSDate = (dateString: string) => {
  return new Date(dateString);
};

export const toIsoString = (date: Date) => {
  const tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num: number) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
};
