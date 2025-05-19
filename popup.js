document.getElementById("yesBtn").addEventListener("click", () => {
    document.getElementById("response").innerText = "Awesome! You got this! 🚀";
  });
  
  document.getElementById("noBtn").addEventListener("click", () => {
    // Hide first screen, show second screen
    document.getElementById("questionScreen").classList.add("hidden");
    document.getElementById("uploadScreen").classList.remove("hidden");
  });
  
  document.getElementById("goBtn").addEventListener("click", async () => {
    const file = document.getElementById("resumeUpload").files[0];
    if (!file) return alert("Please upload your resume.");
  
    const reader = new FileReader();
    reader.onload = async () => {
      const resumeText = reader.result;
  
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
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
        document.getElementById("matchResult").innerText = `Match Score: ${score}`;
      });
    };
    reader.readAsText(file);
  });
  
  function compareText(job, resume) {
    const jobWords = new Set(job.toLowerCase().split(/\W+/));
    const resumeWords = new Set(resume.toLowerCase().split(/\W+/));
    let matchCount = 0;
    for (let word of resumeWords) {
      if (jobWords.has(word)) matchCount++;
    }
    return ((matchCount / jobWords.size) * 100).toFixed(1) + "%";
  }
  