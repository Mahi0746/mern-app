function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const message = inputField.value;

    if (!message.trim()) return;

    chatBox.innerHTML += `<div class="user">You: ${message}</div>`;

    fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        chatBox.innerHTML += `<div class="bot">DevBrain: ${data.response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    inputField.value = "";
}