import { ActivityEvent } from '../messages';

export class BrainstormRenameCategoryEvent extends ActivityEvent {
  event_name = 'BrainstormRenameCategoryEvent';

  constructor(category: number, name: string, board: number) {
    super();
    this.extra_args = { category: category, category_name: name, board: board };
  }
}

export class BrainstormCategoryRearrangeEvent extends ActivityEvent {
  event_name = 'BrainstormCategoryRearrangeEvent';

  constructor(category: number, previous_category: number, next_category: number) {
    super();
    this.extra_args = {
      category: category,
      previous_category: previous_category,
      next_category: next_category,
    };
  }
}

export class BrainstormCreateCategoryEvent extends ActivityEvent {
  event_name = 'BrainstormCreateCategoryEvent';

  constructor(category: string, board: number, previous_category: string) {
    super();
    this.extra_args = { category_name: category, board: board, previous_category };
  }
}

export class BrainstormRemoveCategoryEvent extends ActivityEvent {
  event_name = 'BrainstormRemoveCategoryEvent';

  constructor(catId: number, deleteIdeas: boolean) {
    super();
    this.extra_args = { category: catId, delete_ideas: deleteIdeas };
  }
}
