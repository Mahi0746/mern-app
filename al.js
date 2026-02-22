// Simple client-side analytics simulation

let messageCount = 0;

function trackMessage() {
    messageCount++;
    console.log("Total messages sent:", messageCount);
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("button");
    button.addEventListener("click", trackMessage);
});