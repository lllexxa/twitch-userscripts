// ==UserScript==
// @name         Twitch Auto Reload Player on Error
// @name:ru      Авто-перезагрузка плеера Twitch при ошибке
// @namespace    https://github.com/lllexxa/
// @version      1.2.0
// @author       migaix
// @description  Automatically clicks "Reload Player" only when Twitch displays playback errors (#1000, #2000)
// @description:ru Автоматически нажимает «перезагрузить плеер» только при ошибках Twitch (#1000, #2000)
// @homepage     https://github.com/lllexxa/twitch-userscripts
// @homepageURL  https://github.com/lllexxa/twitch-userscripts
// @supportURL   https://github.com/lllexxa/twitch-userscripts/issues
// @updateURL    https://raw.githubusercontent.com/lllexxa/twitch-userscripts/main/Twitch-Auto-Reload-Player.user.js
// @downloadURL  https://raw.githubusercontent.com/lllexxa/twitch-userscripts/main/Twitch-Auto-Reload-Player.user.js
// @match        https://www.twitch.tv/*
// @run-at       document-end
// @grant        none
// ==/UserScript==


(function () {
    'use strict';

    console.log("[Twitch Auto Reload] Script loaded");

    let lastActionTime = 0;

    function tryReload() {
        const now = Date.now();
        if (now - lastActionTime < 3000) return;

        const errorStrongElements = Array.from(document.querySelectorAll("strong"));

        const errorMessages = [
            "Ошибка #1000",
            "Ошибка #2000",
            "Error #1000",
            "Error #2000",
            "There was a network error"
        ];

        const errorFound = errorStrongElements.find(el =>
            errorMessages.some(msg => el.textContent.includes(msg))
        );

        if (!errorFound) return;

        console.log("[Twitch Auto Reload] Error detected:", errorFound.textContent);

        const buttonTexts = [
            "перезагрузить проигрыватель",
            "Перезагрузить проигрыватель",
            "Click Here to Reload Player",
            "Reload Player"
        ];

        const reloadButton = Array.from(document.querySelectorAll("button"))
            .find(btn => buttonTexts.some(txt =>
                btn.textContent.toLowerCase().includes(txt.toLowerCase())
            ));

        if (reloadButton) {
            console.log("[Twitch Auto Reload] Clicking reload button...");
            lastActionTime = now;
            reloadButton.click();
        }
    }

    const observer = new MutationObserver(tryReload);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log("[Twitch Auto Reload] Observer running...");
})();
