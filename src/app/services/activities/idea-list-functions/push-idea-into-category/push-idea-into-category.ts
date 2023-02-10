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
    throw new Error('New Object must have \'next_idea\' and \'previous_idea\' properties');
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
    throw new Error('Both next_idea and previous_idea cannot be null');
  }

  return arr;
};

// This is regarding a linked list using properties previous_idea
// and next_idea of the Idea. First item in the list has previous_idea
// set to null. Last item in the list will have next_idea set to null.

// export const pushIdeaIntoCategoryx = (arr: Idea[], newObject: Idea) => {
//   if (!Array.isArray(arr)) {
//     throw new Error('Input must be an array');
//   }

//   // Helper function to find the object with a given id
//   const findObjectById = (id) => {
//     return arr.find((obj) => obj.id === id);
//   };

//   // Check if the new object has the required properties
//   if (!newObject.hasOwnProperty('next_idea') || !newObject.hasOwnProperty('previous_idea')) {
//     throw new Error('New Object must have \'next_idea\' and \'previous_idea\' properties');
//   }

//   // if category is empty
//   if (arr.length === 0) {
//     arr.push(newObject);
//     return;
//   }

//   if (arr.filter((obj) => obj.next_idea === null && obj.previous_idea === null).length > 0) {
//     arr.push(newObject);
//     return;
//   }

//   if (newObject.next_idea) {
//     const nextObject = findObjectById(newObject.next_idea);
//     if (nextObject) {
//       newObject.previous_idea = nextObject.previous_idea;
//       nextObject.previous_idea = newObject.id;
//       const previousObject = findObjectById(newObject.previous_idea);
//       if (previousObject) {
//         previousObject.next_idea = newObject.id;
//         arr.splice(arr.indexOf(previousObject) + 1, 0, newObject);
//       } else {
//         arr.unshift(newObject);
//       }
//     } else {
//       throw new Error('Invalid next_idea value, no matching object found in the array');
//     }
//   } else {
//     const previousObject = findObjectById(newObject.previous_idea);
//     if (previousObject) {
//       newObject.next_idea = previousObject.next_idea;
//       previousObject.next_idea = newObject.id;
//       const nextObject = findObjectById(newObject.next_idea);
//       if (nextObject) {
//         nextObject.previous_idea = newObject.id;
//         arr.splice(arr.indexOf(previousObject) + 1, 0, newObject);
//       } else {
//         arr.push(newObject);
//       }
//     } else {
//       throw new Error('Invalid previous_idea value, no matching object found in the array');
//     }
//   }

//   return arr;
// };

// export const pushIdeaIntoCategoryxx = (arr: Idea[], newObject: Idea) => {
//   if (!Array.isArray(arr)) {
//     throw new Error('Input must be an array');
//   }

//   // Helper function to find the object with a given id
//   const findObjectById = (id) => {
//     return arr.find((obj) => obj.id === id);
//   };

//   // Check if the new object has the required properties
//   if (!newObject.hasOwnProperty('next_idea') || !newObject.hasOwnProperty('previous_idea')) {
//     throw new Error('New Object must have \'next_idea\' and \'previous_idea\' properties');
//   }

//   // if category is empty
//   if (arr.length === 0) {
//     arr.push(newObject);
//     return arr;
//   }

//   const nextObject = findObjectById(newObject.next_idea);
//   const previousObject = findObjectById(newObject.previous_idea);

//   if (!nextObject && !previousObject) {
//     throw new Error('Invalid next_idea and previous_idea values, no matching objects found in the array');
//   } else if (!nextObject) {
//     previousObject.next_idea = newObject.id;
//     newObject.previous_idea = previousObject.id;
//     arr.splice(arr.indexOf(previousObject) + 1, 0, newObject);
//   } else if (!previousObject) {
//     nextObject.previous_idea = newObject.id;
//     newObject.next_idea = nextObject.id;
//     arr.splice(arr.indexOf(nextObject), 0, newObject);
//   } else {
//     nextObject.previous_idea = newObject.id;
//     previousObject.next_idea = newObject.id;
//     newObject.next_idea = nextObject.id;
//     newObject.previous_idea = previousObject.id;
//     arr.splice(arr.indexOf(previousObject) + 1, 0, newObject);
//   }

//   return arr;
// };
