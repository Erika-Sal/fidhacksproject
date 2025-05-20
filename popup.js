// Required by pdf.js
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf-lib/pdf.worker.min.js';
  }
  
  // Wait for DOM to fully load
  document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners only when DOM is ready
    setupEventListeners();
  });
  
  function setupEventListeners() {
    // Go button on second screen
    const goBtn = document.getElementById("goBtn");
    if (goBtn) {
      goBtn.addEventListener("click", handleGoButton);
    }
  }
  
  async function handleGoButton() {
    console.log("Go button clicked");
    const fileInput = document.getElementById("resumeUpload");
    const file = fileInput?.files[0];
    
    if (!file) {
      alert("Please upload your resume.");
      return;
    }
  
    const isPDF = file.type === "application/pdf";
  
    try {
      if (isPDF) {
        const reader = new FileReader();
        reader.onload = async function () {
          try {
            const typedarray = new Uint8Array(reader.result);
            
            if (typeof pdfjsLib === 'undefined') {
              console.error("PDF.js library not loaded");
              alert("PDF library not loaded. Please try a text file instead.");
              return;
            }
  
            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
            let resumeText = "";
  
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const strings = content.items.map(item => item.str);
              resumeText += strings.join(" ") + "\n";
            }
  
            scrapeAndCompare(resumeText);
          } catch (error) {
            console.error("Error processing PDF:", error);
            alert("Error processing PDF. Please try again or use a text file.");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const resumeText = event.target.result;
          scrapeAndCompare(resumeText);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Error handling file:", error);
      alert("Error processing file. Please try again.");
    }
  }
  
  function scrapeAndCompare(resumeText) {
    console.log("Scraping and comparing...");
    
    // For testing purposes - if chrome API is not available
    if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.scripting) {
      console.log("Chrome API not available - using test data");
      const testJobText = "Looking for a senior developer with experience in java, python, and rest apis. Kubernetes experience is a plus. Knowledge of aws and devops practices required.";
      const score = compareText(testJobText, resumeText);
      
      // Show results screen with circle
      document.getElementById("uploadScreen").classList.add("hidden");
      document.getElementById("resultScreen").classList.remove("hidden");
      updateCircle(score);
      return;
    }
    
    // Normal flow using Chrome API
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (!tabs || tabs.length === 0) {
        console.error("No active tab found");
        alert("No active tab found. Please try again.");
        return;
      }
      
      const tab = tabs[0];
      
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
        if (chrome.runtime.lastError) {
          console.error("Script execution error:", chrome.runtime.lastError);
          alert("Error accessing page content. Please try again.");
          return;
        }
        
        if (!results || results.length === 0) {
          console.error("No results from script execution");
          alert("Could not analyze job description. Please try again.");
          return;
        }
        
        const jobText = results[0].result;
        const score = compareText(jobText, resumeText);
        
        // Show results screen with circle progress
        document.getElementById("uploadScreen").classList.add("hidden");
        document.getElementById("resultScreen").classList.remove("hidden");
        updateCircle(score);
      });
    });
  }
  
  function compareText(job, resume) {
    console.log("Comparing texts...");
    const skillsToMatch = [
      "java", "python", "c", "c++", "rest", "api", "restful", "docker", "kubernetes", "azure",
      "aws", "jenkins", "jira", "git", "spring", "json", "junit", "selenium", "microservices",
      "testing", "automation", "ci", "cd", "devops", "mongodb", "sql", "react", "node", "typescript"
    ];
  
    const jobText = job.toLowerCase();
    const resumeText = resume.toLowerCase();
  
    // Filter skills that actually appear in the job description
    const jobSkills = skillsToMatch.filter(skill => jobText.includes(skill));
    
    console.log("Job skills found:", jobSkills);
  
    if (jobSkills.length === 0) {
      console.log("No job skills found in text");
      return "N/A"; // Prevent division by 0
    }
  
    // Count how many of those job-relevant skills are in the resume
    const matchCount = jobSkills.filter(skill => resumeText.includes(skill)).length;
    console.log("Matching skills found:", matchCount);
  
    const score = (matchCount / jobSkills.length) * 100;
    return score.toFixed(1);  // Return as number without the % sign
  }
  
  function updateCircle(scoreString) {
    console.log("Updating circle with score:", scoreString);
    
    // Handle N/A case
    if (scoreString === "N/A") {
      document.getElementById("circleText").textContent = "N/A";
      showSuggestions("N/A");
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
    
    // Show suggestions based on score
    showSuggestions(percentage);
  }
  
  function showSuggestions(score) {
    const suggestionsContainer = document.getElementById('suggestions');
    
    // Clear any existing content
    suggestionsContainer.innerHTML = '';
    
    if (score === "N/A") {
      // Handle the N/A case
      suggestionsContainer.innerHTML = `
        <div class="suggestion-title">We couldn't analyze the job description.</div>
        <ul class="suggestion-list">
          <li class="suggestion-item">Try uploading your resume again</li>
          <li class="suggestion-item">Make sure you're on a job posting page</li>
        </ul>
        <a href="https://nexthire-liart.vercel.app/home" target="_blank" class="tip-button">Click here for support</a>
      `;
    } else if (score < 60) {
      // Low match score - provide helpful suggestions
      suggestionsContainer.innerHTML = `
        <div class="suggestion-title">Here are some suggestions to improve your match:</div>
        <ul class="suggestion-list">
          <li class="suggestion-item">Review your resume and highlight skills that match with the job requirements</li>
          <li class="suggestion-item">Consider working on projects or building skills in areas required by this position</li>
        </ul>
        <a href="https://nexthire-liart.vercel.app/home" target="_blank" class="tip-button">Click here for support</a>
      `;
    } else {
      // High match score - encouragement with black text and no background
      suggestionsContainer.innerHTML = `
        <div class="success-message">
          You're a great match for this position!
        </div>
        <a href="https://nexthire-liart.vercel.app/diary-entries" target="_blank" class="tip-button">Click here for support</a>
      `;
    }
  }