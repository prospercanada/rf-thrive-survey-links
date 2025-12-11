document.addEventListener("DOMContentLoaded", function () {
  const isAdmin = !!document.querySelector("#admin-toolbar");
  const isImpersonating = !!document.querySelector("#pnlImpersonation");

  // Only show debug tools for REAL admins
  if (!isAdmin || isImpersonating) return;

  // ------------------------------------------------------------
  // Popup modal function (with close button + ESC + click outside)
  // ------------------------------------------------------------
  function showPopup(title, content) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "999999";

    const popup = document.createElement("div");
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.width = "600px";
    popup.style.maxHeight = "80vh";
    popup.style.overflow = "auto";
    popup.style.position = "relative";
    popup.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
    popup.style.fontFamily = "Arial, sans-serif";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "8px";
    closeBtn.style.right = "8px";
    closeBtn.style.border = "none";
    closeBtn.style.background = "transparent";
    closeBtn.style.fontSize = "22px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.color = "#444";

    const heading = document.createElement("h2");
    heading.textContent = title;
    heading.style.marginTop = "0";
    heading.style.fontSize = "20px";

    const pre = document.createElement("pre");
    pre.textContent = content;
    pre.style.whiteSpace = "pre-wrap";
    pre.style.fontSize = "13px";
    pre.style.background = "#f5f5f5";
    pre.style.padding = "12px";
    pre.style.borderRadius = "4px";
    pre.style.overflowX = "auto";

    // Assemble the modal
    popup.appendChild(closeBtn);
    popup.appendChild(heading);
    popup.appendChild(pre);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Close handlers
    closeBtn.onclick = () => overlay.remove();
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", escHandler);
      }
    });
  }

  // ------------------------------------------------------------
  // Build Admin Debug Panel
  // ------------------------------------------------------------
  const debugPanel = document.createElement("div");
  debugPanel.style.position = "fixed";
  debugPanel.style.bottom = "20px";
  debugPanel.style.right = "20px";
  debugPanel.style.background = "#333";
  debugPanel.style.color = "#fff";
  debugPanel.style.padding = "12px";
  debugPanel.style.borderRadius = "6px";
  debugPanel.style.zIndex = "99999";
  debugPanel.style.fontSize = "14px";
  debugPanel.style.boxShadow = "0 0 8px rgba(0,0,0,0.4)";

  debugPanel.innerHTML = `
    <strong>Admin Debug</strong><br>

    <button id="btnShowSurveyJson" class="rf-debug-btn" style="margin-top:6px;">
      Survey Links JSON
    </button><br>

    <button id="btnShowSecMap" class="rf-debug-btn" style="margin-top:6px;">
      Agency Map JSON
    </button><br>

    <button id="btnHighlight" class="rf-debug-btn" style="margin-top:6px;">
      Highlight Agency Widgets
    </button>
  `;

  document.body.appendChild(debugPanel);

  // ------------------------------------------------------------
  // Button logic (now uses popup modals)
  // ------------------------------------------------------------
  document.getElementById("btnShowSurveyJson").onclick = function () {
    showPopup(
      "Survey Links JSON",
      JSON.stringify(window.allAgencySurveyLinks, null, 2)
    );
  };

  document.getElementById("btnShowSecMap").onclick = function () {
    showPopup(
      "Agency Security Map",
      JSON.stringify(window.agencySecurityMap, null, 2)
    );
  };

  //   document.getElementById("btnHighlight").onclick = function () {
  //     document.querySelectorAll("[data-agencyid]").forEach((el) => {
  //       el.style.outline = "3px solid red";
  //       el.style.margin = "10px 0";
  //       el.style.padding = "10px";
  //     });
  //     alert("Agency widget blocks highlighted.");
  //   };

  //   document.getElementById("btnHighlight").onclick = function () {
  //     const blocks = document.querySelectorAll("[data-agencyid]");
  //     let count = 0;

  //     blocks.forEach((el) => {
  //       count++;

  //       // Add red highlight border
  //       el.style.outline = "3px solid red";
  //       el.style.margin = "10px 0";
  //       el.style.padding = "10px";
  //       el.style.position = "relative";

  //       // Remove any old bubbles
  //       const oldBubble = el.querySelector(".rf-agency-bubble");
  //       if (oldBubble) oldBubble.remove();

  //       // Create a count bubble
  //       const bubble = document.createElement("div");
  //       bubble.className = "rf-agency-bubble";
  //       bubble.textContent = el.dataset.agencyid; // Show pseudokey such as "5229_03"

  //       bubble.style.position = "absolute";
  //       bubble.style.top = "-8px";
  //       bubble.style.right = "-8px";
  //       bubble.style.background = "#0D47A1";
  //       bubble.style.color = "white";
  //       bubble.style.fontSize = "12px";
  //       bubble.style.padding = "4px 6px";
  //       bubble.style.borderRadius = "12px";
  //       bubble.style.fontWeight = "bold";
  //       bubble.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
  //       bubble.style.zIndex = "100002";

  //       el.appendChild(bubble);
  //     });

  //     alert(`Highlighted ${blocks.length} agency widgets.`);
  //   };

  document.getElementById("btnHighlight").onclick = function () {
    const blocks = document.querySelectorAll("[data-agencyid]");

    blocks.forEach((el) => {
      const agencyId = el.dataset.agencyid;

      // Extract survey rounds for this agency
      const surveyInfo = window.allAgencySurveyLinks[agencyId];
      let roundCount = 0;

      if (surveyInfo) {
        roundCount = Object.keys(surveyInfo).length;
      }

      // Build bubble text
      const label = surveyInfo
        ? `${agencyId} • ${roundCount} survey${roundCount !== 1 ? "s" : ""}`
        : `${agencyId} • 0 surveys`;

      // Highlight block
      el.style.outline = "3px solid red";
      el.style.margin = "10px 0";
      el.style.padding = "10px";
      el.style.position = "relative";

      // Remove old bubble if exists
      const oldBubble = el.querySelector(".rf-agency-bubble");
      if (oldBubble) oldBubble.remove();

      // Insert improved bubble
      const bubble = document.createElement("div");
      bubble.className = "rf-agency-bubble";
      bubble.textContent = label;

      bubble.style.position = "absolute";
      bubble.style.top = "-8px";
      bubble.style.right = "-8px";
      bubble.style.background = "#0D47A1";
      bubble.style.color = "white";
      bubble.style.fontSize = "11px";
      bubble.style.padding = "4px 8px";
      bubble.style.borderRadius = "14px";
      bubble.style.fontWeight = "bold";
      bubble.style.whiteSpace = "nowrap";
      bubble.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
      bubble.style.zIndex = "100002";

      el.appendChild(bubble);
    });

    alert("Agency widgets highlighted with survey counts.");
  };

  // ------------------------------------------------------------
  // Pale admin button styles
  // ------------------------------------------------------------
  const style = document.createElement("style");
  style.textContent = `
    .rf-debug-btn {
      background: #E3F2FD !important;
      color: #0D47A1 !important;
      border: 1px solid #90CAF9 !important;
      padding: 6px 10px !important;
      border-radius: 4px !important;
      font-size: 13px !important;
      cursor: pointer !important;
      display: inline-block !important;
    }
    .rf-debug-btn:hover {
      background: #BBDEFB !important;
    }
  `;
  document.head.appendChild(style);
});
