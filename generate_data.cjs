const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');

const template = (country, name) => ({
  country,
  electionName: name,
  targetDate: "2028-01-01T08:00:00",
  phases: [
    {
      id: "registration",
      label: "Registration",
      icon: "📋",
      duration: "Ongoing",
      description: "Voter registration phase.",
      steps: ["Register to vote"],
      voterActions: ["Check registration status"],
      keyLinks: []
    },
    {
      id: "voting",
      label: "Voting Day",
      icon: "🗳️",
      duration: "One Day",
      description: "Cast your vote.",
      steps: ["Go to polling station", "Vote"],
      voterActions: ["Bring ID"],
      keyLinks: []
    }
  ],
  keyDates: [
    { event: "Election Day", date: "TBD" }
  ],
  eligibility: {
    age: "18 years and above",
    citizenship: `Citizen of ${country}`,
    residence: "Resident in constituency"
  },
  glossary: [],
  quickQuestions: ["How to vote?"],
  quiz: []
});

fs.renameSync(path.join(dataDir, 'india.json'), path.join(dataDir, 'india_loksabha.json'));

fs.writeFileSync(path.join(dataDir, 'india_rajyasabha.json'), JSON.stringify(template("India", "Rajya Sabha Elections"), null, 2));
fs.writeFileSync(path.join(dataDir, 'uk.json'), JSON.stringify(template("United Kingdom", "General Election"), null, 2));
fs.writeFileSync(path.join(dataDir, 'canada.json'), JSON.stringify(template("Canada", "Federal Election"), null, 2));
fs.writeFileSync(path.join(dataDir, 'australia.json'), JSON.stringify(template("Australia", "Federal Election"), null, 2));
fs.writeFileSync(path.join(dataDir, 'germany.json'), JSON.stringify(template("Germany", "Bundestag Election"), null, 2));

console.log("Data files generated.");
