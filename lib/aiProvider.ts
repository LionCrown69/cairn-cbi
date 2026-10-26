import { MeshNode, MeshLink, MeshMessage } from './types';

export interface DigestInput {
  onlineNodesCount: number;
  offlineNodesCount: number;
  deliveredMessagesCount: number;
  queuedMessagesCount: number;
  activeLinksCount: number;
  recentMessages: Array<{ callsign: string; content: string; priority: string }>;
  question?: string;
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
export function validateNoHallucinatedNumbers(candidateText: string, inputNumbers: number[]): boolean {
  const numberRegex = /\b\d+(\.\d+)?\b/g;
  const matches = candidateText.match(numberRegex) || [];
  
  // Set of allowed numbers with reasonable tolerances
  const allowed = new Set<string>();
  inputNumbers.forEach(n => {
    if (typeof n !== 'number' || isNaN(n)) return;
    allowed.add(n.toString());
    allowed.add(Math.abs(n).toString());
    allowed.add(Math.round(n).toString());
    allowed.add(Math.abs(Math.round(n)).toString());
    allowed.add(n.toFixed(1));
    allowed.add(Math.abs(n).toFixed(1));
  });

  // Minor harmless indices like 1st, 2nd, 3rd, or 0 can be allowed
  for (const match of matches) {
    const parsed = parseFloat(match);
    if (parsed <= 3) continue;
    if (
      !allowed.has(match) &&
      !allowed.has(Math.round(parsed).toString()) &&
      !allowed.has(Math.abs(Math.round(parsed)).toString())
    ) {
      console.warn(`[AI Guardrail Alert] Disallowed number detected: "${match}". Allowed numbers:`, Array.from(allowed).join(', '));
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
    const disclaimer = 'Calculated from synthetic DEM terrain model.';

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

/**
 * Live Google Gemini AI Provider with numeric whitelist guardrails & deterministic fallback
 */
export class GeminiAIProvider implements AIProvider {
  private apiKey: string;
  private fallbackProvider: MockProvider;
  private modelName = 'gemini-2.5-flash';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fallbackProvider = new MockProvider();
  }

  private async callGemini(systemInstruction: string, prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini returned empty candidate');
    }
    return candidateText;
  }

  async generateDigest(input: DigestInput): Promise<DigestOutput> {
    const systemPrompt = `You are the CAIRN Alpine Situational Intelligence Engine for mountain search and rescue.
Strict rules:
1. ONLY utilize facts in the <telemetry_input> matrix.
2. DO NOT invent, hallucinate, or alter any numbers, coordinates, frequencies, or casualty metrics.
3. Respond ONLY in valid JSON matching this schema:
{
  "headline": string,
  "summary": string,
  "recommendedAction": string
}`;

    const prompt = `<telemetry_input>
Online Stations: ${input.onlineNodesCount}
Offline Stations: ${input.offlineNodesCount}
Active Links: ${input.activeLinksCount}
Delivered Messages: ${input.deliveredMessagesCount}
Queued Messages: ${input.queuedMessagesCount}
Recent Field Messages: ${JSON.stringify(input.recentMessages)}
${input.question ? `Operator Question: "${input.question}"\nPlease directly analyze and answer this question based on the telemetry above.` : ''}
</telemetry_input>`;

    try {
      const rawJson = await this.callGemini(systemPrompt, prompt);
      const parsed = JSON.parse(rawJson);

      // Validate numeric guardrails against hallucinated figures
      const whitelistedNumbers = [
        input.onlineNodesCount,
        input.offlineNodesCount,
        input.activeLinksCount,
        input.deliveredMessagesCount,
        input.queuedMessagesCount,
      ];

      if (input.question) {
        const qNums = input.question.match(/\b\d+(\.\d+)?\b/g) || [];
        qNums.forEach(n => whitelistedNumbers.push(parseFloat(n)));
      }

      input.recentMessages.forEach(msg => {
        const nums = msg.content.match(/\b\d+(\.\d+)?\b/g) || [];
        nums.forEach(n => whitelistedNumbers.push(parseFloat(n)));
      });

      const combinedText = `${parsed.headline} ${parsed.summary} ${parsed.recommendedAction}`;
      const isValid = validateNoHallucinatedNumbers(combinedText, whitelistedNumbers);

      if (!isValid) {
        console.warn('[AI Guardrail Alert] Gemini output contained numbers not in input telemetry. Falling back to deterministic template.');
        const fallback = await this.fallbackProvider.generateDigest(input);
        return {
          ...fallback,
          disclaimer: 'Deterministic fallback: AI output contained ungrounded numeric metrics.',
        };
      }

      return {
        headline: parsed.headline,
        summary: parsed.summary,
        recommendedAction: parsed.recommendedAction,
        source: 'ai',
        timestamp: new Date().toISOString(),
        disclaimer: 'Live AI analysis via Google Gemini 2.5 with verified telemetry guardrails.',
        rawInput: input,
      };
    } catch (err) {
      console.warn('[AI Provider Warning] Gemini call failed, falling back to deterministic template:', err);
      const fallback = await this.fallbackProvider.generateDigest(input);
      return {
        ...fallback,
        disclaimer: 'Deterministic template (Gemini API fallback).',
      };
    }
  }

  async explainLink(input: LinkExplainerInput): Promise<LinkExplainerOutput> {
    const systemPrompt = `You are the CAIRN Alpine RF Line-of-Sight propagation specialist.
Analyze mountain terrain obstruction between stations strictly based on <link_geometry>.
Operating frequency is 915 MHz.
Strict rules:
1. ONLY utilize numbers provided in <link_geometry> (elevations, span distance, clearance, antenna mast heights, or 915 MHz). DO NOT invent fictitious coordinates, dB values, or frequencies.
2. Return ONLY JSON:
{
  "explanation": string,
  "propagationDiagnosis": string,
  "mitigationSuggestion": string
}`;

    const prompt = `<link_geometry>
RF Band: 915 MHz LoRa / FSK
From: ${input.fromCallsign} (${input.fromElevM}m elevation, ${input.fromAntennaM}m mast)
To: ${input.toCallsign} (${input.toElevM}m elevation, ${input.toAntennaM}m mast)
Span Distance: ${input.distanceKm} km
Link Status: ${input.status}
Clearance Margin: ${input.clearanceM} m
Fresnel Loss Margin: ${input.lossMarginDb} dB
</link_geometry>`;

    try {
      const rawJson = await this.callGemini(systemPrompt, prompt);
      const parsed = JSON.parse(rawJson);

      const whitelistedNumbers = [
        915,
        0,
        input.distanceKm,
        input.clearanceM,
        Math.abs(input.clearanceM),
        input.lossMarginDb,
        input.fromElevM,
        input.toElevM,
        input.fromAntennaM,
        input.toAntennaM,
      ];

      const combinedText = `${parsed.explanation} ${parsed.propagationDiagnosis} ${parsed.mitigationSuggestion}`;
      const isValid = validateNoHallucinatedNumbers(combinedText, whitelistedNumbers);

      if (!isValid) {
        console.warn('[AI Guardrail Alert] Link explanation contained ungrounded numbers. Falling back to deterministic template.');
        const fallback = await this.fallbackProvider.explainLink(input);
        return {
          ...fallback,
          disclaimer: 'Deterministic fallback: AI output contained ungrounded numbers.',
        };
      }

      return {
        explanation: parsed.explanation,
        propagationDiagnosis: parsed.propagationDiagnosis,
        mitigationSuggestion: parsed.mitigationSuggestion,
        source: 'ai',
        timestamp: new Date().toISOString(),
        disclaimer: 'Live RF analysis via Google Gemini 2.5 with verified DEM geometry.',
        rawInput: input,
      };
    } catch (err) {
      console.warn('[AI Provider Warning] Gemini link explainer call failed, falling back:', err);
      return this.fallbackProvider.explainLink(input);
    }
  }
}

// Select active provider based on environment
const geminiKey = process.env.GEMINI_API_KEY;
export const aiProvider: AIProvider = geminiKey ? new GeminiAIProvider(geminiKey) : new MockProvider();
