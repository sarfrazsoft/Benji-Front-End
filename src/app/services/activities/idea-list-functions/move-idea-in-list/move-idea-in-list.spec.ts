import { Idea } from '../../../backend/schema';
import { IdeaBuilder } from '../idea-builder';
import { moveIdea } from './move-idea-in-list';

describe('moveIdeaInList', () => {
  let idea: Idea;
  let ideasArray: Array<Idea>;

  beforeEach(() => {
    idea = new IdeaBuilder().withId(1).build();
    ideasArray = [];
  });

  it('should move the first item to second place', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(idea1.id).withNextIdea(null).build();

    ideasArray = [idea1, idea2];

    // move first item to second place
    const movedIdea = moveIdea(ideasArray, 0, 1);

    // expect(ideasArray[0].id).toBe(idea2.id);
    // expect(ideasArray[0].previous_idea).toBe(null);

    expect(movedIdea.id).toBe(idea1.id);
    expect(movedIdea.previous_idea).toBe(idea2.id);
    expect(movedIdea.next_idea).toBe(null);

    // expect(ideasArray[1].id).toBe(idea1.id);
    // expect(ideasArray[1].previous_idea).toBe(idea2.id);
    // expect(ideasArray[1].next_idea).toBe(null);
  });

  it('should move the first item to second place and have correct pointers', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(idea.id).withNextIdea(3).build();
    const idea3 = new IdeaBuilder().withId(3).withPreviousIdea(idea2.id).withNextIdea(null).build();

    ideasArray = [idea1, idea2, idea3];

    const movedIdea = moveIdea(ideasArray, 0, 1);

    expect(movedIdea.id).toBe(idea1.id);
    expect(movedIdea.previous_idea).toBe(idea2.id);
    expect(movedIdea.next_idea).toBe(idea3.id);
  });

  it('should move the first item to second place and have correct pointers', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(idea.id).withNextIdea(3).build();
    const idea3 = new IdeaBuilder().withId(3).withPreviousIdea(idea2.id).withNextIdea(null).build();

    ideasArray = [idea1, idea2, idea3];

    const movedIdea = moveIdea(ideasArray, 1, 2);

    expect(movedIdea.id).toBe(idea2.id);
    expect(movedIdea.previous_idea).toBe(idea3.id);
    expect(movedIdea.next_idea).toBe(null);
  });
});
