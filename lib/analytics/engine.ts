interface Member {
  id: string;
  display_name?: string | null;
  anonymous_id?: string;
  status?: string;
  survey_stage?: string;
}

interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  strength: number;
  direction?: string;
  source_confidence?: number;
}

interface NetworkMetrics {
  centrality: Map<string, number>;
  betweenness: Map<string, number>;
  inDegree: Map<string, number>;
  outDegree: Map<string, number>;
  clusters: Map<string, string[]>;
  bridges: string[];
  isolates: string[];
}

interface TribeAnalysis {
  totalMembers: number;
  completedSurveys: number;
  responseRate: number;
  networkMetrics: NetworkMetrics;
  trustGraph: Graph;
  collaborationGraph: Graph;
  influenceGraph: Graph;
  clusters: Cluster[];
  bridges: Member[];
  isolates: Member[];
  potentialBottlenecks: Member[];
  missingLinks: { source: string; target: string; reason: string }[];
  tensionHotspots: { members: string[]; strength: number }[];
  survey2Recommendations: { memberId: string; reason: string; priority: number }[];
  interviewShortlist: { memberId: string; reason: string }[];
  overallHealth: number;
  dataQuality: {
    completeness: number;
    confidence: number;
    gaps: string[];
  };
}

interface Graph {
  nodes: string[];
  edges: { source: string; target: string; weight: number }[];
}

interface Cluster {
  id: string;
  members: string[];
  density: number;
}

class GraphAnalyzer {
  private adjacencyList: Map<string, Map<string, number>>;
  private nodes: Set<string>;

  constructor(relationships: Relationship[]) {
    this.adjacencyList = new Map();
    this.nodes = new Set();

    for (const rel of relationships) {
      this.nodes.add(rel.source_id);
      this.nodes.add(rel.target_id);

      if (!this.adjacencyList.has(rel.source_id)) {
        this.adjacencyList.set(rel.source_id, new Map());
      }
      this.adjacencyList.get(rel.source_id)!.set(rel.target_id, rel.strength);
    }
  }

  calculateDegreeCentrality(): Map<string, number> {
    const centrality = new Map<string, number>();
    const maxPossible = this.nodes.size - 1;

    for (const node of this.nodes) {
      const neighbors = this.adjacencyList.get(node)?.size || 0;
      centrality.set(node, neighbors / maxPossible);
    }

    return centrality;
  }

  calculateInDegree(): Map<string, number> {
    const inDegree = new Map<string, number>();

    for (const node of this.nodes) {
      inDegree.set(node, 0);
    }

    for (const [source, targets] of this.adjacencyList) {
      for (const [target] of targets) {
        inDegree.set(target, (inDegree.get(target) || 0) + 1);
      }
    }

    return inDegree;
  }

  calculateOutDegree(): Map<string, number> {
    const outDegree = new Map<string, number>();

    for (const node of this.nodes) {
      outDegree.set(node, this.adjacencyList.get(node)?.size || 0);
    }

    return outDegree;
  }

  calculateBetweenness(): Map<string, number> {
    const betweenness = new Map<string, number>();

    for (const node of this.nodes) {
      betweenness.set(node, 0);
    }

    const nodeArray = Array.from(this.nodes);
    
    for (let i = 0; i < nodeArray.length; i++) {
      for (let j = i + 1; j < nodeArray.length; j++) {
        const source = nodeArray[i];
        const target = nodeArray[j];
        
        if (source === target) continue;

        const shortestPaths = this.findShortestPaths(source, target);
        
        if (shortestPaths.length > 0) {
          for (const path of shortestPaths) {
            for (let k = 1; k < path.length - 1; k++) {
              const current = path[k];
              const count = betweenness.get(current) || 0;
              betweenness.set(current, count + 1 / shortestPaths.length);
            }
          }
        }
      }
    }

    const n = this.nodes.size;
    const normalization = ((n - 1) * (n - 2)) / 2;
    
    for (const [node, value] of betweenness) {
      betweenness.set(node, value / normalization);
    }

    return betweenness;
  }

