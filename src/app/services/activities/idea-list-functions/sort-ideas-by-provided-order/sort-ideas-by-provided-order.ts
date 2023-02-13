import { Idea, PostOrder } from 'src/app/services/backend/schema';

export function sortIdeasByProvidedOrder(ideas: Array<Idea>, orderArray: Array<PostOrder>): Array<Idea> {
  if (!orderArray || !orderArray.length) {
    return ideas;
  }

  orderArray = orderArray.sort((a, b) => a.order - b.order);

  const ideasIds = ideas.map((idea) => idea.id);
  const sortedOrderArray = orderArray.filter((order) => ideasIds.includes(order.ideaId));

  if (!sortedOrderArray.length) {
    return ideas;
  }

  const sortedIdeas = [];
  for (const order of sortedOrderArray) {
    const idea = ideas.find((i) => i.id === order.ideaId);
    if (idea) {
      sortedIdeas.push(idea);
    }
  }

  for (const idea of ideas) {
    if (!sortedIdeas.find((i) => i.id === idea.id)) {
      sortedIdeas.push(idea);
    }
  }

  return sortedIdeas;
}
