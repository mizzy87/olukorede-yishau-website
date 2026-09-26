/**
 * Olukorede Yishau - Broadsheet & Literary Editorial Interactive Engine
 * Handles reading modal, category filtering, scroll metrics, and inquiry submission.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Reading Progress Bar
    // --------------------------------------------------------------------------
    const progressBar = document.getElementById('reading-progress');
    
    const updateReadingProgress = () => {
        if (!progressBar) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.pageYOffset / totalHeight) * 100;
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    updateReadingProgress();

    // --------------------------------------------------------------------------
    // 2. Theme Toggle with System Preference Sync
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (themeToggleBtn) {
                themeToggleBtn.setAttribute('aria-label', 'Switch to archival light theme');
                themeToggleBtn.setAttribute('title', 'Switch to archival light theme');
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (themeToggleBtn) {
                themeToggleBtn.setAttribute('aria-label', 'Switch to obsidian dark theme');
                themeToggleBtn.setAttribute('title', 'Switch to obsidian dark theme');
            }
        }
    };

    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const nextTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', nextTheme);
            applyTheme(nextTheme);
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // --------------------------------------------------------------------------
    // 3. Mobile Navigation Drawer
    // --------------------------------------------------------------------------
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-menu');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', String(!expanded));
            mobileDrawer.classList.toggle('open');
            mobileDrawer.setAttribute('aria-hidden', String(expanded));
        });

        mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileDrawer.classList.remove('open');
                mobileDrawer.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // --------------------------------------------------------------------------
    // 4. Interactive Category Filtering (Segmented Control)
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterableItems = document.querySelectorAll('.journalism-filterable');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            filterableItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    if (item.classList.contains('lead-investigation-box')) {
                        item.style.display = 'block';
                    } else if (item.classList.contains('register-item')) {
                        item.style.display = window.innerWidth <= 768 ? 'flex' : 'grid';
                    } else {
                        item.style.display = 'flex';
                    }
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // 5. Reading Modal for Articles & Book Excerpts
    // --------------------------------------------------------------------------
    const modal = document.getElementById('reader-modal');
    const modalMetaTag = document.getElementById('modal-meta-tag');
    const modalReadtime = document.getElementById('modal-readtime');
    const modalBody = document.getElementById('modal-body-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDismissBtn = document.getElementById('modal-dismiss-btn');
    const fontDecBtn = document.getElementById('reader-font-dec');
    const fontIncBtn = document.getElementById('reader-font-inc');

    let currentFontSizeRem = 1.05;

    if (fontDecBtn && fontIncBtn) {
        fontDecBtn.addEventListener('click', () => {
            if (currentFontSizeRem > 0.85) {
                currentFontSizeRem -= 0.1;
                if (modalBody) modalBody.style.fontSize = `${currentFontSizeRem}rem`;
            }
        });

        fontIncBtn.addEventListener('click', () => {
            if (currentFontSizeRem < 1.45) {
                currentFontSizeRem += 0.1;
                if (modalBody) modalBody.style.fontSize = `${currentFontSizeRem}rem`;
            }
        });
    }

    // Archive content repository
    const archiveContent = {
        'father': {
            meta: 'Literary Novel Excerpt · Parresia Publishers',
            readtime: '12 min excerpt',
            title: 'In the Name of Our Father: Chapter One Excerpt',
            byline: 'By Olukorede Yishau · Longlisted, The Nigeria Prize for Literature ($100,000 NLNG Award)',
            html: `
                <p class="drop-cap-p">The smell of burning diesel and rain-soaked asphalt always announced an impending siege in the capital. Justus sat across the scarred mahogany desk, watching the smoke from the general’s cigar curl lazily toward the ceiling fan.</p>
                <p>In those turbulent years of military decree, the border between salvation and state treason was as thin as tissue paper. The Prophet had arrived at midnight through the barracks rear gate, clutching a leather-bound bible whose gilded edges were worn raw from decades of theatrical preaching.</p>
                <blockquote>"You ask of God whether the throne will remain yours, General? God answers not with guarantees, but with demands for unwavering obedience."</blockquote>
                <p>Justus fingered the miniature tape recorder nestled within the lining of his breast pocket. Every instinct honed over fifteen years in Lagos newsrooms warned him that this room would not tolerate witnesses. Yet the story—the sinister covenant between ecclesiastical hypocrisy and gun-barrel power—demanded to be committed to parchment, whatever the cost.</p>
                <p>The city outside slumbered under curfews, unaware that its destiny was being negotiated over warm brandy and fabricated prophecies. And when morning broke, the front pages would carry what the state permitted—until the truth found its crack in the wall.</p>
            `
        },
        'vaults': {
            meta: 'Short Fiction Collection · Anthology Excerpt',
            readtime: '9 min read',
            title: 'Vaults of Secrets: "The Whispering Walls"',
            byline: 'By Olukorede Yishau · Parresia Publishers',
            html: `
                <p class="drop-cap-p">Every house in the government residential reservation carried an invisible ledger. In Chief Alao’s duplex, the ledger was kept not in ledgers or safe deposit vaults, but within the hollowed silence of the master library.</p>
                <p>For twenty years, Alao had been the man who smoothed the jagged edges of political transitions. Ministers visited at 2 a.m. Judges drank his single malt scotch and left briefcases on the wicker chairs. And throughout it all, his wife Simi observed the silent arithmetic of their luxury.</p>
                <blockquote>"A secret is not a burden until the person who gave it to you forgets why they feared you."</blockquote>
                <p>When the anticorruption agency finally tapped on the wrought-iron gates on a rain-drenched Tuesday morning, there was no panic. Just the slow, deliberate turning of a key inside a brass lock that had kept silence for a quarter of a century.</p>
            `
        },
        'after': {
            meta: 'Contemporary Fiction · Opening Excerpt',
            readtime: '11 min read',
            title: 'After The End: Synopsis & Prologue',
            byline: 'By Olukorede Yishau · Author of In the Name of Our Father',
            html: `
                <p class="drop-cap-p">Grief in Lagos is never a quiet affair. It arrives wrapped in the cacophony of condolences from relatives whose eyes scan the sitting room furniture even while their mouths offer hymns of comfort.</p>
                <p>Demilade stood by the French window overlooking the lagoon, clutching the wedding ring that felt heavier now than it ever had during seven years of marriage. Her husband’s brothers were already downstairs, conferring in low, urgent murmurs regarding property deeds and bank signatories.</p>
                <blockquote>"In our tradition, they said, a woman does not inherit; she is merely entrusted with custody until the family decides. But Demilade had spent seven years building this roof with her own sweat."</blockquote>
                <p><em>After The End</em> is an unflinching, intimate narrative charting one woman’s refusal to be erased by bereavement and patriarchally sanctioned dispossession in modern Nigeria.</p>
            `
        },
        'art-1': {
            meta: 'Investigative Report · Public Finance & Oversight',
            readtime: '8 min read',
            title: 'The Anatomy of a Nation’s Conscience: Financial Shadows in Public Procurement',
            byline: 'By Olukorede Yishau · The Nation Special Investigations Desk',
            html: `
                <p class="drop-cap-p">Across three states in the federation, our six-month investigative audit unraveled an intricate ecosystem of phantom project certifications that drained an estimated eighteen billion naira from regional infrastructure accounts.</p>
                <p>Under the pretext of emergency rural electrification, contracts were awarded to newly registered corporate shells whose registered addresses terminated at vacant storefronts in suburban Abuja. Meanwhile, five hundred thousand villagers continue to live in darkness, relying on kerosene lanterns and diesel generators.</p>
                <blockquote>"Public procurement is not merely an administrative procedure; it is the fundamental moral contract between the governors and the governed."</blockquote>
                <p>When confronted with bank transfer records and site inspection logs showing zero groundbreaking on designated transformer pads, state officials deferred comment to a nonexistent inter-ministerial review committee. This dispatch presents the full paper trail, forensic audits, and testimonies of civil servants who chose truth over silence.</p>
            `
        },
        'art-2': {
            meta: 'Column & Commentary · Nigerian Democratic Institutions',
            readtime: '5 min read',
            title: 'The State of the Republic: Why Electoral Reform Cannot Wait',
            byline: 'By Olukorede Yishau · The Nation Broadsheet Columnist',
            html: `
                <p class="drop-cap-p">No nation sustains a democracy when its citizens view polling units as theatrical stages rather than instruments of sovereign will. The pervasive cynicism that keeps seventy percent of registered voters at home on election day is not apathy; it is an indictment.</p>
                <p>When electronic transmission of results becomes a contentious debate rather than an obvious institutional standard, we must ask: whose interests does technical ambiguity serve? The answers are neither obscure nor mysterious.</p>
                <p>True sovereignty demands that the vote of the street sweeper in Ajegunle carries identical mathematical integrity to the declaration of the electoral commissioner. Until auditability is non-negotiable, democratic consolidation remains an unfulfilled promise.</p>
            `
        },
        'art-3': {
            meta: 'Diplomatic Dispatch · US-Africa Relations',
            readtime: '7 min read',
            title: 'From the Potomac to the Niger: Re-imagining US-Nigeria Strategic Partnerships',
            byline: 'By Olukorede Yishau · United States Bureau Chief, Washington D.C.',
            html: `
                <p class="drop-cap-p">Walking the corridors of the Dirksen Senate Office Building in Washington, one is struck by how frequently discussions on Sub-Saharan Africa remain anchored to outdated Cold War paradigms or reactive security containment.</p>
                <p>Nigeria, with its surging demographic youth dividend and technological innovation ecosystem, represents the definitive economic frontier of the Atlantic basin. The diaspora community alone channels over twenty billion dollars annually into the homeland—surpassing official development assistance by several multiples.</p>
                <blockquote>"The partnership of the next half-century cannot be dictated from Capitol Hill; it must be negotiated as an equal dialogue between sovereign economic powerhouses."</blockquote>
                <p>From bilateral digital commerce to renewable energy co-investments, this dispatch assesses the legislative initiatives reshaping the diplomatic architecture between Washington and Abuja.</p>
            `
        },
        'art-4': {
            meta: 'Field Reportage · Healthcare & Society',
            readtime: '10 min read',
            title: 'Unspoken Sacrifices: Behind the Frontlines of Community Healthcare',
            byline: 'By Olukorede Yishau · Special Feature Series',
            html: `
                <p class="drop-cap-p">At 3:00 a.m. in the maternity ward of a district hospital forty kilometers south of Ibadan, Dr. Adeyemi delivers a healthy baby boy using the flashlight of an old smartphone. The municipal grid collapsed six hours earlier.</p>
                <p>This is the routine reality for hundreds of medical professionals across Nigeria who remain behind while their peers migrate to the United Kingdom, Canada, and the United States in historic numbers. Their dedication is nothing short of heroic, but heroism is not a sustainable substitute for hospital infrastructure.</p>
                <p>Our investigative feature documents the human cost of health budget deficits and the urgent policy interventions needed to retain the country's finest medical talents.</p>
            `
        },
        'art-5': {
            meta: 'Opinion & Societal Inquest · NMMA Entry',
            readtime: '6 min read',
            title: 'Between the Pulpit and the Ballot: The Dangerous Currency of Religious Politics',
            byline: 'By Olukorede Yishau · Award-Winning Columnist',
            html: `
                <p class="drop-cap-p">When politicians begin seeking spiritual legitimacy in the tabernacle rather than constitutional compliance in the courthouse, the republic is in grave peril.</p>
                <p>In recent election cycles, religious pulpits have increasingly been transformed into campaign podiums, where blessings are traded for state patronages and partisan loyalties are couched in divine mandates. This dangerous fusion corrodes both faith and statecraft.</p>
                <p>A secular democracy is not hostile to faith; it is the only constitutional safeguard that ensures every faith—and those of none—can co-exist under equal protection of the law.</p>
            `
        },
        'art-6': {
            meta: 'Diaspora Inquiry · North American Affairs',
            readtime: '6 min read',
            title: 'The Brain Drain Paradox: Nigerian Intellectual Capital in the American Diaspora',
            byline: 'By Olukorede Yishau · Washington Bureau',
            html: `
                <p class="drop-cap-p">In academic medical centers from Johns Hopkins to MD Anderson, Nigerian physicians lead critical research departments. In Silicon Valley, engineers of Nigerian descent architect artificial intelligence infrastructure.</p>
                <p>Yet for every story of diasporic triumph, there is the lingering sorrow of a homeland starved of its sharpest minds. What would it take to reverse this trajectory—or at least transform brain drain into brain circulation?</p>
                <p>Drawing on extensive interviews with Nigerian professionals across the East Coast of the United States, this essay charts practical mechanisms for institutional re-engagement, dual-appointment university models, and cross-border venture capital funds.</p>
            `
        }
    };

    const openModal = (contentKey) => {
        const item = archiveContent[contentKey];
        if (!item || !modal || !modalBody || !modalMetaTag) return;

        modalMetaTag.textContent = item.meta;
        if (modalReadtime) modalReadtime.textContent = item.readtime ? `· ${item.readtime}` : '';
        modalBody.innerHTML = `
            <h2>${item.title}</h2>
            <div class="article-byline">${item.byline}</div>
            ${item.html}
        `;

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (modalCloseBtn) modalCloseBtn.focus();
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Attach click handlers to book excerpt buttons
    document.querySelectorAll('.btn-read-excerpt').forEach(btn => {
        btn.addEventListener('click', () => {
            const bookKey = btn.getAttribute('data-book');
            openModal(bookKey);
        });
    });

    // Attach click handlers to article dispatch buttons
    document.querySelectorAll('.btn-read-article').forEach(btn => {
        btn.addEventListener('click', () => {
            const articleId = btn.getAttribute('data-article-id');
            openModal(articleId);
        });
    });

    // Attach click handlers to dispatch register buttons
    document.querySelectorAll('.btn-register-read').forEach(btn => {
        btn.addEventListener('click', () => {
            const articleId = btn.getAttribute('data-article-id');
            openModal(articleId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // --------------------------------------------------------------------------
    // 6. Editorial Inquiry Form Handler
    // --------------------------------------------------------------------------
    const inquiryForm = document.getElementById('inquiry-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const typeInput = document.getElementById('form-inquiry-type');
            const messageInput = document.getElementById('form-message');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                if (formFeedback) {
                    formFeedback.textContent = 'Please provide your full name, email, and inquiry context.';
                    formFeedback.style.color = '#DC2626';
                }
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Transmitting...</span> <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>`;
            }

            // Simulate polite editorial dispatch
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Transmitted</span> <i class="fas fa-check" aria-hidden="true"></i>`;
                }

                if (formFeedback) {
                    formFeedback.innerHTML = `
                        <div class="feedback-success">
                            <strong>Inquiry Transmitted Successfully.</strong><br>
                            Thank you, ${nameInput.value.trim()}. Your correspondence regarding "${typeInput.options[typeInput.selectedIndex]?.text || 'Editorial Consultation'}" has been forwarded to Olukorede Yishau’s bureau desk. A personal response will follow within 48 business hours.
                        </div>
                    `;
                }

                inquiryForm.reset();

                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = `<span>Transmit Inquiry</span> <i class="fas fa-paper-plane" aria-hidden="true"></i>`;
                    }
                }, 5000);
            }, 600);
        });
    }

    // --------------------------------------------------------------------------
    // 7. Mobile Bottom Navigation Scrollspy & Touch Navigation
    // --------------------------------------------------------------------------
    const bottomTabs = document.querySelectorAll('.bottom-tab');
    const trackedSections = ['about', 'books', 'journalism', 'accolades', 'contact']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const updateActiveBottomTab = () => {
        if (!bottomTabs.length || !trackedSections.length) return;
        const scrollPosition = window.pageYOffset + 240;

        let currentActiveId = '';
        trackedSections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentActiveId = section.getAttribute('id');
            }
        });

        // Edge case: top of page or bottom of page
        if (window.pageYOffset < 280) {
            currentActiveId = 'about';
        } else if ((window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 80) {
            currentActiveId = 'contact';
        }

        if (currentActiveId) {
            bottomTabs.forEach(tab => {
                if (tab.getAttribute('data-section') === currentActiveId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        }
    };

    window.addEventListener('scroll', updateActiveBottomTab, { passive: true });
    updateActiveBottomTab();

    bottomTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetId = tab.getAttribute('href')?.replace('#', '');
            const targetEl = targetId ? document.getElementById(targetId) : null;
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
                bottomTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            }
        });
    });

    // Touch swipe down on bottom sheet drag handle to close
    const modalWindow = modal ? modal.querySelector('.modal-window') : null;
    const dragHandle = modal ? modal.querySelector('.modal-drag-handle') : null;
    if (dragHandle && modalWindow) {
        let touchStartY = 0;
        let touchMoveY = 0;

        dragHandle.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchMoveY = touchStartY;
        }, { passive: true });

        dragHandle.addEventListener('touchmove', (e) => {
            touchMoveY = e.touches[0].clientY;
            const diff = touchMoveY - touchStartY;
            if (diff > 0) {
                modalWindow.style.transform = `translateY(${diff}px)`;
            }
        }, { passive: true });

        dragHandle.addEventListener('touchend', () => {
            const diff = touchMoveY - touchStartY;
            if (diff > 75) {
                closeModal();
            }
            modalWindow.style.transform = '';
            touchStartY = 0;
            touchMoveY = 0;
        });
    }
});
