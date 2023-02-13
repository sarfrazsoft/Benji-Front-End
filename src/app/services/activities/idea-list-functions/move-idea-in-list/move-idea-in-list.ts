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

export function moveIdea(ideas: Idea[], fromIndex: number, toIndex: number) {
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
    ideas[toIndex - 1].next_idea = idea.id;
  }
  if (nextId !== null) {
    ideas[toIndex + 1].previous_idea = idea.id;
  }

  idea.previous_idea = previousId;
  idea.next_idea = nextId;

  // set the previous_idea of the first item to null if it's being moved to the first position
  if (toIndex === 0) {
    idea.previous_idea = null;
  }

  if (toIndex === ideas.length - 1) {
    idea.next_idea = null;
  }

  return idea;
}
