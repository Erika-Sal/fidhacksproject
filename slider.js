const response = document.getElementById("response");
const questionScreen = document.getElementById("questionScreen");
const uploadScreen = document.getElementById("uploadScreen");
const nextBtn = document.getElementById("nextBtn");
const canvas = document.getElementById("confidenceMeter");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height;
const radius = Math.min(centerX, centerY) - 10;
let currentValue = 50;
let dragging = false;

function drawMeter(value) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Background arc (gray)
  ctx.beginPath();
  ctx.lineWidth = 20;
  ctx.strokeStyle = "#ddd";
  ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
  ctx.stroke();
 
  // Create gradient for foreground arc
  const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
  gradient.addColorStop(0, "#C981FF");       // start color (purple)
  gradient.addColorStop(1, "#F8B6EE");       // end color (pink)
  // Foreground arc (gradient)
  const endAngle = Math.PI + (value / 100) * Math.PI;
  ctx.beginPath();
  ctx.lineWidth = 20;
  ctx.strokeStyle = gradient;
  ctx.lineCap = "round";
  ctx.arc(centerX, centerY, radius, Math.PI, endAngle, false);
  ctx.stroke();
  const pointerX = centerX + radius * Math.cos(endAngle);
  const pointerY = centerY + radius * Math.sin(endAngle);
  ctx.beginPath();
  ctx.fillStyle = "#C981FF"; 
  ctx.arc(pointerX, pointerY, 12, 0, 2 * Math.PI);
  ctx.fill();
  // Draw the confidence percentage text inside the semicircle, centered horizontally and vertically
  ctx.fillStyle = "#000"; // black text
  ctx.font = " 40px Manjari, Arial, sans-serif";  // Manjari font with fallback
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Position text at centerX horizontally
  // Vertically: centerY - radius * 0.6 (a bit above the middle of semicircle)
  ctx.fillText(Math.round(value) + "%", centerX + 7, centerY - radius * 0.3);
  
  // Update the confidence text below the meter
  document.getElementById("sliderValue").textContent = Math.round(value) + "%";
}

function onConfidenceChange(value) {
  // Clear any previous messages
  response.innerHTML = "";
  nextBtn.classList.remove("hidden"); 
  
  // Don't change the button text
  nextBtn.textContent = "Next";
}

function updateValueFromMouse(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const dx = x - centerX;
  const dy = y - centerY;
  const angle = Math.atan2(dy, dx);
  if (angle >= -Math.PI && angle <= 0) {
    const value = ((angle + Math.PI) / Math.PI) * 100;
    currentValue = Math.min(100, Math.max(0, value));
    drawMeter(currentValue);
  }
}

canvas.style.cursor = "pointer";
canvas.addEventListener("mousedown", (e) => {
  dragging = true;
  updateValueFromMouse(e.clientX, e.clientY);
});

canvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    updateValueFromMouse(e.clientX, e.clientY);
  }
});

window.addEventListener("mouseup", () => {
  if (dragging) {
    onConfidenceChange(currentValue);
    dragging = false;
  }
});

nextBtn.addEventListener("click", () => {
  if (currentValue < 60) {
    questionScreen.classList.add("hidden");
    uploadScreen.classList.remove("hidden");
  } else {
    response.innerHTML = "<span class='motivational-message'>You got it! Apply to the job!</span>";
  }
});

// Initial draw
drawMeter(currentValue);
onConfidenceChange(currentValue);