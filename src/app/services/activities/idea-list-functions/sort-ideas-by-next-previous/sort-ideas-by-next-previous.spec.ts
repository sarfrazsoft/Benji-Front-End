import {
  Category,
  Idea,
  IdeaComment,
  IdeaDocument,
  IdeaHeart,
  ParticipantCode,
} from '../../../backend/schema';
import { IdeaBuilder } from '../idea-builder';
import { sortByFirstToLast } from './sort-ideas-by-next-previous';

describe('sortByNextPrevious', () => {
  it('should sort the array correctly 1', () => {
    const idea1 = new IdeaBuilder().withId(1).withNextIdea(3).withPreviousIdea(null).build();
    const idea2 = new IdeaBuilder().withId(2).withNextIdea(null).withPreviousIdea(3).build();
    const idea3 = new IdeaBuilder().withId(3).withNextIdea(2).withPreviousIdea(1).build();

    const ideas = [idea1, idea2, idea3];
    const sortedIdeas = sortByFirstToLast(ideas);

    expect(sortedIdeas[0].id).toEqual(1);
    expect(sortedIdeas[0].previous_idea).toBeNull();
    expect(sortedIdeas[1].id).toEqual(3);
    expect(sortedIdeas[1].next_idea).toEqual(2);
    expect(sortedIdeas[2].id).toEqual(2);
    expect(sortedIdeas[2].next_idea).toBeNull();
  });

  it('should sort the array correctly 2', () => {
    const idea1 = new IdeaBuilder().withId(1).withNextIdea(2).withPreviousIdea(null).build();
    const idea2 = new IdeaBuilder().withId(2).withNextIdea(3).withPreviousIdea(1).build();
    const idea3 = new IdeaBuilder().withId(3).withNextIdea(4).withPreviousIdea(3).build();
    const idea4 = new IdeaBuilder().withId(4).withNextIdea(null).withPreviousIdea(1).build();

    const ideas = [idea1, idea3, idea4, idea2];
    const sortedIdeas = sortByFirstToLast(ideas);

    expect(sortedIdeas[0].id).toEqual(1);
    expect(sortedIdeas[0].previous_idea).toBeNull();
    expect(sortedIdeas[1].id).toEqual(2);
    expect(sortedIdeas[1].next_idea).toEqual(3);
    expect(sortedIdeas[2].id).toEqual(3);
    expect(sortedIdeas[2].next_idea).toEqual(4);
    expect(sortedIdeas[3].id).toEqual(4);
    expect(sortedIdeas[3].next_idea).toBeNull();
  });

  it('should sort the array partially and return all ideas', () => {
    const idea1 = new IdeaBuilder().withId(1).withNextIdea(2).withPreviousIdea(null).build();
    const idea2 = new IdeaBuilder().withId(2).withNextIdea(3).withPreviousIdea(1).build();
    const idea3 = new IdeaBuilder().withId(3).withNextIdea(4).withPreviousIdea(3).build();
    const idea4 = new IdeaBuilder().withId(4).withNextIdea(null).withPreviousIdea(1).build();

    const idea5 = new IdeaBuilder().withId(5).withNextIdea(null).withPreviousIdea(null).build();
    const idea6 = new IdeaBuilder().withId(6).withNextIdea(null).withPreviousIdea(null).build();

    const ideas = [idea1, idea5, idea4, idea2, idea3, idea6];
    const sortedIdeas = sortByFirstToLast(ideas);

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

  it('should return the array unsorted', () => {
    const idea1 = new IdeaBuilder().withId(1).build();
    const idea2 = new IdeaBuilder().withId(2).build();
    const idea3 = new IdeaBuilder().withId(3).build();
    const idea4 = new IdeaBuilder().withId(4).build();

    const ideas = [idea1, idea2, idea3, idea4];
    const sortedIdeas = sortByFirstToLast(ideas);

    expect(sortedIdeas[0].id).toEqual(1);
    expect(sortedIdeas[0].previous_idea).toBeNull();
    expect(sortedIdeas[1].id).toBe(2);
    expect(sortedIdeas[1].next_idea).toBeNull();
    expect(sortedIdeas[2].id).toEqual(3);
    expect(sortedIdeas[2].next_idea).toBeNull();
    expect(sortedIdeas[3].id).toEqual(4);
    expect(sortedIdeas[3].next_idea).toBeNull();
  });

  it('should throw an error if the input is not an array', () => {
    const category = {
      id: 1,
      brainstormidea_set: {},
      category_name: 'Test Category',
      removed: false,
    } as Category;

    expect(() => sortByFirstToLast(category.brainstormidea_set)).toThrowError('Input must be an array');
  });

  it('should throw an error if the array elements do not have next_idea and previous_idea properties', () => {
    const idea1: Idea = {
      id: 1,
      comments: [],
      hearts: null,
      idea: null,
      idea_document: null,
      idea_image: null,
      idea_video: null,
      meta: null,
      num_votes: null,
      pinned: null,
      removed: null,
      submitting_participant: null,
      time: null,
      title: null,
      version: null,
      addingIdea: null,
      editing: null,
      showClose: null,
    } as Idea;

    expect(() => sortByFirstToLast([idea1])).toThrowError(
      `Array elements must have 'next_idea' and 'previous_idea' properties`
    );
  });
});
