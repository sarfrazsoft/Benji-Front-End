import { Category, Idea } from '../../../backend/schema';
import { getIdeaFromCategory } from './get-idea-from-category';

describe('getIdeaFromCategory', () => {
  it('should return the first idea when first parameter is first', () => {
    const category = {
      brainstormidea_set: [
        { id: 1, removed: false, next_idea: 2, previous_idea: null },
        { id: 2, removed: false, next_idea: 3, previous_idea: 1 },
        { id: 3, removed: false, next_idea: null, previous_idea: 2 },
      ],
    } as Category;
    const result = getIdeaFromCategory(category, 'first');

    expect(result).toEqual({ id: 1, removed: false, next_idea: 2, previous_idea: null } as Idea);
  });

  it('should return the last idea when first parameter is last', () => {
    const category = {
      brainstormidea_set: [
        { id: 2, removed: false, next_idea: 3, previous_idea: 1 },
        { id: 1, removed: false, next_idea: 2, previous_idea: null },
        { id: 3, removed: false, next_idea: null, previous_idea: 2 },
      ],
    } as Category;
    const result = getIdeaFromCategory(category, 'last');
    expect(result).toEqual({ id: 3, removed: false, next_idea: null, previous_idea: 2 } as Idea);
  });

  it('should return null if there are no ideas', () => {
    const category = {
      brainstormidea_set: [],
    } as Category;
    const result = getIdeaFromCategory(category, 'first');
    expect(result).toBeNull();
  });

  it('should return the only idea if there is only one idea', () => {
    const category = {
      brainstormidea_set: [{ id: 1, removed: false, next_idea: null, previous_idea: null }],
    } as Category;
    const result = getIdeaFromCategory(category, 'first');
    expect(result).toEqual({ id: 1, removed: false, next_idea: null, previous_idea: null } as Idea);
  });

  it('should return null if all ideas are removed', () => {
    const category = {
      brainstormidea_set: [
        { id: 1, removed: true, next_idea: 2, previous_idea: null },
        { id: 2, removed: true, next_idea: 3, previous_idea: 1 },
        { id: 3, removed: true, next_idea: null, previous_idea: 2 },
      ],
    } as Category;
    const result = getIdeaFromCategory(category, 'first');
    expect(result).toBeNull();
  });

  it('should return null if the idea is not found', () => {
    const category = {
      brainstormidea_set: [
        { id: 2, removed: false, next_idea: 3, previous_idea: 1 },
        { id: 1, removed: false, next_idea: 2, previous_idea: null },
      ],
    } as Category;
    const result = getIdeaFromCategory(category, 'last');
    expect(result).toBeNull();
  });

  it('should return the first idea even if the idea order is not sequential', () => {
    const category = {
      brainstormidea_set: [
        { id: 3, removed: false, next_idea: null, previous_idea: 2 },
        { id: 1, removed: false, next_idea: 2, previous_idea: null },
        { id: 2, removed: false, next_idea: 3, previous_idea: 1 },
      ],
    } as Category;
    const result = getIdeaFromCategory(category, 'first');
    expect(result).toEqual({ id: 1, removed: false, next_idea: 2, previous_idea: null } as Idea);
  });

  it('should return the last idea even if the idea order is not sequential', () => {
    const category = {
      brainstormidea_set: [
        { id: 2, removed: false, next_idea: 3, previous_idea: 1 },
        { id: 3, removed: false, next_idea: null, previous_idea: 2 },
        { id: 1, removed: false, next_idea: 2, previous_idea: null },
      ],
    } as Category;
    const result = getIdeaFromCategory(category, 'last');
    expect(result).toEqual({ id: 3, removed: false, next_idea: null, previous_idea: 2 } as Idea);
  });

  it('should return null if the idea set is undefined', () => {
    const category = {
      brainstormidea_set: undefined,
    } as Category;
    const result = getIdeaFromCategory(category, 'first');
    expect(result).toBeNull();
  });

  it('should return null if the idea set is null', () => {
    const category = {
      brainstormidea_set: null,
    } as Category;
    const result = getIdeaFromCategory(category, 'first');
    expect(result).toBeNull();
  });
});
