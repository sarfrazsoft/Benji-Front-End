import { Idea } from '../../../backend/schema';
import { IdeaBuilder } from '../../object-builders/idea-builder';
import { removeItemFromList } from './remove-item-from-category';

describe('removeItemFromList', () => {
  let firstIdea: Idea;
  let thirdIdea: Idea;
  let secondIdea: Idea;
  let fourthIdea: Idea;

  beforeEach(() => {
    firstIdea = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    secondIdea = new IdeaBuilder().withId(2).withPreviousIdea(firstIdea.id).withNextIdea(3).build();
    thirdIdea = new IdeaBuilder().withId(3).withPreviousIdea(2).withNextIdea(null).build();
    fourthIdea = new IdeaBuilder().withId(4).withPreviousIdea(null).withNextIdea(null).build();
  });

  it('should delete the first idea', () => {
    const ideas = [firstIdea, thirdIdea, secondIdea];
    const updatedIdeas = removeItemFromList(ideas, firstIdea.id, 'previous_idea', 'next_idea');

    expect(updatedIdeas.length).toEqual(2);

    expect(updatedIdeas[0]).toEqual(thirdIdea);
    expect(updatedIdeas[0].previous_idea).toBe(thirdIdea.previous_idea);
    expect(updatedIdeas[0].next_idea).toBe(thirdIdea.next_idea);

    expect(updatedIdeas[1]).toEqual(secondIdea);
    expect(updatedIdeas[1].previous_idea).toEqual(null);
    expect(updatedIdeas[1].next_idea).toBe(3);
  });

  it('should delete the first idea from two', () => {
    firstIdea = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    secondIdea = new IdeaBuilder().withId(2).withPreviousIdea(firstIdea.id).withNextIdea(null).build();
    const ideas = [firstIdea, secondIdea];
    const updatedIdeas = removeItemFromList(ideas, firstIdea.id, 'previous_idea', 'next_idea');

    expect(updatedIdeas.length).toEqual(1);

    expect(updatedIdeas[0]).toEqual(secondIdea);
    expect(updatedIdeas[0].previous_idea).toEqual(null);
    expect(updatedIdeas[0].next_idea).toBe(null);
  });

  it('should delete the second idea from two', () => {
    firstIdea = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    secondIdea = new IdeaBuilder().withId(2).withPreviousIdea(firstIdea.id).withNextIdea(null).build();
    const ideas = [firstIdea, secondIdea];
    const updatedIdeas = removeItemFromList(ideas, secondIdea.id, 'previous_idea', 'next_idea');

    expect(updatedIdeas.length).toEqual(1);

    expect(updatedIdeas[0].id).toEqual(firstIdea.id);
    expect(updatedIdeas[0].previous_idea).toEqual(null);
    expect(updatedIdeas[0].next_idea).toBe(null);
  });

  it('should delete the second idea from two', () => {
    firstIdea = new IdeaBuilder().withId(1).withPreviousIdea(34).withNextIdea(2).build();
    secondIdea = new IdeaBuilder().withId(2).withPreviousIdea(firstIdea.id).withNextIdea(44).build();
    const ideas = [firstIdea, secondIdea];
    const updatedIdeas = removeItemFromList(ideas, secondIdea.id, 'previous_idea', 'next_idea');

    expect(updatedIdeas.length).toEqual(1);

    expect(updatedIdeas[0].id).toEqual(firstIdea.id);
    expect(updatedIdeas[0].previous_idea).toEqual(34);
    expect(updatedIdeas[0].next_idea).toBe(44);
  });

  it('should delete the broken idea', () => {
    firstIdea = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    secondIdea = new IdeaBuilder().withId(2).withPreviousIdea(firstIdea.id).withNextIdea(null).build();
    thirdIdea = new IdeaBuilder().withId(3).withPreviousIdea(null).withNextIdea(null).build();

    const ideas = [firstIdea, thirdIdea, secondIdea];
    const updatedIdeas = removeItemFromList(ideas, secondIdea.id, 'previous_idea', 'next_idea');

    expect(updatedIdeas.length).toEqual(2);

    expect(updatedIdeas[0]).toEqual(firstIdea);
    expect(updatedIdeas[0].previous_idea).toBe(firstIdea.previous_idea);
    expect(updatedIdeas[0].next_idea).toBe(firstIdea.next_idea);

    expect(updatedIdeas[1]).toEqual(thirdIdea);
    expect(updatedIdeas[1].previous_idea).toEqual(thirdIdea.previous_idea);
    expect(updatedIdeas[1].next_idea).toBe(thirdIdea.next_idea);
  });

  it('should delete the last idea', () => {
    const ideas = [thirdIdea, firstIdea, secondIdea];
    const updatedIdeas = removeItemFromList(ideas, thirdIdea.id, 'previous_idea', 'next_idea');

    expect(updatedIdeas.length).toEqual(2);
    expect(updatedIdeas[0]).toEqual(firstIdea);
    expect(updatedIdeas[0].previous_idea).toBeNull();

    expect(updatedIdeas[1].id).toEqual(secondIdea.id);
    expect(updatedIdeas[1].previous_idea).toEqual(firstIdea.id);
    expect(updatedIdeas[1].next_idea).toBeNull();
  });

  it('should delete the middle idea', () => {
    const ideas = [firstIdea, secondIdea, thirdIdea];
    const updatedIdeas = removeItemFromList(ideas, secondIdea.id, 'previous_idea', 'next_idea');

    expect(updatedIdeas.length).toEqual(2);
    expect(updatedIdeas[0].id).toEqual(firstIdea.id);
    expect(updatedIdeas[0].next_idea).toEqual(thirdIdea.id);
    expect(updatedIdeas[0].previous_idea).toBeNull();

    expect(updatedIdeas[1]).toEqual(thirdIdea);
    expect(updatedIdeas[1].previous_idea).toEqual(firstIdea.id);
    expect(updatedIdeas[1].next_idea).toBeNull();
  });

  it('should delete the fourth idea', () => {
    const ideas = [firstIdea, secondIdea, thirdIdea, fourthIdea];
    const updatedIdeas = removeItemFromList(ideas, fourthIdea.id, 'previous_idea', 'next_idea');

    expect(updatedIdeas.length).toEqual(3);
    expect(updatedIdeas[0].id).toEqual(firstIdea.id);
    expect(updatedIdeas[0].next_idea).toEqual(secondIdea.id);
    expect(updatedIdeas[0].previous_idea).toBeNull();

    expect(updatedIdeas[1]).toEqual(secondIdea);
    expect(updatedIdeas[1].previous_idea).toEqual(firstIdea.id);
    expect(updatedIdeas[1].next_idea).toEqual(thirdIdea.id);

    expect(updatedIdeas[2]).toEqual(thirdIdea);
    expect(updatedIdeas[2].previous_idea).toBe(secondIdea.id);
    expect(updatedIdeas[2].next_idea).toBeNull();
  });

  it('should delete the third idea', () => {
    const ideas = [firstIdea, secondIdea, thirdIdea, fourthIdea];
    const updatedIdeas = removeItemFromList(ideas, secondIdea.id, 'previous_idea', 'next_idea');

    expect(updatedIdeas.length).toEqual(3);
    expect(updatedIdeas[0].id).toEqual(firstIdea.id);
    expect(updatedIdeas[0].next_idea).toEqual(thirdIdea.id);
    expect(updatedIdeas[0].previous_idea).toBeNull();

    expect(updatedIdeas[1]).toEqual(thirdIdea);
    expect(updatedIdeas[1].previous_idea).toEqual(firstIdea.id);
    expect(updatedIdeas[1].next_idea).toBeNull();

    expect(updatedIdeas[2]).toEqual(fourthIdea);
    expect(updatedIdeas[2].previous_idea).toBeNull();
    expect(updatedIdeas[2].next_idea).toBeNull();
  });

  it('should return empty array', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(null).build();
    let ideasArray1 = [idea1];

    ideasArray1 = removeItemFromList(ideasArray1, idea1.id, 'previous_idea', 'next_idea');

    expect(ideasArray1.length).toBe(0);
  });

  it('should return empty array', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(2).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(1).withNextIdea(null).build();
    let ideasArray1 = [idea1, idea2];

    ideasArray1 = removeItemFromList(ideasArray1, 4, 'previous_idea', 'next_idea');

    expect(ideasArray1.length).toBe(2);
  });
});
