import { Idea } from '../../backend/schema';
import { removeItemFromList } from '../item-list-functions/remove-item-from-category/remove-item-from-category';
import { IdeaBuilder } from '../object-builders/idea-builder';
import { insertAt } from './insert-at/insert-at';

describe('insertAt', () => {
  let idea: Idea;
  let ideasArray: Array<Idea>;

  beforeEach(() => {
    idea = new IdeaBuilder().withId(1).build();
    ideasArray = [];
  });

  it('should remove idea from one array and insert into the other array correctly', () => {
    const idea2Id = 2;
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(idea2Id).build();
    const idea2 = new IdeaBuilder().withId(idea2Id).withPreviousIdea(idea1.id).withNextIdea(null).build();
    const ideasArray1 = [idea1, idea2];

    const idea4Id = 4;
    const idea3 = new IdeaBuilder().withId(3).withPreviousIdea(null).withNextIdea(idea4Id).build();
    const idea4 = new IdeaBuilder().withId(idea4Id).withPreviousIdea(idea3.id).withNextIdea(null).build();
    let ideasArray2 = [idea3, idea4];

    ideasArray2 = removeItemFromList(ideasArray2, idea4.id, 'previous_idea', 'next_idea');
    const movedIdea = insertAt(ideasArray1, idea4, 2);

    expect(ideasArray2.length).toBe(1);
    expect(ideasArray1.length).toBe(3);

    expect(ideasArray2[0].id).toBe(idea3.id);
    expect(ideasArray2[0].previous_idea).toBe(null);
    expect(ideasArray2[0].next_idea).toBe(null);

    expect(ideasArray1[0].id).toBe(idea1.id);
    expect(ideasArray1[0].previous_idea).toBe(null);
    expect(ideasArray1[0].next_idea).toBe(idea2.id);

    expect(ideasArray1[1].id).toBe(idea2.id);
    expect(ideasArray1[1].previous_idea).toBe(idea1.id);
    expect(ideasArray1[1].next_idea).toBe(idea4.id);

    expect(ideasArray1[2].id).toBe(idea4.id);
    expect(ideasArray1[2].previous_idea).toBe(idea2.id);
    expect(ideasArray1[2].next_idea).toBe(null);

    expect(movedIdea).toEqual(ideasArray1[2]);

    expect(ideasArray2[0].id).toBe(idea3.id);
    expect(ideasArray2[0].previous_idea).toBe(null);
    expect(ideasArray2[0].next_idea).toBe(null);
  });

  it('should move third idea from arr1 to arr2', () => {
    const idea2Id = 2;
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(idea2Id).build();
    const idea2 = new IdeaBuilder().withId(idea2Id).withPreviousIdea(idea1.id).withNextIdea(3).build();
    const idea3 = new IdeaBuilder().withId(3).withPreviousIdea(idea2Id).withNextIdea(null).build();
    let ideasArray1 = [idea1, idea2, idea3];

    const idea4Id = 4;
    const idea4 = new IdeaBuilder().withId(idea4Id).withPreviousIdea(null).withNextIdea(null).build();
    const ideasArray2 = [idea4];

    ideasArray1 = removeItemFromList(ideasArray1, idea3.id, 'previous_idea', 'next_idea');
    const movedIdea = insertAt(ideasArray2, idea3, 1);

    expect(ideasArray1.length).toBe(2);
    expect(ideasArray2.length).toBe(2);

    expect(ideasArray1[0].id).toBe(idea1.id);
    expect(ideasArray1[0].previous_idea).toBe(null);
    expect(ideasArray1[0].next_idea).toBe(idea2.id);

    expect(ideasArray1[1].id).toBe(idea2.id);
    expect(ideasArray1[1].previous_idea).toBe(idea1.id);
    expect(ideasArray1[1].next_idea).toBe(null);

    expect(ideasArray2[0].id).toBe(idea4.id);
    expect(ideasArray2[0].previous_idea).toBe(null);
    expect(ideasArray2[0].next_idea).toBe(idea3.id);

    expect(ideasArray2[1].id).toBe(idea3.id);
    expect(ideasArray2[1].previous_idea).toBe(idea4.id);
    expect(ideasArray2[1].next_idea).toBe(null);
  });

  it('should remove idea from one array and insert into the other array correctly', () => {
    const idea2Id = 2;
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(idea2Id).build();
    const idea2 = new IdeaBuilder().withId(idea2Id).withPreviousIdea(idea1.id).withNextIdea(null).build();
    const ideasArray1 = [idea1, idea2];

    const idea3 = new IdeaBuilder().withId(3).withPreviousIdea(null).withNextIdea(null).build();
    let ideasArray2 = [idea3];

    ideasArray2 = removeItemFromList(ideasArray2, idea3.id, 'previous_idea', 'next_idea');
    const movedIdea = insertAt(ideasArray1, idea3, 1);

    expect(ideasArray2.length).toBe(0);
    expect(ideasArray1.length).toBe(3);

    expect(ideasArray1[0].id).toBe(idea1.id);
    expect(ideasArray1[0].previous_idea).toBe(null);
    expect(ideasArray1[0].next_idea).toBe(idea3.id);

    expect(ideasArray1[1].id).toBe(idea3.id);
    expect(ideasArray1[1].previous_idea).toBe(idea1.id);
    expect(ideasArray1[1].next_idea).toBe(idea2.id);

    expect(ideasArray1[2].id).toBe(idea2.id);
    expect(ideasArray1[2].previous_idea).toBe(idea3.id);
    expect(ideasArray1[2].next_idea).toBe(null);
  });
});
