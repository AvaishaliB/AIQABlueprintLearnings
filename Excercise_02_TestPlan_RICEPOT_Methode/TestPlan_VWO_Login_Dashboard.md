# Test Plan – VWO Login Dashboard

**Document Owner:** Senior QA Test Architect  
**Version:** 1.0  
**Status:** Final Draft  
**Target Platform:** app.vwo.com  

---

## 1. Introduction
This Test Plan provides a comprehensive strategy for validating the VWO Login Dashboard, a critical entry point for VWO's SaaS experimentation platform. The platform serves a diverse user base, including digital marketers, product managers, and enterprise organizations. This document outlines the testing approach to ensure the system meets enterprise-grade security, global scalability, and high availability requirements, adhering to industry standards such as GDPR and OWASP.

## 2. Objectives
- Validate that the authentication system (Email/Password, MFA, SSO) is secure and reliable.
- Ensure the user experience is frictionless across all supported devices and viewports.
- Verify compliance with security standards (OWASP) and data privacy regulations (GDPR).
- Confirm the system handles high concurrent load without performance degradation.
- Ensure seamless integration with the main VWO dashboard post-authentication.

## 3. Scope

### 3.1 In Scope
- **Core Authentication:** Email + Password login, Multi-Factor Authentication (2FA), and Enterprise Single Sign-On (SSO/SAML).
- **Session Management:** Secure token generation, session persistence (Remember Me), and inactivity timeouts.
- **Self-Service Actions:** Forgot Password workflow and account recovery.
- **Requirement Validation:** Real-time email format verification and password strength indicators.
- **Cross-Platform:** Responsive UI validation across desktop, tablet, and mobile browsers.
- **Accessibility:** Compliance with WCAG 2.1 AA standards.
- **Security Protections:** Rate limiting, brute force protection, and HTTPS/SSL enforcement.

### 3.2 Out of Scope
- Registration and free trial signup flows (covered in a separate Test Plan).
- Internal administrative portals for customer support.
- Deep functional testing of product features *within* the main VWO dashboard (e.g., A/B test setup).

## 4. Test Items
- **UI Components:** Email field, Password field, 'Remember Me' checkbox, Login button.
- **Navigation Links:** Forgot Password, Sign up for a free trial.
- **Feedback Elements:** Error message containers, loading spinners, password strength bars.
- **Theme Controls:** Light/Dark mode toggle.
- **Communication:** Triggered emails for password reset and MFA codes.

## 5. Test Strategy

### 5.1 Functional Testing
Focus on business logic: Positive and negative authentication paths, Remember Me persistence across browser restarts, and validation of error messages to ensure they are actionable but secure.

### 5.2 UI Testing
Verification of the VWO design system alignment. Focus on visual consistency across browsers (Chrome, Firefox, Edge, Safari) and responsive behavior on mobile/tablet devices. Ensure no layout shifts during loading.

### 5.3 Security Testing
- **Vulnerability Checks:** Protection against SQL injection, XSS, and CSRF on authentication endpoints.
- **Authentication Security:** Validation of password hashing, secure cookie attributes (HttpOnly, Secure), and MFA token expiration.
- **Infrastructure:** Brute force protection/rate limiting and verification of HSTS (HTTP Strict Transport Security).

### 5.4 Performance Testing
- **Load Testing:** Verify the login page loads within 2 seconds under 1,000 concurrent user attempts.
- **Stress Testing:** Identify the breaking point of the authentication service.
- **Scalability:** Verify auto-scaling capabilities in multi-region deployments.

### 5.5 Accessibility Testing
Manual and automated (Axe-core) audits to ensure full keyboard navigability, screen reader compatibility (ARIA labels), and high-contrast support to meet WCAG 2.1 AA.

### 5.6 Integration Testing
Verify the hand-off between the Login service and the Core Platform. Ensure that the correct user context, permissions, and personalized settings are loaded into the main dashboard after successful login.

## 6. Test Environment
- **Staging URL:** `https://staging.app.vwo.com`
- **Browsers:** Chrome (v120+), Firefox (v121+), Edge (v120+), Safari (v17+).
- **Mobile Viewports:** iOS Safari (iPhone 14/15), Android Chrome (Pixel 7/8).
- **OS Platform:** Windows 11, macOS Sonoma, iOS, Android.

## 7. Test Data Requirements
- Valid enterprise accounts with different permission levels (Admin, Viewer, Editor).
- Valid accounts with MFA enabled/disabled.
- Valid accounts configured for SSO (SAML/OAuth).
- List of invalid/expired/locked accounts for negative testing.
- Test email addresses to verify password reset delivery.

## 8. Test Scenarios
- **Scenario 1:** Successful login with valid credentials and redirection to correct dashboard.
- **Scenario 2:** MFA challenge flow for users with 2FA enabled.
- **Scenario 3:** Native SSO redirection and successful authentication via SAML provider.
- **Scenario 4:** Verification of rate limiting after 5 failed attempts (Account Lockout).
- **Scenario 5:** Password reset flow from request to token expiration.
- **Scenario 6:** Responsive layout behavior on fold/rotate for mobile devices.

## 9. Entry Criteria
- Build is deployed in the Staging/QA environment.
- Test documentation (Test Plan, Test Cases) is approved.
- Test data (accounts/SSO config) is provisioned.
- Smoke tests pass on the current build.

## 10. Exit Criteria
- 100% of planned test cases executed.
- 95%+ pass rate for all functional tests.
- Zero open Critical/High severity defects.
- All high-risk security vulnerabilities (OWASP Top 10) are mitigated.
- Page load time meets the 2-second SLA.

## 11. Risk and Mitigation
- **Risk:** Staging SSO providers may go down. *Mitigation:* Use mock SSO providers for initial validation.
- **Risk:** Rate limiting might block automation scripts. *Mitigation:* Whitelist QA IPs or implement a dedicated "No-Limit" test environment.
- **Risk:** Delayed delivery of MFA emails/SMS. *Mitigation:* Use virtual phone numbers or internal email logs for verification.

## 12. Deliverables
- Test Plan (this document).
- Automated Regression Suite (Selenium/Java/TestNG).
- Test Execution Summary Report (with Allure results).
- Defect Reports in JIRA.
- Final QA Sign-off Document.

## 13. Roles and Responsibilities
- **Senior QA Architect:** Strategy, planning, and high-level risk management.
- **QA Automation Engineer:** Development and maintenance of the Selenium framework.
- **Manual QA Specialist:** Exploratory testing, accessibility audits, and UI validation.
- **DevOps Engineer:** Environment stability and CI/CD integration.
- **Product Owner:** Acceptance criteria verification and final sign-off.

## 14. Test Tools
- **Automation Framework:** Selenium 4, Java 17, TestNG, Maven.
- **Reporting:** Allure Reports.
- **Performance:** Apache JMeter / k6.
- **Accessibility:** Axe DevTools, NVDA/Screen Reader.
- **Security:** OWASP ZAP / Burp Suite.
- **Management:** JIRA & Confluence.
