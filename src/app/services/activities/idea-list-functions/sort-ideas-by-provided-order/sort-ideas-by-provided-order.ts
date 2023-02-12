import { parseInt } from 'lodash';
import { Idea, PostOrder } from 'src/app/services/backend/schema';

export function sortIdeasByProvidedOrder(ideas: Array<Idea>, orderArray: Array<PostOrder>): Array<Idea> {
  if (!orderArray.length) {
    return ideas;
  }

  const ideasIds = ideas.map((idea) => idea.id);
  const sortedOrderArray = orderArray.filter((order) => ideasIds.includes(order.ideaId));

  if (!sortedOrderArray.length) {
    return ideas;
  }

  return ideas.sort((a, b) => {
    const orderA = orderArray.find((order) => order.ideaId === a.id);
    const orderB = orderArray.find((order) => order.ideaId === b.id);
    if (orderA && orderB) {
      return orderA.order - orderB.order;
    }
  });
}
