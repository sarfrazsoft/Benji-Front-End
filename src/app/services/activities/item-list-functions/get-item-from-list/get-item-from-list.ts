import { Category, Idea } from '../../../backend/schema';

export const getItemFromList = (
  items: Array<any>,
  firstOrLast: 'first' | 'last',
  previousPointer: string,
  nextPointer: string
): any => {
  try {
    const ideas = items?.filter((idea) => !idea.removed) || [];
    if (ideas.length) {
      const allIdeasAreLegacy = ideas.every(
        (idea) => idea[nextPointer] === null && idea[previousPointer] === null
      );
      if (allIdeasAreLegacy) {
        return firstOrLast === 'first' ? ideas[0] : ideas[ideas.length - 1];
      }

      const targetIdea = ideas.find((idea) => {
        return firstOrLast === 'first' ? idea[previousPointer] === null : idea[nextPointer] === null;
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
