/**
 * Olukorede Yishau - Portfolio Engine
 * Implements wireframe features: Selected Work filtering, reading modal, 
 * interactive project intake form, mobile bottom nav scrollspy, and gesture handlers.
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
    // 4. Interactive Category Filtering for SELECTED WORK
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterableProjects = document.querySelectorAll('.work-filterable');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            filterableProjects.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'flex';
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

    // Attach click handlers to project view buttons
    document.querySelectorAll('.btn-project-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project-id');
            openModal(projectId);
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
    // 6. Interactive Project Intake & Collaboration Form
    // --------------------------------------------------------------------------
    const inquiryForm = document.getElementById('inquiry-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');
    const openIntakeBtn = document.getElementById('btn-open-intake');

    if (openIntakeBtn) {
        openIntakeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const intakeBox = document.getElementById('project-intake');
            if (intakeBox) {
                intakeBox.scrollIntoView({ behavior: 'smooth' });
                const firstInput = document.getElementById('form-name');
                if (firstInput) setTimeout(() => firstInput.focus(), 600);
            }
        });
    }

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const typeInput = document.getElementById('form-inquiry-type');
            const messageInput = document.getElementById('form-message');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                if (formFeedback) {
                    formFeedback.textContent = 'Please provide your name, email, and project overview.';
                    formFeedback.style.color = '#DC2626';
                }
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Transmitting Project Brief...</span> <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>`;
            }

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Brief Received</span> <i class="fas fa-check" aria-hidden="true"></i>`;
                }

                if (formFeedback) {
                    formFeedback.innerHTML = `
                        <div class="feedback-success">
                            <strong>Project Brief Received Successfully.</strong><br>
                            Thank you, ${nameInput.value.trim()}. Your inquiry regarding "${typeInput.options[typeInput.selectedIndex]?.text || 'Editorial Project'}" has been forwarded directly to Olukorede Yishau’s bureau desk. A personal response and initial alignment call invitation will follow within 48 business hours.
                        </div>
                    `;
                }

                inquiryForm.reset();

                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = `<span>Submit Project Request</span> <i class="fas fa-paper-plane" aria-hidden="true"></i>`;
                    }
                }, 5000);
            }, 600);
        });
    }

    // --------------------------------------------------------------------------
    // 7. Mobile Bottom Navigation Scrollspy (Matching User's Layout)
    // --------------------------------------------------------------------------
    const bottomTabs = document.querySelectorAll('.bottom-tab');
    const trackedSections = ['work', 'services', 'process', 'about', 'contact']
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

        // Edge case: top or bottom of page
        if (window.pageYOffset < 280) {
            currentActiveId = 'work';
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

    // --------------------------------------------------------------------------
    // 8. Interactive Editorial Ambient Background Engine
    // --------------------------------------------------------------------------
    const initInteractiveBackground = () => {
        const canvas = document.getElementById('ambient-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cursorGlow = document.getElementById('ambient-cursor-glow');
        const modeToggle = document.getElementById('bg-mode-toggle');
        const modeLabel = document.getElementById('bg-mode-label');
        const rippleTrigger = document.getElementById('bg-ripple-trigger');

        const MODES = ['constellation', 'flow', 'grid'];
        const MODE_NAMES = {
            constellation: '✦ Constellation',
            flow: '≋ Ink Flow',
            grid: '⊞ Matrix Grid'
        };
        let currentMode = 'constellation';

        let width = 0;
        let height = 0;
        let dpr = 1;
        let animationFrameId = null;
        let isTabActive = true;
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Pointer state
        const pointer = {
            x: -2000,
            y: -2000,
            targetX: -2000,
            targetY: -2000,
            smoothX: -2000,
            smoothY: -2000,
            isActive: false,
            radius: 175,
            lastMove: Date.now()
        };

        let lastScrollY = window.pageYOffset;
        let scrollVelocity = 0;
        let particles = [];
        let ripples = [];

        // Colors depending on theme
        const getColors = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                return {
                    nodePrimary: 'rgba(221, 167, 94, ',      // Gold/amber
                    nodeSecondary: 'rgba(243, 244, 246, ',    // Crisp starlight
                    nodeTertiary: 'rgba(156, 163, 175, ',     // Slate
                    line: 'rgba(221, 167, 94, ',              // Gold hairline
                    cursorLine: 'rgba(232, 188, 120, ',       // Bright cursor filament
                    ripple: 'rgba(221, 167, 94, ',
                    gridLine: 'rgba(255, 255, 255, 0.05)',
                    gridDot: 'rgba(221, 167, 94, 0.3)'
                };
            } else {
                return {
                    nodePrimary: 'rgba(180, 131, 62, ',       // Warm gold
                    nodeSecondary: 'rgba(87, 83, 78, ',       // Warm ink charcoal
                    nodeTertiary: 'rgba(168, 162, 158, ',     // Muted stone
                    line: 'rgba(180, 131, 62, ',              // Warm gold hairline
                    cursorLine: 'rgba(180, 131, 62, ',        // Filament
                    ripple: 'rgba(180, 131, 62, ',
                    gridLine: 'rgba(26, 24, 22, 0.04)',
                    gridDot: 'rgba(180, 131, 62, 0.22)'
                };
            }
        };

        const createParticles = () => {
            particles = [];
            const count = Math.min(95, Math.max(36, Math.floor((width * height) / 14000)));

            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.15 + Math.random() * 0.35;
                const typeRand = Math.random();
                let type = 'primary';
                if (typeRand > 0.65) type = 'secondary';
                else if (typeRand > 0.45) type = 'tertiary';

                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 1.2 + Math.random() * 1.8,
                    baseAlpha: 0.25 + Math.random() * 0.55,
                    phase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.015 + Math.random() * 0.02,
                    type: type,
                    layer: Math.floor(Math.random() * 3),
                    energy: 0
                });
            }
        };

        const handleResize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
            createParticles();
        };

        const spawnRipple = (x, y, maxR = 340, intensity = 1.0) => {
            ripples.push({
                x: x,
                y: y,
                radius: 4,
                maxRadius: maxR,
                speed: 4.8,
                intensity: intensity,
                alpha: 0.65
            });

            particles.forEach(p => {
                const dx = p.x - x;
                const dy = p.y - y;
                const distSq = dx * dx + dy * dy;
                if (distSq < maxR * maxR && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / maxR) * 2.2 * intensity;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                    p.energy = Math.min(1.5, p.energy + force);
                }
            });
        };

        const onPointerMove = (e) => {
            const clientX = e.clientX;
            const clientY = e.clientY;
            pointer.targetX = clientX;
            pointer.targetY = clientY;
            pointer.isActive = true;
            pointer.lastMove = Date.now();

            if (cursorGlow) {
                cursorGlow.style.opacity = '1';
                cursorGlow.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
            }
        };

        const onPointerLeave = () => {
            pointer.isActive = false;
            pointer.targetX = -2000;
            pointer.targetY = -2000;
            if (cursorGlow) {
                cursorGlow.style.opacity = '0';
            }
        };

        const onPointerDown = (e) => {
            const target = e.target;
            const isClickable = target.closest('button, a, input, select, textarea, .modal-window');
            const intensity = isClickable ? 0.45 : 0.85;
            spawnRipple(e.clientX, e.clientY, isClickable ? 200 : 340, intensity);
        };

        window.addEventListener('mousemove', onPointerMove, { passive: true });
        document.body.addEventListener('mouseleave', onPointerLeave);
        window.addEventListener('mousedown', onPointerDown, { passive: true });

        // Touch handling
        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches[0]) {
                const t = e.touches[0];
                onPointerMove(t);
                spawnRipple(t.clientX, t.clientY, 240, 0.7);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                onPointerMove(e.touches[0]);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            setTimeout(() => {
                if (Date.now() - pointer.lastMove > 800) {
                    onPointerLeave();
                }
            }, 800);
        }, { passive: true });

        // Parallax and scroll reactivity
        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;
            scrollVelocity = (currentScrollY - lastScrollY) * 0.15;
            lastScrollY = currentScrollY;
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            isTabActive = !document.hidden;
            if (isTabActive && !animationFrameId && !isReducedMotion) {
                render();
            }
        });

        // Mode switching controls
        if (modeToggle) {
            modeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentIndex = MODES.indexOf(currentMode);
                currentMode = MODES[(currentIndex + 1) % MODES.length];
                if (modeLabel) {
                    modeLabel.textContent = MODE_NAMES[currentMode];
                }
                spawnRipple(width / 2, height / 2, 400, 1.0);
            });
        }

        if (rippleTrigger) {
            rippleTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                spawnRipple(width / 2, height / 2, 450, 1.25);
            });
        }

        let lastTime = performance.now();
        const render = () => {
            if (!isTabActive) {
                animationFrameId = null;
                return;
            }

            const now = performance.now();
            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;

            scrollVelocity *= 0.92;

            if (pointer.isActive) {
                pointer.smoothX += (pointer.targetX - pointer.smoothX) * 0.12;
                pointer.smoothY += (pointer.targetY - pointer.smoothY) * 0.12;
            } else {
                pointer.smoothX += (-2000 - pointer.smoothX) * 0.1;
                pointer.smoothY += (-2000 - pointer.smoothY) * 0.1;
            }

            ctx.clearRect(0, 0, width, height);
            const colors = getColors();

            if (currentMode === 'constellation') {
                renderConstellationMode(colors, dt);
            } else if (currentMode === 'flow') {
                renderFlowMode(colors, now, dt);
            } else if (currentMode === 'grid') {
                renderGridMode(colors, now, dt);
            }

            renderRipples(colors, dt);

            animationFrameId = requestAnimationFrame(render);
        };

        const renderConstellationMode = (colors, dt) => {
            const maxConnectDist = width < 768 ? 85 : 110;
            const maxConnectDistSq = maxConnectDist * maxConnectDist;
            const cursorRadiusSq = pointer.radius * pointer.radius;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.phase += p.pulseSpeed;
                const pulse = Math.sin(p.phase) * 0.25;

                if (p.energy > 0.01) {
                    p.energy *= 0.94;
                } else {
                    p.energy = 0;
                }

                if (pointer.isActive) {
                    const dx = pointer.smoothX - p.x;
                    const dy = pointer.smoothY - p.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < cursorRadiusSq) {
                        const dist = Math.sqrt(distSq);
                        const normDist = 1 - dist / pointer.radius;

                        const force = normDist * 0.45;
                        p.vx += (dx / dist) * force * 0.2;
                        p.vy += (dy / dist) * force * 0.2;
                        p.vx += (-dy / dist) * force * 0.15;
                        p.vy += (dx / dist) * force * 0.15;

                        const cursorLineAlpha = normDist * 0.45;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(pointer.smoothX, pointer.smoothY);
                        ctx.strokeStyle = `${colors.cursorLine}${cursorLineAlpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }

                p.vx *= 0.985;
                p.vy *= 0.985;

                const currentSpeedSq = p.vx * p.vx + p.vy * p.vy;
                if (currentSpeedSq < 0.04) {
                    p.vx += (Math.random() - 0.5) * 0.05;
                    p.vy += (Math.random() - 0.5) * 0.05;
                }

                p.y += p.vy - scrollVelocity * (0.1 + p.layer * 0.1);
                p.x += p.vx;

                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const cdx = p.x - p2.x;
                    const cdy = p.y - p2.y;
                    const cdistSq = cdx * cdx + cdy * cdy;

                    if (cdistSq < maxConnectDistSq) {
                        const cdist = Math.sqrt(cdistSq);
                        const lineAlpha = (1 - cdist / maxConnectDist) * 0.22 * (p.baseAlpha + p2.baseAlpha) * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `${colors.line}${lineAlpha})`;
                        ctx.lineWidth = 0.65;
                        ctx.stroke();
                    }
                }

                let colorPrefix = colors.nodePrimary;
                if (p.type === 'secondary') colorPrefix = colors.nodeSecondary;
                else if (p.type === 'tertiary') colorPrefix = colors.nodeTertiary;

                const finalAlpha = Math.min(1, Math.max(0.1, (p.baseAlpha + pulse + p.energy * 0.5)));
                const finalSize = p.size * (1 + p.energy * 0.5);

                ctx.beginPath();
                ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
                ctx.fillStyle = `${colorPrefix}${finalAlpha})`;
                ctx.fill();

                if (p.type === 'primary') {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, finalSize * 2.2, 0, Math.PI * 2);
                    ctx.fillStyle = `${colors.nodePrimary}${finalAlpha * 0.18})`;
                    ctx.fill();
                }
            }
        };

        const renderFlowMode = (colors, now, dt) => {
            const time = now * 0.0006;
            ctx.lineWidth = 1;

            particles.forEach((p) => {
                const angle = Math.sin(p.x * 0.0025 + time) * 1.5 + Math.cos(p.y * 0.0025 + time * 0.8) * 1.5;
                const flowSpeed = 0.85 + (p.layer * 0.35);

                p.vx += Math.cos(angle) * flowSpeed * 0.08;
                p.vy += Math.sin(angle) * flowSpeed * 0.08;

                if (pointer.isActive) {
                    const dx = p.x - pointer.smoothX;
                    const dy = p.y - pointer.smoothY;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < 200 * 200 && distSq > 0) {
                        const dist = Math.sqrt(distSq);
                        const push = (1 - dist / 200) * 1.2;
                        p.vx += (dx / dist) * push;
                        p.vy += (dy / dist) * push;
                    }
                }

                p.vx *= 0.95;
                p.vy *= 0.95;

                const prevX = p.x;
                const prevY = p.y;
                p.x += p.vx;
                p.y += p.vy - scrollVelocity * (0.1 + p.layer * 0.1);

                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = `${colors.line}${p.baseAlpha * 0.55})`;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 1.1, 0, Math.PI * 2);
                ctx.fillStyle = `${colors.nodePrimary}${p.baseAlpha * 0.85})`;
                ctx.fill();
            });
        };

        const renderGridMode = (colors, now, dt) => {
            const gridSize = width < 768 ? 44 : 56;
            const cols = Math.ceil(width / gridSize);
            const rows = Math.ceil(height / gridSize);

            ctx.strokeStyle = colors.gridLine;
            ctx.lineWidth = 0.5;

            for (let c = 0; c <= cols; c++) {
                const x = c * gridSize;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let r = 0; r <= rows; r++) {
                const y = r * gridSize;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            for (let c = 0; c <= cols; c++) {
                for (let r = 0; r <= rows; r++) {
                    const x = c * gridSize;
                    const y = r * gridSize;

                    if (pointer.isActive) {
                        const dx = pointer.smoothX - x;
                        const dy = pointer.smoothY - y;
                        const distSq = dx * dx + dy * dy;
                        if (distSq < 180 * 180) {
                            const dist = Math.sqrt(distSq);
                            const factor = 1 - dist / 180;
                            ctx.beginPath();
                            ctx.arc(x, y, 1.5 + factor * 2.5, 0, Math.PI * 2);
                            ctx.fillStyle = `${colors.nodePrimary}${factor * 0.8})`;
                            ctx.fill();
                        } else {
                            ctx.fillStyle = colors.gridDot;
                            ctx.fillRect(x - 1, y - 1, 2, 2);
                        }
                    } else {
                        ctx.fillStyle = colors.gridDot;
                        ctx.fillRect(x - 1, y - 1, 2, 2);
                    }
                }
            }
        };

        const renderRipples = (colors, dt) => {
            for (let r = ripples.length - 1; r >= 0; r--) {
                const rip = ripples[r];
                rip.radius += rip.speed;
                rip.alpha = (1 - rip.radius / rip.maxRadius) * 0.55 * rip.intensity;

                if (rip.radius >= rip.maxRadius || rip.alpha <= 0.01) {
                    ripples.splice(r, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `${colors.ripple}${rip.alpha})`;
                ctx.lineWidth = 1.4;
                ctx.stroke();

                if (rip.radius > 25) {
                    ctx.beginPath();
                    ctx.arc(rip.x, rip.y, rip.radius * 0.72, 0, Math.PI * 2);
                    ctx.strokeStyle = `${colors.ripple}${rip.alpha * 0.4})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        };

        window.addEventListener('resize', handleResize, { passive: true });
        handleResize();

        if (!isReducedMotion) {
            render();
        } else {
            renderConstellationMode(getColors(), 0);
        }
    };

    // Initialize interactive background
    initInteractiveBackground();

    // --------------------------------------------------------------------------
    // 9. Comprehensive Scroll-Based Animation Engine
    // --------------------------------------------------------------------------
    const initScrollAnimations = () => {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // 1. Curatorial Auto-Decoration for Staggered Entrances
        const setupRevealTargets = () => {
            // Section Headers
            document.querySelectorAll('.section-header, .work-header-split').forEach(header => {
                const kicker = header.querySelector('.section-kicker');
                const title = header.querySelector('.section-title');
                const subtitle = header.querySelector('.section-subtitle');
                const filterControls = header.querySelector('.filter-controls');

                if (kicker) kicker.classList.add('scroll-reveal');
                if (title) title.classList.add('scroll-reveal', 'stagger-1');
                if (subtitle) subtitle.classList.add('scroll-reveal', 'stagger-2');
                if (filterControls) filterControls.classList.add('scroll-reveal', 'stagger-3');
            });

            // Hero Elements
            const heroFolio = document.querySelector('.editorial-folio');
            const heroTitle = document.querySelector('.hero-title');
            const heroLead = document.querySelector('.hero-lead');
            const heroCtas = document.querySelector('.hero-cta-cluster');
            const heroProof = document.querySelector('.hero-proof-strip');
            const heroPortrait = document.querySelector('.hero-portrait-frame');

            if (heroFolio) heroFolio.classList.add('scroll-reveal');
            if (heroTitle) heroTitle.classList.add('scroll-reveal', 'stagger-1');
            if (heroLead) heroLead.classList.add('scroll-reveal', 'stagger-2');
            if (heroCtas) heroCtas.classList.add('scroll-reveal', 'stagger-3');
            if (heroProof) heroProof.classList.add('scroll-reveal', 'stagger-4');
            if (heroPortrait) heroPortrait.classList.add('scroll-reveal-scale', 'stagger-2');

            // Work Cards
            document.querySelectorAll('.work-filterable').forEach((card, idx) => {
                const stagger = (idx % 4) + 1;
                card.classList.add('scroll-reveal', `stagger-${stagger}`);
            });

            // Services Items
            document.querySelectorAll('.service-item').forEach((item, idx) => {
                const stagger = (idx % 4) + 1;
                item.classList.add('scroll-reveal', `stagger-${stagger}`);
            });

            // Process Nodes
            document.querySelectorAll('.process-node').forEach((node, idx) => {
                const stagger = (idx % 4) + 1;
                node.classList.add('scroll-reveal', `stagger-${stagger}`);
            });

            // Bio Section
            const bioProse = document.querySelector('.bio-prose');
            const bioDossier = document.querySelector('.bio-dossier-card');
            const bioQuote = document.querySelector('.bio-quote-callout');
            if (bioProse) bioProse.classList.add('scroll-reveal-left');
            if (bioDossier) bioDossier.classList.add('scroll-reveal-right');
            if (bioQuote) bioQuote.classList.add('scroll-reveal-scale');

            // Testimonials
            document.querySelectorAll('.testimonial-card').forEach((card, idx) => {
                const stagger = (idx % 3) + 1;
                card.classList.add('scroll-reveal', `stagger-${stagger}`);
            });

            // Contact Elements
            const contactCard = document.querySelector('.contact-card');
            const deskCard = document.querySelector('.desk-dispatch-card');
            if (contactCard) contactCard.classList.add('scroll-reveal-left');
            if (deskCard) deskCard.classList.add('scroll-reveal-right');
        };

        setupRevealTargets();

        // 2. IntersectionObserver for Reveal Triggering
        const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');

        if (!isReducedMotion && 'IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.08
            });

            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            // Immediate reveal if reduced motion or older browser
            revealElements.forEach(el => el.classList.add('is-revealed'));
        }

        // 3. Scroll-Triggered Metric Counter Animation
        const proofStrip = document.querySelector('.hero-proof-strip');
        let counterAnimated = false;

        const animateCounters = () => {
            if (counterAnimated) return;
            counterAnimated = true;

            const counters = document.querySelectorAll('[data-count-to]');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count-to'), 10);
                const suffix = counter.getAttribute('data-suffix') || '';
                const prefix = counter.getAttribute('data-prefix') || '';
                const duration = 1600;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 4);
                    const currentVal = Math.round(target * ease);

                    let formattedVal = String(currentVal);
                    if (prefix && currentVal < 10 && prefix === '0') {
                        formattedVal = '0' + formattedVal;
                    } else if (prefix && prefix !== '0') {
                        formattedVal = prefix + formattedVal;
                    }

                    counter.textContent = formattedVal + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        let finalVal = String(target);
                        if (prefix === '0' && target < 10) finalVal = '0' + finalVal;
                        counter.textContent = (prefix && prefix !== '0' ? prefix : '') + finalVal + suffix;
                    }
                };

                requestAnimationFrame(updateCount);
            });

            const shimmerEl = document.querySelector('[data-count-shimmer="true"]');
            if (shimmerEl) {
                shimmerEl.classList.add('is-shimmering');
            }
        };

        if (proofStrip && 'IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(proofStrip);
                }
            }, { threshold: 0.3 });
            counterObserver.observe(proofStrip);
        } else {
            animateCounters();
        }

        // 4. Scroll-Driven Process Stepper Animation
        const processNodes = document.querySelectorAll('.process-node');
        if (processNodes.length && 'IntersectionObserver' in window) {
            const processObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-active-step');
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -90px 0px',
                threshold: 0.25
            });

            processNodes.forEach(node => processObserver.observe(node));
        }

        // 5. Desktop Header Scrollspy
        const desktopNavLinks = document.querySelectorAll('.site-nav .nav-link');
        const sectionsToTrack = ['work', 'services', 'process', 'about', 'testimonials', 'contact']
            .map(id => document.getElementById(id))
            .filter(Boolean);

        const updateDesktopNavScrollspy = () => {
            if (!desktopNavLinks.length || !sectionsToTrack.length) return;
            const scrollPos = window.pageYOffset + 180;

            let activeId = '';
            sectionsToTrack.forEach(sec => {
                const top = sec.offsetTop;
                const height = sec.offsetHeight;
                if (scrollPos >= top && scrollPos < top + height) {
                    activeId = sec.getAttribute('id');
                }
            });

            if (window.pageYOffset < 240) {
                activeId = '';
            }

            desktopNavLinks.forEach(link => {
                const href = link.getAttribute('href')?.replace('#', '');
                if (href === activeId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        // 6. Floating Scroll-to-Top Button
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        const updateScrollToTopVisibility = () => {
            if (!scrollToTopBtn) return;
            if (window.pageYOffset > 420) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        };

        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // 7. Subtle Hero Portrait Parallax
        const portraitCard = document.querySelector('.portrait-card');
        const handleHeroParallax = () => {
            if (isReducedMotion || !portraitCard) return;
            const scrollY = window.pageYOffset;
            if (scrollY < 800) {
                const offset = scrollY * 0.08;
                portraitCard.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
            }
        };

        // Unified Passive Scroll Listener
        let scrollTick = false;
        window.addEventListener('scroll', () => {
            if (!scrollTick) {
                window.requestAnimationFrame(() => {
                    updateDesktopNavScrollspy();
                    updateScrollToTopVisibility();
                    handleHeroParallax();
                    scrollTick = false;
                });
                scrollTick = true;
            }
        }, { passive: true });

        // Initial run
        updateDesktopNavScrollspy();
        updateScrollToTopVisibility();
    };

    // Initialize scroll-based animations
    initScrollAnimations();

    // --------------------------------------------------------------------------
    // 10. Small Work & Literary AI Assistant Engine
    // --------------------------------------------------------------------------
    const initAiAssistant = () => {
        const widget = document.getElementById('ai-assistant-widget');
        const toggleBtn = document.getElementById('ai-assistant-toggle');
        const panel = document.getElementById('ai-assistant-modal');
        const closeBtn = document.getElementById('ai-assistant-close');
        const chatStream = document.getElementById('ai-chat-stream');
        const chatForm = document.getElementById('ai-chat-form');
        const chatInput = document.getElementById('ai-chat-input');
        const chatSend = document.getElementById('ai-chat-send');
        const promptChipsContainer = document.getElementById('ai-prompt-chips');

        if (!widget || !toggleBtn || !panel || !chatForm || !chatInput) return;

        let conversationHistory = [];
        let isWaitingResponse = false;

        const openPanel = () => {
            panel.classList.add('is-open');
            panel.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
            setTimeout(() => chatInput.focus(), 150);
            scrollChatToBottom();
        };

        const closePanel = () => {
            panel.classList.remove('is-open');
            panel.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
        };

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (panel.classList.contains('is-open')) {
                closePanel();
            } else {
                openPanel();
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closePanel();
            });
        }

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('is-open')) {
                closePanel();
            }
        });

        // Close on click outside on desktop
        document.addEventListener('click', (e) => {
            if (panel.classList.contains('is-open') && !widget.contains(e.target)) {
                closePanel();
            }
        });

        const scrollChatToBottom = () => {
            if (chatStream) {
                chatStream.scrollTop = chatStream.scrollHeight;
            }
        };

        // Format basic Markdown bold, italic, and bullet lists safely
        const formatMarkdown = (text) => {
            if (!text) return '';
            const lines = text.split('\n');
            let formattedHtml = '';
            let inList = false;

            lines.forEach((line) => {
                const trimmed = line.trim();

                // Bullet point
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
                    if (!inList) {
                        formattedHtml += '<ul>';
                        inList = true;
                    }
                    const itemContent = trimmed.substring(2);
                    formattedHtml += `<li>${formatInline(itemContent)}</li>`;
                } else if (/^\d+\.\s/.test(trimmed)) {
                    // Numbered list
                    if (!inList) {
                        formattedHtml += '<ul>';
                        inList = true;
                    }
                    const itemContent = trimmed.replace(/^\d+\.\s/, '');
                    formattedHtml += `<li>${formatInline(itemContent)}</li>`;
                } else {
                    if (inList) {
                        formattedHtml += '</ul>';
                        inList = false;
                    }
                    if (trimmed) {
                        formattedHtml += `<p>${formatInline(trimmed)}</p>`;
                    }
                }
            });

            if (inList) formattedHtml += '</ul>';
            return formattedHtml;
        };

        const formatInline = (str) => {
            let safe = str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            safe = safe.replace(/\*(.*?)\*/g, '<em>$1</em>');
            safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

            return safe;
        };

        const appendMessage = (text, role = 'assistant') => {
            if (!chatStream) return;

            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-message ai-message-${role}`;

            const bubble = document.createElement('div');
            bubble.className = 'ai-message-bubble';
            if (role === 'assistant') {
                bubble.innerHTML = formatMarkdown(text);
            } else {
                bubble.textContent = text;
            }

            const timeSpan = document.createElement('span');
            timeSpan.className = 'ai-message-time';
            timeSpan.textContent = role === 'assistant' ? 'Assistant' : 'You';

            msgDiv.appendChild(bubble);
            msgDiv.appendChild(timeSpan);
            chatStream.appendChild(msgDiv);

            scrollChatToBottom();
            return msgDiv;
        };

        const showTypingIndicator = () => {
            const indicator = document.createElement('div');
            indicator.className = 'ai-typing-indicator';
            indicator.id = 'ai-typing-indicator';
            indicator.innerHTML = `
                <span class="ai-typing-dot"></span>
                <span class="ai-typing-dot"></span>
                <span class="ai-typing-dot"></span>
            `;
            chatStream.appendChild(indicator);
            scrollChatToBottom();
        };

        const removeTypingIndicator = () => {
            const indicator = document.getElementById('ai-typing-indicator');
            if (indicator) indicator.remove();
        };

        const submitQuery = async (queryText) => {
            const cleanQuery = queryText.trim();
            if (!cleanQuery || isWaitingResponse) return;

            if (promptChipsContainer) {
                promptChipsContainer.style.display = 'none';
            }

            appendMessage(cleanQuery, 'user');
            conversationHistory.push({ role: 'user', text: cleanQuery });

            chatInput.value = '';
            isWaitingResponse = true;
            if (chatSend) chatSend.disabled = true;

            showTypingIndicator();

            try {
                const response = await fetch('/api/assistant/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: cleanQuery,
                        conversationHistory: conversationHistory.slice(-6)
                    })
                });

                removeTypingIndicator();

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const reply = data.reply || "I apologize, but I could not process your request at this moment. Olukorede Yishau's works include 'In the Name of Our Father', 'Vaults of Secrets', and 'After The End'. Please feel free to explore the sections above!";
                appendMessage(reply, 'assistant');
                conversationHistory.push({ role: 'assistant', text: reply });
            } catch (err) {
                removeTypingIndicator();
                console.error('AI Assistant Error:', err);
                appendMessage("Olukorede Yishau is an acclaimed Nigerian author and investigative journalist with 25+ years of experience, known for novels like 'In the Name of Our Father', 'Vaults of Secrets', and 'After The End'. You can also submit inquiries via the 'Let's Work Together' section below.", 'assistant');
            } finally {
                isWaitingResponse = false;
                if (chatSend) chatSend.disabled = false;
                chatInput.focus();
            }
        };

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitQuery(chatInput.value);
        });

        if (promptChipsContainer) {
            promptChipsContainer.querySelectorAll('.ai-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const prompt = chip.getAttribute('data-prompt');
                    if (prompt) {
                        submitQuery(prompt);
                    }
                });
            });
        }
    };

    // Initialize AI assistant
    initAiAssistant();
});
