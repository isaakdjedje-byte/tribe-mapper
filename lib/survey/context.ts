// Survey Context Model for TribeMapper
// Defines how survey wording and modules adapt to different social contexts

export type SurveyContext = 'friends' | 'family' | 'tribe';

export interface ContextConfig {
  id: SurveyContext;
  label: string;
  labelFr: string;
  groupLabel: string;
  groupLabelFr: string;
  warmth: number; // 1-10 scale for tone adjustment
  tone: 'intimate' | 'warm' | 'structured';
}

export const CONTEXT_CONFIGS: Record<SurveyContext, ContextConfig> = {
  friends: {
    id: 'friends',
    label: 'Friends',
    labelFr: 'Amis',
    groupLabel: 'group of friends',
    groupLabelFr: 'groupe d\'amis',
    warmth: 9,
    tone: 'intimate'
  },
  family: {
    id: 'family',
    label: 'Family',
    labelFr: 'Famille',
    groupLabel: 'your family',
    groupLabelFr: 'ta famille',
    warmth: 8,
    tone: 'intimate'
  },
  tribe: {
    id: 'tribe',
    label: 'Community',
    labelFr: 'Communauté',
    groupLabel: 'community',
    groupLabelFr: 'communauté',
    warmth: 6,
    tone: 'structured'
  }
};

export function getContextConfig(context: SurveyContext): ContextConfig {
  return CONTEXT_CONFIGS[context];
}

export function getGroupLabel(context: SurveyContext, lang: 'en' | 'fr' = 'en'): string {
  const config = CONTEXT_CONFIGS[context];
  return lang === 'fr' ? config.groupLabelFr : config.groupLabel;
}