  private findShortestPaths(source: string, target: string): string[][] {
    const paths: string[][] = [];
    const queue: { node: string; path: string[] }[] = [{ node: source, path: [source] }];
    let minLength = Infinity;

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;

      if (path.length > minLength) continue;
      if (node === target) {
        paths.push(path);
        minLength = path.length;
        continue;
      }

      const neighbors = this.adjacencyList.get(node);
      if (neighbors) {
        for (const [neighbor] of neighbors) {
          if (!path.includes(neighbor)) {
            queue.push({ node: neighbor, path: [...path, neighbor] });
          }
        }
      }
    }

    return paths;
  }

  detectClusters(): Cluster[] {
    const clusters: Cluster[] = [];
    const visited = new Set<string>();
    let clusterId = 0;

    const getNeighbors = (node: string): string[] => {
      const neighbors: string[] = [];
      const adj = this.adjacencyList.get(node);
      if (adj) {
        for (const [n] of adj) {
          neighbors.push(n);
        }
      }
      return neighbors;
    };

    for (const startNode of this.nodes) {
      if (visited.has(startNode)) continue;

      const cluster: string[] = [];
      const queue = [startNode];

      while (queue.length > 0) {
        const node = queue.shift()!;
        if (visited.has(node)) continue;
        
        visited.add(node);
        cluster.push(node);

        const neighbors = getNeighbors(node);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }

      if (cluster.length > 0) {
        const density = this.calculateClusterDensity(cluster);
        clusters.push({
          id: `cluster_${clusterId++}`,
          members: cluster,
          density
        });
      }
    }

    return clusters;
  }

  private calculateClusterDensity(members: string[]): number {
    let edges = 0;
    const possibleEdges = (members.length * (members.length - 1)) / 2;

    if (possibleEdges === 0) return 0;

    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const adj = this.adjacencyList.get(members[i]);
        if (adj?.has(members[j])) {
          edges++;
        }
      }
    }

    return edges / possibleEdges;
  }

  findBridges(): string[] {
    const bridges: string[] = [];
    const betweenness = this.calculateBetweenness();
    const degree = this.calculateDegreeCentrality();

    const thresholdBetweenness = 0.3;
    const thresholdDegree = 0.2;

    for (const [node, bw] of betweenness) {
      const d = degree.get(node) || 0;
      if (bw > thresholdBetweenness && d > thresholdDegree) {
        bridges.push(node);
      }
    }

    return bridges;
  }

  findIsolates(): string[] {
    const isolates: string[] = [];
    const inDegree = this.calculateInDegree();
    const outDegree = this.calculateOutDegree();

    for (const node of this.nodes) {
      const inD = inDegree.get(node) || 0;
      const outD = outDegree.get(node) || 0;
      
      if (inD + outD <= 1) {
        isolates.push(node);
      }
    }

    return isolates;
  }

  getGraph(): Graph {
    const edges: { source: string; target: string; weight: number }[] = [];
    
    for (const [source, targets] of this.adjacencyList) {
      for (const [target, weight] of targets) {
        edges.push({ source, target, weight });
      }
    }

    return {
      nodes: Array.from(this.nodes),
      edges
    };
  }
}

