# RF Thrive Survey Link Development Environment

This project provides a local development environment for building and testing
the JavaScript logic used to render survey links inside the Higher Logic Thrive
“Evaluation & Reporting” landing page for Resilient Futures partner agencies.

Logical Outcomes (LO) provides survey link exports in CSV format. These CSVs
must be transformed into a JSON structure that Thrive can use to inject the
correct survey URLs for each agency based on the page’s `data-agencyid`
attribute.

This folder contains:

- A test HTML file that emulates Thrive’s rendered page structure
- Scripts for converting the LO CSV export into structured JSON
- An agency → security group mapping file
- Output files that will be copy/pasted into Thrive

---

## Project Structure

```
rf-thrive-dev/
│
├── thrive-test.html              # Local emulator of the Thrive page
├── lo-survey-links-sample.csv    # Sample CSV from Logical Outcomes
├── agency-security-map.json      # Prosper-maintained agency → security group map
├── csv-to-json.js                # Node script converting CSV → final JSON
├── final-survey-data.json        # Auto-generated JSON used in Thrive
├── package.json
├── .gitignore
└── README.md
```

---

## 1. Install Dependencies

Run this once:

```bash
npm install
```

---

## 2. Convert the LO CSV into JSON

```bash
node csv-to-json.js
```

This script will generate `final-survey-data.json`.

---

## 3. Test the Rendering Logic Locally

Open:

```
thrive-test.html
```

Update `data-agencyid` to test different agencies.

---

## 4. Deploy to Thrive

Copy/paste:

1. The JSON from `final-survey-data.json`
2. The rendering JavaScript

into the Thrive page widget for the correct agency.

---

## 5. Updating Data

Replace the CSV, run:

```bash
node csv-to-json.js
```

Paste updated JSON into Thrive.

---

Internal use only – Prosper Canada Information Systems Team.
