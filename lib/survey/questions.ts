// New Survey Model for TribeMapper
// Supports friends/family/tribe contexts with natural wording

import { SurveyContext } from './context';

export type QuestionType = 
  | 'text' 
  | 'textarea' 
  | 'single' 
  | 'multi' 
  | 'scale' 
  | 'nominate' 
  | 'date' 
  | 'checkbox';

export interface Question {
  id: string;
  section: string;
  sectionFr: string;
  question: string;
  questionFr: string;
  description?: string;
  descriptionFr?: string;
  type: QuestionType;
  options?: { value: string; label: string; labelFr: string }[];
  placeholder?: string;
  placeholderFr?: string;
  required: boolean;
  maxSelections?: number;
  minSelections?: number;
  // Where this data belongs
  dataTarget: 'member_profile' | 'survey_response' | 'relationship';
  // Field mapping for member profile updates
  profileField?: string;
  // Relationship type if applicable
  relationshipType?: string;
}

// Helper to create context-aware questions
function createContextQuestions(context: SurveyContext): {
  profile: Question[];
  relationships: Question[];
  reflection: Question[];
} {
  const isFriends = context === 'friends';
  const isFamily = context === 'family';
  const isTribe = context === 'tribe';

  // PROFILE MODULE - Common for all contexts
  const profile: Question[] = [
    {
      id: 'preferred_name',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What should we call you?',
      questionFr: 'Comment devrions-nous t\'appeler ?',
      description: 'This is how you\'ll appear in the system.',
      descriptionFr: 'C\'est comme ça que tu apparaîtras dans le système.',
      type: 'text',
      placeholder: 'Your name or nickname',
      placeholderFr: 'Ton nom ou surnom',
      required: true,
      dataTarget: 'member_profile',
      profileField: 'display_name'
    },
    {
      id: 'full_name',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What is your full name?',
      questionFr: 'Quel est ton nom complet ?',
      type: 'text',
      placeholder: 'Full legal name',
      placeholderFr: 'Nom complet',
      required: true,
      dataTarget: 'member_profile',
      profileField: 'full_name'
    },
    {
      id: 'date_of_birth',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What is your date of birth?',
      questionFr: 'Quelle est ta date de naissance ?',
      description: 'We use this so birthdays are never forgotten.',
      descriptionFr: 'On l\'utilise pour ne jamais oublier les anniversaires.',
      type: 'date',
      required: true,
      dataTarget: 'member_profile',
      profileField: 'date_of_birth'
    },
    {
      id: 'primary_language',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What language are you most comfortable with?',
      questionFr: 'Dans quelle langue es-tu le plus à l\'aise ?',
      type: 'text',
      placeholder: 'e.g., English, French, Spanish',
      placeholderFr: 'ex. Anglais, Français, Espagnol',
      required: true,
      dataTarget: 'member_profile',
      profileField: 'primary_language'
    },
    {
      id: 'additional_languages',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What other languages do you speak comfortably?',
      questionFr: 'Quelles autres langues parles-tu facilement ?',
      description: 'Separate multiple languages with commas',
      descriptionFr: 'Sépare les langues par des virgules',
      type: 'text',
      placeholder: 'e.g., Spanish, German, Mandarin',
      placeholderFr: 'ex. Espagnol, Allemand, Mandarin',
      required: false,
      dataTarget: 'member_profile',
      profileField: 'additional_languages'
    },
    {
      id: 'role_in_circle',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: isFriends 
        ? 'How would you describe your place in this circle of friends?'
        : isFamily
        ? 'How would you describe your place in the family?'
        : 'How would you describe your role in the community?',
      questionFr: isFriends
        ? 'Comment décrirais-tu ta place dans ce cercle d\'amis ?'
        : isFamily
        ? 'Comment décrirais-tu ta place dans la famille ?'
        : 'Comment décrirais-tu ton rôle dans la communauté ?',
      description: 'What is your natural position or function?',
      descriptionFr: 'Quelle est ta position ou fonction naturelle ?',
      type: 'textarea',
      placeholder: isFriends
        ? 'e.g., The organizer, the listener, the connector...'
        : isFamily
        ? 'e.g., The mediator, the practical one, the emotional anchor...'
        : 'e.g., I coordinate events, I mentor newcomers, I handle communications...',
      placeholderFr: isFriends
        ? 'ex. L\'organisateur, l\'écouteur, le connecteur...'
        : isFamily
        ? 'ex. Le médiateur, le pragmatique, l\'ancre émotionnelle...'
        : 'ex. Je coordonne des événements, j\'accompagne les nouveaux...',
      required: true,
      dataTarget: 'member_profile',
      profileField: 'role_in_tribe'
    },
    {
      id: 'tenure',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: isFriends
        ? 'How long have you been part of this circle?'
        : isFamily
        ? 'How long have you been closely part of this family life?'
        : 'How long have you been part of this community?',
      questionFr: isFriends
        ? 'Depuis combien de temps fais-tu partie de ce cercle ?'
        : isFamily
        ? 'Depuis combien de temps participes-tu activement à la vie de famille ?'
        : 'Depuis combien de temps fais-tu partie de cette communauté ?',
      type: 'single',
      required: false,
      options: [
        { value: 'less_3mo', label: 'Less than 3 months', labelFr: 'Moins de 3 mois' },
        { value: '3mo_1yr', label: '3 months to 1 year', labelFr: '3 mois à 1 an' },
        { value: '1yr_2yr', label: '1 to 2 years', labelFr: '1 à 2 ans' },
        { value: '2yr_5yr', label: '2 to 5 years', labelFr: '2 à 5 ans' },
        { value: '5yr_plus', label: 'More than 5 years', labelFr: 'Plus de 5 ans' }
      ],
      dataTarget: 'member_profile',
      profileField: 'tenure'
    },
    {
      id: 'profession',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What do you do professionally?',
      questionFr: 'Que fais-tu professionnellement ?',
      type: 'text',
      placeholder: 'e.g., Software Engineer, Teacher, Nurse',
      placeholderFr: 'ex. Ingénieur, Enseignant, Infirmier',
      required: false,
      dataTarget: 'member_profile',
      profileField: 'profession'
    },
    {
      id: 'current_activity',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What is your current activity or job title?',
      questionFr: 'Quelle est ton activité actuelle ou ton poste ?',
      type: 'text',
      placeholder: 'e.g., Senior Product Manager at Acme Corp',
      placeholderFr: 'ex. Chef de Projet Senior chez Acme Corp',
      required: false,
      dataTarget: 'member_profile',
      profileField: 'current_activity_or_job_title'
    },
    {
      id: 'email',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What email should we use for you?',
      questionFr: 'Quel email devons-nous utiliser pour toi ?',
      type: 'text',
      placeholder: 'your@email.com',
      placeholderFr: 'ton@email.com',
      required: false,
      dataTarget: 'member_profile',
      profileField: 'email'
    },
    {
      id: 'phone_number',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What phone number should we use for you?',
      questionFr: 'Quel numéro de téléphone devons-nous utiliser pour toi ?',
      type: 'text',
      placeholder: '+1 234 567 8900',
      placeholderFr: '+33 6 12 34 56 78',
      required: false,
      dataTarget: 'member_profile',
      profileField: 'phone_number'
    },
    {
      id: 'current_city',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What city do you currently live in?',
      questionFr: 'Dans quelle ville vis-tu actuellement ?',
      type: 'text',
      placeholder: 'e.g., Paris, New York, Tokyo',
      placeholderFr: 'ex. Paris, New York, Tokyo',
      required: false,
      dataTarget: 'member_profile',
      profileField: 'current_city'
    },
    {
      id: 'current_country',
      section: 'Your Profile',
      sectionFr: 'Ton Profil',
      question: 'What country do you currently live in?',
      questionFr: 'Dans quel pays vis-tu actuellement ?',
      type: 'text',
      placeholder: 'e.g., France, USA, Japan',
      placeholderFr: 'ex. France, États-Unis, Japon',
      required: false,
      dataTarget: 'member_profile',
      profileField: 'current_country'
    },
    {
      id: 'consent_storage',
      section: 'Consent',
      sectionFr: 'Consentement',
      question: 'I consent to storing my profile and survey data',
      questionFr: 'Je consens au stockage de mon profil et de mes réponses',
      description: 'Your data will be securely stored and used to understand the network.',
      descriptionFr: 'Tes données seront stockées en toute sécurité pour comprendre le réseau.',
      type: 'checkbox',
      required: true,
      dataTarget: 'member_profile',
      profileField: 'consent_storage'
    },
    {
      id: 'consent_analysis',
      section: 'Consent',
      sectionFr: 'Consentement',
      question: 'I consent to analyzing this data to understand relationships and patterns',
      questionFr: 'Je consens à l\'analyse de ces données pour comprendre les relations et schémas',
      type: 'checkbox',
      required: true,
      dataTarget: 'member_profile',
      profileField: 'consent_analysis'
    },
    {
      id: 'consent_contact',
      section: 'Consent',
      sectionFr: 'Consentement',
      question: 'I consent to being contacted if needed (optional)',
      questionFr: 'Je consens à être contacté si nécessaire (optionnel)',
      type: 'checkbox',
      required: false,
      dataTarget: 'member_profile',
      profileField: 'consent_contact'
    },
    {
      id: 'consent_birthday_reminder',
      section: 'Consent',
      sectionFr: 'Consentement',
      question: 'I consent to using my birthday for reminders (optional)',
      questionFr: 'Je consens à utiliser mon anniversaire pour les rappels (optionnel)',
      type: 'checkbox',
      required: false,
      dataTarget: 'member_profile',
      profileField: 'consent_birthday_reminder'
    }
  ];

  // RELATIONSHIP MODULE - Context specific
  const relationships: Question[] = isFriends ? [
    {
      id: 'friends_closest',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who are the friends in this circle you feel closest to?',
      questionFr: 'Quels sont les amis de ce cercle auxquels tu te sens le plus proche ?',
      description: 'Select up to 5 people',
      descriptionFr: 'Sélectionne jusqu\'à 5 personnes',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'closeness'
    },
    {
      id: 'friends_talk_to',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who do you usually turn to when you need to talk?',
      questionFr: 'À qui te tournes-tu habituellement quand tu as besoin de parler ?',
      type: 'nominate',
      required: false,
      maxSelections: 3,
      dataTarget: 'relationship',
      relationshipType: 'support'
    },
    {
      id: 'friends_spend_time',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who do you spend the most time with?',
      questionFr: 'Avec qui passes-tu le plus de temps ?',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'time_together'
    },
    {
      id: 'friends_supportive',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who is often there for you when you need support?',
      questionFr: 'Qui est souvent là pour toi quand tu as besoin de soutien ?',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'support'
    },
    {
      id: 'friends_connectors',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who helps keep people connected in this circle?',
      questionFr: 'Qui aide à garder les gens connectés dans ce cercle ?',
      description: 'The people who introduce others and bring the group together',
      descriptionFr: 'Les personnes qui présentent les uns aux autres et rassemblent le groupe',
      type: 'nominate',
      required: false,
      maxSelections: 3,
      dataTarget: 'relationship',
      relationshipType: 'bridge'
    },
    {
      id: 'friends_tension',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Are there any friendships in this circle that sometimes feel strained or complicated?',
      questionFr: 'Y a-t-il des amitiés dans ce cercle qui se sentent parfois tendues ou compliquées ?',
      description: 'This is optional and private. Only name people if you feel comfortable.',
      descriptionFr: 'C\'est optionnel et privé. Ne nomme que si tu te sens à l\'aise.',
      type: 'nominate',
      required: false,
      maxSelections: 3,
      dataTarget: 'relationship',
      relationshipType: 'tension'
    }
  ] : isFamily ? [
    {
      id: 'family_rely_on',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who in the family do you rely on most when something important happens?',
      questionFr: 'De qui dans la famille dépends-tu le plus quand quelque chose d\'important arrive ?',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'reliance'
    },
    {
      id: 'family_talk_naturally',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who do you speak with most naturally in the family?',
      questionFr: 'Avec qui parles-tu le plus naturellement dans la famille ?',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'closeness'
    },
    {
      id: 'family_support_difficult',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who usually helps when someone in the family is going through something difficult?',
      questionFr: 'Qui aide habituellement quand quelqu\'un dans la famille traverse des moments difficiles ?',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'support'
    },
    {
      id: 'family_connectors',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who helps keep different parts of the family connected?',
      questionFr: 'Qui aide à garder les différentes branches de la famille connectées ?',
      type: 'nominate',
      required: false,
      maxSelections: 3,
      dataTarget: 'relationship',
      relationshipType: 'bridge'
    },
    {
      id: 'family_emotional_close',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who do you feel emotionally closest to in the family?',
      questionFr: 'À qui te sens-tu le plus proche émotionnellement dans la famille ?',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'emotional_closeness'
    },
    {
      id: 'family_tension',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Are there any family relationships that currently feel tense or difficult?',
      questionFr: 'Y a-t-il des relations familiales qui se sentent actuellement tendues ou difficiles ?',
      description: 'This is optional and completely private.',
      descriptionFr: 'C\'est optionnel et complètement privé.',
      type: 'nominate',
      required: false,
      maxSelections: 3,
      dataTarget: 'relationship',
      relationshipType: 'tension'
    }
  ] : [
    // TRIBE context
    {
      id: 'tribe_reliance',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who in this community do you rely on most?',
      questionFr: 'De qui dans cette communauté dépends-tu le plus ?',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'reliance'
    },
    {
      id: 'tribe_collaboration',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who do you most often build, organize, or work on things with?',
      questionFr: 'Avec qui construis-tu, organises-tu ou travailles-tu le plus souvent ?',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'collaboration'
    },
    {
      id: 'tribe_advice',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who do you usually turn to for advice or perspective?',
      questionFr: 'À qui te tournes-tu habituellement pour des conseils ou une perspective ?',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'advice'
    },
    {
      id: 'tribe_influence',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Whose perspective tends to carry weight in this community?',
      questionFr: 'La perspective de qui a tendance à compter dans cette communauté ?',
      description: 'People whose opinions others listen to',
      descriptionFr: 'Les personnes dont les opinions sont écoutées',
      type: 'nominate',
      required: false,
      maxSelections: 5,
      dataTarget: 'relationship',
      relationshipType: 'influence'
    },
    {
      id: 'tribe_bridges',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Who helps connect different parts of the community?',
      questionFr: 'Qui aide à connecter les différentes parties de la communauté ?',
      type: 'nominate',
      required: false,
      maxSelections: 3,
      dataTarget: 'relationship',
      relationshipType: 'bridge'
    },
    {
      id: 'tribe_tension',
      section: 'Your Connections',
      sectionFr: 'Tes Connexions',
      question: 'Are there any relationships in the community that currently feel difficult or tense?',
      questionFr: 'Y a-t-il des relations dans la communauté qui se sentent actuellement difficiles ou tendues ?',
      description: 'Optional and private.',
      descriptionFr: 'Optionnel et privé.',
      type: 'nominate',
      required: false,
      maxSelections: 3,
      dataTarget: 'relationship',
      relationshipType: 'tension'
    }
  ];

  // REFLECTION MODULE - Shared across contexts
  const groupLabel = isFriends ? 'this circle of friends' : isFamily ? 'the family' : 'this community';
  const groupLabelFr = isFriends ? 'ce cercle d\'amis' : isFamily ? 'la famille' : 'cette communauté';

  const reflection: Question[] = [
    {
      id: 'reflection_health',
      section: 'Reflection',
      sectionFr: 'Réflexion',
      question: `How healthy does ${groupLabel} feel to you right now?`,
      questionFr: `À quel point ${groupLabelFr} te semble-t-elle saine en ce moment ?`,
      type: 'scale',
      required: false,
      options: [
        { value: '1', label: 'Struggling', labelFr: 'En difficulté' },
        { value: '2', label: 'Challenged', labelFr: 'Mis à l\'épreuve' },
        { value: '3', label: 'Stable', labelFr: 'Stable' },
        { value: '4', label: 'Growing', labelFr: 'En croissance' },
        { value: '5', label: 'Thriving', labelFr: 'Épanouie' }
      ],
      dataTarget: 'survey_response'
    },
    {
      id: 'reflection_connected',
      section: 'Reflection',
      sectionFr: 'Réflexion',
      question: `How connected do you personally feel to ${groupLabel} right now?`,
      questionFr: `À quel point te sens-tu personnellement connecté à ${groupLabelFr} en ce moment ?`,
      type: 'scale',
      required: false,
      options: [
        { value: '1', label: 'Not at all', labelFr: 'Pas du tout' },
        { value: '2', label: 'Slightly', labelFr: 'Un peu' },
        { value: '3', label: 'Moderately', labelFr: 'Modérément' },
        { value: '4', label: 'Quite', labelFr: 'Assez' },
        { value: '5', label: 'Deeply', labelFr: 'Profondément' }
      ],
      dataTarget: 'survey_response'
    },
    {
      id: 'reflection_missing',
      section: 'Reflection',
      sectionFr: 'Réflexion',
      question: `Is there anything important about ${groupLabel} that would be missed if we only looked at names and connections?`,
      questionFr: `Y a-t-il quelque chose d\'important à propos de ${groupLabelFr} qui serait manqué si on ne regardait que les noms et connexions ?`,
      description: 'Tell us what matters that the data might not capture',
      descriptionFr: 'Dis-nous ce qui compte que les données pourraient ne pas capturer',
      type: 'textarea',
      placeholder: 'e.g., The unspoken dynamics, recent changes, hopes for the future...',
      placeholderFr: 'ex. Les dynamiques tacites, les changements récents, les espoirs pour l\'avenir...',
      required: false,
      dataTarget: 'survey_response'
    }
  ];

  return { profile, relationships, reflection };
}

export function getSurveyQuestions(context: SurveyContext): Question[] {
  const { profile, relationships, reflection } = createContextQuestions(context);
  return [...profile, ...relationships, ...reflection];
}

export function getProfileQuestions(context: SurveyContext): Question[] {
  return createContextQuestions(context).profile;
}

export function getRelationshipQuestions(context: SurveyContext): Question[] {
  return createContextQuestions(context).relationships;
}

export function getReflectionQuestions(context: SurveyContext): Question[] {
  return createContextQuestions(context).reflection;
}
