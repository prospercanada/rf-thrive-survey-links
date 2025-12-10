const fs = require("fs");
const csv = require("csv-parse/sync");

const csvText = fs.readFileSync("./lo-survey-links-sample.csv", "utf8");
const rows = csv.parse(csvText, { columns: true });

const output = {};

rows.forEach((row) => {
  const agencyId = row.grantee_id; // Prosper + LO shared ID
  const round = row.round; // A1, A3, etc.
  const lang = row.language; // en, fr

  if (!output[agencyId]) {
    output[agencyId] = {};
  }
  if (!output[agencyId][round]) {
    output[agencyId][round] = {};
  }

  // Build full LimeSurvey URL
  const fullUrl = "https://logicaloutcomes.com" + row.url;

  output[agencyId][round][lang] = fullUrl;
});

fs.writeFileSync("./final-survey-data.json", JSON.stringify(output, null, 2));
console.log("Generated final-survey-data.json");
