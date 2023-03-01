import { Idea } from '../../../backend/schema';
import { IdeaBuilder } from '../../object-builders/idea-builder';
import { pushItemIntoList } from './push-item-into-list';

describe('pushItemIntoList', () => {
  let ideaBuilder: IdeaBuilder;
  let idea: Idea;
  let ideasArray: Array<Idea>;

  beforeEach(() => {
    ideaBuilder = new IdeaBuilder();
    idea = ideaBuilder.withId(1).build();
    ideasArray = [];
  });

  it('should add the idea to the array', () => {
    const newArr = pushItemIntoList(ideasArray, idea, 'previous_idea', 'next_idea');
    expect(newArr.length).toBe(1);
    expect(newArr[0].id).toBe(idea.id);
  });

  it('should add the idea at the end of array and update existing idea', () => {
    const idea1 = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(null).build();
    const idea2 = new IdeaBuilder().withId(2).withPreviousIdea(idea.id).withNextIdea(null).build();

    let newArr = pushItemIntoList(ideasArray, idea1, 'previous_idea', 'next_idea');
    newArr = pushItemIntoList(newArr, idea2, 'previous_idea', 'next_idea');

    expect(newArr.length).toBe(2);
    expect(newArr[0].id).toBe(idea1.id);
    expect(newArr[0].next_idea).toBe(idea2.id);

    expect(newArr[1].id).toBe(idea2.id);
    expect(newArr[1].previous_idea).toBe(idea1.id);
    expect(newArr[1].next_idea).toBe(null);
  });

  it('should add the idea in the middle of the array', () => {
    const firstIdea = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(null).build();
    const lastIdea = new IdeaBuilder().withId(2).withPreviousIdea(firstIdea.id).withNextIdea(null).build();

    const middleIdea = new IdeaBuilder()
      .withId(3)
      .withPreviousIdea(firstIdea.id)
      .withNextIdea(lastIdea.id)
      .build();

    let newArr = pushItemIntoList(ideasArray, firstIdea, 'previous_idea', 'next_idea');
    newArr = pushItemIntoList(newArr, lastIdea, 'previous_idea', 'next_idea');
    newArr = pushItemIntoList(newArr, middleIdea, 'previous_idea', 'next_idea');

    expect(newArr.length).toBe(3);
    expect(newArr[0].id).toBe(firstIdea.id);
    expect(newArr[0].next_idea).toBe(middleIdea.id);
    expect(newArr[0].previous_idea).toBe(null);

    expect(newArr[1].id).toBe(middleIdea.id);
    expect(newArr[1].previous_idea).toBe(firstIdea.id);
    expect(newArr[1].next_idea).toBe(lastIdea.id);

    expect(newArr[2].id).toBe(lastIdea.id);
    expect(newArr[2].previous_idea).toBe(middleIdea.id);
    expect(newArr[2].next_idea).toBe(null);
  });

  it('should add the idea at the start of the array', () => {
    const firstIdea = new IdeaBuilder().withId(1).withPreviousIdea(null).withNextIdea(null).build();
    const lastIdea = new IdeaBuilder().withId(2).withPreviousIdea(firstIdea.id).withNextIdea(null).build();

    const middleIdea = new IdeaBuilder()
      .withId(3)
      .withPreviousIdea(firstIdea.id)
      .withNextIdea(lastIdea.id)
      .build();

    const smallestAddedIdea = new IdeaBuilder().withId(4).withPreviousIdea(null).withNextIdea(1).build();

    pushItemIntoList(ideasArray, firstIdea, 'previous_idea', 'next_idea');
    pushItemIntoList(ideasArray, lastIdea, 'previous_idea', 'next_idea');
    pushItemIntoList(ideasArray, middleIdea, 'previous_idea', 'next_idea');
    pushItemIntoList(ideasArray, smallestAddedIdea, 'previous_idea', 'next_idea');

    // response should be
    // [smallestAddedIdea, fistIdea, middleIdea, lastIdea]

    expect(ideasArray.length).toBe(4);

    expect(ideasArray[0].id).toBe(smallestAddedIdea.id);
    expect(ideasArray[0].next_idea).toBe(firstIdea.id);
    expect(ideasArray[0].previous_idea).toBe(null);

    expect(ideasArray[1].id).toBe(firstIdea.id);
    expect(ideasArray[1].next_idea).toBe(middleIdea.id);
    expect(ideasArray[1].previous_idea).toBe(smallestAddedIdea.id);

    expect(ideasArray[2].id).toBe(middleIdea.id);
    expect(ideasArray[2].previous_idea).toBe(firstIdea.id);
    expect(ideasArray[2].next_idea).toBe(lastIdea.id);

    expect(ideasArray[3].id).toBe(lastIdea.id);
    expect(ideasArray[3].previous_idea).toBe(middleIdea.id);
    expect(ideasArray[3].next_idea).toBe(null);
  });
});