export function analyzeTribe(
  members: Member[],
  relationships: Relationship[],
  surveyResponses: any[]
): TribeAnalysis {
  const activeMembers = members.filter(m => m.status !== 'exited');
  const completedCount = activeMembers.filter(m => m.status === 'completed').length;
  
  // Group relationships by type
  const trustRels = relationships.filter(r => r.relationship_type === 'trust');
  const collabRels = relationships.filter(r => r.relationship_type === 'collaboration');
  const influenceRels = relationships.filter(r => r.relationship_type === 'influence');
  const conflictRels = relationships.filter(r => r.relationship_type === 'conflict');

  // Analyze each relationship type
  const trustGraph = new GraphAnalyzer(trustRels);
  const collabGraph = new GraphAnalyzer(collabRels);
  const influenceGraph = new GraphAnalyzer(influenceRels);

  const trustMetrics = {
    centrality: trustGraph.calculateDegreeCentrality(),
    betweenness: trustGraph.calculateBetweenness(),
    inDegree: trustGraph.calculateInDegree(),
    outDegree: trustGraph.calculateOutDegree(),
    clusters: new Map(trustGraph.detectClusters().map(c => [c.id, c.members])),
    bridges: trustGraph.findBridges(),
    isolates: trustGraph.findIsolates()
  };

  const collabMetrics = {
    centrality: collabGraph.calculateDegreeCentrality(),
    betweenness: collabGraph.calculateBetweenness(),
    inDegree: collabGraph.calculateInDegree(),
    outDegree: collabGraph.calculateOutDegree(),
    clusters: new Map(collabGraph.detectClusters().map(c => [c.id, c.members])),
    bridges: collabGraph.findBridges(),
    isolates: collabGraph.findIsolates()
  };

  const clusters = trustGraph.detectClusters();
  const bridges = [...new Set([...trustMetrics.bridges, ...collabMetrics.bridges])];
  const isolates = [...new Set([...trustMetrics.isolates, ...collabMetrics.isolates])];

  // Find potential bottlenecks (high betweenness in multiple graphs)
  const bottleneckCandidates: { id: string; count: number }[] = [];
  for (const member of activeMembers) {
    let count = 0;
    if (trustMetrics.betweenness.get(member.id)! > 0.3) count++;
    if (collabMetrics.betweenness.get(member.id)! > 0.3) count++;
    if (influenceGraph.calculateBetweenness().get(member.id)! > 0.3) count++;
    if (count >= 2) {
      bottleneckCandidates.push({ id: member.id, count });
    }
  }
  bottleneckCandidates.sort((a, b) => b.count - a.count);
  const potentialBottlenecks = bottleneckCandidates.slice(0, 3).map(b => 
    members.find(m => m.id === b.id)!
  );

  // Find missing links (members with low connectivity who could bridge clusters)
  const missingLinks: { source: string; target: string; reason: string }[] = [];
  for (const member of activeMembers) {
    const trustD = trustMetrics.outDegree.get(member.id) || 0;
    if (trustD < 2) {
      for (const cluster of clusters) {
        if (!cluster.members.includes(member.id) && cluster.density > 0.5) {
          missingLinks.push({
            source: member.id,
            target: cluster.id,
            reason: 'Low trust connections, could bridge to dense cluster'
          });
        }
      }
    }
  }

  // Find tension hotspots (conflict relationships + low trust)
  const tensionHotspots: { members: string[]; strength: number }[] = [];
  for (const conflict of conflictRels) {
    const trustSource = trustRels.find(r => r.source_id === conflict.source_id && r.target_id === conflict.target_id);
    if (!trustSource) {
      tensionHotspots.push({
        members: [conflict.source_id, conflict.target_id],
        strength: conflict.strength
      });
    }
  }

  // Survey 2 recommendations
  const survey2Recommendations: { memberId: string; reason: string; priority: number }[] = [];
  
  for (const member of activeMembers) {
    const nominationsReceived = trustRels.filter(r => r.target_id === member.id).length;
    const nominationsGiven = trustRels.filter(r => r.source_id === member.id).length;
    const reciprocationRate = nominationsReceived > 0 ? nominationsGiven / nominationsReceived : 0;

    if (nominationsReceived >= 3 && reciprocationRate < 0.5) {
      survey2Recommendations.push({
        memberId: member.id,
        reason: 'High centrality but low trust reciprocation - investigate bridging role',
        priority: 1
      });
    }

    const memberHasRelationships = relationships.some(r => r.source_id === member.id);
    if (member.status === 'completed' && !memberHasRelationships) {
      survey2Recommendations.push({
        memberId: member.id,
        reason: 'Completed survey but no relationship nominations - missing data',
        priority: 2
      });
    }

    const trustAsymmetry = trustRels.some(r => 
      r.source_id === member.id && 
      !trustRels.some(r2 => r2.source_id === r.target_id && r2.target_id === member.id)
    );
    if (trustAsymmetry) {
      survey2Recommendations.push({
        memberId: member.id,
        reason: 'Unilateral trust detected - validate relationship reciprocity',
        priority: 3
      });
    }
  }

  survey2Recommendations.sort((a, b) => a.priority - b.priority);

  // Interview shortlist
  const interviewShortlist: { memberId: string; reason: string }[] = [];
  
  for (const rec of survey2Recommendations) {
    if (rec.priority === 1 && activeMembers.find(m => m.id === rec.memberId)) {
      interviewShortlist.push({
        memberId: rec.memberId,
        reason: rec.reason
      });
    }
  }

  // Calculate overall health from survey responses
  const healthResponses = surveyResponses.filter(r => r.question_id === 'e1_health');
  const healthScores = healthResponses.map(r => parseInt(r.answer_value)).filter(s => !isNaN(s));
  const overallHealth = healthScores.length > 0 
    ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length 
    : 3;

  // Data quality assessment
  const expectedResponses = activeMembers.length * 17; // 17 questions in Survey 1
  const actualResponses = surveyResponses.filter(r => r.survey_type === 'survey1').length;
  const completeness = expectedResponses > 0 ? actualResponses / expectedResponses : 0;
  
  const highConfidenceResponses = surveyResponses.filter(r => r.answer_type === 'nominate').length;
  const confidence = completeness > 0.7 && highConfidenceResponses > expectedResponses * 0.3 ? 0.8 : 0.5;

  const gaps: string[] = [];
  if (completeness < 0.5) gaps.push('Low survey completion rate');
  if (isolates.length > activeMembers.length * 0.3) gaps.push('High number of isolates');
  if (clusters.length > 5) gaps.push('Possible fragmentation (many clusters)');
  if (tensionHotspots.length > 3) gaps.push('Multiple tension hotspots detected');

  return {
    totalMembers: members.length,
    completedSurveys: completedCount,
    responseRate: members.length > 0 ? completedCount / members.length : 0,
    networkMetrics: trustMetrics as NetworkMetrics,
    trustGraph: trustGraph.getGraph(),
    collaborationGraph: collabGraph.getGraph(),
    influenceGraph: influenceGraph.getGraph(),
    clusters,
    bridges: bridges.map(id => members.find(m => m.id === id)!).filter(Boolean),
    isolates: isolates.map(id => members.find(m => m.id === id)!).filter(Boolean),
    potentialBottlenecks,
    missingLinks,
    tensionHotspots,
    survey2Recommendations,
    interviewShortlist,
    overallHealth,
    dataQuality: {
      completeness,
      confidence,
      gaps
    }
  };
}

