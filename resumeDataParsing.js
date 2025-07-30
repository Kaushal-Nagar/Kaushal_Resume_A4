document.addEventListener("DOMContentLoaded", function () {
  // Define your resume versions
  const resumeVersions = [
    {
      id: "Common",
      name: "Common Resume",
      file: "Common.json",
    },
    {
      id: "Alpha and Omega",
      name: "Alpha and Omega Specific Resume",
      file: "Alpha_and_Omega.json",
    },
  ];

  // Create version cards
  const versionSelector = document.getElementById("version-selector");
  let currentVersionId = resumeVersions[0].id; // Track current version

  resumeVersions.forEach((version, index) => {
    // Create version card
    const card = document.createElement("div");
    card.className = "version-card" + (index === 0 ? " active" : "");
    card.dataset.versionId = version.id;

    // Add version name
    const nameElement = document.createElement("div");
    nameElement.className = "version-name";
    nameElement.textContent = version.name;
    card.appendChild(nameElement);

    // Add download button
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "download-btn";
    downloadBtn.textContent = "Download PDF";
    downloadBtn.dataset.versionId = version.id; // Associate button with version
    downloadBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      // Only print if this is the current version
      if (version.id === currentVersionId) {
        window.print();
      } else {
        // Switch to this version first, then print
        switchResumeVersion(version.id, true);
      }
    });
    card.appendChild(downloadBtn);

    // Add click handler to switch versions
    card.addEventListener("click", function () {
      switchResumeVersion(version.id);
    });

    versionSelector.appendChild(card);
  });

  // Load the first resume by default
  loadResumeData(resumeVersions[0].file);

  // Modified switch function with optional print parameter
  function switchResumeVersion(versionId, shouldPrint = false) {
    currentVersionId = versionId; // Update current version

    // Update active card
    document.querySelectorAll(".version-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.versionId === versionId);
    });

    // Load the corresponding resume data
    const version = resumeVersions.find((v) => v.id === versionId);
    loadResumeData(version.file).then(() => {
      if (shouldPrint) {
        window.print();
      }
    });
  }

  // Modified load function to return Promise
  function loadResumeData(filename) {
    return fetch(filename)
      .then((response) => response.json())
      .then((data) => populateResume(data))
      .catch((error) => console.error("Error loading resume data:", error));
  }

  // Function to download/print resume
  function downloadResume() {
    window.print();
  }

  // Function to populate resume (same as your existing code, just extracted)
  function populateResume(data) {
    // Clear existing content
    document.getElementById("name-container").innerHTML = "";
    document.getElementById("contact-info").innerHTML = "";
    document.getElementById("skills").innerHTML = "";
    document.getElementById("experience").innerHTML = "";
    document.getElementById("projects").innerHTML = "";
    document.getElementById("certifications").innerHTML = "";
    document.getElementById("education").innerHTML = "";

    // Populate the name
    const nameContainer = document.getElementById("name-container");
    nameContainer.innerHTML = `<span class="name">${data.name}</span> ( ${data["Job Role"]} )`;

    // Populate contact info
    const contactInfo = document.getElementById("contact-info");
    data.contactInfo.forEach((item) => {
      const li = document.createElement("li");
      if (typeof item === "string") {
        li.textContent = item;
      } else if (item.email) {
        li.innerHTML = `✉️ <a href="${item.url}" target="_blank">${item.email}</a>`;
      } else if (item.linkedin) {
        li.innerHTML = `🔗 <a href="${item.url}" target="_blank">${item.linkedin}</a>`;
      }
      contactInfo.appendChild(li);
    });

    // Populate about section
    const aboutList = document.getElementById("about");
    if (Array.isArray(data.about)) {
      // If about is an array, create list items
      data.about.forEach((point) => {
        const li = document.createElement("li");
        li.textContent = point;
        aboutList.appendChild(li);
      });
    } else {
      // Fallback for old string format (backward compatibility)
      const li = document.createElement("li");
      li.textContent = data.about;
      aboutList.appendChild(li);
    }

    // Populate skills
    const skillsList = document.getElementById("skills");
    for (const [key, value] of Object.entries(data.skills)) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${key} :</strong> ${value}`;
      skillsList.appendChild(li);
    }

    // Populate experience
    const experienceList = document.getElementById("experience");
    data.experience.forEach((exp) => {
      const li = document.createElement("li");
      li.className = "experience-item";
      li.innerHTML = `<h3>${exp.position} | ${exp.company} (${exp.duration})</h3>`;

      const ul = document.createElement("ul");
      exp.responsibilities.forEach((resp) => {
        const respLi = document.createElement("li");
        if (resp.project) {
          respLi.innerHTML = `<strong>${resp.project}</strong>`;
          const projectUl = document.createElement("ul");
          resp.details.forEach((detail) => {
            const detailLi = document.createElement("li");
            if (detail.title) {
              detailLi.innerHTML = `<strong>${detail.title}</strong> ${detail.description}`;
            } else {
              detailLi.textContent = detail.description;
            }
            projectUl.appendChild(detailLi);
          });
          respLi.appendChild(projectUl);
        } else if (resp.title) {
          respLi.innerHTML = `<strong>${resp.title}</strong> ${resp.description}`;
        } else {
          respLi.textContent = resp.description;
        }
        ul.appendChild(respLi);
      });
      li.appendChild(ul);
      experienceList.appendChild(li);
    });

    // Populate projects
    const projectsList = document.getElementById("projects");
    data.projects.forEach((project) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${project.name}:</strong> ${project.description}`;
      projectsList.appendChild(li);
    });

    // Populate certifications
    const certList = document.getElementById("certifications");
    data.certifications.forEach((cert) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${cert.name}</strong> | ${cert.issuer} (${cert.year})`;
      certList.appendChild(li);
    });

    // Populate education
    const eduList = document.getElementById("education");
    data.education.forEach((edu) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${edu.degree} | ${edu.institution}</strong> | ${edu.year} | ${edu.grade}`;
      eduList.appendChild(li);
    });
  }
});
