const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const modelSelect = document.getElementById("model-select");

function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = "message " + sender;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage("user", message);
    input.value = "";

    const loadingMsg = document.createElement("div");
    loadingMsg.className = "message ai";
    loadingMsg.textContent = "Thinking...";
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message, model: modelSelect.value })
        });
        const data = await response.json();
        loadingMsg.remove();

        if (data.error) {
            addMessage("ai", "Error: " + data.error);
        } else {
            addMessage("ai", data.reply);
        }
    } catch (err) {
        loadingMsg.remove();
        addMessage("ai", "Error connecting to server.");
    }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});