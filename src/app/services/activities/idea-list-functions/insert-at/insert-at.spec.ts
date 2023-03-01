import { Idea } from '../../../backend/schema';
import { IdeaBuilder } from '../../object-builders/idea-builder';
import { insertAt } from './insert-at';

describe('insertAt', () => {
  let idea: Idea;
  let ideasArray: Array<Idea>;

  beforeEach(() => {
    idea = new IdeaBuilder().withId(1).build();
    ideasArray = [];
  });

  it('should insert idea at index 0 and ideasArray to be updated 1', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(idea1.id).withNextIdea(null).build();

    const idea3 = new IdeaBuilder().withId(3).withPreviousIdea(null).withNextIdea(null).build();

    ideasArray = [idea1, idea2];

    const movedIdea = insertAt(ideasArray, idea3, 0);

    expect(movedIdea.id).toBe(idea3.id);
    expect(movedIdea.previous_idea).toBe(null);
    expect(movedIdea.next_idea).toBe(idea1.id);

    expect(ideasArray.length).toBe(3);
    expect(ideasArray[1].id).toBe(idea1.id);
    expect(ideasArray[1].next_idea).toBe(idea2.id);
    expect(ideasArray[1].previous_idea).toBe(idea3.id);

    expect(ideasArray[2].id).toBe(idea2.id);
    expect(ideasArray[2].next_idea).toBe(null);
    expect(ideasArray[2].previous_idea).toBe(idea1.id);
  });

  it('should insert idea at index 0 and ideasArray to be updated 2', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(null).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(null).withNextIdea(null).build();

    ideasArray = [idea1];

    const movedIdea = insertAt(ideasArray, idea2, 0);

    expect(ideasArray.length).toBe(2);

    expect(movedIdea.id).toBe(idea2.id);
    expect(movedIdea.previous_idea).toBe(null);
    expect(movedIdea.next_idea).toBe(idea1.id);

    expect(ideasArray[0].id).toBe(idea2.id);
    expect(ideasArray[0].next_idea).toBe(idea1.id);
    expect(ideasArray[0].previous_idea).toBe(null);

    expect(ideasArray[1].id).toBe(idea1.id);
    expect(ideasArray[1].next_idea).toBe(null);
    expect(ideasArray[1].previous_idea).toBe(idea2.id);
  });
  it('should insert idea at index 1 and ideasArray to be updated 3', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(null).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(null).withNextIdea(null).build();

    ideasArray = [idea1];

    const movedIdea = insertAt(ideasArray, idea2, 1);

    expect(ideasArray.length).toBe(2);

    expect(movedIdea.id).toBe(idea2.id);
    expect(movedIdea.previous_idea).toBe(idea1.id);
    expect(movedIdea.next_idea).toBe(null);

    expect(ideasArray[0].id).toBe(idea1.id);
    expect(ideasArray[0].previous_idea).toBe(null);
    expect(ideasArray[0].next_idea).toBe(idea2.id);

    expect(ideasArray[1].id).toBe(idea2.id);
    expect(ideasArray[1].previous_idea).toBe(idea1.id);
    expect(ideasArray[1].next_idea).toBe(null);
  });

  it('should insert idea at index 1 and ideasArray to be updated', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(idea1.id).withNextIdea(null).build();

    const idea3 = new IdeaBuilder().withId(3).withPreviousIdea(null).withNextIdea(null).build();

    ideasArray = [idea1, idea2];

    const movedIdea = insertAt(ideasArray, idea3, 1);

    expect(movedIdea.id).toBe(idea3.id);
    expect(movedIdea.previous_idea).toBe(idea1.id);
    expect(movedIdea.next_idea).toBe(idea2.id);

    expect(ideasArray.length).toBe(3);
    expect(ideasArray[0].id).toBe(idea1.id);
    expect(ideasArray[0].next_idea).toBe(idea3.id);
    expect(ideasArray[0].previous_idea).toBe(null);

    expect(ideasArray[2].id).toBe(idea2.id);
    expect(ideasArray[2].next_idea).toBe(null);
    expect(ideasArray[2].previous_idea).toBe(idea3.id);
  });

  it('should insert idea at index 2 and ideasArray to be updated', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(idea1.id).withNextIdea(null).build();

    const idea3 = new IdeaBuilder().withId(3).withPreviousIdea(null).withNextIdea(null).build();

    ideasArray = [idea1, idea2];

    const movedIdea = insertAt(ideasArray, idea3, 2);

    expect(movedIdea.id).toBe(idea3.id);
    expect(movedIdea.previous_idea).toBe(idea2.id);
    expect(movedIdea.next_idea).toBe(null);

    expect(ideasArray.length).toBe(3);
    expect(ideasArray[0].id).toBe(idea1.id);
    expect(ideasArray[0].next_idea).toBe(idea2.id);
    expect(ideasArray[0].previous_idea).toBe(null);

    expect(ideasArray[1].id).toBe(idea2.id);
    expect(ideasArray[1].next_idea).toBe(idea3.id);
    expect(ideasArray[1].previous_idea).toBe(idea1.id);

    expect(ideasArray[2].id).toBe(idea3.id);
    expect(ideasArray[2].next_idea).toBe(null);
    expect(ideasArray[2].previous_idea).toBe(idea2.id);
  });
  it('should throw error', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(idea1.id).withNextIdea(null).build();

    const idea3 = new IdeaBuilder().withId(3).withPreviousIdea(null).withNextIdea(null).build();

    ideasArray = [idea1, idea2];

    expect(() => insertAt(ideasArray, idea3, 4)).toThrowError('Invalid toIndex');
  });
});
