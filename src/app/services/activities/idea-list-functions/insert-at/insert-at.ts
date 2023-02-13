import { cloneDeep } from 'lodash';
import { Category, Idea } from '../../../backend/schema';

export function insertAt(ideas: Idea[], i: Idea, toIndex: number) {
  if (toIndex < 0 || toIndex > ideas.length) {
    throw new Error('Invalid toIndex');
  }

  const idea = i;
  ideas.splice(toIndex, 0, idea);

  let previousId: number | null;
  if (toIndex - 1 >= 0) {
    previousId = ideas[toIndex - 1].id;
  } else {
    // if it has become the first idea
    // set previousId to null
    previousId = null;
  }
  let nextId: number | null;
  if (toIndex + 1 < ideas.length) {
    nextId = ideas[toIndex + 1].id;
  } else {
    // if it has become the last idea
    // set previousId to null
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

  return idea;
}
