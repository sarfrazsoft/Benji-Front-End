import { Category, Idea } from '../../../backend/schema';

const findObjectById = (id: number, arr: Idea[]) => {
  return arr.find((obj) => obj.id === id);
};

const addToStart = (newObject: any, arr: any[], previousPointer: string, nextPointer: string) => {
  newObject[previousPointer] = null;
  newObject[nextPointer] = arr[0].id;
  arr[0][previousPointer] = newObject.id;
  arr.unshift(newObject);
};

const addToEnd = (newObject: any, arr: any[], previousPointer: string, nextPointer: string) => {
  newObject[previousPointer] = arr[arr.length - 1].id;
  newObject[nextPointer] = null;
  arr[arr.length - 1][nextPointer] = newObject.id;
  arr.push(newObject);
};

const addInBetween = (newObject: any, arr: any[], previousPointer: string, nextPointer: string) => {
  const nextObject = findObjectById(newObject[nextPointer], arr);
  const previousObject = findObjectById(newObject[previousPointer], arr);

  if (!nextObject || !previousObject) {
    throw new Error('Invalid next_idea or previous_idea value, no matching object found in the array');
  }

  nextObject[previousPointer] = newObject.id;
  previousObject[nextPointer] = newObject.id;
  arr.splice(arr.indexOf(previousObject) + 1, 0, newObject);
};

export const pushItemIntoList = (
  arr: any[],
  newObject: any,
  previousPointer: string,
  nextPointer: string
) => {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }

  if (!newObject.hasOwnProperty(nextPointer) || !newObject.hasOwnProperty(previousPointer)) {
    throw new Error(`New Object must have '${nextPointer}' and '${previousPointer}' properties`);
  }

  if (arr.length === 0) {
    arr.push(newObject);
    return arr;
  }

  if (newObject[nextPointer] && newObject[previousPointer]) {
    addInBetween(newObject, arr, previousPointer, nextPointer);
  } else if (!newObject[nextPointer] && newObject[previousPointer]) {
    addToEnd(newObject, arr, previousPointer, nextPointer);
  } else if (newObject[nextPointer] && !newObject[previousPointer]) {
    addToStart(newObject, arr, previousPointer, nextPointer);
  } else {
    arr.push(newObject);
    return arr;
  }

  return arr;
};
