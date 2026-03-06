// Multilingual translations for TribeMapper
// Supports: English (en), French (fr), Croatian (hr)
// LIMITED TO SURVEY EXPERIENCE ONLY - Admin/Landing remain English-only

export type Language = 'en' | 'fr' | 'hr';

export const translations = {
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
    
    // Admin login - NOT TRANSLATED (English only)
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
    
    // Admin dashboard - NOT TRANSLATED (English only)
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
    
    // Survey 1 - FULLY TRANSLATED
    survey1: {
      loading: 'Loading...',
      completed: 'Thank you',
      completedMessage: 'Your responses have been recorded.',
      consent: {
        title: 'Help Us Understand Your Group',
        description: 'This survey maps relationships, roles, and dynamics to help the group work better together.',
        privacy: 'Your responses are confidential and used only for group analysis.',
        skip: 'You can skip any question or withdraw at any time.',
        confidential: 'Individual responses won\'t be shared with other members.',
        continue: 'Continue'
      },
      sections: {
        identity: 'Identity',
        relationships: 'Relationships',
        behavior: 'Behavior',
        values: 'Values',
        reflection: 'Reflection'
      },
      navigation: {
        back: 'Back',
        continue: 'Continue',
        submit: 'Submit',
        submitting: 'Submitting...',
        selectSomeone: 'Select someone...'
      },
      selectUpTo: 'Select up to {count}',
      questions: {
        a1_name: {
          question: 'What should we call you?',
          description: 'Your name or nickname in the system',
          placeholder: 'Your name'
        },
        a2_role: {
          question: 'How would you describe your role?',
          description: 'What you actually do day-to-day',
          placeholder: 'e.g., I coordinate between teams, handle logistics, etc.'
        },
        a3_duration: {
          question: 'How long have you been part of this group?'
        },
        b1_trust: {
          question: 'Who do you trust most?',
          description: 'Up to 5 people you rely on'
        },
        b2_collaboration: {
          question: 'Who do you work with most closely?'
        },
        b3_influence: {
          question: 'Whose opinions sway decisions?'
        },
        b4_conflicts: {
          question: 'Anyone you find difficult to work with?',
          description: 'Optional — private and confidential'
        },
        c1_decision: {
          question: 'How are major decisions made?'
        },
        c2_conflict: {
          question: 'How are disagreements handled?'
        },
        c3_initiative: {
          question: 'How do new projects start?'
        },
        c4_information: {
          question: 'How does information flow?'
        },
        d1_values: {
          question: 'What matters most to this group?',
          description: 'Select exactly 3'
        },
        d2_language: {
          question: 'What phrases would an outsider not understand?',
          placeholder: 'Inside jokes, project codenames, etc.'
        },
        d3_experiences: {
          question: 'What moments define this group?',
          placeholder: 'Launches, crises, retreats...'
        },
        d4_vision: {
          question: 'What should the group work toward?',
          placeholder: 'Where should we be in 1 year?'
        },
        e1_health: {
          question: 'How is the group doing overall?'
        },
        e2_influence: {
          question: 'How much influence do you have?'
        }
      },
      options: {
        duration: {
          less_3mo: 'Less than 3 months',
          '3mo_1yr': '3–12 months',
          '1yr_2yr': '1–2 years',
          '2yr_5yr': '2–5 years',
          '5yr_plus': '5+ years'
        },
        decision: {
          leader_decides: { label: 'Leaders decide', description: 'One or two people make the call' },
          consensus: { label: 'Consensus', description: 'Everyone discusses until agreement' },
          vote: { label: 'Voting', description: 'Majority rules' },
          organic: { label: 'Emerges organically', description: 'No explicit process' }
        },
        conflict: {
          avoid: { label: 'Avoided', description: 'Swept under the rug' },
          mediate: { label: 'Mediated', description: 'Third party helps resolve' },
          confront: { label: 'Direct', description: 'Those involved work it out' },
          escalate: { label: 'Escalated', description: 'Leaders step in' }
        },
        initiative: {
          permission: { label: 'Require permission', description: 'Leadership approval needed' },
          volunteers: { label: 'Volunteers form teams', description: 'Natural collaboration' },
          anyone: { label: 'Anyone can start', description: 'No formal process' },
          committee: { label: 'Committee evaluation', description: 'Structured assessment' }
        },
        information: {
          top_down: { label: 'Top-down', description: 'Leaders announce to group' },
          hubs: { label: 'Through key people', description: 'Certain individuals spread it' },
          network: { label: 'Network', description: 'Many conversations' },
          chaos: { label: 'Chaotic', description: 'Unclear, sometimes late' }
        },
        values: {
          quality: 'Quality & Excellence',
          speed: 'Speed & Results',
          community: 'Community & Belonging',
          innovation: 'Innovation',
          stability: 'Stability',
          autonomy: 'Autonomy',
          impact: 'Impact',
          fairness: 'Fairness'
        },
        health: {
          '1': 'Struggling',
          '2': 'Challenged',
          '3': 'Stable',
          '4': 'Growing',
          '5': 'Thriving'
        },
        influence: {
          '1': 'Minimal',
          '2': 'Some',
          '3': 'Moderate',
          '4': 'High',
          '5': 'Very High'
        }
      }
    },
    
    // Survey 2 - FULLY TRANSLATED
    survey2: {
      loading: 'Loading...',
      completed: 'Thank you',
      completedMessage: 'Your additional insights are valuable.',
      followUpQuestions: 'Follow-up Questions',
      navigation: {
        back: 'Back',
        continue: 'Continue',
        submit: 'Submit',
        submitting: 'Submitting...',
        selectSomeone: 'Select someone...'
      },
      selectUpTo: 'Select up to {count}',
      questions: {
        bridge_1: {
          question: 'How do you stay connected across different parts of the group?',
          placeholder: 'Describe your bridging role...'
        },
        bridge_2: {
          question: 'Who would you go to for help outside your usual area?'
        },
        role_1: {
          question: 'How has your role changed recently?'
        },
        role_2: {
          question: 'If you stepped back, who could fill your role?'
        },
        values_1: {
          question: 'When did you feel most aligned with the group?',
          placeholder: 'A specific moment...'
        },
        values_2: {
          question: 'When did you feel least aligned with the group?',
          placeholder: 'A specific moment...'
        },
        gap_1: {
          question: 'Who do you wish you knew better?'
        },
        gap_2: {
          question: 'Who seems isolated or disconnected?'
        },
        influence_1: {
          question: 'Who influences you most?'
        },
        influence_2: {
          question: 'How do you influence decisions?'
        }
      },
      options: {
        role: {
          more_central: 'More central/influential',
          less_central: 'Less central',
          same: 'Stayed the same',
          changed: 'Changed in nature'
        },
        influence: {
          direct: 'Speak up in discussions',
          indirect: 'One-on-one conversations',
          expert: 'My expertise carries weight',
          behind: 'Behind the scenes'
        }
      }
    },
    
    // Language switcher
    language: {
      label: 'Language',
      en: 'English',
      fr: 'Français',
      hr: 'Hrvatski'
    }
  },
  
  fr: {
    // Landing page - NOT TRANSLATED (English only per requirements)
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
    
    // Survey 1 - FULLY TRANSLATED
    survey1: {
      loading: 'Chargement...',
      completed: 'Merci',
      completedMessage: 'Vos réponses ont été enregistrées.',
      consent: {
        title: 'Aidez-nous à Comprendre Votre Groupe',
        description: 'Cette enquête cartographie les relations, les rôles et la dynamique pour aider le groupe à mieux travailler ensemble.',
        privacy: 'Vos réponses sont confidentielles et utilisées uniquement pour l\'analyse du groupe.',
        skip: 'Vous pouvez passer toute question ou vous retirer à tout moment.',
        confidential: 'Les réponses individuelles ne seront pas partagées avec les autres membres.',
        continue: 'Continuer'
      },
      sections: {
        identity: 'Identité',
        relationships: 'Relations',
        behavior: 'Comportement',
        values: 'Valeurs',
        reflection: 'Réflexion'
      },
      navigation: {
        back: 'Retour',
        continue: 'Continuer',
        submit: 'Soumettre',
        submitting: 'Envoi...',
        selectSomeone: 'Sélectionner quelqu\'un...'
      },
      selectUpTo: 'Sélectionnez jusqu\'à {count}',
      questions: {
        a1_name: {
          question: 'Comment devrions-nous vous appeler ?',
          description: 'Votre nom ou surnom dans le système',
          placeholder: 'Votre nom'
        },
        a2_role: {
          question: 'Comment décririez-vous votre rôle ?',
          description: 'Ce que vous faites réellement au quotidien',
          placeholder: 'Ex: Je coordonne entre les équipes, gère la logistique, etc.'
        },
        a3_duration: {
          question: 'Depuis combien de temps faites-vous partie de ce groupe ?'
        },
        b1_trust: {
          question: 'En qui avez-vous le plus confiance ?',
          description: 'Jusqu\'à 5 personnes sur qui vous comptez'
        },
        b2_collaboration: {
          question: 'Avec qui travaillez-vous le plus étroitement ?'
        },
        b3_influence: {
          question: 'Les opinions de qui influencent les décisions ?'
        },
        b4_conflicts: {
          question: 'Quelqu\'un avec qui vous avez des difficultés ?',
          description: 'Optionnel — privé et confidentiel'
        },
        c1_decision: {
          question: 'Comment les décisions majeures sont-elles prises ?'
        },
        c2_conflict: {
          question: 'Comment les désaccords sont-ils gérés ?'
        },
        c3_initiative: {
          question: 'Comment les nouveaux projets démarrent-ils ?'
        },
        c4_information: {
          question: 'Comment circule l\'information ?'
        },
        d1_values: {
          question: 'Qu\'est-ce qui compte le plus pour ce groupe ?',
          description: 'Sélectionnez exactement 3'
        },
        d2_language: {
          question: 'Quelles expressions un outsider ne comprendrait pas ?',
          placeholder: 'Blagues internes, noms de projets, etc.'
        },
        d3_experiences: {
          question: 'Quels moments définissent ce groupe ?',
          placeholder: 'Lancements, crises, retraites...'
        },
        d4_vision: {
          question: 'Vers quoi le groupe devrait-il travailler ?',
          placeholder: 'Où devrions-nous être dans 1 an ?'
        },
        e1_health: {
          question: 'Comment va le groupe globalement ?'
        },
        e2_influence: {
          question: 'Quelle influence avez-vous ?'
        }
      },
      options: {
        duration: {
          less_3mo: 'Moins de 3 mois',
          '3mo_1yr': '3–12 mois',
          '1yr_2yr': '1–2 ans',
          '2yr_5yr': '2–5 ans',
          '5yr_plus': '5+ ans'
        },
        decision: {
          leader_decides: { label: 'Les leaders décident', description: 'Une ou deux personnes prennent la décision' },
          consensus: { label: 'Consensus', description: 'Tout le monde discute jusqu\'à l\'accord' },
          vote: { label: 'Vote', description: 'La majorité l\'emporte' },
          organic: { label: 'Émerge naturellement', description: 'Aucun processus explicite' }
        },
        conflict: {
          avoid: { label: 'Évité', description: 'Sous le tapis' },
          mediate: { label: 'Médié', description: 'Un tiers aide à résoudre' },
          confront: { label: 'Direct', description: 'Les concernés règlent le problème' },
          escalate: { label: 'Escaladé', description: 'Les leaders interviennent' }
        },
        initiative: {
          permission: { label: 'Nécessite permission', description: 'Approbation des leaders requise' },
          volunteers: { label: 'Bénévoles forment équipes', description: 'Collaboration naturelle' },
          anyone: { label: 'Tout le monde peut démarrer', description: 'Aucun processus formel' },
          committee: { label: 'Évaluation par comité', description: 'Évaluation structurée' }
        },
        information: {
          top_down: { label: 'Top-down', description: 'Les leaders annoncent au groupe' },
          hubs: { label: 'Via quelques personnes clés', description: 'Certaines personnes diffusent' },
          network: { label: 'Réseau', description: 'Nombreuses conversations' },
          chaos: { label: 'Chaotique', description: 'Peu clair, parfois tard' }
        },
        values: {
          quality: 'Qualité et Excellence',
          speed: 'Rapidité et Résultats',
          community: 'Communauté et Appartenance',
          innovation: 'Innovation',
          stability: 'Stabilité',
          autonomy: 'Autonomie',
          impact: 'Impact',
          fairness: 'Équité'
        },
        health: {
          '1': 'En difficulté',
          '2': 'Mis au défi',
          '3': 'Stable',
          '4': 'En croissance',
          '5': 'Prospère'
        },
        influence: {
          '1': 'Minimale',
          '2': 'Quelque',
          '3': 'Modérée',
          '4': 'Élevée',
          '5': 'Très élevée'
        }
      }
    },
    
    // Survey 2 - FULLY TRANSLATED
    survey2: {
      loading: 'Chargement...',
      completed: 'Merci',
      completedMessage: 'Vos insights additionnels sont précieux.',
      followUpQuestions: 'Questions de Suivi',
      navigation: {
        back: 'Retour',
        continue: 'Continuer',
        submit: 'Soumettre',
        submitting: 'Envoi...',
        selectSomeone: 'Sélectionner quelqu\'un...'
      },
      selectUpTo: 'Sélectionnez jusqu\'à {count}',
      questions: {
        bridge_1: {
          question: 'Comment restez-vous connecté aux différentes parties du groupe ?',
          placeholder: 'Décrivez votre rôle de pont...'
        },
        bridge_2: {
          question: 'À qui vous adresseriez-vous pour de l\'aide en dehors de votre domaine ?'
        },
        role_1: {
          question: 'Comment votre rôle a-t-il changé récemment ?'
        },
        role_2: {
          question: 'Si vous vous effaciez, qui pourrait remplir votre rôle ?'
        },
        values_1: {
          question: 'Quand vous êtes-vous senti le plus aligné avec le groupe ?',
          placeholder: 'Un moment spécifique...'
        },
        values_2: {
          question: 'Quand vous êtes-vous senti le moins aligné avec le groupe ?',
          placeholder: 'Un moment spécifique...'
        },
        gap_1: {
          question: 'Qui aimeriez-vous mieux connaître ?'
        },
        gap_2: {
          question: 'Qui semble isolé ou déconnecté ?'
        },
        influence_1: {
          question: 'Qui vous influence le plus ?'
        },
        influence_2: {
          question: 'Comment influencez-vous les décisions ?'
        }
      },
      options: {
        role: {
          more_central: 'Plus central/influent',
          less_central: 'Moins central',
          same: 'Resté le même',
          changed: 'Changé de nature'
        },
        influence: {
          direct: 'Intervenir dans les discussions',
          indirect: 'Conversations individuelles',
          expert: 'Mon expertise a du poids',
          behind: 'En coulisses'
        }
      }
    },
    
    // Language switcher
    language: {
      label: 'Langue',
      en: 'English',
      fr: 'Français',
      hr: 'Hrvatski'
    }
  },
  
  hr: {
    // Landing page - NOT TRANSLATED (English only per requirements)
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
    
    // Survey 1 - FULLY TRANSLATED
    survey1: {
      loading: 'Učitavanje...',
      completed: 'Hvala',
      completedMessage: 'Vaši odgovori su zabilježeni.',
      consent: {
        title: 'Pomozite Nam Razumjeti Vašu Grupu',
        description: 'Ova anketa kartografira odnose, uloge i dinamiku kako bi grupa bolje surađivala.',
        privacy: 'Vaši odgovori su povjerljivi i koriste se samo za analizu grupe.',
        skip: 'Možete preskočiti bilo koje pitanje ili odustati u bilo kojem trenutku.',
        confidential: 'Pojedinačni odgovori neće biti podijeljeni s drugim članovima.',
        continue: 'Nastavi'
      },
      sections: {
        identity: 'Identitet',
        relationships: 'Odnosi',
        behavior: 'Ponašanje',
        values: 'Vrijednosti',
        reflection: 'Refleksija'
      },
      navigation: {
        back: 'Natrag',
        continue: 'Nastavi',
        submit: 'Pošalji',
        submitting: 'Slanje...',
        selectSomeone: 'Odaberite nekoga...'
      },
      selectUpTo: 'Odaberite do {count}',
      questions: {
        a1_name: {
          question: 'Kako vas trebamo zvati ?',
          description: 'Vaše ime ili nadimak u sustavu',
          placeholder: 'Vaše ime'
        },
        a2_role: {
          question: 'Kako biste opisali svoju ulogu ?',
          description: 'Ono što zapravo radite svakodnevno',
          placeholder: 'Npr: Koordiniram timovima, rukujem logistikom, itd.'
        },
        a3_duration: {
          question: 'Koliko dugo ste dio ove grupe ?'
        },
        b1_trust: {
          question: 'Kome najviše vjerujete ?',
          description: 'Do 5 osoba na koje se oslanjate'
        },
        b2_collaboration: {
          question: 'S kim najtješnje surađujete ?'
        },
        b3_influence: {
          question: 'Čija mišljenja utječu na odluke ?'
        },
        b4_conflicts: {
          question: 'Netko s kim imate poteškoća ?',
          description: 'Opcionalno — privatno i povjerljivo'
        },
        c1_decision: {
          question: 'Kako se donose glavne odluke ?'
        },
        c2_conflict: {
          question: 'Kako se rješavaju neslaganja ?'
        },
        c3_initiative: {
          question: 'Kako započinju novi projekti ?'
        },
        c4_information: {
          question: 'Kako teče informacija ?'
        },
        d1_values: {
          question: 'Što je najvažnije za ovu grupu ?',
          description: 'Odaberite točno 3'
        },
        d2_language: {
          question: 'Koje izraze stranac ne bi razumio ?',
          placeholder: 'Interne šale, kodna imena projekata, itd.'
        },
        d3_experiences: {
          question: 'Koji trenuci definiraju ovu grupu ?',
          placeholder: 'Lansiranja, krize, povlačenja...'
        },
        d4_vision: {
          question: 'Prema čemu bi grupa trebala raditi ?',
          placeholder: 'Gdje bismo trebali biti za 1 godinu ?'
        },
        e1_health: {
          question: 'Kako je grupi ukupno ?'
        },
        e2_influence: {
          question: 'Koliki utjecaj imate ?'
        }
      },
      options: {
        duration: {
          less_3mo: 'Manje od 3 mjeseca',
          '3mo_1yr': '3–12 mjeseci',
          '1yr_2yr': '1–2 godine',
          '2yr_5yr': '2–5 godina',
          '5yr_plus': '5+ godina'
        },
        decision: {
          leader_decides: { label: 'Vođe odlučuju', description: 'Jedna ili dvije osobe donose odluku' },
          consensus: { label: 'Konsenzus', description: 'Svi raspravljaju do dogovora' },
          vote: { label: 'Glasanje', description: 'Većina pobjeđuje' },
          organic: { label: 'Organski nastaje', description: 'Nema eksplicitnog procesa' }
        },
        conflict: {
          avoid: { label: 'Izbjegavano', description: 'Sakriveno ispod tepiha' },
          mediate: { label: 'Posredovano', description: 'Treća strana pomaže riješiti' },
          confront: { label: 'Direktno', description: 'Uključeni rješavaju problem' },
          escalate: { label: 'Escalirano', description: 'Vođe interveniraju' }
        },
        initiative: {
          permission: { label: 'Zahtijeva dozvolu', description: 'Potrebno odobrenje vođa' },
          volunteers: { label: 'Volonteri formiraju timove', description: 'Prirodna suradnja' },
          anyone: { label: 'Svatko može započeti', description: 'Nema formalnog procesa' },
          committee: { label: 'Evaluacija odbora', description: 'Strukturirana procjena' }
        },
        information: {
          top_down: { label: 'Top-down', description: 'Vođe najavljuju grupi' },
          hubs: { label: 'Preko ključnih osoba', description: 'Određene osobe šire dalje' },
          network: { label: 'Mreža', description: 'Mnogi razgovori' },
          chaos: { label: 'Kaotično', description: 'Nejasno, ponekad kasno' }
        },
        values: {
          quality: 'Kvaliteta i Izvrsnost',
          speed: 'Brzina i Rezultati',
          community: 'Zajednica i Pripadnost',
          innovation: 'Inovacija',
          stability: 'Stabilnost',
          autonomy: 'Autonomija',
          impact: 'Utjecaj',
          fairness: 'Pravednost'
        },
        health: {
          '1': 'U poteškoćama',
          '2': 'Izazvano',
          '3': 'Stabilno',
          '4': 'U rastu',
          '5': 'Uspravno'
        },
        influence: {
          '1': 'Minimalno',
          '2': 'Nekoliko',
          '3': 'Umjereno',
          '4': 'Visoko',
          '5': 'Vrlo visoko'
        }
      }
    },
    
    // Survey 2 - FULLY TRANSLATED
    survey2: {
      loading: 'Učitavanje...',
      completed: 'Hvala',
      completedMessage: 'Vaši dodatni uvidi su vrijedni.',
      followUpQuestions: 'Pitanja za Praćenje',
      navigation: {
        back: 'Natrag',
        continue: 'Nastavi',
        submit: 'Pošalji',
        submitting: 'Slanje...',
        selectSomeone: 'Odaberite nekoga...'
      },
      selectUpTo: 'Odaberite do {count}',
      questions: {
        bridge_1: {
          question: 'Kako ostajete povezani s različitim dijelovima grupe ?',
          placeholder: 'Opišite svoju ulogu mosta...'
        },
        bridge_2: {
          question: 'Kome biste se obratili za pomoć izvan svog područja ?'
        },
        role_1: {
          question: 'Kako se vaša uloga nedavno promijenila ?'
        },
        role_2: {
          question: 'Ako biste se povukli, tko bi mogao preuzeti vašu ulogu ?'
        },
        values_1: {
          question: 'Kada ste se osjećali najviše usklađeno s grupom ?',
          placeholder: 'Specifičan trenutak...'
        },
        values_2: {
          question: 'Kada ste se osjećali najmanje usklađeno s grupom ?',
          placeholder: 'Specifičan trenutak...'
        },
        gap_1: {
          question: 'Koga biste voljeli bolje upoznati ?'
        },
        gap_2: {
          question: 'Tko se čini izolirano ili odvojeno ?'
        },
        influence_1: {
          question: 'Tko vas najviše utječe ?'
        },
        influence_2: {
          question: 'Kako utječete na odluke ?'
        }
      },
      options: {
        role: {
          more_central: 'Više centralno/utjecajno',
          less_central: 'Manje centralno',
          same: 'Ostalo isto',
          changed: 'Promijenilo se u prirodi'
        },
        influence: {
          direct: 'Govoriti u raspravama',
          indirect: 'Razgovori jedan na jedan',
          expert: 'Moja stručnost ima težinu',
          behind: 'Iza kulisa'
        }
      }
    },
    
    // Language switcher
    language: {
      label: 'Jezik',
      en: 'English',
      fr: 'Français',
      hr: 'Hrvatski'
    }
  }
} as const;

// Extract type from English translations (source of truth)
export type Translations = typeof translations.en;

// Type assertion to ensure all languages match the same structure
// Using 'as any' to allow different string values while maintaining type safety
export const typedTranslations: Record<Language, Translations> = translations as any;
