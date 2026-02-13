// ==UserScript==
// @name         Vity Referral Loop - Growth Experiment (Maximem AI)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  PLG referral experiment for Maximem Vity - Growth Engineer Application by @capyheer
// @author       Heeraa @capyheer
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @match        https://www.perplexity.ai/*
// @match        https://grok.x.ai/*
// @match        https://poe.com/*
// @match        https://you.com/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

/**
 * ============================================================
 * VITY REFERRAL LOOP - GROWTH EXPERIMENT
 * ============================================================
 * 
 * Author: Heeraa (@capyheer)
 * For: Gaurav Dadhich, Founder @ Maximem AI
 * Purpose: Growth Engineer Application Demo
 * 
 * This demonstrates:
 * - PLG referral mechanics
 * - A/B testing framework
 * - Analytics event tracking
 * - Privacy-first design (ZDR aligned)
 * 
 * Press Ctrl+Shift+M to manually trigger for demo
 * Press Ctrl+Shift+V to cycle through A/B variants
 * ============================================================
 */

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        storageKey: 'vity_referral_state_v2',
        triggerMessageCount: 3,
        refLink: 'https://app.maximem.ai/signup?ref=',
        userId: 'demo_' + Math.random().toString(36).substr(2, 9),
        debugMode: true
    };

    // ==================== A/B TEST VARIANTS ====================
    const VARIANTS = {
        A: {
            name: 'Emotional',
            title: 'Your AI Remembered',
            subtitle: 'Your Private Memory Vault made this moment seamless. Share with a friend.',
            cta: 'Get Referral Link',
            reward: '+1 GB Vault Space for both'
        },
        B: {
            name: 'Value-First',
            title: 'You Just Saved 5 Minutes',
            subtitle: 'Vity auto-injected your context. No more copy-paste repetition.',
            cta: 'Share & Get +1GB Free',
            reward: 'Unlock bonus storage instantly'
        },
        C: {
            name: 'Social Proof',
            title: '12,847 Users Share Daily',
            subtitle: 'Join the privacy-first AI memory movement.',
            cta: 'Get Your Invite Link',
            reward: 'Both you & friend get rewards'
        },
        D: {
            name: 'Scarcity',
            title: 'Beta Referral Bonus',
            subtitle: 'Early users get 2x vault space. Limited time offer.',
            cta: 'Claim My Referral Link',
            reward: '2x storage for beta referrers'
        }
    };

    // ==================== STATE MANAGEMENT ====================
    const getState = () => {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            return saved ? JSON.parse(saved) : {
                shown: false,
                dismissed: false,
                converted: false,
                variant: Object.keys(VARIANTS)[Math.floor(Math.random() * 4)],
                impressions: 0,
                lastShown: null
            };
        } catch {
            return { shown: false, variant: 'A', impressions: 0 };
        }
    };

    const setState = (updates) => {
        const current = getState();
        const newState = { ...current, ...updates };
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(newState));
        return newState;
    };

    let state = getState();
    let currentVariant = state.variant;

    // Skip if already converted
    if (state.converted) {
        log('User already converted, skipping');
        return;
    }

    // Skip if dismissed recently (7 day cooldown)
    if (state.dismissed && state.lastShown) {
        const daysSinceDismiss = (Date.now() - state.lastShown) / (1000 * 60 * 60 * 24);
        if (daysSinceDismiss < 7) {
            log(`Dismissed ${daysSinceDismiss.toFixed(1)} days ago, waiting for cooldown`);
            return;
        }
    }

    // ==================== ANALYTICS (Mock) ====================
    const Analytics = {
        track: (event, properties = {}) => {
            const payload = {
                event,
                properties: {
                    ...properties,
                    platform: window.location.hostname,
                    variant: currentVariant,
                    variant_name: VARIANTS[currentVariant].name,
                    user_id: CONFIG.userId,
                    timestamp: new Date().toISOString(),
                    session_id: sessionStorage.getItem('vity_session') || generateSessionId()
                }
            };
            
            // In production, this would send to Mixpanel/Amplitude
            log('📊 Analytics Event:', payload);
            
            // Store events locally for demo purposes
            const events = JSON.parse(localStorage.getItem('vity_analytics') || '[]');
            events.push(payload);
            localStorage.setItem('vity_analytics', JSON.stringify(events));
        }
    };

    function generateSessionId() {
        const id = 'sess_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('vity_session', id);
        return id;
    }

    // ==================== LOGGING ====================
    function log(...args) {
        if (CONFIG.debugMode) {
            console.log('%c[Vity Growth]', 'color: #f5f0e8; background: #0d0d0d; padding: 2px 6px; border-radius: 4px;', ...args);
        }
    }

    // ==================== STYLES ====================
    const styles = document.createElement('style');
    styles.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .vity-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(12px);
            z-index: 999998;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .vity-overlay.show { opacity: 1; }
        
        .vity-modal {
            position: fixed;
            bottom: 28px;
            right: 28px;
            width: 400px;
            background: #0d0d0d;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 24px;
            padding: 32px;
            z-index: 999999;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
            transform: translateY(30px) scale(0.95);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .vity-modal.show {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        
        .vity-variant-badge {
            position: absolute;
            top: -10px;
            left: 20px;
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22c55e;
            font-size: 10px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 100px;
            letter-spacing: 0.5px;
        }
        
        .vity-logo {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 24px;
        }
        .vity-logo-icon {
            width: 52px;
            height: 52px;
            margin-bottom: 16px;
        }
        .vity-logo-icon svg {
            width: 100%;
            height: 100%;
        }
        
        .vity-title {
            color: #ffffff;
            font-size: 26px;
            font-weight: 700;
            text-align: center;
            line-height: 1.2;
            letter-spacing: -0.5px;
            margin-bottom: 12px;
        }
        
        .vity-desc {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            line-height: 1.6;
            text-align: center;
            margin-bottom: 24px;
        }
        
        .vity-reward {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 14px 18px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .vity-reward-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }
        .vity-reward-text {
            color: rgba(255, 255, 255, 0.8);
            font-size: 13px;
            font-weight: 500;
        }
        
        .vity-btn-primary {
            width: 100%;
            padding: 15px 24px;
            border: none;
            border-radius: 14px;
            background: #f5f0e8;
            color: #0d0d0d;
            font-family: inherit;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .vity-btn-primary:hover {
            background: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(245, 240, 232, 0.2);
        }
        .vity-btn-primary:active { transform: translateY(0); }
        .vity-btn-primary svg { width: 18px; height: 18px; }
        
        .vity-btn-secondary {
            width: 100%;
            padding: 12px;
            margin-top: 8px;
            border: none;
            background: transparent;
            color: rgba(255, 255, 255, 0.4);
            font-family: inherit;
            font-size: 13px;
            cursor: pointer;
            transition: color 0.2s;
        }
        .vity-btn-secondary:hover { color: rgba(255, 255, 255, 0.7); }
        
        .vity-close {
            position: absolute;
            top: 18px;
            right: 18px;
            width: 34px;
            height: 34px;
            border: none;
            background: rgba(255, 255, 255, 0.04);
            border-radius: 10px;
            color: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .vity-close:hover {
            background: rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.6);
        }
        .vity-close svg { width: 18px; height: 18px; }
        
        .vity-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 18px;
            padding-top: 18px;
            border-top: 1px solid rgba(255, 255, 255, 0.04);
        }
        .vity-footer svg {
            width: 13px;
            height: 13px;
            color: rgba(255, 255, 255, 0.25);
        }
        .vity-footer span {
            color: rgba(255, 255, 255, 0.25);
            font-size: 11px;
            letter-spacing: 0.3px;
        }
        
        .vity-toast {
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #0d0d0d;
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #ffffff;
            padding: 14px 24px;
            border-radius: 14px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000000;
            opacity: 0;
            transition: all 0.35s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .vity-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        .vity-toast svg {
            width: 18px;
            height: 18px;
            color: #22c55e;
        }
        
        .vity-debug {
            position: fixed;
            bottom: 28px;
            left: 28px;
            background: #0d0d0d;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px 16px;
            font-family: 'Inter', monospace;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
            z-index: 999997;
            max-width: 280px;
        }
        .vity-debug-title {
            color: #f5f0e8;
            font-weight: 600;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .vity-debug-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .vity-debug-row:last-child { border: none; }
        .vity-debug-key { color: rgba(255,255,255,0.4); }
        .vity-debug-value { color: #22c55e; font-weight: 500; }
    `;
    document.head.appendChild(styles);

    // ==================== MODAL HTML ====================
    function getModalHTML(variant) {
        const v = VARIANTS[variant];
        return `
            <div class="vity-overlay" id="vityOverlay"></div>
            <div class="vity-modal" id="vityModal">
                <div class="vity-variant-badge">Variant ${variant}: ${v.name}</div>
                <button class="vity-close" id="vityClose">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                
                <div class="vity-logo">
                    <div class="vity-logo-icon">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 5L93.3 27.5V72.5L50 95L6.7 72.5V27.5L50 5Z" stroke="white" stroke-width="3" fill="none"/>
                            <path d="M50 25L72.5 37.5V62.5L50 75L27.5 62.5V37.5L50 25Z" stroke="white" stroke-width="3" fill="none"/>
                            <circle cx="50" cy="50" r="8" fill="white"/>
                        </svg>
                    </div>
                </div>
                
                <div class="vity-title">${v.title}</div>
                <div class="vity-desc">${v.subtitle}</div>
                
                <div class="vity-reward">
                    <div class="vity-reward-icon">🎁</div>
                    <div class="vity-reward-text">${v.reward}</div>
                </div>
                
                <button class="vity-btn-primary" id="vityGetLink">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
                    </svg>
                    ${v.cta}
                </button>
                <button class="vity-btn-secondary" id="vityNotNow">Maybe later</button>
                
                <div class="vity-footer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                    </svg>
                    <span>Privacy-first · ZDR Compliant · maximem.ai</span>
                </div>
            </div>
            
            <div class="vity-toast" id="vityToast">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Link copied! Share on X or Discord
            </div>
        `;
    }

    // ==================== DEBUG PANEL ====================
    function createDebugPanel() {
        const panel = document.createElement('div');
        panel.className = 'vity-debug';
        panel.id = 'vityDebug';
        panel.innerHTML = `
            <div class="vity-debug-title">🧪 Vity Growth Experiment</div>
            <div class="vity-debug-row">
                <span class="vity-debug-key">Messages</span>
                <span class="vity-debug-value" id="debugMsgCount">0 / ${CONFIG.triggerMessageCount}</span>
            </div>
            <div class="vity-debug-row">
                <span class="vity-debug-key">Variant</span>
                <span class="vity-debug-value" id="debugVariant">${currentVariant} (${VARIANTS[currentVariant].name})</span>
            </div>
            <div class="vity-debug-row">
                <span class="vity-debug-key">Platform</span>
                <span class="vity-debug-value">${window.location.hostname}</span>
            </div>
            <div class="vity-debug-row">
                <span class="vity-debug-key">Shortcuts</span>
                <span class="vity-debug-value">⌃⇧M / ⌃⇧V</span>
            </div>
        `;
        document.body.appendChild(panel);
    }

    function updateDebugPanel(msgCount) {
        const el = document.getElementById('debugMsgCount');
        if (el) el.textContent = `${msgCount} / ${CONFIG.triggerMessageCount}`;
    }

    // ==================== MODAL LOGIC ====================
    let messageCount = 0;
    let modalInjected = false;
    let modalShowTime = null;

    function showModal() {
        if (modalInjected) return;
        modalInjected = true;
        modalShowTime = Date.now();

        const container = document.createElement('div');
        container.id = 'vityContainer';
        container.innerHTML = getModalHTML(currentVariant);
        document.body.appendChild(container);

        requestAnimationFrame(() => {
            document.getElementById('vityOverlay').classList.add('show');
            document.getElementById('vityModal').classList.add('show');
        });

        // Track impression
        setState({ impressions: state.impressions + 1, lastShown: Date.now() });
        Analytics.track('referral_modal_shown', {
            message_count: messageCount,
            impressions_total: state.impressions + 1
        });

        // Bind events
        document.getElementById('vityGetLink').addEventListener('click', handleConversion);
        document.getElementById('vityClose').addEventListener('click', () => handleDismiss('close_button'));
        document.getElementById('vityNotNow').addEventListener('click', () => handleDismiss('not_now'));
        document.getElementById('vityOverlay').addEventListener('click', () => handleDismiss('overlay_click'));

        log('✅ Modal shown - Variant:', currentVariant);
    }

    function handleConversion() {
        const timeToAction = (Date.now() - modalShowTime) / 1000;
        const refUrl = CONFIG.refLink + CONFIG.userId;
        const shareText = `Stop explaining yourself to AI - @maximem_ai Vity is your Private Memory Vault. Privacy-first, ZDR compliant. Join beta: ${refUrl} #Vity #AIMemory`;

        // Copy to clipboard
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(shareText);
        } else {
            navigator.clipboard.writeText(shareText).catch(() => {});
        }

        // Show toast
        const toast = document.getElementById('vityToast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);

        // Track conversion
        setState({ converted: true });
        Analytics.track('referral_link_copied', {
            time_to_action_seconds: timeToAction.toFixed(2),
            referral_url: refUrl
        });

        log('🎉 Conversion! Time to action:', timeToAction.toFixed(2) + 's');

        setTimeout(closeModal, 1800);
    }

    function handleDismiss(type) {
        const timeOnModal = (Date.now() - modalShowTime) / 1000;
        
        setState({ dismissed: true, lastShown: Date.now() });
        Analytics.track('referral_modal_dismissed', {
            dismiss_type: type,
            time_on_modal_seconds: timeOnModal.toFixed(2)
        });

        log('👋 Dismissed via:', type);
        closeModal();
    }

    function closeModal() {
        document.getElementById('vityOverlay')?.classList.remove('show');
        document.getElementById('vityModal')?.classList.remove('show');
        setTimeout(() => {
            document.getElementById('vityContainer')?.remove();
            modalInjected = false;
        }, 350);
    }

    // ==================== MESSAGE DETECTION ====================
    function detectMessages() {
        // Keyboard detection
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                const t = e.target;
                const isInput = t.tagName === 'TEXTAREA' || 
                               t.contentEditable === 'true' || 
                               t.role === 'textbox' ||
                               t.closest('[contenteditable="true"]') ||
                               t.closest('[data-testid*="composer"]');
                if (isInput && t.value?.trim() || t.textContent?.trim()) {
                    incrementMessage('keyboard');
                }
            }
        }, true);

        // Click detection
        document.addEventListener('click', (e) => {
            const sendBtn = e.target.closest('button[data-testid*="send"], button[aria-label*="Send"], form button[type="submit"]');
            if (sendBtn) {
                incrementMessage('click');
            }
        }, true);

        // MutationObserver for ChatGPT
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        const isUserMessage = node.matches?.('[data-message-author-role="user"]') ||
                                             node.querySelector?.('[data-message-author-role="user"]');
                        if (isUserMessage) {
                            incrementMessage('dom');
                        }
                    }
                }
            }
        });

        setTimeout(() => {
            const container = document.querySelector('main, [role="main"], [class*="conversation"]');
            observer.observe(container || document.body, { childList: true, subtree: true });
            log('👀 Observer attached');
        }, 2000);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+M: Manual trigger
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                log('🎯 Manual trigger');
                if (modalInjected) closeModal();
                setTimeout(showModal, 100);
            }
            // Ctrl+Shift+V: Cycle variants
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                const keys = Object.keys(VARIANTS);
                const idx = (keys.indexOf(currentVariant) + 1) % keys.length;
                currentVariant = keys[idx];
                setState({ variant: currentVariant });
                document.getElementById('debugVariant').textContent = `${currentVariant} (${VARIANTS[currentVariant].name})`;
                log('🔄 Switched to variant:', currentVariant);
                if (modalInjected) {
                    closeModal();
                    setTimeout(showModal, 400);
                }
            }
        });
    }

    function incrementMessage(source) {
        messageCount++;
        updateDebugPanel(messageCount);
        log(`💬 Message detected (${source}) - ${messageCount}/${CONFIG.triggerMessageCount}`);
        
        Analytics.track('user_message_sent', {
            message_number: messageCount,
            detection_source: source
        });

        if (messageCount >= CONFIG.triggerMessageCount && !modalInjected && !state.converted) {
            log('🎯 Threshold reached, showing modal in 1.5s');
            setTimeout(showModal, 1500);
        }
    }

    // ==================== INIT ====================
    createDebugPanel();
    detectMessages();
    
    log('🚀 Vity Growth Experiment loaded');
    log('📋 Variant:', currentVariant, `(${VARIANTS[currentVariant].name})`);
    log('⌨️ Shortcuts: Ctrl+Shift+M (trigger) | Ctrl+Shift+V (cycle variants)');

})();
