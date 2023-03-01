import {
  Category,
  Idea,
  IdeaComment,
  IdeaDocument,
  IdeaHeart,
  ParticipantCode,
} from '../../../backend/schema';
import { CategoryBuilder } from '../../object-builders/category-builder';
import { IdeaBuilder } from '../../object-builders/idea-builder';
import { sortByFirstToLast } from './sort-items-by-next-previous';

describe('sortByNextPrevious', () => {
  it('Ideas - should sort the array correctly 1', () => {
    const idea1 = new IdeaBuilder().withId(1).withNextIdea(3).withPreviousIdea(null).build();
    const idea2 = new IdeaBuilder().withId(2).withNextIdea(null).withPreviousIdea(3).build();
    const idea3 = new IdeaBuilder().withId(3).withNextIdea(2).withPreviousIdea(1).build();

    const ideas = [idea1, idea2, idea3];
    const sortedIdeas = sortByFirstToLast(ideas, 'previous_idea', 'next_idea');

    expect(sortedIdeas[0].id).toEqual(1);
    expect(sortedIdeas[0].previous_idea).toBeNull();
    expect(sortedIdeas[1].id).toEqual(3);
    expect(sortedIdeas[1].next_idea).toEqual(2);
    expect(sortedIdeas[2].id).toEqual(2);
    expect(sortedIdeas[2].next_idea).toBeNull();
  });

  it('Categories - should sort the array correctly 1', () => {
    const category1 = new CategoryBuilder().withId(1).withNextCategory(2).withPreviousCategory(null).build();
    const category2 = new CategoryBuilder().withId(2).withNextCategory(3).withPreviousCategory(1).build();
    const category3 = new CategoryBuilder().withId(3).withNextCategory(4).withPreviousCategory(2).build();
    const category4 = new CategoryBuilder().withId(4).withNextCategory(5).withPreviousCategory(3).build();
    const category5 = new CategoryBuilder().withId(5).withNextCategory(null).withPreviousCategory(4).build();

    const categories = [category4, category1, , category5, category2, category3];
    const sortedCategories = sortByFirstToLast(categories, 'previous_category', 'next_category');

    expect(sortedCategories[0].id).toEqual(1);
    expect(sortedCategories[0].previous_category).toBeNull();
    expect(sortedCategories[1].id).toEqual(2);
    expect(sortedCategories[1].next_category).toEqual(3);
    expect(sortedCategories[2].id).toEqual(3);
    expect(sortedCategories[2].next_category).toEqual(4);
    expect(sortedCategories[3].id).toEqual(4);
    expect(sortedCategories[3].next_category).toEqual(5);
    expect(sortedCategories[4].id).toEqual(5);
    expect(sortedCategories[4].next_category).toBeNull();
  });

  it('Ideas - should sort the array correctly 2', () => {
    const idea1 = new IdeaBuilder().withId(1).withNextIdea(2).withPreviousIdea(null).build();
    const idea2 = new IdeaBuilder().withId(2).withNextIdea(3).withPreviousIdea(1).build();
    const idea3 = new IdeaBuilder().withId(3).withNextIdea(4).withPreviousIdea(3).build();
    const idea4 = new IdeaBuilder().withId(4).withNextIdea(null).withPreviousIdea(1).build();

    const ideas = [idea1, idea3, idea4, idea2];
    const sortedIdeas = sortByFirstToLast(ideas, 'previous_idea', 'next_idea');

    expect(sortedIdeas[0].id).toEqual(1);
    expect(sortedIdeas[0].previous_idea).toBeNull();
    expect(sortedIdeas[1].id).toEqual(2);
    expect(sortedIdeas[1].next_idea).toEqual(3);
    expect(sortedIdeas[2].id).toEqual(3);
    expect(sortedIdeas[2].next_idea).toEqual(4);
    expect(sortedIdeas[3].id).toEqual(4);
    expect(sortedIdeas[3].next_idea).toBeNull();
  });

  it('Ideas - should sort the array partially and return all ideas', () => {
    const idea1 = new IdeaBuilder().withId(1).withNextIdea(2).withPreviousIdea(null).build();
    const idea2 = new IdeaBuilder().withId(2).withNextIdea(3).withPreviousIdea(1).build();
    const idea3 = new IdeaBuilder().withId(3).withNextIdea(4).withPreviousIdea(3).build();
    const idea4 = new IdeaBuilder().withId(4).withNextIdea(null).withPreviousIdea(1).build();

    const idea5 = new IdeaBuilder().withId(5).withNextIdea(null).withPreviousIdea(null).build();
    const idea6 = new IdeaBuilder().withId(6).withNextIdea(null).withPreviousIdea(null).build();

    const ideas = [idea1, idea5, idea4, idea2, idea3, idea6];
    const sortedIdeas = sortByFirstToLast(ideas, 'previous_idea', 'next_idea');

    expect(sortedIdeas[0].id).toEqual(1);
    expect(sortedIdeas[0].previous_idea).toBeNull();
    expect(sortedIdeas[1].id).toEqual(2);
    expect(sortedIdeas[1].next_idea).toEqual(3);
    expect(sortedIdeas[2].id).toEqual(3);
    expect(sortedIdeas[2].next_idea).toEqual(4);
    expect(sortedIdeas[3].id).toEqual(4);
    expect(sortedIdeas[3].next_idea).toBeNull();

    expect(sortedIdeas[4].id).toEqual(5);
    expect(sortedIdeas[5].id).toEqual(6);
  });

  it('Ideas - should return the array unsorted', () => {
    const idea1 = new IdeaBuilder().withId(1).build();
    const idea2 = new IdeaBuilder().withId(2).build();
    const idea3 = new IdeaBuilder().withId(3).build();
    const idea4 = new IdeaBuilder().withId(4).build();

    const ideas = [idea1, idea2, idea3, idea4];
    const sortedIdeas = sortByFirstToLast(ideas, 'previous_idea', 'next_idea');

    expect(sortedIdeas[0].id).toEqual(1);
    expect(sortedIdeas[0].previous_idea).toBeNull();
    expect(sortedIdeas[1].id).toBe(2);
    expect(sortedIdeas[1].next_idea).toBeNull();
    expect(sortedIdeas[2].id).toEqual(3);
    expect(sortedIdeas[2].next_idea).toBeNull();
    expect(sortedIdeas[3].id).toEqual(4);
    expect(sortedIdeas[3].next_idea).toBeNull();
  });

  it('Ideas - should throw an error if the input is not an array', () => {
    const category = {
      id: 1,
      brainstormidea_set: {},
      category_name: 'Test Category',
      removed: false,
    } as Category;

    expect(() => sortByFirstToLast(category.brainstormidea_set, 'previous_idea', 'next_idea')).toThrowError(
      'Input must be an array'
    );
  });

  // it('should throw an error if the array elements do not have next_
  // idea and previous_idea properties', () => {
  //   const idea1: Idea = {
  //     id: 1,
  //     comments: [],
  //     hearts: null,
  //     idea: null,
  //     idea_document: null,
  //     idea_image: null,
  //     idea_video: null,
  //     meta: null,
  //     num_votes: null,
  //     pinned: null,
  //     removed: null,
  //     submitting_participant: null,
  //     time: null,
  //     title: null,
  //     version: null,
  //     addingIdea: null,
  //     editing: null,
  //     showClose: null,
  //   } as Idea;

  //   expect(() => sortByFirstToLast([idea1], 'previous_idea', 'next_idea')).toThrowError(
  //     `Array elements must have previous_idea and next_idea properties`
  //   );
  // });
});
