/**
 * Journalism Portfolio — Olukorede Yishau
 * Interactive Logic, Article Data, Filter Engine, and Modal Handlers
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Data Store: Detailed Article Dossiers
  const articleDatabase = {
    'art-1': {
      title: "Echoes of Despotism: Inside the Dark Machinations of Dictatorship and the Press",
      category: "Investigative",
      publication: "The Nation • Special Report & Sunday Cover",
      date: "Investigative Retrospective",
      methods: "Archival intelligence leaks, declassified security memos, underground safehouse records, and firsthand interviews with surviving pro-democracy journalists of the 1990s.",
      findings: "Documented systematic state wiretapping, intimidation protocols, and fabricated treason indictments used by military regimes to suppress investigative reporting, highlighting how administrative architectures from that era continue to influence contemporary security services.",
      impact: "Sparked a multi-part series debated across national broadcast networks; cited during National Assembly committee hearings on press freedom protections and whistleblower statutes.",
      excerpt: "“When the state turns its arsenal upon the word, it admits that truth is more lethal than gunpowder. In those dimly lit safehouses of Lagos, journalism ceased to be an occupation—it became an act of insurrection against tyranny...”"
    },
    'art-2': {
      title: "The Bleeding Floor: Insider Trading and Market Shenanigans on the Exchange",
      category: "Business & Markets",
      publication: "The Nation (Capital Market Desk) — NMMA Laureate 2013",
      date: "Winner: NMMA Capital Market Reporter",
      methods: "Forensic analysis of order-book transaction volumes, matching broker-dealer registries, confidential leaks from audit committees, and whistleblowing testimony from disaffected compliance officers.",
      findings: "Exposed a covert syndicate between high-profile stockbroking institutions and commercial banks that orchestrated artificial price spikes in penny stocks, dumping overvalued paper on unsophisticated retail investors ahead of scheduled regulatory audits.",
      impact: "Directly cited in an inquiry by the Securities and Exchange Commission (SEC); precipitated disciplinary delistings and expedited the rollout of electronic trade tracking algorithms across the Nigerian Stock Exchange.",
      excerpt: "“On the trading floor, the ticker tape does not merely record prices—it records the quiet liquidation of retirees' life savings. Behind the veneer of bullish optimism lay a sophisticated apparatus of manufactured demand...”"
    },
    'art-3': {
      title: "Danger in the Skies: Maintenance Lapses and Civil Aviation Regulatory Oversight",
      category: "Aviation & Safety",
      publication: "The Source / The Nation — NMMA Laureate 2003",
      date: "Winner: NMMA Aviation Industry Reporter",
      methods: "Airside hangar access, analysis of aircraft flight logs, verification of minimum equipment list (MEL) deferrals, and interviews with licensed aircraft maintenance engineers (LAME).",
      findings: "Revealed routine commercial operation of aging McDonnell Douglas and Boeing airframes with deferred maintenance clearances, pilot fatigue duty hours systematically manipulated to cut crew expenses, and obsolete runway calibration gear.",
      impact: "Compelled the Federal Ministry of Aviation to inaugurate a comprehensive safety audit panel; led to the temporary grounding of two domestic operators and accelerated the modernization of radar landing aids.",
      excerpt: "“Aviation safety is written in blood. Every deferred maintenance bolt, every exhausted captain flying into storm season on an expired simulator check, is an invitation to catastrophe...”"
    },
    'art-4': {
      title: "The Godfather Phenomenon: The Politics of Rent-Seeking and Democratic Capture",
      category: "Politics & Governance",
      publication: "The Sunday Column (The Nation) — NMMA Laureate 2015",
      date: "Winner: NMMA Columnist of the Year",
      methods: "Field interviews with grassroots ward leaders, tracking state budget allocation diversion records, and empirical study of gubernatorial godfathers across three geopolitical zones.",
      findings: "Analyzed the parasitic transactional contracts wherein political godfathers bankroll gubernatorial candidates in exchange for unilateral control over state treasury accounts and cabinet placements.",
      impact: "Widely syndicated across the Nigerian media landscape, adopted as reading material in university political science departments, and awarded Columnist of the Year at the Nigeria Media Merit Awards.",
      excerpt: "“In our democratic masquerade, the voters queue in the scorching sun, but the feast was concluded the night before in the private sitting rooms of oligarchs who regard state treasuries as their personal estates...”"
    },
    'art-5': {
      title: "Subway Dreams & Winter Blues: The Lived Realities of the New African Migrant",
      category: "Features & Diaspora",
      publication: "The Nation • Life in the Big Apple Dispatch",
      date: "New York Bureau Special Feature",
      methods: "Ethnographic reporting in Harlem, Brooklyn, and the Bronx; riding overnight delivery shifts with African gig workers; tracking informal remittance networks and asylum legal consultations.",
      findings: "Explored the paradox of skilled African professionals holding doctorates and master’s degrees forced into precarious gig-economy roles, navigating systemic coldness, legal vulnerability, and relentless remittance demands.",
      impact: "Drew profound empathy across the diaspora community and generated an ongoing international dialogue on brain drain, dignified labor, and transnational identity.",
      excerpt: "“When the 2-train rattles into 125th Street at 2:00 AM, the passengers carry the burden of two continents. In their pockets are receipts of money wired to pay for malaria treatments in Ibadan, while their hands are numbed by the bitter frost of a city that never stops demanding...”"
    },
    'art-6': {
      title: "Subsidies of Illusion: The Phantom Vessels and the Sovereign Fuel Scam",
      category: "Investigative",
      publication: "The Nation • Energy & Public Finance Investigation",
      date: "Special Investigative Series",
      methods: "Automated Identification System (AIS) satellite vessel tracking, customs bill of lading cross-referencing, offshore ship-to-ship transfer reconciliations, and central bank foreign exchange allocation audits.",
      findings: "Uncovered instances where subsidy claims worth hundreds of millions of dollars were disbursed for maritime vessels that never berthed in Nigerian territorial waters, exposing massive fabricated invoice rings.",
      impact: "Contributed crucial journalistic documentation utilized by parliamentary probe panels and the Economic and Financial Crimes Commission (EFCC) during high-profile recovery litigations.",
      excerpt: "“The ships existed only in the ink of rubber stamps and the imagination of treasury looters. On paper, millions of metric tonnes of refined fuel were feeding the nation's energy grid; in reality, only phantom manifests were docking...”"
    },
    'art-7': {
      title: "The Cost of Loyalty: Cabinets, Cronyism, and the Erosion of Technocracy",
      category: "Politics & Governance",
      publication: "The Nation • Political Analysis Desk",
      date: "Lead Sunday Essay",
      methods: "Comparative analysis of federal ministerial ministerial rosters across three republics, correlating cabinet portfolios with political campaign donor registries.",
      findings: "Demonstrated how crucial fiscal, trade, and education portfolios were systematically sacrificed to pacify political faction leaders rather than deployed to address structural macroeconomic headwinds.",
      impact: "Generated spirited debate among policy analysts and was featured on national breakfast broadcast panels.",
      excerpt: "“When governance becomes an exercise in distributing rewards to party loyalists, national survival is relegated to an afterthought. We cannot expect technocratic miracles from cabinets constructed as political settlement vouchers...”"
    },
    'art-8': {
      title: "Monetary Tightening vs. Real-Sector Survival: The Dilemma of Central Banking",
      category: "Business & Markets",
      publication: "The Nation • Economic Desk",
      date: "Financial Governance In-Depth",
      methods: "Interviews with manufacturing CEOs, review of Monetary Policy Committee (MPC) communique trends, and econometric evaluation of lending interest spreads.",
      findings: "Showed that aggressive benchmark interest rate increases were disproportionately crushing domestic small and medium enterprises (SMEs) without dampening food and foreign exchange-driven cost-push inflation.",
      impact: "Cited by organized private sector unions in pre-budget memorandums to the Ministry of Finance.",
      excerpt: "“In the orthodox economics textbook, raising interest rates reins in money supply. But in an economy where inflation is driven by bad roads, port bottlenecks, and fuel costs, raising rates simply crushes the manufacturer while banks declare record spreads...”"
    },
    'art-9': {
      title: "The Grounded Ambitions: The Never-Ending Tale of a National Flag Carrier",
      category: "Aviation & Safety",
      publication: "The Nation • Aviation Desk",
      date: "Special Investigation",
      methods: "FOI requests on aircraft wet-lease contracts, registry filings of foreign shadow partners, and financial statements of national aviation development funds.",
      findings: "Charted millions of public funds expended on overseas aircraft livery unveilings and consultancy studies for national carrier projects that repeatedly dissolved in legal gridlock.",
      impact: "Heightened public scrutiny, contributing to the eventual restructuring and judicial reviews of proposed airline partnerships.",
      excerpt: "“For decades, Nigeria has launched airlines on PowerPoint slides and international airshow runways, while its domestic aviation sector struggles on runways devoid of night navigational lights...”"
    },
    'art-10': {
      title: "Between Two Worlds: The Search for Ancestral Belonging in the Diaspora",
      category: "Features & Diaspora",
      publication: "The Nation • Cultural Feature",
      date: "Life in the Big Apple Series",
      methods: "Interviews with second-generation diaspora youth, sociologists, and cultural repatriation collectives in New York and London.",
      findings: "Chronicles the psychological journey of first-generation American-born Africans who feel culturally estranged in the West yet encounter alienation when returning to their parents' homeland.",
      impact: "Featured in diaspora university forums and literary panels on transnational identity.",
      excerpt: "“They speak English with an American cadence, but their names carry the weight of Yoruba deities and Igbo proverbs. In Brooklyn they are called African; in Lagos they are called 'Americana'. Home becomes not a geographical coordinate, but a quiet longing...”"
    }
  };

  // 2. Theme Toggle (Light / Dark)
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('oy_portfolio_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('oy_portfolio_theme', newTheme);
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('open');
    });

    // Close mobile nav when clicking a link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Interactive Article Filtering & Live Search
  const filterTabs = document.querySelectorAll('.filter-tab');
  const articleCards = document.querySelectorAll('.article-card');
  const searchInput = document.getElementById('article-search');

  function filterArticles() {
    const activeTab = document.querySelector('.filter-tab.active');
    const selectedFilter = activeTab ? activeTab.dataset.filter : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    articleCards.forEach(card => {
      const category = card.dataset.category;
      const text = card.textContent.toLowerCase();

      const matchesFilter = (selectedFilter === 'all') || (category === selectedFilter);
      const matchesSearch = (searchQuery === '') || text.includes(searchQuery);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterArticles();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterArticles);
  }

  // 5. In-Depth Article Brief Modal
  const modalBackdrop = document.getElementById('article-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCat = document.getElementById('modal-cat');
  const modalMeta = document.getElementById('modal-meta');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');

  function openArticleModal(articleId) {
    const article = articleDatabase[articleId];
    if (!article || !modalBackdrop) return;

    modalTitle.textContent = article.title;
    modalCat.textContent = article.category;
    modalMeta.textContent = `${article.publication} • ${article.date}`;

    modalBody.innerHTML = `
      <h4>Investigative Excerpt</h4>
      <blockquote style="font-family: var(--font-serif-body); font-style: italic; font-size: 1.1rem; line-height: 1.6; border-left: 3px solid var(--accent-gold); padding-left: 1rem; margin-bottom: 1.5rem; color: var(--text-main);">
        ${article.excerpt}
      </blockquote>

      <h4>Reporting Methodology & Sourcing</h4>
      <p style="margin-bottom: 1.25rem;">${article.methods}</p>

      <h4>Key Findings & Revelations</h4>
      <p style="margin-bottom: 1.25rem;">${article.findings}</p>

      <h4>Public & Legislative Impact</h4>
      <p style="margin-bottom: 1.25rem;">${article.impact}</p>
    `;

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeArticleModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-read-brief').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const artId = e.currentTarget.dataset.articleId;
      openArticleModal(artId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeArticleModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeArticleModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeArticleModal();
    });
  }

  // 6. Complete Raw Dossier Modal View
  const dossierModal = document.getElementById('dossier-modal');
  const viewRawDossierBtn = document.getElementById('view-raw-dossier');
  const dossierCloseBtn = document.getElementById('dossier-close-btn');
  const dossierDismissBtn = document.getElementById('dossier-dismiss-btn');
  const dossierCopyBtn = document.getElementById('dossier-copy-btn');
  const rawDossierText = document.getElementById('raw-dossier-text');

  let dossierMarkdownContent = null;

  async function loadDossierMarkdown() {
    if (dossierMarkdownContent) return dossierMarkdownContent;
    try {
      const res = await fetch('JOURNALISM_PORTFOLIO_OLUKOREDE_YISHAU.md');
      if (res.ok) {
        dossierMarkdownContent = await res.text();
        return dossierMarkdownContent;
      }
    } catch (e) {
      console.warn("Could not fetch markdown file directly; falling back to embedded summary.", e);
    }
    return `# JOURNALISM PORTFOLIO — OLUKOREDE YISHAU\n\nAssociate Editor & US Bureau Chief, The Nation Newspaper.\nQuadruple NMMA Laureate.\n(Full 12-section document available in workspace file JOURNALISM_PORTFOLIO_OLUKOREDE_YISHAU.md)`;
  }

  if (viewRawDossierBtn && dossierModal) {
    viewRawDossierBtn.addEventListener('click', async () => {
      const content = await loadDossierMarkdown();
      if (rawDossierText) rawDossierText.textContent = content;
      dossierModal.classList.add('open');
      dossierModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeDossierModal() {
    if (!dossierModal) return;
    dossierModal.classList.remove('open');
    dossierModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (dossierCloseBtn) dossierCloseBtn.addEventListener('click', closeDossierModal);
  if (dossierDismissBtn) dossierDismissBtn.addEventListener('click', closeDossierModal);
  if (dossierModal) {
    dossierModal.addEventListener('click', (e) => {
      if (e.target === dossierModal) closeDossierModal();
    });
  }

  if (dossierCopyBtn) {
    dossierCopyBtn.addEventListener('click', async () => {
      const content = await loadDossierMarkdown();
      navigator.clipboard.writeText(content).then(() => {
        const originalText = dossierCopyBtn.textContent;
        dossierCopyBtn.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => {
          dossierCopyBtn.textContent = originalText;
        }, 2500);
      });
    });
  }

  // 7. Print Dossier Triggers (Window Print)
  const printDossierBtn = document.getElementById('print-dossier-btn');
  const printDossierAction = document.getElementById('print-dossier-action');
  const footerPrintBtn = document.getElementById('footer-print-btn');

  function triggerPrintDossier() {
    window.print();
  }

  if (printDossierBtn) printDossierBtn.addEventListener('click', triggerPrintDossier);
  if (printDossierAction) printDossierAction.addEventListener('click', triggerPrintDossier);
  if (footerPrintBtn) footerPrintBtn.addEventListener('click', triggerPrintDossier);

  // 8. Contact Form Submission Simulation
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Message...';
      }

      setTimeout(() => {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Thank you! Your editorial inquiry has been recorded. Direct communications are also routed to olukoredeyishau@gmail.com.';
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Inquiry';
        }
      }, 1000);
    });
  }

  // 9. Current Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 10. Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeArticleModal();
      closeDossierModal();
    }
  });

});
