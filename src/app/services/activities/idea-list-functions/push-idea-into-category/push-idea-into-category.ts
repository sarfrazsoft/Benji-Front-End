import { Category, Idea } from '../../../backend/schema';

const findObjectById = (id: number, arr: Idea[]) => {
  return arr.find((obj) => obj.id === id);
};

const addToStart = (newObject: Idea, arr: Idea[]) => {
  newObject.previous_idea = null;
  newObject.next_idea = arr[0].id;
  arr[0].previous_idea = newObject.id;
  arr.unshift(newObject);
};

const addToEnd = (newObject: Idea, arr: Idea[]) => {
  newObject.previous_idea = arr[arr.length - 1].id;
  newObject.next_idea = null;
  arr[arr.length - 1].next_idea = newObject.id;
  arr.push(newObject);
};

const addInBetween = (newObject: Idea, arr: Idea[]) => {
  const nextObject = findObjectById(newObject.next_idea, arr);
  const previousObject = findObjectById(newObject.previous_idea, arr);

  if (!nextObject || !previousObject) {
    throw new Error('Invalid next_idea or previous_idea value, no matching object found in the array');
  }

  nextObject.previous_idea = newObject.id;
  previousObject.next_idea = newObject.id;
  arr.splice(arr.indexOf(previousObject) + 1, 0, newObject);
};

export const pushIdeaIntoCategory = (arr: Idea[], newObject: Idea) => {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }

  if (!newObject.hasOwnProperty('next_idea') || !newObject.hasOwnProperty('previous_idea')) {
    throw new Error(`New Object must have 'next_idea' and 'previous_idea' properties`);
  }

  if (arr.length === 0) {
    arr.push(newObject);
    return arr;
  }

  if (newObject.next_idea && newObject.previous_idea) {
    addInBetween(newObject, arr);
  } else if (!newObject.next_idea && newObject.previous_idea) {
    addToEnd(newObject, arr);
  } else if (newObject.next_idea && !newObject.previous_idea) {
    addToStart(newObject, arr);
  } else {
    arr.push(newObject);
    return arr;
  }

  return arr;
};
