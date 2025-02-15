// Set random background in blocked screen
function setRandomBackground() {
    try {
        // Image configuration
        const name = 'dumbfatkitten';
        const numberOfImages = 9;
        
        // Select the image
        const randomNumber = Math.floor(Math.random() * numberOfImages) + 1;
        const imageUrl = chrome.runtime.getURL(`images/${name}${randomNumber}.png`);
        
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    } catch (error) {
        console.error('Error setting background:', error);
        // All grey if image loading fails
        document.body.style.backgroundColor = '#111';
    }
}

// Set random background when page loads
document.addEventListener('DOMContentLoaded', () => {
    setRandomBackground();
    startCountdown();
});

// Countdown and redirect
function startCountdown() {
    let count = 5;
    const countdownElement = document.getElementById('countdown');
    
    const countdown = setInterval(() => {
        count--;
        countdownElement.textContent = count;
        
        if (count <= 0) {
            clearInterval(countdown);
            window.location.href = 'https://google.com';
        }
    }, 1000);
}