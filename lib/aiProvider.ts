import { MeshNode, MeshLink, MeshMessage } from './types';

export interface DigestInput {
  onlineNodesCount: number;
  offlineNodesCount: number;
  deliveredMessagesCount: number;
  queuedMessagesCount: number;
  activeLinksCount: number;
  recentMessages: Array<{ callsign: string; content: string; priority: string }>;
}

export interface DigestOutput {
  headline: string;
  summary: string;
  recommendedAction: string;
  source: 'ai' | 'deterministic_template';
  timestamp: string;
  disclaimer: string;
  rawInput: DigestInput;
}

export interface LinkExplainerInput {
  fromCallsign: string;
  toCallsign: string;
  distanceKm: number;
  status: 'online' | 'severed';
  clearanceM: number;
  lossMarginDb: number;
  fromElevM: number;
  toElevM: number;
  fromAntennaM: number;
  toAntennaM: number;
}

export interface LinkExplainerOutput {
  explanation: string;
  propagationDiagnosis: string;
  mitigationSuggestion: string;
  source: 'ai' | 'deterministic_template';
  timestamp: string;
  disclaimer: string;
  rawInput: LinkExplainerInput;
}

/**
 * Validates that an AI output does not invent numbers not found in the input.
 * Extracts all numbers from candidate text and checks against whitelist of input numbers.
 */
function validateNoHallucinatedNumbers(candidateText: string, inputNumbers: number[]): boolean {
  const numberRegex = /\b\d+(\.\d+)?\b/g;
  const matches = candidateText.match(numberRegex) || [];
  
  // Set of allowed numbers with reasonable tolerances
  const allowed = new Set<string>();
  inputNumbers.forEach(n => {
    allowed.add(n.toString());
    allowed.add(Math.round(n).toString());
    allowed.add(n.toFixed(1));
  });

  // Minor harmless indices like 1st, 2nd, etc. can be allowed, but unexpected tactical figures trigger fallback
  for (const match of matches) {
    const parsed = parseFloat(match);
    // Ignore small structural numbers (e.g. 1, 2) if in range
    if (parsed <= 3) continue;
    if (!allowed.has(match) && !allowed.has(Math.round(parsed).toString())) {
      // Found an invented number!
      return false;
    }
  }
  return true;
}

export interface AIProvider {
  generateDigest(input: DigestInput): Promise<DigestOutput>;
  explainLink(input: LinkExplainerInput): Promise<LinkExplainerOutput>;
}

export class MockProvider implements AIProvider {
  async generateDigest(input: DigestInput): Promise<DigestOutput> {
    const timestamp = new Date().toISOString();
    const disclaimer = 'AI-generated, unverified. Generated from synthetic telemetry.';

    // Deterministic rule-based template that never hallucinates
    const statusWord = input.offlineNodesCount === 0 ? 'NOMINAL' : 'DEGRADED';
    const queueWord = input.queuedMessagesCount === 0 
      ? 'All message buffers cleared.' 
      : `${input.queuedMessagesCount} packet(s) holding in local queue awaiting mesh relay.`;

    const headline = `MESH TOPOLOGY: ${statusWord} (${input.onlineNodesCount} ONLINE, ${input.activeLinksCount} ACTIVE LINKS)`;
    
    let summary = `Network operating with ${input.onlineNodesCount} active station(s) and ${input.activeLinksCount} operational line-of-sight link(s). ${queueWord}`;
    if (input.recentMessages.length > 0) {
      summary += ` Latest field report from ${input.recentMessages[0].callsign}: "${input.recentMessages[0].content}".`;
    }

    let recommendedAction = 'Maintain baseline patrol polling schedule.';
    if (input.offlineNodesCount > 0) {
      recommendedAction = `Investigate offline station(s). Maintain store-and-forward relay positions to clear queued traffic.`;
    }

    return {
      headline,
      summary,
      recommendedAction,
      source: 'deterministic_template',
      timestamp,
      disclaimer,
      rawInput: input,
    };
  }

  async explainLink(input: LinkExplainerInput): Promise<LinkExplainerOutput> {
    const timestamp = new Date().toISOString();
    const disclaimer = 'AI-generated, unverified. Calculated from synthetic DEM terrain model.';

    let explanation: string;
    let propagationDiagnosis: string;
    let mitigationSuggestion: string;

    if (input.status === 'online') {
      explanation = `Direct line-of-sight confirmed over ${input.distanceKm} km. Clearance margin: +${input.clearanceM} m above intervening ground.`;
      propagationDiagnosis = `First Fresnel zone is unobstructed by alpine ridge lines. Link margin is estimated at ${input.lossMarginDb} dB.`;
      mitigationSuggestion = 'Nominal propagation. No elevation or mast height adjustment necessary.';
    } else {
      explanation = `Link severed over ${input.distanceKm} km span. Mountain terrain breaches line-of-sight with a negative clearance of ${input.clearanceM} m.`;
      propagationDiagnosis = `Intervening ridge fold between ${input.fromCallsign} (${input.fromElevM}m) and ${input.toCallsign} (${input.toElevM}m) completely occludes RF path.`;
      mitigationSuggestion = `Deploy intermediate saddle relay or elevate mast by ${Math.abs(Math.round(input.clearanceM)) + 4} m.`;
    }

    return {
      explanation,
      propagationDiagnosis,
      mitigationSuggestion,
      source: 'deterministic_template',
      timestamp,
      disclaimer,
      rawInput: input,
    };
  }
}

export const aiProvider = new MockProvider();
