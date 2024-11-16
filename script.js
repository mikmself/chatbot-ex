const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "sk-proj-lg6xoylv7TZh7RDFX4OGT3BlbkFJ1fENOHUHKln30W0Jb7jX";
const ORGANIZATION_ID = "org-GHLeyGWH6wWMetQy2e60xv0l";

const inputInitHeight = chatInput.scrollHeight;

const customResponses = [
    {
        question: "Apa kabar?",
        answer: "Saya baik, terima kasih! Bagaimana dengan Anda?"
    },
    {
        question: "Siapa nama Anda?",
        answer: "Nama saya adalah ChatGPT. Saya adalah chatbot AI."
    },
    {
        question: "Apa yang Anda bisa lakukan?",
        answer: "Saya dapat membantu Anda dengan pertanyaan apa pun yang Anda miliki!"
    }
];

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">account_circle</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const findCustomResponse = (userQuestion) => {
    const matchingResponse = customResponses.find(response => response.question.toLowerCase() === userQuestion.toLowerCase());
    return matchingResponse ? matchingResponse.answer : null;
}

const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");
    const userQuestion = userMessage.trim();

    // Mencari respon di customResponses
    const customResponse = findCustomResponse(userQuestion);

    if (customResponse) {
        // Jika pertanyaan ditemukan di customResponses, tampilkan jawabannya
        messageElement.textContent = customResponse;
    } else {
        try {
            // Gunakan API Key untuk autentikasi
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                    "OpenAI-Organization" : `${ORGANIZATION_ID}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{role: "user", content: userQuestion}]
                })
            };

            // Lakukan permintaan fetch dengan penambahan delay
            await new Promise(resolve => setTimeout(resolve, 1000)); // Tambahkan delay 1 detik
            const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
            const data = await response.json();

            if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                messageElement.textContent = data.choices[0].message.content;
            } else {
                messageElement.classList.add("error");
                messageElement.textContent = "Maaf, terjadi kesalahan. Silahkan coba lagi.";
            }
        } catch (error) {
            console.error("Error:", error);
            messageElement.classList.add("error");
            messageElement.textContent = "Maaf Terjadi Kesalahan. Silahkan Coba Lagi.";
        } finally {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    }
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    chatInput.value ="";
    chatInput.style.height = `${inputInitHeight}px`;

    const outgoingChatLi = createChatLi(userMessage, "outgoing");
    chatbox.appendChild(outgoingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const incomingChatLi = createChatLi("..........", "incoming")
    chatbox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
