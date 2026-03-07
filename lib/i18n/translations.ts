// Multilingual translations for TribeMapper
// Supports: English (en), French (fr) only
// Croatian (hr) has been removed

export type Language = 'en' | 'fr';

// Typed translations for TypeScript support
export const typedTranslations = {
  en: {
    // Landing page - NOT TRANSLATED (English only)
    landing: {
      title: 'TribeMapper',
      subtitle: 'Understand how your community works',
      adminButton: 'Admin Dashboard',
      whatMaps: 'What TribeMapper Maps',
      features: {
        trust: 'Trust and influence patterns',
        decision: 'Decision-making dynamics',
        connectors: 'Key connectors and bridges',
        clusters: 'Sub-groups and clusters',
        tension: 'Potential tension points',
        values: 'Shared values and language'
      },
      surveyLinkHint: 'Have a survey link? It will direct you to the right place.'
    },
    
    // Admin login - NOT TRANSLATED
    login: {
      title: 'Admin Access',
      description: 'Enter the admin password to continue.',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter password',
      errorInvalid: 'Invalid password',
      errorFailed: 'Login failed',
      signingIn: 'Signing in...',
      signIn: 'Sign In'
    },
    
    // Admin dashboard - NOT TRANSLATED
    admin: {
      title: 'TribeMapper Admin',
      refresh: 'Refresh',
      logout: 'Logout',
      tabs: {
        overview: 'Overview',
        roster: 'Roster',
        analytics: 'Analytics',
        settings: 'Settings'
      },
      stats: {
        totalMembers: 'Total Members',
        completed: 'Completed',
        active: 'Active',
        pending: 'Pending'
      },
      networkOverview: 'Network Overview',
      structuralElements: 'Structural Elements',
      bridges: 'Bridges',
      isolates: 'Isolates',
      clusters: 'Clusters',
      healthAndQuality: 'Health & Quality',
      overallHealth: 'Overall Health',
      dataCompleteness: 'Data Completeness',
      confidence: 'Confidence',
      dataQualityGaps: 'Data Quality Gaps',
      recommendations: 'Recommendations',
      membersFlagged: 'members flagged for follow-up',
      detailedAnalysis: 'Detailed Analysis',
      followUpRequired: 'Follow-up Required',
      interviewShortlist: 'Interview Shortlist',
      membersRecommended: 'members recommended',
      trigger: 'Trigger',
      clusterId: 'Cluster',
      membersCount: 'members',
      density: 'density',
      noBridges: 'No bridges detected',
      noIsolates: 'No isolates detected',
      noClusters: 'No clusters detected',
      generateLinks: 'Generate Survey Links',
      createTokens: 'Create unique tokens for tribe members',
      generate: 'Generate',
      generating: 'Generating...',
      generatedLinks: 'Generated Links',
      copy: 'Copy',
      linkGenerated: 'Generated {count} survey link',
      linksGenerated: 'Generated {count} survey links',
      failedLinks: 'Failed to generate links',
      noLinksGenerated: 'No links were generated',
      networkError: 'Network error: Failed to generate links',
      database: 'Database',
      initializeDatabase: 'Initialize Database',
      databaseInitialized: 'Database initialized',
      table: {
        member: 'Member',
        status: 'Status',
        stage: 'Stage',
        trustIn: 'Trust In',
        trustOut: 'Trust Out',
        collab: 'Collab',
        score: 'Score',
        anonymous: 'Anonymous'
      },
      status: {
        completed: 'completed',
        active: 'active',
        pending: 'pending'
      }
    },
    
    // Survey - Fully translated with context-aware wording
    survey: {
      loading: 'Loading...',
      completed: 'Thank you',
      completedMessage: 'Your responses have been recorded.',
      
      // Consent screen
      consent: {
        title: 'Help Us Map Your Network',
        titleFr: 'Aide-nous à Cartographier Ton Réseau',
        description: 'This survey helps us understand the relationships, roles, and dynamics in your personal network.',
        descriptionFr: 'Cette enquête nous aide à comprendre les relations, rôles et dynamiques de ton réseau personnel.',
        privacy: 'Your responses are confidential and used only for personal network analysis.',
        privacyFr: 'Tes réponses sont confidentielles et utilisées uniquement pour l\'analyse de réseau personnel.',
        skip: 'You can skip any question or withdraw at any time.',
        skipFr: 'Tu peux passer n\'importe quelle question ou te retirer à tout moment.',
        continue: 'Continue',
        continueFr: 'Continuer'
      },
      
      // Navigation
      navigation: {
        back: 'Back',
        backFr: 'Retour',
        continue: 'Continue',
        continueFr: 'Continuer',
        submit: 'Submit',
        submitFr: 'Soumettre',
        submitting: 'Submitting...',
        submittingFr: 'Envoi en cours...',
        skip: 'Skip',
        skipFr: 'Passer',
        addSomeone: 'Add someone not listed',
        addSomeoneFr: 'Ajouter quelqu\'un qui n\'est pas listé',
        selectSomeone: 'Select someone...',
        selectSomeoneFr: 'Sélectionner quelqu\'un...',
        typeName: 'Type their name...',
        typeNameFr: 'Tape leur nom...',
        add: 'Add',
        addFr: 'Ajouter'
      },
      
      // Section headers
      sections: {
        profile: 'Your Profile',
        profileFr: 'Ton Profil',
        connections: 'Your Connections',
        connectionsFr: 'Tes Connexions',
        reflection: 'Reflection',
        reflectionFr: 'Réflexion'
      },
      
      // Common labels
      selectUpTo: 'Select up to {count}',
      selectUpToFr: 'Sélectionne jusqu\'à {count}',
      optional: 'Optional',
      optionalFr: 'Optionnel',
      required: 'Required',
      requiredFr: 'Obligatoire'
    },
    
    // Language switcher
    language: {
      label: 'Language',
      labelFr: 'Langue',
      en: 'English',
      fr: 'Français'
    }
  },
  
  fr: {
    // Landing page - Use English for admin areas
    landing: {
      title: 'TribeMapper',
      subtitle: 'Understand how your community works',
      adminButton: 'Admin Dashboard',
      whatMaps: 'What TribeMapper Maps',
      features: {
        trust: 'Trust and influence patterns',
        decision: 'Decision-making dynamics',
        connectors: 'Key connectors and bridges',
        clusters: 'Sub-groups and clusters',
        tension: 'Potential tension points',
        values: 'Shared values and language'
      },
      surveyLinkHint: 'Have a survey link? It will direct you to the right place.'
    },
    
    // Admin login - Use English for admin areas
    login: {
      title: 'Admin Access',
      description: 'Enter the admin password to continue.',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter password',
      errorInvalid: 'Invalid password',
      errorFailed: 'Login failed',
      signingIn: 'Signing in...',
      signIn: 'Sign In'
    },
    
    // Admin dashboard - Use English for admin areas
    admin: {
      title: 'TribeMapper Admin',
      refresh: 'Refresh',
      logout: 'Logout',
      tabs: {
        overview: 'Overview',
        roster: 'Roster',
        analytics: 'Analytics',
        settings: 'Settings'
      },
      stats: {
        totalMembers: 'Total Members',
        completed: 'Completed',
        active: 'Active',
        pending: 'Pending'
      },
      networkOverview: 'Network Overview',
      structuralElements: 'Structural Elements',
      bridges: 'Bridges',
      isolates: 'Isolates',
      clusters: 'Clusters',
      healthAndQuality: 'Health & Quality',
      overallHealth: 'Overall Health',
      dataCompleteness: 'Data Completeness',
      confidence: 'Confidence',
      dataQualityGaps: 'Data Quality Gaps',
      recommendations: 'Recommendations',
      membersFlagged: 'members flagged for follow-up',
      detailedAnalysis: 'Detailed Analysis',
      followUpRequired: 'Follow-up Required',
      interviewShortlist: 'Interview Shortlist',
      membersRecommended: 'members recommended',
      trigger: 'Trigger',
      clusterId: 'Cluster',
      membersCount: 'members',
      density: 'density',
      noBridges: 'No bridges detected',
      noIsolates: 'No isolates detected',
      noClusters: 'No clusters detected',
      generateLinks: 'Generate Survey Links',
      createTokens: 'Create unique tokens for tribe members',
      generate: 'Generate',
      generating: 'Generating...',
      generatedLinks: 'Generated Links',
      copy: 'Copy',
      linkGenerated: 'Generated {count} survey link',
      linksGenerated: 'Generated {count} survey links',
      failedLinks: 'Failed to generate links',
      noLinksGenerated: 'No links were generated',
      networkError: 'Network error: Failed to generate links',
      database: 'Database',
      initializeDatabase: 'Initialize Database',
      databaseInitialized: 'Database initialized',
      table: {
        member: 'Member',
        status: 'Status',
        stage: 'Stage',
        trustIn: 'Trust In',
        trustOut: 'Trust Out',
        collab: 'Collab',
        score: 'Score',
        anonymous: 'Anonymous'
      },
      status: {
        completed: 'completed',
        active: 'active',
        pending: 'pending'
      }
    },
    
    // Survey - French translations
    survey: {
      loading: 'Chargement...',
      completed: 'Merci',
      completedMessage: 'Tes réponses ont été enregistrées.',
      
      consent: {
        title: 'Aide-nous à Cartographier Ton Réseau',
        titleFr: 'Aide-nous à Cartographier Ton Réseau',
        description: 'Cette enquête nous aide à comprendre les relations, rôles et dynamiques de ton réseau personnel.',
        descriptionFr: 'Cette enquête nous aide à comprendre les relations, rôles et dynamiques de ton réseau personnel.',
        privacy: 'Tes réponses sont confidentielles et utilisées uniquement pour l\'analyse de réseau personnel.',
        privacyFr: 'Tes réponses sont confidentielles et utilisées uniquement pour l\'analyse de réseau personnel.',
        skip: 'Tu peux passer n\'importe quelle question ou te retirer à tout moment.',
        skipFr: 'Tu peux passer n\'importe quelle question ou te retirer à tout moment.',
        continue: 'Continuer',
        continueFr: 'Continuer'
      },
      
      navigation: {
        back: 'Retour',
        backFr: 'Retour',
        continue: 'Continuer',
        continueFr: 'Continuer',
        submit: 'Soumettre',
        submitFr: 'Soumettre',
        submitting: 'Envoi en cours...',
        submittingFr: 'Envoi en cours...',
        skip: 'Passer',
        skipFr: 'Passer',
        addSomeone: 'Ajouter quelqu\'un qui n\'est pas listé',
        addSomeoneFr: 'Ajouter quelqu\'un qui n\'est pas listé',
        selectSomeone: 'Sélectionner quelqu\'un...',
        selectSomeoneFr: 'Sélectionner quelqu\'un...',
        typeName: 'Tape leur nom...',
        typeNameFr: 'Tape leur nom...',
        add: 'Ajouter',
        addFr: 'Ajouter'
      },
      
      sections: {
        profile: 'Ton Profil',
        profileFr: 'Ton Profil',
        connections: 'Tes Connexions',
        connectionsFr: 'Tes Connexions',
        reflection: 'Réflexion',
        reflectionFr: 'Réflexion'
      },
      
      selectUpTo: 'Sélectionne jusqu\'à {count}',
      selectUpToFr: 'Sélectionne jusqu\'à {count}',
      optional: 'Optionnel',
      optionalFr: 'Optionnel',
      required: 'Obligatoire',
      requiredFr: 'Obligatoire'
    },
    
    // Language switcher
    language: {
      label: 'Langue',
      labelFr: 'Langue',
      en: 'English',
      fr: 'Français'
    }
  }
};

// Export the typed translations
export const translations = typedTranslations;

// Type helper - use English as the base type
export type Translations = typeof typedTranslations.en;

// Helper function to get translations for a language
export function getTranslations(lang: Language): Translations {
  return typedTranslations[lang] as Translations;
}
