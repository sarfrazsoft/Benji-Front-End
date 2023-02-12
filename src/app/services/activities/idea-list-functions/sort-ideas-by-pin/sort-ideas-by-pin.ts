import { Idea } from 'src/app/services/backend/schema';

export function sortIdeasByPin(ideas: Array<Idea>) {
  // This code snippet is using a for loop to iterate through an array of "columns".
  //  For each column, it is accessing a property called "brainstormidea_set" and
  // using the JavaScript sort method to sort the ideas within that property. The
  // sorting is being done based on the value of the "pinned" property of each idea.
  // If two ideas have the same value for "pinned", they will be considered equal and
  // their order will not be changed. If one idea has a "pinned" value of true and the
  // other has a "pinned" value of false, the idea with the true value will be considered
  // "smaller" and will come first in the sorted array.
  return ideas.sort((a: Idea, b: Idea) => {
    return a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1;
  });
}
