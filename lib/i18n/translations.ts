// Multilingual translations for TribeMapper
// Supports: English (en), French (fr), Croatian (hr)

export type Language = 'en' | 'fr' | 'hr';

export const translations = {
  en: {
    // Landing page
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
    
    // Admin login
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
    
    // Admin dashboard
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
      
      // Settings
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
      
      // Roster table
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
      
      // Status
      status: {
        completed: 'completed',
        active: 'active',
        pending: 'pending'
      }
    },
    
    // Survey 1
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
        submitting: 'Submitting...'
      },
      selectUpTo: 'Select up to {count}',
      questions: {
        a1_name: 'What should we call you?',
        a1_name_desc: 'Your name or nickname in the system',
        a1_name_placeholder: 'Your name',
        a2_role: 'How would you describe your role?',
        a2_role_desc: 'What you actually do day-to-day',
        a2_role_placeholder: 'e.g., I coordinate between teams, handle logistics, etc.',
        a3_duration: 'How long have you been part of this group?',
        b1_trust: 'Who do you trust most?',
        b1_trust_desc: 'Up to 5 people you rely on',
        b2_collaboration: 'Who do you work with most closely?',
        b3_influence: 'Whose opinions sway decisions?',
        b4_conflicts: 'Anyone you find difficult to work with?',
        b4_conflicts_desc: 'Optional — private and confidential',
        c1_decision: 'How are major decisions made?',
        c2_conflict: 'How are disagreements handled?',
        c3_initiative: 'How do new projects start?',
        c4_information: 'How does information flow?',
        d1_values: 'What matters most to this group?',
        d1_values_desc: 'Select exactly 3',
        d2_language: 'What phrases would an outsider not understand?',
        d2_language_placeholder: 'Inside jokes, project codenames, etc.',
        d3_experiences: 'What moments define this group?',
        d3_experiences_placeholder: 'Launches, crises, retreats...',
        d4_vision: 'What should the group work toward?',
        d4_vision_placeholder: 'Where should we be in 1 year?',
        e1_health: 'How is the group doing overall?',
        e2_influence: 'How much influence do you have?'
      },
      options: {
        // Duration
        less_3mo: 'Less than 3 months',
        '3mo_1yr': '3–12 months',
        '1yr_2yr': '1–2 years',
        '2yr_5yr': '2–5 years',
        '5yr_plus': '5+ years',
        // Decision making
        leader_decides: 'Leaders decide',
        leader_decides_desc: 'One or two people make the call',
        consensus: 'Consensus',
        consensus_desc: 'Everyone discusses until agreement',
        vote: 'Voting',
        vote_desc: 'Majority rules',
        organic: 'Emerges organically',
        organic_desc: 'No explicit process',
        // Conflict
        avoid: 'Avoided',
        avoid_desc: 'Swept under the rug',
        mediate: 'Mediated',
        mediate_desc: 'Third party helps resolve',
        confront: 'Direct',
        confront_desc: 'Those involved work it out',
        escalate: 'Escalated',
        escalate_desc: 'Leaders step in',
        // Initiative
        permission: 'Require permission',
        permission_desc: 'Leadership approval needed',
        volunteers: 'Volunteers form teams',
        volunteers_desc: 'Natural collaboration',
        anyone: 'Anyone can start',
        anyone_desc: 'No formal process',
        committee: 'Committee evaluation',
        committee_desc: 'Structured assessment',
        // Information
        top_down: 'Top-down',
        top_down_desc: 'Leaders announce to group',
        hubs: 'Through key people',
        hubs_desc: 'Certain individuals spread it',
        network: 'Network',
        network_desc: 'Many conversations',
        chaos: 'Chaotic',
        chaos_desc: 'Unclear, sometimes late',
        // Values
        quality: 'Quality & Excellence',
        speed: 'Speed & Results',
        community: 'Community & Belonging',
        innovation: 'Innovation',
        stability: 'Stability',
        autonomy: 'Autonomy',
        impact: 'Impact',
        fairness: 'Fairness',
        // Health scale
        struggling: 'Struggling',
        challenged: 'Challenged',
        stable: 'Stable',
        growing: 'Growing',
        thriving: 'Thriving',
        // Influence scale
        minimal: 'Minimal',
        some: 'Some',
        moderate: 'Moderate',
        high: 'High',
        very_high: 'Very High'
      }
    },
    
    // Survey 2
    survey2: {
      loading: 'Loading...',
      completed: 'Thank you',
      completedMessage: 'Your additional insights are valuable.',
      followUpQuestions: 'Follow-up Questions',
      back: 'Back',
      continue: 'Continue',
      submit: 'Submit',
      submitting: 'Submitting...',
      selectUpTo: 'Select up to {count}',
      questions: {
        bridge_1: 'How do you stay connected across different parts of the group?',
        bridge_2: 'Who would you go to for help outside your usual area?',
        role_1: 'How has your role changed recently?',
        role_2: 'If you stepped back, who could fill your role?',
        values_1: 'When did you feel most aligned with the group?',
        values_2: 'When did you feel least aligned with the group?',
        gap_1: 'Who do you wish you knew better?',
        gap_2: 'Who seems isolated or disconnected?',
        influence_1: 'Who influences you most?',
        influence_2: 'How do you influence decisions?'
      },
      options: {
        role_more_central: 'More central/influential',
        role_less_central: 'Less central',
        role_same: 'Stayed the same',
        role_changed: 'Changed in nature',
        influence_direct: 'Speak up in discussions',
        influence_indirect: 'One-on-one conversations',
        influence_expert: 'My expertise carries weight',
        influence_behind: 'Behind the scenes'
      },
      placeholders: {
        bridge_1: 'Describe your bridging role...',
        values_1: 'A specific moment...',
        values_2: 'A specific moment...'
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
    // Landing page
    landing: {
      title: 'TribeMapper',
      subtitle: 'Comprendre comment fonctionne votre communauté',
      adminButton: 'Tableau de Bord Admin',
      whatMaps: 'Ce que TribeMapper Cartographie',
      features: {
        trust: 'Modèles de confiance et d\'influence',
        decision: 'Dynamiques de prise de décision',
        connectors: 'Connecteurs clés et ponts',
        clusters: 'Sous-groupes et regroupements',
        tension: 'Points de tension potentiels',
        values: 'Valeurs partagées et langage'
      },
      surveyLinkHint: 'Vous avez un lien d\'enquête ? Il vous dirigera vers le bon endroit.'
    },
    
    // Admin login
    login: {
      title: 'Accès Admin',
      description: 'Entrez le mot de passe administrateur pour continuer.',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Entrez le mot de passe',
      errorInvalid: 'Mot de passe invalide',
      errorFailed: 'Échec de connexion',
      signingIn: 'Connexion...',
      signIn: 'Se Connecter'
    },
    
    // Admin dashboard
    admin: {
      title: 'Admin TribeMapper',
      refresh: 'Actualiser',
      logout: 'Déconnexion',
      tabs: {
        overview: 'Vue d\'ensemble',
        roster: 'Liste',
        analytics: 'Analyses',
        settings: 'Paramètres'
      },
      stats: {
        totalMembers: 'Membres Totaux',
        completed: 'Terminés',
        active: 'Actifs',
        pending: 'En attente'
      },
      networkOverview: 'Aperçu du Réseau',
      structuralElements: 'Éléments Structurels',
      bridges: 'Ponts',
      isolates: 'Isolés',
      clusters: 'Regroupements',
      healthAndQuality: 'Santé et Qualité',
      overallHealth: 'Santé Globale',
      dataCompleteness: 'Complétude des Données',
      confidence: 'Confiance',
      dataQualityGaps: 'Lacunes de Qualité des Données',
      recommendations: 'Recommandations',
      membersFlagged: 'membres signalés pour suivi',
      detailedAnalysis: 'Analyse Détaillée',
      followUpRequired: 'Suivi Requis',
      interviewShortlist: 'Liste d\'Entretiens',
      membersRecommended: 'membres recommandés',
      trigger: 'Déclencher',
      clusterId: 'Regroupement',
      membersCount: 'membres',
      density: 'densité',
      noBridges: 'Aucun pont détecté',
      noIsolates: 'Aucun isolé détecté',
      noClusters: 'Aucun regroupement détecté',
      
      // Settings
      generateLinks: 'Générer des Liens d\'Enquête',
      createTokens: 'Créer des jetons uniques pour les membres',
      generate: 'Générer',
      generating: 'Génération...',
      generatedLinks: 'Liens Générés',
      copy: 'Copier',
      linkGenerated: '{count} lien généré',
      linksGenerated: '{count} liens générés',
      failedLinks: 'Échec de la génération des liens',
      noLinksGenerated: 'Aucun lien n\'a été généré',
      networkError: 'Erreur réseau : Impossible de générer les liens',
      database: 'Base de Données',
      initializeDatabase: 'Initialiser la Base de Données',
      databaseInitialized: 'Base de données initialisée',
      
      // Roster table
      table: {
        member: 'Membre',
        status: 'Statut',
        stage: 'Étape',
        trustIn: 'Confiance Entrante',
        trustOut: 'Confiance Sortante',
        collab: 'Collab',
        score: 'Score',
        anonymous: 'Anonyme'
      },
      
      // Status
      status: {
        completed: 'terminé',
        active: 'actif',
        pending: 'en attente'
      }
    },
    
    // Survey 1
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
        submitting: 'Envoi...'
      },
      selectUpTo: 'Sélectionnez jusqu\'à {count}',
      questions: {
        a1_name: 'Comment devrions-nous vous appeler ?',
        a1_name_desc: 'Votre nom ou surnom dans le système',
        a1_name_placeholder: 'Votre nom',
        a2_role: 'Comment décririez-vous votre rôle ?',
        a2_role_desc: 'Ce que vous faites réellement au quotidien',
        a2_role_placeholder: 'Ex: Je coordonne entre les équipes, gère la logistique, etc.',
        a3_duration: 'Depuis combien de temps faites-vous partie de ce groupe ?',
        b1_trust: 'En qui avez-vous le plus confiance ?',
        b1_trust_desc: 'Jusqu\'à 5 personnes sur qui vous comptez',
        b2_collaboration: 'Avec qui travaillez-vous le plus étroitement ?',
        b3_influence: 'Les opinions de qui influencent les décisions ?',
        b4_conflicts: 'Quelqu\'un avec qui vous avez des difficultés ?',
        b4_conflicts_desc: 'Optionnel — privé et confidentiel',
        c1_decision: 'Comment les décisions majeures sont-elles prises ?',
        c2_conflict: 'Comment les désaccords sont-ils gérés ?',
        c3_initiative: 'Comment les nouveaux projets démarrent-ils ?',
        c4_information: 'Comment circule l\'information ?',
        d1_values: 'Qu\'est-ce qui compte le plus pour ce groupe ?',
        d1_values_desc: 'Sélectionnez exactement 3',
        d2_language: 'Quelles expressions un outsider ne comprendrait pas ?',
        d2_language_placeholder: 'Blagues internes, noms de projets, etc.',
        d3_experiences: 'Quels moments définissent ce groupe ?',
        d3_experiences_placeholder: 'Lancements, crises, retraites...',
        d4_vision: 'Vers quoi le groupe devrait-il travailler ?',
        d4_vision_placeholder: 'Où devrions-nous être dans 1 an ?',
        e1_health: 'Comment va le groupe globalement ?',
        e2_influence: 'Quelle influence avez-vous ?'
      },
      options: {
        // Duration
        less_3mo: 'Moins de 3 mois',
        '3mo_1yr': '3–12 mois',
        '1yr_2yr': '1–2 ans',
        '2yr_5yr': '2–5 ans',
        '5yr_plus': '5+ ans',
        // Decision making
        leader_decides: 'Les leaders décident',
        leader_decides_desc: 'Une ou deux personnes prennent la décision',
        consensus: 'Consensus',
        consensus_desc: 'Tout le monde discute jusqu\'à l\'accord',
        vote: 'Vote',
        vote_desc: 'La majorité l\'emporte',
        organic: 'Émerge naturellement',
        organic_desc: 'Aucun processus explicite',
        // Conflict
        avoid: 'Évité',
        avoid_desc: 'Sous le tapis',
        mediate: 'Médié',
        mediate_desc: 'Un tiers aide à résoudre',
        confront: 'Direct',
        confront_desc: 'Les concernés règlent le problème',
        escalate: 'Escaladé',
        escalate_desc: 'Les leaders interviennent',
        // Initiative
        permission: 'Nécessite permission',
        permission_desc: 'Approbation des leaders requise',
        volunteers: 'Bénévoles forment équipes',
        volunteers_desc: 'Collaboration naturelle',
        anyone: 'Tout le monde peut démarrer',
        anyone_desc: 'Aucun processus formel',
        committee: 'Évaluation par comité',
        committee_desc: 'Évaluation structurée',
        // Information
        top_down: 'Top-down',
        top_down_desc: 'Les leaders annoncent au groupe',
        hubs: 'Via quelques personnes clés',
        hubs_desc: 'Certaines personnes diffusent',
        network: 'Réseau',
        network_desc: 'Nombreuses conversations',
        chaos: 'Chaotique',
        chaos_desc: 'Peu clair, parfois tard',
        // Values
        quality: 'Qualité et Excellence',
        speed: 'Rapidité et Résultats',
        community: 'Communauté et Appartenance',
        innovation: 'Innovation',
        stability: 'Stabilité',
        autonomy: 'Autonomie',
        impact: 'Impact',
        fairness: 'Équité',
        // Health scale
        struggling: 'En difficulté',
        challenged: 'Mis au défi',
        stable: 'Stable',
        growing: 'En croissance',
        thriving: 'Prospère',
        // Influence scale
        minimal: 'Minimale',
        some: 'Quelque',
        moderate: 'Modérée',
        high: 'Élevée',
        very_high: 'Très élevée'
      }
    },
    
    // Survey 2
    survey2: {
      loading: 'Chargement...',
      completed: 'Merci',
      completedMessage: 'Vos insights additionnels sont précieux.',
      followUpQuestions: 'Questions de Suivi',
      back: 'Retour',
      continue: 'Continuer',
      submit: 'Soumettre',
      submitting: 'Envoi...',
      selectUpTo: 'Sélectionnez jusqu\'à {count}',
      questions: {
        bridge_1: 'Comment restez-vous connecté aux différentes parties du groupe ?',
        bridge_2: 'À qui vous adresseriez-vous pour de l\'aide en dehors de votre domaine ?',
        role_1: 'Comment votre rôle a-t-il changé récemment ?',
        role_2: 'Si vous vous effaciez, qui pourrait remplir votre rôle ?',
        values_1: 'Quand vous êtes-vous senti le plus aligné avec le groupe ?',
        values_2: 'Quand vous êtes-vous senti le moins aligné avec le groupe ?',
        gap_1: 'Qui aimeriez-vous mieux connaître ?',
        gap_2: 'Qui semble isolé ou déconnecté ?',
        influence_1: 'Qui vous influence le plus ?',
        influence_2: 'Comment influencez-vous les décisions ?'
      },
      options: {
        role_more_central: 'Plus central/influent',
        role_less_central: 'Moins central',
        role_same: 'Resté le même',
        role_changed: 'Changé de nature',
        influence_direct: 'Intervenir dans les discussions',
        influence_indirect: 'Conversations individuelles',
        influence_expert: 'Mon expertise a du poids',
        influence_behind: 'En coulisses'
      },
      placeholders: {
        bridge_1: 'Décrivez votre rôle de pont...',
        values_1: 'Un moment spécifique...',
        values_2: 'Un moment spécifique...'
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
    // Landing page
    landing: {
      title: 'TribeMapper',
      subtitle: 'Razumijevanje kako vaša zajednica funkcionira',
      adminButton: 'Administracijska Nadzorna Ploča',
      whatMaps: 'Što TribeMapper Kartografira',
      features: {
        trust: 'Obrasci povjerenja i utjecaja',
        decision: 'Dinamika donošenja odluka',
        connectors: 'Ključni poveznici i mostovi',
        clusters: 'Podgrupe i skupine',
        tension: 'Potencijalne točke napetosti',
        values: 'Dijeljene vrijednosti i jezik'
      },
      surveyLinkHint: 'Imate li link za anketu? Usmjerit će vas na pravo mjesto.'
    },
    
    // Admin login
    login: {
      title: 'Administratorski Pristup',
      description: 'Unesite administratorsku lozinku za nastavak.',
      passwordLabel: 'Lozinka',
      passwordPlaceholder: 'Unesite lozinku',
      errorInvalid: 'Neispravna lozinka',
      errorFailed: 'Prijava nije uspjela',
      signingIn: 'Prijava...',
      signIn: 'Prijavi se'
    },
    
    // Admin dashboard
    admin: {
      title: 'TribeMapper Admin',
      refresh: 'Osvježi',
      logout: 'Odjava',
      tabs: {
        overview: 'Pregled',
        roster: 'Popis',
        analytics: 'Analitika',
        settings: 'Postavke'
      },
      stats: {
        totalMembers: 'Ukupno Članova',
        completed: 'Završeno',
        active: 'Aktivno',
        pending: 'Na čekanju'
      },
      networkOverview: 'Pregled Mreže',
      structuralElements: 'Strukturni Elementi',
      bridges: 'Mostovi',
      isolates: 'Izolirani',
      clusters: 'Skupine',
      healthAndQuality: 'Zdravlje i Kvaliteta',
      overallHealth: 'Ukupno Zdravlje',
      dataCompleteness: 'Potpunost Podataka',
      confidence: 'Pouzdanost',
      dataQualityGaps: 'Praznine u Kvaliteti Podataka',
      recommendations: 'Preporuke',
      membersFlagged: 'članova označeno za praćenje',
      detailedAnalysis: 'Detaljna Analiza',
      followUpRequired: 'Potrebno Praćenje',
      interviewShortlist: 'Kratki Popis za Intervju',
      membersRecommended: 'članova preporučeno',
      trigger: 'Pokreni',
      clusterId: 'Skupina',
      membersCount: 'članova',
      density: 'gustoća',
      noBridges: 'Nema otkrivenih mostova',
      noIsolates: 'Nema otkrivenih izoliranih',
      noClusters: 'Nema otkrivenih skupina',
      
      // Settings
      generateLinks: 'Generiraj Linkove za Anketu',
      createTokens: 'Kreiraj jedinstvene tokene za članove',
      generate: 'Generiraj',
      generating: 'Generiranje...',
      generatedLinks: 'Generirani Linkovi',
      copy: 'Kopiraj',
      linkGenerated: 'Generiran {count} link',
      linksGenerated: 'Generirano {count} linkova',
      failedLinks: 'Neuspješno generiranje linkova',
      noLinksGenerated: 'Nije generiran nijedan link',
      networkError: 'Greška mreže: Neuspješno generiranje linkova',
      database: 'Baza Podataka',
      initializeDatabase: 'Inicijaliziraj Baz Podataka',
      databaseInitialized: 'Baza podataka inicijalizirana',
      
      // Roster table
      table: {
        member: 'Član',
        status: 'Status',
        stage: 'Faza',
        trustIn: 'Povjerenje Ulazno',
        trustOut: 'Povjerenje Izlazno',
        collab: 'Suradnja',
        score: 'Ocjena',
        anonymous: 'Anonimno'
      },
      
      // Status
      status: {
        completed: 'završeno',
        active: 'aktivno',
        pending: 'na čekanju'
      }
    },
    
    // Survey 1
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
        submitting: 'Slanje...'
      },
      selectUpTo: 'Odaberite do {count}',
      questions: {
        a1_name: 'Kako vas trebamo zvati ?',
        a1_name_desc: 'Vaše ime ili nadimak u sustavu',
        a1_name_placeholder: 'Vaše ime',
        a2_role: 'Kako biste opisali svoju ulogu ?',
        a2_role_desc: 'Ono što zapravo radite svakodnevno',
        a2_role_placeholder: 'Npr: Koordiniram timovima, rukujem logistikom, itd.',
        a3_duration: 'Koliko dugo ste dio ove grupe ?',
        b1_trust: 'Kome najviše vjerujete ?',
        b1_trust_desc: 'Do 5 osoba na koje se oslanjate',
        b2_collaboration: 'S kim najtješnje surađujete ?',
        b3_influence: 'Čija mišljenja utječu na odluke ?',
        b4_conflicts: 'Netko s kim imate poteškoća ?',
        b4_conflicts_desc: 'Opcionalno — privatno i povjerljivo',
        c1_decision: 'Kako se donose glavne odluke ?',
        c2_conflict: 'Kako se rješavaju neslaganja ?',
        c3_initiative: 'Kako započinju novi projekti ?',
        c4_information: 'Kako teče informacija ?',
        d1_values: 'Što je najvažnije za ovu grupu ?',
        d1_values_desc: 'Odaberite točno 3',
        d2_language: 'Koje izraze stranac ne bi razumio ?',
        d2_language_placeholder: 'Interne šale, kodna imena projekata, itd.',
        d3_experiences: 'Koji trenuci definiraju ovu grupu ?',
        d3_experiences_placeholder: 'Lansiranja, krize, povlačenja...',
        d4_vision: 'Prema čemu bi grupa trebala raditi ?',
        d4_vision_placeholder: 'Gdje bismo trebali biti za 1 godinu ?',
        e1_health: 'Kako je grupi ukupno ?',
        e2_influence: 'Koliki utjecaj imate ?'
      },
      options: {
        // Duration
        less_3mo: 'Manje od 3 mjeseca',
        '3mo_1yr': '3–12 mjeseci',
        '1yr_2yr': '1–2 godine',
        '2yr_5yr': '2–5 godina',
        '5yr_plus': '5+ godina',
        // Decision making
        leader_decides: 'Vođe odlučuju',
        leader_decides_desc: 'Jedna ili dvije osobe donose odluku',
        consensus: 'Konsenzus',
        consensus_desc: 'Svi raspravljaju do dogovora',
        vote: 'Glasanje',
        vote_desc: 'Većina pobjeđuje',
        organic: 'Organski nastaje',
        organic_desc: 'Nema eksplicitnog procesa',
        // Conflict
        avoid: 'Izbjegavano',
        avoid_desc: 'Sakriveno ispod tepiha',
        mediate: 'Posredovano',
        mediate_desc: 'Treća strana pomaže riješiti',
        confront: 'Direktno',
        confront_desc: 'Uključeni rješavaju problem',
        escalate: 'Escalirano',
        escalate_desc: 'Vođe interveniraju',
        // Initiative
        permission: 'Zahtijeva dozvolu',
        permission_desc: 'Potrebno odobrenje vođa',
        volunteers: 'Volonteri formiraju timove',
        volunteers_desc: 'Prirodna suradnja',
        anyone: 'Svatko može započeti',
        anyone_desc: 'Nema formalnog procesa',
        committee: 'Evaluacija odbora',
        committee_desc: 'Strukturirana procjena',
        // Information
        top_down: 'Top-down',
        top_down_desc: 'Vođe najavljuju grupi',
        hubs: 'Preko ključnih osoba',
        hubs_desc: 'Određene osobe šire dalje',
        network: 'Mreža',
        network_desc: 'Mnogi razgovori',
        chaos: 'Kaotično',
        chaos_desc: 'Nejasno, ponekad kasno',
        // Values
        quality: 'Kvaliteta i Izvrsnost',
        speed: 'Brzina i Rezultati',
        community: 'Zajednica i Pripadnost',
        innovation: 'Inovacija',
        stability: 'Stabilnost',
        autonomy: 'Autonomija',
        impact: 'Utjecaj',
        fairness: 'Pravednost',
        // Health scale
        struggling: 'U poteškoćama',
        challenged: 'Izazvano',
        stable: 'Stabilno',
        growing: 'U rastu',
        thriving: 'Uspravno',
        // Influence scale
        minimal: 'Minimalno',
        some: 'Nekoliko',
        moderate: 'Umjereno',
        high: 'Visoko',
        very_high: 'Vrlo visoko'
      }
    },
    
    // Survey 2
    survey2: {
      loading: 'Učitavanje...',
      completed: 'Hvala',
      completedMessage: 'Vaši dodatni uvidi su vrijedni.',
      followUpQuestions: 'Pitanja za Praćenje',
      back: 'Natrag',
      continue: 'Nastavi',
      submit: 'Pošalji',
      submitting: 'Slanje...',
      selectUpTo: 'Odaberite do {count}',
      questions: {
        bridge_1: 'Kako ostajete povezani s različitim dijelovima grupe ?',
        bridge_2: 'Kome biste se obratili za pomoć izvan svog područja ?',
        role_1: 'Kako se vaša uloga nedavno promijenila ?',
        role_2: 'Ako biste se povukli, tko bi mogao preuzeti vašu ulogu ?',
        values_1: 'Kada ste se osjećali najviše usklađeno s grupom ?',
        values_2: 'Kada ste se osjećali najmanje usklađeno s grupom ?',
        gap_1: 'Koga biste voljeli bolje upoznati ?',
        gap_2: 'Tko se čini izolirano ili odvojeno ?',
        influence_1: 'Tko vas najviše utječe ?',
        influence_2: 'Kako utječete na odluke ?'
      },
      options: {
        role_more_central: 'Više centralno/utjecajno',
        role_less_central: 'Manje centralno',
        role_same: 'Ostalo isto',
        role_changed: 'Promijenilo se u prirodi',
        influence_direct: 'Govoriti u raspravama',
        influence_indirect: 'Razgovori jedan na jedan',
        influence_expert: 'Moja stručnost ima težinu',
        influence_behind: 'Iza kulisa'
      },
      placeholders: {
        bridge_1: 'Opišite svoju ulogu mosta...',
        values_1: 'Specifičan trenutak...',
        values_2: 'Specifičan trenutak...'
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