export function calculateMemberScore(memberId: string, relationships: Relationship[]): number {
  const trustRels = relationships.filter(r => 
    (r.source_id === memberId || r.target_id === memberId) && 
    r.relationship_type === 'trust'
  );
  
  const collabRels = relationships.filter(r => 
    (r.source_id === memberId || r.target_id === memberId) && 
    r.relationship_type === 'collaboration'
  );
  
  const influenceRels = relationships.filter(r => 
    (r.source_id === memberId || r.target_id === memberId) && 
    r.relationship_type === 'influence'
  );

  const scores = {
    trust: trustRels.length * 1.0,
    collaboration: collabRels.length * 0.8,
    influence: influenceRels.length * 1.2
  };

  return (scores.trust + scores.collaboration + scores.influence) / 10;
}

export function detectTriads(relationships: Relationship[]): { closed: number; open: number } {
  const trustRels = relationships.filter(r => r.relationship_type === 'trust');
  const adj = new Map<string, Set<string>>();
  
  for (const r of trustRels) {
    if (!adj.has(r.source_id)) adj.set(r.source_id, new Set());
    if (!adj.has(r.target_id)) adj.set(r.target_id, new Set());
    adj.get(r.source_id)!.add(r.target_id);
    adj.get(r.target_id)!.add(r.source_id);
  }

  let closed = 0;
  let open = 0;

  for (const [a, neighborsA] of adj) {
    for (const b of neighborsA) {
      if (b <= a) continue;
      for (const c of neighborsA) {
        if (c <= b || c <= a) continue;
        const neighborsB = adj.get(b);
        const neighborsC = adj.get(c);
        
        if (neighborsB?.has(c)) closed++;
        else if (neighborsC?.has(b)) closed++;
        else open++;
      }
    }
  }

  return { closed, open };
}
