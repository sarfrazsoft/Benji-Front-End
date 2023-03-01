import { Category, Idea } from 'src/app/services/backend/schema';

export const sortByFirstToLast = <T extends Idea | Category>(
  arr: Array<T>,
  previousPointer: string,
  nextPointer: string
) => {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }

  if (arr.length === 0) {
    return arr;
  }

  // for (const idea of arr) {
  //   if (!idea.hasOwnProperty(nextPointer) || !idea.hasOwnProperty(previousPointer)) {
  //     throw new Error(`Array elements must have ${nextPointer} and ${previousPointer} properties`);
  //   }
  // }

  const allIdeasAreLegacy = arr.every((idea) => idea[nextPointer] === null && idea[previousPointer] === null);
  if (allIdeasAreLegacy) {
    return arr;
  }

  const legacyIdeas = arr.filter((idea) => idea[nextPointer] === null && idea[previousPointer] === null);
  const updatedArr = arr.filter((idea) => idea[nextPointer] !== null || idea[previousPointer] !== null);

  const sorted = [];
  const visited = new Set();
  let current = updatedArr.find((idea) => idea[previousPointer] === null);

  if (!current) {
    // throw new Error('No idea found with previous_idea property set to null');
    return arr;
  }

  while (current) {
    if (visited.has(current)) {
      // throw new Error('Circular linked list found in the next_idea property');
      return arr;
    }

    sorted.push(current);
    visited.add(current);
    current = updatedArr.find((idea) => idea.id === current[nextPointer]);
  }

  const sortedNLegacy = [...sorted, ...legacyIdeas];

  const unsortedIdeas = arr.filter((idea) => !sortedNLegacy.includes(idea));

  return [...sortedNLegacy, ...unsortedIdeas];
};
