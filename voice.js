/**
 * voice.js — Complete Voice System
 * 🎤 Speech-to-Text: Click mic, speak, auto-sends to chat
 * 🔊 Text-to-Speech: AI reads every response aloud
 */
(function () {
    'use strict';

    const micBtn = document.getElementById('mic-btn');
    const userInput = document.getElementById('user-input');
    const voiceToggle = document.getElementById('voice-toggle');

    if (!micBtn || !userInput) {
        console.warn('voice.js: Elements not found.');
        return;
    }

    // ===========================
    //  TEXT-TO-SPEECH (AI Speaks)
    // ===========================
    let voicesLoaded = false;
    let cachedVoices = [];

    function loadVoices() {
        cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
        voicesLoaded = cachedVoices.length > 0;
    }

    if (window.speechSynthesis) {
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    function cleanTextForSpeech(text) {
        return text
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
            .replace(/[\u{2600}-\u{27BF}]/gu, '')
            .replace(/[✅❌✨⏰⏳📋📊📅💊💰🧾🏥🧑🔍📱🆔📞🎯👨‍⚕️💡⚠️]/g, '')
            .replace(/\n/g, '. ')
            .trim();
    }

    window.speakAI = function (text) {
        if (!window.speechSynthesis) return;
        if (voiceToggle && !voiceToggle.checked) return;

        window.speechSynthesis.cancel();
        const clean = cleanTextForSpeech(text);
        if (!clean || clean.length < 2) return;

        const lang = localStorage.getItem('clinic_lang') || 'en';
        const utter = new SpeechSynthesisUtterance(clean);
        utter.rate = 0.95;
        
        // Pick best voice for EN, HI
        if (!voicesLoaded) loadVoices();
        const bestVoice = cachedVoices.find(v => v.lang.startsWith(lang));
        if (bestVoice) utter.voice = bestVoice;
        else if (lang !== 'en') {
            // Fallback for HI/MR if specific voice not found
            utter.lang = lang === 'hi' ? 'hi-IN' : 'mr-IN';
        }

        window.speechSynthesis.speak(utter);
    };

    // ================================
    //  SPEECH-TO-TEXT (Microphone)
    // ================================
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        micBtn.style.opacity = '0.5';
        micBtn.title = 'Speech not supported';
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let isListening = false;

    recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        micBtn.innerHTML = '⏹';
        userInput.placeholder = '🎤 Listening... speak now';
        
        // Show temporary feedback in the chat area maybe?
        const container = document.getElementById('chat-messages');
        const feedback = document.createElement('div');
        feedback.id = 'voice-feedback';
        feedback.className = 'feedback-overlay';
        feedback.innerHTML = '<span>🎤 Listening to your voice...</span>';
        container.appendChild(feedback);
        container.scrollTop = container.scrollHeight;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) finalTranscript += result[0].transcript;
            else interimTranscript += result[0].transcript;
        }

        if (interimTranscript) userInput.value = interimTranscript;
        
        if (finalTranscript) {
            userInput.value = finalTranscript;
            setTimeout(() => {
                if (typeof window.sendChatMessage === 'function') {
                    window.sendChatMessage(finalTranscript);
                }
            }, 500);
        }
    };

    recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove('listening');
        micBtn.innerHTML = '🎤';
        userInput.placeholder = 'Type or tap 🎤 to speak...';
        
        const feedback = document.getElementById('voice-feedback');
        if (feedback) feedback.remove();
    };

    recognition.onerror = (event) => {
        console.error('Speech error:', event.error);
        isListening = false;
        micBtn.classList.remove('listening');
        micBtn.innerHTML = '🎤';
        const feedback = document.getElementById('voice-feedback');
        if (feedback) feedback.remove();
    };

    micBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            const lang = localStorage.getItem('clinic_lang') || 'en';
            recognition.lang = lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-IN');
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            recognition.start();
        }
    });

    console.log('✅ voice.js Upgraded — Interactive states ready');
})();
