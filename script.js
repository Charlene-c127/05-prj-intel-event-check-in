// Intel Sustainability Summit Check-In App

const attendanceGoal = 50;

let attendeeCount = 0;

let teamCounts = {
  water: 0,
  zero: 0,
  power: 0
};

let attendees = [];

// HTML elements
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");

const celebrationMessage = document.getElementById("celebrationMessage");
const attendeeList = document.getElementById("attendeeList");
const resetBtn = document.getElementById("resetBtn");

// Load saved data when the page opens
window.addEventListener("load", function () {
  const savedData = JSON.parse(localStorage.getItem("intelSummitCheckIn"));

  if (savedData) {
    attendeeCount = savedData.attendeeCount;
    teamCounts = savedData.teamCounts;
    attendees = savedData.attendees;
  }

  updateDisplay();
});

// Handle form submit
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (attendeeName === "" || selectedTeam === "") {
    greeting.textContent = "Please enter your name and select a team.";
    return;
  }

  attendeeCount++;
  teamCounts[selectedTeam]++;

  attendees.push({
    name: attendeeName,
    team: selectedTeam
  });

  greeting.textContent = `Welcome, ${attendeeName}! You are checked in for ${getTeamName(
    selectedTeam
  )}.`;

  attendeeNameInput.value = "";
  teamSelect.value = "";

  saveData();
  updateDisplay();
});

// Update all page content
function updateDisplay() {
  attendeeCountDisplay.textContent = attendeeCount;

  waterCountDisplay.textContent = teamCounts.water;
  zeroCountDisplay.textContent = teamCounts.zero;
  powerCountDisplay.textContent = teamCounts.power;

  let progressPercent = (attendeeCount / attendanceGoal) * 100;

  if (progressPercent > 100) {
    progressPercent = 100;
  }

  progressBar.style.width = progressPercent + "%";

  renderAttendeeList();
  checkCelebration();
}

// Convert team value to full team name
function getTeamName(team) {
  if (team === "water") {
    return "Team Water Wise";
  } else if (team === "zero") {
    return "Team Net Zero";
  } else if (team === "power") {
    return "Team Renewables";
  }
}

// Find the team with the highest count
function getWinningTeam() {
  let winningTeam = "water";
  let highestCount = teamCounts.water;

  if (teamCounts.zero > highestCount) {
    winningTeam = "zero";
    highestCount = teamCounts.zero;
  }

  if (teamCounts.power > highestCount) {
    winningTeam = "power";
    highestCount = teamCounts.power;
  }

  return getTeamName(winningTeam);
}

// Celebration LevelUp
function checkCelebration() {
  if (attendeeCount >= attendanceGoal) {
    celebrationMessage.textContent = `Goal reached! ${getWinningTeam()} is leading the summit turnout.`;
  } else {
    celebrationMessage.textContent = "";
  }
}

// Attendee List LevelUp
function renderAttendeeList() {
  attendeeList.innerHTML = "";

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.textContent = `${attendee.name} — ${getTeamName(attendee.team)}`;
    attendeeList.appendChild(listItem);
  });
}

// Save Progress LevelUp
function saveData() {
  const data = {
    attendeeCount: attendeeCount,
    teamCounts: teamCounts,
    attendees: attendees
  };

  localStorage.setItem("intelSummitCheckIn", JSON.stringify(data));
}

// Reset button for testing
resetBtn.addEventListener("click", function () {
  attendeeCount = 0;

  teamCounts = {
    water: 0,
    zero: 0,
    power: 0
  };

  attendees = [];

  localStorage.removeItem("intelSummitCheckIn");

  greeting.textContent = "Check-in data has been reset.";
  updateDisplay();
});