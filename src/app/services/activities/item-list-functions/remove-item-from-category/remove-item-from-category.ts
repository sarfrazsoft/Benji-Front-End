import { remove } from 'lodash';
import { Category, Idea } from '../../../backend/schema';

export function removeItemFromList(
  ideas: any[],
  id: number,
  previousPointer: string,
  nextPointer: string
): any[] {
  // for (const i of ideas) {
  //   if (!i.hasOwnProperty('next_idea') || !i.hasOwnProperty('previous_idea')) {
  //     throw new Error(`Array elements must have 'next_idea' and 'previous_idea' properties`);
  //   }
  // }

  const allIdeasAreLegacy = ideas.every((i) => i[nextPointer] === null && i[previousPointer] === null);
  if (allIdeasAreLegacy) {
    remove(ideas, { id: id });
    return ideas;
  }

  const legacyIdeas = ideas.filter((i) => i[nextPointer] === null && i[previousPointer] === null);
  const updatedArr = ideas.filter((i) => i[nextPointer] !== null || i[previousPointer] !== null);

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
    if (idea[previousPointer] !== null) {
      const previousIdeaIndex = ideas.findIndex((i) => i.id === idea[previousPointer]);
      if (previousIdeaIndex !== -1) {
        // if we could find the previous idea
        ideas[previousIdeaIndex][nextPointer] = idea[nextPointer];
      }
    }
    if (idea[nextPointer] !== null) {
      const nextIdeaIndex = ideas.findIndex((i) => i.id === idea[nextPointer]);
      if (nextIdeaIndex !== -1) {
        // if next idea is in the array
        // set previous of that to previous of leaving idea
        ideas[nextIdeaIndex][previousPointer] = idea[previousPointer];
      }
    }
    ideas.splice(updatedIndex, 1);
  }
  return ideas;
}
