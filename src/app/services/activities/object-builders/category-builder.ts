import { Category, Idea } from '../../backend/schema';

export class CategoryBuilder {
  private category: Category = {
    id: 0,
    brainstormidea_set: [],
    category_name: '',
    removed: false,
    next_category: null,
    previous_category: null,
  };

  withId(id: number): CategoryBuilder {
    this.category.id = id;
    return this;
  }

  withBrainstormIdeas(brainstormidea_set: Array<Idea>): CategoryBuilder {
    this.category.brainstormidea_set = brainstormidea_set;
    return this;
  }

  withCategoryName(category_name: string): CategoryBuilder {
    this.category.category_name = category_name;
    return this;
  }

  withRemoved(removed: boolean): CategoryBuilder {
    this.category.removed = removed;
    return this;
  }

  withNextCategory(next_category: number): CategoryBuilder {
    this.category.next_category = next_category;
    return this;
  }

  withPreviousCategory(previous_category: number): CategoryBuilder {
    this.category.previous_category = previous_category;
    return this;
  }

  build(): Category {
    return this.category;
  }
}
