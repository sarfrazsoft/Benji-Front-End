import { Category, Idea } from '../../../backend/schema';

export const getIdeaFromCategory = (category: Category, firstOrLast: 'first' | 'last'): Idea | null => {
  try {
    const ideas = category?.brainstormidea_set?.filter((idea) => !idea.removed) || [];
    if (ideas.length) {
      const allIdeasAreLegacy = ideas.every((idea) => idea.next_idea === null && idea.previous_idea === null);
      if (allIdeasAreLegacy) {
        return firstOrLast === 'first' ? ideas[0] : ideas[ideas.length - 1];
      }

      const targetIdea = ideas.find((idea) => {
        return firstOrLast === 'first' ? idea.previous_idea === null : idea.next_idea === null;
      });
      if (!targetIdea) {
        throw new Error(`${firstOrLast === 'first' ? 'First' : 'Last'} idea not found in the array`);
      }
      return targetIdea;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
