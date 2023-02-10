import { remove } from 'lodash';
import { Category, Idea } from '../../../backend/schema';

export function removeIdeaFromCategory(ideas: Idea[], id: number): Idea[] {
  for (const i of ideas) {
    if (!i.hasOwnProperty('next_idea') || !i.hasOwnProperty('previous_idea')) {
      throw new Error(`Array elements must have 'next_idea' and 'previous_idea' properties`);
    }
  }

  const allIdeasAreLegacy = ideas.every((i) => i.next_idea === null && i.previous_idea === null);
  if (allIdeasAreLegacy) {
    remove(ideas, { id: id });
    return ideas;
  }

  const legacyIdeas = ideas.filter((i) => i.next_idea === null && i.previous_idea === null);
  const updatedArr = ideas.filter((i) => i.next_idea !== null || i.previous_idea !== null);

  const legacyIndex = legacyIdeas.findIndex((i) => i.id === id);
  if (legacyIndex !== -1) {
    // remove it from legacy ideas, concat and return
    remove(legacyIdeas, { id: id });
    return [...updatedArr, ...legacyIdeas];
  }

  const updatedIndex = ideas.findIndex((i) => i.id === id);
  if (updatedIndex !== -1) {
    // remove it from updated ideas, concat and return
    const idea = ideas[updatedIndex];
    if (idea.previous_idea !== null) {
      const previousIdeaIndex = ideas.findIndex((i) => i.id === idea.previous_idea);
      if (previousIdeaIndex !== -1) {
        // if we could find the previous idea
        ideas[previousIdeaIndex].next_idea = idea.next_idea;
      }
    }
    if (idea.next_idea !== null) {
      const nextIdeaIndex = ideas.findIndex((i) => i.id === idea.next_idea);
      if (nextIdeaIndex !== -1) {
        // if next idea is in the array
        // set previous of that to previous of leaving idea
        ideas[nextIdeaIndex].previous_idea = idea.previous_idea;
      }
    }
    ideas.splice(updatedIndex, 1);
  }
  return ideas;
}
