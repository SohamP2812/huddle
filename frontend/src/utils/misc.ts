import { Dayjs } from "dayjs";

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

export const toIsoString = (date: Date) => {
  var tzo = -date.getTimezoneOffset(),
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
