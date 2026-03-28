/// <reference types="cypress" />
// E2E spec that focuses on /api/hub communication patterns:
// request shape, auth guard, and error-response resilience.
// All back-end dependencies are stubbed via cy.intercept.

describe("05 Hub API — request & response", () => {
  // ─── Happy paths ──────────────────────────────────────────────────────────

  it("image upload sends a multipart/form-data request to /api/hub", () => {
    cy.login();
    cy.visit("/dashboard");
    cy.selectDb("DeCav");
    cy.reload();
    cy.typeInEditor(1, "<p>Content before image.</p>");

    cy.intercept("POST", "/api/hub", (req) => {
      req.reply({ status: 200, message: "Data sanitized successfully" });
    }).as("hubCall");

    cy.get('[data-cy="image-button"]').click();
    cy.uploadTestImage();

    cy.wait("@hubCall", { timeout: 8000 }).then((interception) => {
      // The hub must receive a multipart request (file + type field)
      expect(interception.request.headers["content-type"]).to.match(
        /multipart\/form-data/i,
      );
    });
  });

  it("hub returns 200 for clean-image: dashboard stays rendered and functional", () => {
    cy.login();
    cy.visit("/dashboard");
    cy.selectDb("DeCav");
    cy.reload();

    cy.intercept("POST", "/api/hub", {
      status: 200,
      message: "Data sanitized successfully",
    }).as("hubOk");

    cy.get('[data-cy="image-button"]').click();
    cy.uploadTestImage();

    cy.wait("@hubOk", { timeout: 8000 });

    cy.url().should("include", "/dashboard");
    cy.get('[data-cy="editor-body"]').should("exist");
  });

  // ─── Non-happy paths ──────────────────────────────────────────────────────

  it("unauthenticated POST to /api/hub returns a body with status 401", () => {
    // Use cy.request without a session cookie to simulate an expired session
    cy.clearCookies();
    cy.request({
      method: "POST",
      url: "/api/hub",
      body: JSON.stringify({ data: "https://example.com", type: "summary" }),
      headers: { "Content-Type": "application/json" },
      failOnStatusCode: false,
    }).then((response) => {
      // hub/route.ts returns NextResponse.json({ status: 401, message: "User without a valid session" })
      expect(response.body.status).to.equal(401);
    });
  });

  it("hub returning 500 does not navigate the user away from the dashboard", () => {
    cy.login();
    cy.visit("/dashboard");
    cy.selectDb("DeCav");
    cy.reload();
    cy.typeInEditor(1, "<p>Content.</p>");

    cy.intercept("POST", "/api/hub", {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    }).as("hubError");

    cy.get('[data-cy="image-button"]').click();
    cy.uploadTestImage();

    cy.wait("@hubError", { timeout: 8000 });

    // The page must not crash — editor and URL should still be intact
    cy.url().should("include", "/dashboard");
    cy.get('[data-cy="editor-body"]').should("exist");
  });

  it("hub returning 401 mid-session leaves the page in a usable state", () => {
    cy.login();
    cy.visit("/dashboard");
    cy.selectDb("DeCav");
    cy.reload();
    cy.typeInEditor(1, "<p>Content.</p>");

    cy.intercept("POST", "/api/hub", {
      statusCode: 401,
      body: { status: 401, message: "Unauthorized" },
    }).as("hubUnauthorized");

    cy.get('[data-cy="image-button"]').click();
    cy.uploadTestImage();

    cy.wait("@hubUnauthorized", { timeout: 8000 });

    // The app must handle a 401 gracefully — body must not be empty/blank
    cy.get("body").should("exist").and("not.be.empty");
  });
});
