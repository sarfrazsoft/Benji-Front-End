import { IdeaBuilder } from '../../object-builders/idea-builder';
import { sortIdeasByProvidedOrder } from './sort-ideas-by-provided-order';

describe('sortIdeasByProvidedOrder', () => {
  it('should sort ideas according to the provided order', () => {
    const idea1 = new IdeaBuilder().withId(1).build();
    const idea2 = new IdeaBuilder().withId(2).build();
    const idea3 = new IdeaBuilder().withId(3).build();
    const idea4 = new IdeaBuilder().withId(4).build();

    const orderArray = [
      { order: 0, ideaId: 1 },
      { order: 1, ideaId: 2 },
      { order: 2, ideaId: 3 },
      { order: 3, ideaId: 4 },
    ];

    const sortedIdeas = sortIdeasByProvidedOrder([idea1, idea2, idea3, idea4], orderArray);
    expect(sortedIdeas[0].id).toBe(1);
    expect(sortedIdeas[1].id).toBe(2);
    expect(sortedIdeas[2].id).toBe(3);
    expect(sortedIdeas[3].id).toBe(4);
  });

  it('should return the same ideas array if the orderArray is empty', () => {
    const idea1 = new IdeaBuilder().withId(1).build();
    const idea2 = new IdeaBuilder().withId(2).build();
    const idea3 = new IdeaBuilder().withId(3).build();
    const idea4 = new IdeaBuilder().withId(4).build();

    const orderArray = [];

    const sortedIdeas = sortIdeasByProvidedOrder([idea1, idea2, idea3, idea4], orderArray);
    expect(sortedIdeas).toEqual([idea1, idea2, idea3, idea4]);
  });

  it('should return the partially sorted array if the orderArray does not contain all the idea ids', () => {
    const idea1 = new IdeaBuilder().withId(1).build();
    const idea2 = new IdeaBuilder().withId(2).build();
    const idea3 = new IdeaBuilder().withId(3).build();
    const idea4 = new IdeaBuilder().withId(4).build();

    const orderArray = [
      { order: 0, ideaId: 1 },
      { order: 1, ideaId: 3 },
    ];

    const sortedIdeas = sortIdeasByProvidedOrder([idea1, idea2, idea3, idea4], orderArray);
    expect(sortedIdeas).toEqual([idea1, idea3, idea2, idea4]);
  });

  it('should return the ideas array unsorted if the orderArray does not contain any of the idea ids', () => {
    const idea1 = new IdeaBuilder().withId(1).build();
    const idea2 = new IdeaBuilder().withId(2).build();
    const idea3 = new IdeaBuilder().withId(3).build();
    const idea4 = new IdeaBuilder().withId(4).build();

    const orderArray = [
      { order: 0, ideaId: 6 },
      { order: 1, ideaId: 7 },
    ];

    const sortedIdeas = sortIdeasByProvidedOrder([idea1, idea2, idea3, idea4], orderArray);
    expect(sortedIdeas).toEqual([idea1, idea2, idea3, idea4]);
  });

  it('should sort ideas in reverse order if the orderArray is reversed', () => {
    const idea1 = new IdeaBuilder().withId(1).build();
    const idea2 = new IdeaBuilder().withId(2).build();
    const idea3 = new IdeaBuilder().withId(3).build();
    const idea4 = new IdeaBuilder().withId(4).build();

    const orderArray = [
      { order: 3, ideaId: 1 },
      { order: 2, ideaId: 2 },
      { order: 1, ideaId: 3 },
      { order: 0, ideaId: 4 },
    ];

    const sortedIdeas = sortIdeasByProvidedOrder([idea1, idea2, idea3, idea4], orderArray);
    expect(sortedIdeas[0].id).toBe(4);
    expect(sortedIdeas[1].id).toBe(3);
    expect(sortedIdeas[2].id).toBe(2);
    expect(sortedIdeas[3].id).toBe(1);
  });
});
