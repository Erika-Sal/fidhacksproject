// Required by pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf-lib/pdf.worker.min.js';

document.getElementById("yesBtn").addEventListener("click", () => {
  document.getElementById("response").innerText = "Awesome! You got this!";
});

document.getElementById("noBtn").addEventListener("click", () => {
  // Hide first screen, show second screen
  document.getElementById("questionScreen").classList.add("hidden");
  document.getElementById("uploadScreen").classList.remove("hidden");
});

document.getElementById("goBtn").addEventListener("click", async () => {
  const file = document.getElementById("resumeUpload").files[0];
  if (!file) return alert("Please upload your resume.");

  const isPDF = file.type === "application/pdf";

  if (isPDF) {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(reader.result);

      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      let resumeText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        resumeText += strings.join(" ") + "\n";
      }

      scrapeAndCompare(resumeText);
    };
    reader.readAsArrayBuffer(file);
  } else {
    const reader = new FileReader();
    reader.onload = () => scrapeAndCompare(reader.result);
    reader.readAsText(file);
  }
});

function scrapeAndCompare(resumeText) {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const selectors = [
          ".topcard__title", ".jobsearch-JobInfoHeader-title",
          ".description__text", ".jobs-description__content",
          ".jobsearch-jobDescriptionText"
        ];
        let jobText = '';
        selectors.forEach(sel => {
          const el = document.querySelector(sel);
          if (el) jobText += el.innerText + '\n';
        });
        return jobText || document.body.innerText.slice(0, 1000);
      }
    }, (results) => {
      const jobText = results[0].result;
      const score = compareText(jobText, resumeText);
      document.getElementById("uploadScreen").classList.add("hidden");
      document.getElementById("resultScreen").classList.remove("hidden");
      updateCircle(score);
    });
  });
}

function compareText(job, resume) {
  const skillsToMatch = [
    "java", "python", "c", "c++", "rest", "api", "restful", "docker", "kubernetes", "azure",
    "aws", "jenkins", "jira", "git", "spring", "json", "junit", "selenium", "microservices",
    "testing", "automation", "ci", "cd", "devops", "mongodb", "sql", "react", "node", "typescript"
  ];

  const jobText = job.toLowerCase();
  const resumeText = resume.toLowerCase();

  // Filter skills that actually appear in the job description
  const jobSkills = skillsToMatch.filter(skill => jobText.includes(skill));

  if (jobSkills.length === 0) return "N/A"; // Prevent division by 0

  // Count how many of those job-relevant skills are in the resume
  const matchCount = jobSkills.filter(skill => resumeText.includes(skill)).length;

  const score = (matchCount / jobSkills.length) * 100;
  return score.toFixed(1);  // Return as number without the % sign
}

function updateCircle(scoreString) {
  // Handle N/A case
  if (scoreString === "N/A") {
    document.getElementById("circleText").textContent = "N/A";
    return;
  }

  const percentage = parseFloat(scoreString);
  const circle = document.querySelector('.progress-ring__circle');
  const text = document.getElementById("circleText");
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  // Make sure circle attributes are properly set
  circle.style.strokeDasharray = circumference;
  
  // Calculate the offset based on percentage
  const offset = circumference - (percentage / 100) * circumference;
  
  // Apply the offset with a slight delay for animation effect
  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 100);
  
  // Update the text in the center of the circle
  text.textContent = `${percentage}%`;
}