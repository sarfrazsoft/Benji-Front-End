import { Category, Idea } from '../../../backend/schema';

export const sortByFirstToLast = (arr: Array<Idea>) => {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }

  if (arr.length === 0) {
    return arr;
  }

  for (const idea of arr) {
    if (!idea.hasOwnProperty('next_idea') || !idea.hasOwnProperty('previous_idea')) {
      throw new Error(`Array elements must have 'next_idea' and 'previous_idea' properties`);
    }
  }

  const allIdeasAreLegacy = arr.every((idea) => idea.next_idea === null && idea.previous_idea === null);
  if (allIdeasAreLegacy) {
    return arr;
  }

  const legacyIdeas = arr.filter((idea) => idea.next_idea === null && idea.previous_idea === null);
  const updatedArr = arr.filter((idea) => idea.next_idea !== null || idea.previous_idea !== null);

  const sorted = [];
  const visited = new Set();
  let current = updatedArr.find((idea) => idea.previous_idea === null);

  if (!current) {
    throw new Error('No idea found with previous_idea property set to null');
  }

  while (current) {
    if (visited.has(current)) {
      throw new Error('Circular linked list found in the next_idea property');
    }

    sorted.push(current);
    visited.add(current);
    current = updatedArr.find((idea) => idea.id === current.next_idea);
  }

  return [...sorted, ...legacyIdeas];
};
