import { Category, Idea, IdeaComment, IdeaDocument, IdeaHeart, ParticipantCode } from '../../backend/schema';

export class IdeaBuilder {
  private idea: Idea = {
    id: 0,
    num_votes: 0,
    idea: '',
    title: '',
    removed: false,
    submitting_participant: null,
    idea_image: null,
    showClose: false,
    pinned: false,
    editing: false,
    addingIdea: false,
    comments: [],
    hearts: [],
    version: 0,
    time: '',
    idea_document: null,
    idea_video: null,
    meta: null,
    next_idea: null,
    previous_idea: null,
  };

  withId(id: number): IdeaBuilder {
    this.idea.id = id;
    return this;
  }

  withNumVotes(num_votes: number): IdeaBuilder {
    this.idea.num_votes = num_votes;
    return this;
  }

  withIdea(idea: string): IdeaBuilder {
    this.idea.idea = idea;
    return this;
  }

  withTitle(title: string): IdeaBuilder {
    this.idea.title = title;
    return this;
  }

  withRemoved(removed: boolean): IdeaBuilder {
    this.idea.removed = removed;
    return this;
  }

  withSubmittingParticipant(submitting_participant: ParticipantCode): IdeaBuilder {
    this.idea.submitting_participant = submitting_participant;
    return this;
  }

  withIdeaImage(idea_image: IdeaDocument): IdeaBuilder {
    this.idea.idea_image = idea_image;
    return this;
  }

  withShowClose(showClose: boolean): IdeaBuilder {
    this.idea.showClose = showClose;
    return this;
  }

  withPinned(pinned: boolean): IdeaBuilder {
    this.idea.pinned = pinned;
    return this;
  }

  withEditing(editing: boolean): IdeaBuilder {
    this.idea.editing = editing;
    return this;
  }

  withAddingIdea(addingIdea: boolean): IdeaBuilder {
    this.idea.addingIdea = addingIdea;
    return this;
  }

  withComments(comments: Array<IdeaComment>): IdeaBuilder {
    this.idea.comments = comments;
    return this;
  }

  withHearts(hearts: Array<IdeaHeart>): IdeaBuilder {
    this.idea.hearts = hearts;
    return this;
  }

  withVersion(version: number): IdeaBuilder {
    this.idea.version = version;
    return this;
  }

  withTime(time: string): IdeaBuilder {
    this.idea.time = time;
    return this;
  }

  withIdeaDocument(idea_document: IdeaDocument): IdeaBuilder {
    this.idea.idea_document = idea_document;
    return this;
  }
  withIdeaVideo(idea_video: IdeaDocument): IdeaBuilder {
    this.idea.idea_video = idea_video;
    return this;
  }

  withMeta(meta: any): IdeaBuilder {
    this.idea.meta = meta;
    return this;
  }

  withNextIdea(next_idea: number): IdeaBuilder {
    this.idea.next_idea = next_idea;
    return this;
  }

  withPreviousIdea(previous_idea: number): IdeaBuilder {
    this.idea.previous_idea = previous_idea;
    return this;
  }

  build(): Idea {
    return this.idea;
  }
}
