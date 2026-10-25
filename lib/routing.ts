import { MeshNode, MeshLink, MeshMessage } from './types';

export interface RouteResult {
  path: string[]; // sequence of node IDs
  hops: number;
  reachable: boolean;
  distanceKm: number;
}

/**
 * Executes Breadth-First Search (BFS) over active links to find the shortest hop path.
 */
export function findShortestRoute(
  startNodeId: string,
  targetNodeId: string,
  nodes: MeshNode[],
  links: MeshLink[]
): RouteResult {
  if (startNodeId === targetNodeId) {
    return { path: [startNodeId], hops: 0, reachable: true, distanceKm: 0 };
  }

  // Build adjacency list only for links that are 'online'
  const adj = new Map<string, Array<{ to: string; dist: number }>>();
  nodes.forEach(n => adj.set(n.id, []));

  links.forEach(link => {
    if (link.status === 'online') {
      adj.get(link.fromId)?.push({ to: link.toId, dist: link.distanceKm });
      adj.get(link.toId)?.push({ to: link.fromId, dist: link.distanceKm });
    }
  });

  const queue: Array<{ id: string; path: string[]; dist: number }> = [
    { id: startNodeId, path: [startNodeId], dist: 0 }
  ];
  const visited = new Set<string>([startNodeId]);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.id === targetNodeId) {
      return {
        path: current.path,
        hops: current.path.length - 1,
        reachable: true,
        distanceKm: Math.round(current.dist * 100) / 100,
      };
    }

    const neighbors = adj.get(current.id) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.to)) {
        visited.add(neighbor.to);
        queue.push({
          id: neighbor.to,
          path: [...current.path, neighbor.to],
          dist: current.dist + neighbor.dist,
        });
      }
    }
  }

  return {
    path: [],
    hops: 0,
    reachable: false,
    distanceKm: 0,
  };
}

/**
 * Returns immediate neighbors of a node along with link statuses.
 */
export function getNeighbors(nodeId: string, links: MeshLink[]): Array<{ neighborId: string; link: MeshLink }> {
  const neighbors: Array<{ neighborId: string; link: MeshLink }> = [];
  links.forEach(l => {
    if (l.fromId === nodeId) {
      neighbors.push({ neighborId: l.toId, link: l });
    } else if (l.toId === nodeId) {
      neighbors.push({ neighborId: l.fromId, link: l });
    }
  });
  return neighbors;
}

/**
 * Re-evaluates store-and-forward message queue upon any network topology change.
 * If a queued message now has a viable route to its destination, marks it as 'delivered'.
 */
export function processMessageQueue(
  messages: MeshMessage[],
  nodes: MeshNode[],
  links: MeshLink[]
): { updatedMessages: MeshMessage[]; newlyDeliveredCount: number } {
  let newlyDeliveredCount = 0;

  const updatedMessages = messages.map(msg => {
    if (msg.status === 'delivered') return msg;

    const route = findShortestRoute(msg.fromId, msg.toId, nodes, links);
    if (route.reachable) {
      newlyDeliveredCount++;
      return {
        ...msg,
        status: 'delivered' as const,
        hops: route.path,
        deliveredAtIso: new Date().toISOString(),
      };
    }
    return msg;
  });

  return { updatedMessages, newlyDeliveredCount };
}
