//
// rf-agency-render.js
// Public-safe rendering logic for Thrive Evaluation page
// -------------------------------------------------------
// EXPECTS inside Thrive page:
//
//   window.agencySecurityMap = { ...non-sensitive metadata... };
//   window.allAgencySurveyLinks = { ...survey links (private)... };
//
// Thrive then calls:
//
//   window.renderEvaluationPage();
//
// This script must contain NO survey URLs and NO sensitive information.
//

(function () {
  //
  // Utility: Escape HTML to prevent rendering issues
  //
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  //
  // Core Rendering Function
  //
  function renderEvaluationPage() {
    const container = document.getElementById("rf-agency-container");
    if (!container) {
      console.warn("RF widget: No #rf-agency-container found.");
      return;
    }

    const agencyId = container.dataset.agencyid;
    if (!agencyId) {
      console.warn("RF widget: No data-agencyid attribute found.");
      return;
    }

    const meta = window.agencySecurityMap?.[agencyId];
    const surveys = window.allAgencySurveyLinks?.[agencyId];

    const agencyName = escapeHtml(meta?.agencyName || "Your Organization");
    const securityGroup = escapeHtml(meta?.securityGroup || "");
    const role = meta?.role ? escapeHtml(meta.role) : "";
    const stream = meta?.stream ? escapeHtml(meta.stream) : "";

    //
    // Start building full page HTML
    //
    let html = `
      <div class="container my-5 ${securityGroup}" data-agencyid="${agencyId}">
        
        <!-- Header -->
        <div class="row mb-4">
          <div class="col">
            <h1 class="mb-3">My Evaluation & Reporting – ${agencyName}</h1>
            <p class="text-muted">
              Access your evaluation surveys and reporting tools.
            </p>
          </div>
        </div>

        <!-- Surveys Section -->
        <div class="row mb-3">
          <div class="col">
            <h3 class="mb-3">Surveys & Reporting</h3>
          </div>
        </div>

        <div class="row">
    `;

    //
    // If there are surveys, create cards
    //
    if (surveys) {
      for (const round of Object.keys(surveys)) {
        const { en, fr } = surveys[round]; // from private Thrive inline script

        html += `
          <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">
                  <i class="fa fa-clipboard mr-2"></i>${escapeHtml(
                    round
                  )} Evaluation Survey
                </h5>
                <p class="card-text flex-grow-1">
                  Please complete this evaluation survey.
                </p>
                <a href="${escapeHtml(
                  en
                )}" target="_blank" class="btn btn-primary mt-auto">
                  Start (English)
                </a>
                <a href="${escapeHtml(
                  fr
                )}" target="_blank" class="btn btn-secondary mt-2">
                  Start (Français)
                </a>
              </div>
            </div>
          </div>
        `;
      }
    } else {
      //
      // Fallback if no surveys are defined yet
      //
      html += `
        <div class="col-md-12">
          <div class="alert alert-warning">
            No surveys are available yet for ${agencyName}.
          </div>
        </div>
      `;
    }

    //
    // Results & Insights section
    //
    html += `
        </div> <!-- end surveys row -->

        <div class="row mt-5 mb-3">
          <div class="col">
            <h3 class="mb-3">Results & Insights</h3>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="alert alert-info">
              <i class="fa fa-info-circle mr-2"></i>
              No dashboards are available yet. Your evaluation results will appear here as the project progresses.
            </div>
          </div>
        </div>

      </div> <!-- end container -->
    `;

    //
    // Inject HTML into the Thrive container
    //
    container.innerHTML = html;
  }

  //
  // Expose globally (safe)
  //
  window.renderEvaluationPage = renderEvaluationPage;
})();
