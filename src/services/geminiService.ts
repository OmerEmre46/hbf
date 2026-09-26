import { MatchData, StoryScript } from '../types/football';

export interface GenerateStoryParams {
  matchData: MatchData;
  focusTopic?: string;
  desiredDurationSec?: number;
  customNotes?: string;
}

export async function generateTacticalStory(params: GenerateStoryParams): Promise<{
  success: boolean;
  script: StoryScript;
  source: string;
  notice?: string;
}> {
  const response = await fetch('/api/generate-story', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}
