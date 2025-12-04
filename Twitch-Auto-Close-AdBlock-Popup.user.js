// ==UserScript==
// @name         Twitch Auto Close AdBlock Popup
// @name:ru      Автозакрытие окна AdBlock на Twitch
// @namespace    https://github.com/lllexxa/
// @version      1.0.0
// @author       migaix
// @description  Automatically closes the Twitch "Disable AdBlock to support the channel" popup when it appears.
// @description:ru Автоматически закрывает всплывающее окно Twitch с просьбой отключить блокировщик рекламы.
// @homepage     https://github.com/lllexxa/twitch-userscripts
// @homepageURL  https://github.com/lllexxa/twitch-userscripts
// @supportURL   https://github.com/lllexxa/twitch-userscripts/issues
// @updateURL    https://raw.githubusercontent.com/lllexxa/twitch-userscripts/main/Twitch-Auto-Close-AdBlock-Popup.user.js
// @downloadURL  https://raw.githubusercontent.com/lllexxa/twitch-userscripts/main/Twitch-Auto-Close-AdBlock-Popup.user.js
// @match        https://www.twitch.tv/*
// @run-at       document-end
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    const log = (...a) => console.log('[Twitch AutoCloseAD]', ...a);

    const CLOSE_BUTTON_SELECTORS = [
        'button[aria-label="Вернуться к трансляции"]',
        'button[aria-label="Return to stream"]'
    ];

    function findVisibleCloseButton() {
        for (const sel of CLOSE_BUTTON_SELECTORS) {
            const btn = document.querySelector(sel);
            if (btn && btn.offsetParent !== null) return btn;
        }
        return null;
    }

    const observer = new MutationObserver(() => {
        const closeBtn = findVisibleCloseButton();
        if (closeBtn) {
            log('Popup detected — close button found:', closeBtn.getAttribute('aria-label'));
            closeBtn.click();
            log('Clicked close button');
        }
    });

    // Wait until the Twitch player appears (DOM fully loaded)
    const waitForPlayer = setInterval(() => {
        const player = document.querySelector('.video-ref, video, .video-player__default-player');
        if (player) {
            clearInterval(waitForPlayer);
            log('Player detected — starting DOM observer');

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }, 500);
})();
