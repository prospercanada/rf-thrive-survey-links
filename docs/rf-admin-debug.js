document.addEventListener("DOMContentLoaded", function () {
  const isAdmin = !!document.querySelector("#admin-toolbar");
  const isImpersonating = !!document.querySelector("#pnlImpersonation");

  // Only show debug tools for REAL admins
  if (!isAdmin || isImpersonating) return;

  // --- Build Admin Debug Panel ---
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
    <button id="btnShowSurveyJson" style="margin-top:6px;">Survey Links JSON</button><br>
    <button id="btnShowSecMap" style="margin-top:6px;">Agency Map JSON</button><br>
    <button id="btnHighlight" style="margin-top:6px;">Highlight Agency Widgets</button>
  `;

  document.body.appendChild(debugPanel);

  // --- Hidden <pre> block for data output ---
  const pre = document.createElement("pre");
  pre.style.display = "none";
  pre.style.position = "fixed";
  pre.style.top = "20px";
  pre.style.left = "20px";
  pre.style.width = "40%";
  pre.style.height = "60%";
  pre.style.overflow = "auto";
  pre.style.background = "#111";
  pre.style.color = "#0f0";
  pre.style.padding = "10px";
  pre.style.border = "1px solid #444";
  pre.style.zIndex = "99998";
  document.body.appendChild(pre);

  function togglePre(content) {
    if (pre.style.display === "none") {
      pre.textContent = content;
      pre.style.display = "block";
    } else {
      pre.style.display = "none";
    }
  }

  // --- Button handlers ---
  document.getElementById("btnShowSurveyJson").onclick = function () {
    togglePre(JSON.stringify(window.allAgencySurveyLinks, null, 2));
  };

  document.getElementById("btnShowSecMap").onclick = function () {
    togglePre(JSON.stringify(window.agencySecurityMap, null, 2));
  };

  document.getElementById("btnHighlight").onclick = function () {
    document.querySelectorAll("[data-agencyid]").forEach((el) => {
      el.style.outline = "3px solid red";
      el.style.margin = "10px 0";
      el.style.padding = "10px";
    });
    alert("Agency widget blocks are highlighted.");
  };
});
