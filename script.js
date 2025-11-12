//  Constants & Elements
const modal = document.getElementById("jobFormModal");
const openBtn = document.getElementById("openFormModal");
const closeBtn = document.querySelector(".closeBtn");
const main = document.querySelector(".main");

// Form elements
const jobForm = document.querySelector("#jobForm");
const jobTitleInput = document.querySelector("#jobTitle");
const companyNameInput = document.querySelector("#company");
const dateInput = document.querySelector("#date");
const descriptionInput = document.querySelector("#description");
const skills = document.querySelector("#skills");
const salaryInput = document.querySelector("#salary");

//for dragging
let dragStartIndex;
let dragOverIndex;
let draggedCard;
//for searching
let jobFinderInput = document.querySelector("#jobFinder");

//  Default Jobs
const defaultJobs = [
  {
    title: "Frontend Developer",
    company: "DevTech",
    date: "20 May, 2023",
    description:
      "Looking for a frontend intern passionate about web development.",
    skills: ["HTML", "CSS", "JavaScript"],
    salary: "$250 per day",
  },
  {
    title: "Backend Developer",
    company: "CodeBase Solutions",
    date: "28 May, 2023",
    description: "Seeking a backend developer to build and maintain APIs.",
    skills: ["Node.js", "Express", "MongoDB"],
    salary: "$300 per day",
  },
  {
    title: "UI/UX Designer",
    company: "Creative Minds",
    date: "1 June, 2023",
    description:
      "Design engaging and user-friendly interfaces for web and mobile apps.",
    skills: ["Figma", "Adobe XD", "User Research"],
    salary: "$200 per day",
  },
  {
    title: "Fullstack Developer",
    company: "TechCorp",
    date: "5 June, 2023",
    description:
      "Join our team as a fullstack developer and work on exciting projects.",
    skills: ["React", "Node.js", "MongoDB"],
    salary: "$350 per day",
  },
  {
    title: "Data Scientist",
    company: "DataGenie",
    date: "10 June, 2023",
    description:
      "Analyze and interpret complex data to drive business decisions.",
    skills: ["Python", "Machine Learning", "Data Visualization"],
    salary: "$400 per day",
  },
];

let jobs = [...defaultJobs];

// Function
function renderJobs(jobLists) {
  main.innerHTML = "";

  jobLists.forEach((job, idx) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("job-card");
    jobCard.setAttribute("draggable", true);
    jobCard.dataset.index = idx;

    const jobDate = document.createElement("p");
    jobDate.classList.add("date");
    jobDate.textContent = job.date;

    const company = document.createElement("p");
    company.classList.add("company");
    company.textContent = job.company;

    const title = document.createElement("h2");
    title.classList.add("job-title");
    title.textContent = job.title;

    const jobDescription = document.createElement("p");
    jobDescription.classList.add("description");
    jobDescription.textContent = job.description;

    const skillsRequired = document.createElement("div");
    skillsRequired.classList.add("skills");

    job.skills.forEach((skill) => {
      const span = document.createElement("span");
      span.textContent = skill;
      skillsRequired.appendChild(span);
    });

    const details = document.createElement("div");
    details.classList.add("details");

    const salary = document.createElement("p");
    salary.classList.add("salary");
    salary.textContent = job.salary;

    const detailBtn = document.createElement("button");
    detailBtn.textContent = "Delete";
    detailBtn.setAttribute("data-index", idx);
    details.append(salary, detailBtn);

    jobCard.append(
      jobDate,
      company,
      title,
      jobDescription,
      skillsRequired,
      details
    );

    main.append(jobCard);

    //DRAG & DROP EVENTS
    jobCard.addEventListener("dragstart", (e) => {
      dragStartIndex = parseInt(e.currentTarget.dataset.index);
      draggedCard = e.currentTarget;
      draggedCard.style.opacity = "0.5";
    });

    jobCard.addEventListener("dragover", (e) => {
      e.preventDefault(); // important to allow drop
      dragOverIndex = parseInt(e.currentTarget.dataset.index);
      jobCard.classList.add("drag-over");
    });

    jobCard.addEventListener("dragleave", () => {
      jobCard.classList.remove("drag-over");
    });

    jobCard.addEventListener("drop", (e) => {
      e.preventDefault();
 draggedCard.style.opacity = "1";
      [jobs[dragStartIndex], jobs[dragOverIndex]] = [
        jobs[dragOverIndex],
        jobs[dragStartIndex],
      ];

      renderJobs(jobs);
    });
  });
}

//Event Listener

// Open modal
openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("show");
  }, 300);
});

// Close modal
closeBtn.addEventListener("click", () => {
  setTimeout(() => {
    modal.classList.remove("show");
  }, 300);
  setTimeout(() => {
    modal.style.display = "none";
  }, 400);
});

// Close modal on outside click
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
});

// Delete job
main.addEventListener("click", (e) => {
  const index = e.target.getAttribute("data-index");
  if (e.target.tagName === "BUTTON") {
    jobs.splice(index, 1);
    renderJobs(jobs);
localStorage.setItem("jobs", JSON.stringify(jobs.slice(defaultJobs.length)));

  }
});

// Add job via form
jobForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const titLeName = jobTitleInput.value;
  const companyName = companyNameInput.value;
  const jobDate = dateInput.value;
  const dateObj = new Date(jobDate);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const description = descriptionInput.value;
  const jobSalary = salaryInput.value;
  const skillsName = skills.value.split(",").map((skill) => skill.trim());

  jobs.push({
    title: titLeName,
    company: companyName,
    date: formattedDate,
    description: description,
    skills: skillsName,
    salary: jobSalary,
  });

  renderJobs(jobs);
  closeBtn.click();
  jobTitleInput.value = "";
  companyNameInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  salaryInput.value = "";
  skills.value = "";
  localStorage.setItem("jobs", JSON.stringify(jobs.slice(defaultJobs.length)));
});

//allowing dragging
main.addEventListener("dragover", (e) => {
  e.preventDefault();
});

// Load saved jobs
window.addEventListener("load", () => {
  const savedJobs = JSON.parse(localStorage.getItem("jobs"));
  if (savedJobs && savedJobs.length > 0) {
    jobs = [...defaultJobs, ...savedJobs]; 
  } else {
    jobs = [...defaultJobs];
  }
  renderJobs(jobs);
});


//searching

jobFinderInput.addEventListener("input", () => {
  const searchText = jobFinderInput.value.trim().toLowerCase();

  const filtered = jobs.filter((job) => {
    return job.title.toLocaleLowerCase().trim().includes(searchText);
  });

  renderJobs(filtered);
});
