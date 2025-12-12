//
// rf-agency-render.js
// Public-safe rendering logic for Thrive Evaluation page
// -------------------------------------------------------
// EXPECTS inside Thrive page:
//
//   window.agencySecurityMap = {
//     "5122_00": {
//        agencyName: "...",
//        securityGroup: "...",        // optional
//        role: "...",                 // optional
//        stream: 1,
//        domains: ["example.org"]     // optional
//     }
//   };
//
//   window.allAgencySurveyLinks = { ...survey links (private)... };
//
//   window.agencyEmailOverrides = {
//     "user@gmail.com": { agency: "5122_00" }
//   };
//
// Thrive then calls:
//
//   window.renderEvaluationPage();
//
// This script contains NO survey URLs and NO sensitive data.
//

(function () {
  //
  // Utility: Escape HTML
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
  // Utility: Read logged-in user's email from Thrive UI
  //
  function getLoggedInUserEmail() {
    const emailEl = document.querySelector(".panel-email");
    if (!emailEl) return null;
    return emailEl.textContent.trim().toLowerCase();
  }

  //
  // Utility: Resolve agency by email domain
  //
  function resolveAgencyByDomain(email) {
    if (!email || !window.agencySecurityMap) return null;

    const domain = email.split("@")[1];
    if (!domain) return null;

    for (const [agencyId, meta] of Object.entries(window.agencySecurityMap)) {
      if (
        Array.isArray(meta.domains) &&
        meta.domains.map((d) => d.toLowerCase()).includes(domain)
      ) {
        return agencyId;
      }
    }
    return null;
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

    const domAgencyId = container.dataset.agencyid || null;
    const userEmail = getLoggedInUserEmail();

    let agencyId = null;
    let resolutionMethod = null;

    //
    // 1. Explicit email override (highest priority)
    //
    if (userEmail && window.agencyEmailOverrides?.[userEmail]?.agency) {
      agencyId = window.agencyEmailOverrides[userEmail].agency;
      resolutionMethod = "email-override";
    }

    //
    // 2. Email domain match
    //
    if (!agencyId && userEmail) {
      const domainMatch = resolveAgencyByDomain(userEmail);
      if (domainMatch) {
        agencyId = domainMatch;
        resolutionMethod = "email-domain";
      }
    }

    //
    // 3. Fallback to DOM-provided agency (SG-based)
    //
    if (!agencyId && domAgencyId) {
      agencyId = domAgencyId;
      resolutionMethod = "dom-agencyid";
    }

    //
    // 4. Fail closed
    //
    if (!agencyId) {
      console.warn("RF widget: Unable to resolve agency.", {
        userEmail,
        domAgencyId,
      });

      container.innerHTML = `
        <div class="alert alert-danger">
          <strong>Access not configured</strong><br>
          We could not determine your organization.
          Please contact Prosper Canada for access.
        </div>
      `;
      return;
    }

    const meta = window.agencySecurityMap?.[agencyId];
    const surveys = window.allAgencySurveyLinks?.[agencyId];

    const agencyName = escapeHtml(meta?.agencyName || "Your Organization");
    const securityGroup = escapeHtml(meta?.securityGroup || "");

    //
    // Build page HTML
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
    // Surveys
    //
    if (surveys) {
      for (const round of Object.keys(surveys)) {
        const { en, fr } = surveys[round];

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
      html += `
        <div class="col-md-12">
          <div class="alert alert-warning">
            No surveys are available yet for ${agencyName}.
          </div>
        </div>
      `;
    }

    //
    // Results & Insights
    //
    html += `
        </div>

        <div class="row mt-5 mb-3">
          <div class="col">
            <h3 class="mb-3">Results & Insights</h3>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="alert alert-info">
              <i class="fa fa-info-circle mr-2"></i>
              No dashboards are available yet.
            </div>
          </div>
        </div>

      </div>
    `;

    container.innerHTML = html;

    //
    // Optional: expose resolution method for admin/debug tools
    //
    // ------------------------------------------------------------
    // Expose resolution info for admin/debug tools (single source of truth)
    // ------------------------------------------------------------
    window.__rfResolutionInfo = {
      userEmail,
      resolvedAgencyId: agencyId,
      resolutionMethod, // "email-override" | "email-domain" | "dom-agencyid"
    };
  }

  //
  // Expose globally
  //
  window.renderEvaluationPage = renderEvaluationPage;
})();
