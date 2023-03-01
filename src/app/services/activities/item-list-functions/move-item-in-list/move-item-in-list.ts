import { cloneDeep } from 'lodash';
import { Category, Idea } from '../../../backend/schema';

// you can determine the new previous_idea and next_idea of
// the moved item by using the information about the array,
// the index it was moved from, and the index it was moved to.

// Assuming the array is 0-indexed, you can use the following logic:

// If the item was moved from a lower index to a higher index, the new
// previous_idea will be the item at the index one less than the new location
//  and the new next_idea will be the item at the index one more than the new location.

// If the item was moved from a higher index to a lower index, the new previous_idea
// will be the item at the index one more than the new location and the new next_idea
//  will be the item at the index one less than the new location.

// If the item was moved to the first position, the new previous_idea will be set to null
// and the new next_idea will be the item at the index one more than the new location.

// If the item was moved to the last position, the new previous_idea will be the item at the
//  index one less than the new location and the new next_idea will be set to null.

export function moveItem(
  ideas: any[],
  fromIndex: number,
  toIndex: number,
  previousPointer: string,
  nextPointer: string
) {
  if (fromIndex < 0 || fromIndex >= ideas.length) {
    throw new Error('Invalid fromIndex');
  }
  if (toIndex < 0 || toIndex > ideas.length) {
    throw new Error('Invalid toIndex');
  }

  const idea = ideas[fromIndex];
  ideas.splice(fromIndex, 1);
  ideas.splice(toIndex, 0, idea);

  let previousId: number | null;
  if (toIndex - 1 >= 0) {
    previousId = ideas[toIndex - 1].id;
  } else {
    previousId = null;
  }
  let nextId: number | null;
  if (toIndex + 1 < ideas.length) {
    nextId = ideas[toIndex + 1].id;
  } else {
    nextId = null;
  }

  if (previousId !== null) {
    ideas[toIndex - 1][nextPointer] = idea.id;
  }
  if (nextId !== null) {
    ideas[toIndex + 1][previousPointer] = idea.id;
  }

  idea[previousPointer] = previousId;
  idea[nextPointer] = nextId;

  // set the previous_idea of the first item to null if it's being moved to the first position
  if (toIndex === 0) {
    idea[previousPointer] = null;
  }

  if (toIndex === ideas.length - 1) {
    idea[nextPointer] = null;
  }

  return idea;
}
