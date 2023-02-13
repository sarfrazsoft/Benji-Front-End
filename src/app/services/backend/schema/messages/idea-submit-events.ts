import { ActivityEvent } from '../messages';

export class BrainstormSubmitEvent extends ActivityEvent {
  event_name = 'BrainstormSubmitEvent';

  constructor(idea: {
    id: number;
    text: string;
    title: string;
    category: number;
    groupId: number;
    idea_image: number;
    image_path?: string;
    idea_video: number;
    meta: any;
    next_idea: number;
    previous_idea: number;
  }) {
    super();
    this.extra_args = {
      idea: idea.text,
      title: idea.title,
      category: idea.category,
      group_id: idea.groupId,
      idea_image: idea.idea_image,
      image_path: idea.image_path,
      meta: idea.meta,
      next_idea: idea.next_idea,
      previous_idea: idea.previous_idea,
    };
  }
}

export class BrainstormSubmitVideoEvent extends ActivityEvent {
  event_name = 'BrainstormSubmitEvent';

  constructor(idea: {
    id: number;
    text: string;
    title: string;
    category: number;
    idea_video: number;
    next_idea: number;
    previous_idea: number;
  }) {
    super();
    this.extra_args = {
      id: idea.id,
      idea: idea.text,
      title: idea.title,
      category: idea.category,
      idea_video: idea.idea_video,
      next_idea: idea.next_idea,
      previous_idea: idea.previous_idea,
    };
  }
}

export class BrainstormEditIdeaVideoSubmitEvent extends ActivityEvent {
  event_name = 'BrainstormEditIdeaSubmitEvent';

  constructor(idea: {
    id: number;
    text: string;
    title: string;
    category: number;
    idea_video: number;
    next_idea: number;
    previous_idea: number;
  }) {
    super();
    this.extra_args = {
      brainstormidea: idea.id,
      idea: idea.text,
      title: idea.title,
      category: idea.category,
      idea_video: idea.idea_video,
      next_idea: idea.next_idea,
      previous_idea: idea.previous_idea,
    };
  }
}

export class BrainstormSubmitDocumentEvent extends ActivityEvent {
  event_name = 'BrainstormSubmitEvent';

  constructor(idea: {
    text: string;
    title: string;
    category: number;
    documentId: number;
    next_idea: number;
    previous_idea: number;
  }) {
    super();
    this.extra_args = {
      idea: idea.text,
      title: idea.title,
      category: idea.category,
      idea_document: idea.documentId,
      next_idea: idea.next_idea,
      previous_idea: idea.previous_idea,
    };
  }
}

export class BrainstormEditDocumentIdeaEvent extends ActivityEvent {
  event_name = 'BrainstormEditIdeaSubmitEvent';

  constructor(idea: {
    id: string;
    text: string;
    title: string;
    category: number;
    documentId: number;
    next_idea: number;
    previous_idea: number;
  }) {
    super();
    this.extra_args = {
      brainstormidea: idea.id,
      idea: idea.text,
      title: idea.title,
      category: idea.category,
      idea_document: idea.documentId,
      previous_idea: idea.previous_idea,
      next_idea: idea.next_idea,
    };
  }
}

export class BrainstormEditIdeaSubmitEvent extends ActivityEvent {
  event_name = 'BrainstormEditIdeaSubmitEvent';

  constructor(idea: {
    id: number;
    text: string;
    title: string;
    category: number;
    groupId: number;
    idea_image?: number;
    image_path?: string;
    meta?: any;
    next_idea: number;
    previous_idea: number;
  }) {
    super();
    this.extra_args = {
      brainstormidea: idea.id,
      idea: idea.text,
      title: idea.title,
      category: idea.category,
      group_id: idea.groupId,
      idea_image: idea.idea_image,
      image_path: idea.image_path,
      meta: idea.meta,
      previous_idea: idea.previous_idea,
      next_idea: idea.next_idea,
    };
  }
}
