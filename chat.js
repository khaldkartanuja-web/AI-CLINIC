/**
 * chat.js — Connects to the Backend AI API
 * Enhanced for competition-ready UI with processing states and smart action cards
 */
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:3000/api';
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function formatMessage(text) {
        if (!text) return '';
        let safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // **Bold**
        safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // ### Title
        safe = safe.replace(/^###\s+(.*)$/gm, '<h3 class="chat-heading">$1</h3>');
        // Bullet points
        safe = safe.replace(/^[-\•]\s+(.*)$/gm, '<li class="chat-li">$1</li>');
        
        return safe.replace(/\n/g, '<br>');
    }

    function addMessage(text, sender, isAction = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender} ${isAction ? 'action-card' : ''}`;
        
        if (sender === 'bot') {
            msgDiv.innerHTML = formatMessage(text);
        } else {
            msgDiv.textContent = text;
        }
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'msg bot typing-indicator';
        typing.id = 'typing';
        typing.innerHTML = '<span></span><span></span><span></span> <small style="margin-left:8px; opacity:0.6;">AI is thinking...</small>';
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
        const el = document.getElementById('typing');
        if (el) el.remove();
    }

    async function sendMessage(text) {
        if (!text || !text.trim()) return;
        text = text.trim();

        const lang = localStorage.getItem('clinic_lang') || 'en';

        addMessage(text, 'user');
        userInput.value = '';
        userInput.disabled = true;
        sendBtn.disabled = true;

        showTyping();

        try {
            const res = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage: text, phone: 'COUNTER', language: lang })
            });
            const data = await res.json();

            hideTyping();
            
            // If action was executed, show a special confirmation card maybe?
            // For now, we just show the text but ensure it looks structured
            addMessage(data.text, 'bot');

            if (typeof window.speakAI === 'function') {
                window.speakAI(data.text);
            }

            // If it was a booking or registration, maybe refresh admin view if open in another tab?
            // (Not possible easily, but we can log it)
            if (data.action_executed) {
                console.log('Action successful:', data.intent);
            }

        } catch (err) {
            hideTyping();
            addMessage(lang === 'hi' ? '⚠️ सर्वर से कनेक्ट नहीं हो सका।' : '⚠️ Cannot connect to the server.', 'bot');
        } finally {
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    }

    window.sendChatMessage = sendMessage;

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(userInput.value);
    });

    // Greeting on load
    setTimeout(() => {
        const lang = localStorage.getItem('clinic_lang') || 'en';
        
        const greeting = lang === 'en' ? 
            "Hello! 👋 Welcome to SmartClinic. I'm your AI Receptionist. I can book appointments, register patients, check medicines, and more!\n\n💡 Type **help** to see all commands." :
            (lang === 'hi' ? 
            "नमस्ते! 👋 स्मार्टक्लीनिक में आपका स्वागत है। मैं आपकी एआई रिसेप्शनिस्ट हूँ। मैं अपॉइंटमेंट और मरीज रजिस्ट्रेशन में आपकी मदद कर सकती हूँ!\n\n💡 सभी कमांड के लिए **help** टाइप करें।" :
            "नमस्कार! 👋 स्मार्टक्लीनिकमध्ये आपले स्वागत आहे. मी तुमची एआई रिसेप्शनिस्ट आहे. मी तुम्हाला अपॉइंटमेंट आणि रजिस्ट्रेशनमध्ये मदत करू शकते!\n\n💡 कमांडसाठी **help** टाईप करा.");

        addMessage(greeting, 'bot');
        
        if (typeof window.speakAI === 'function') {
            const speakGreet = lang === 'en' ? "Hello! Welcome to SmartClinic. I'm your AI Receptionist. How can I help you today?" :
                              (lang === 'hi' ? "नमस्ते! स्मार्टक्लीनिक में आपका स्वागत है। मैं आपकी एआई रिसेप्शनिस्ट हूँ। मैं आपकी कैसे मदद कर सकती हूँ?" :
                              "नमस्कार! स्मार्टक्लीनिकमध्ये आपले स्वागत आहे. मी तुमची एआई रिसेप्शनिस्ट आहे. मी तुम्हाला कशी मदत करू शकते?");
            window.speakAI(speakGreet);
        }
    }, 800);
});
