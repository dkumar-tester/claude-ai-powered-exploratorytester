# Test Plan: Innovayte Investor Portal
**URL:** https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?
**Date:** 2026-04-10
**Environment:** UAT Sandbox
**Application Type:** Salesforce Community / Experience Cloud - Investor Portal

---

## Application Overview
The Innovayte Investor Portal is a read-only financial portal where investors can view:
- Investment account information (via ETC Brokerage Services and Equity Trust Company custodians)
- Financial documents and statements
- Portfolio positions and charts
- Advisor contact details
- FAQ and contact information

### Navigation Structure
- **Home** (Dashboard with portfolio breakdown, advisor details, quick links)
- **Accounts** (Investment accounts with two custodian tabs)
- **Documents** (Financial account documents)
- **Positions** (Portfolio charts and position data)
- **Contact Us** (FAQ and contact information)
- **User Profile** (Log Out)

### Key Pages Discovered
1. Portal Login Page (custom branded)
2. Password Reset Page (custom branded)
3. Employee/Salesforce Login Page (with SSO: Okta)
4. MFA / Identity Verification Page
5. Home Dashboard
6. Investment Accounts Page
7. Documents Page
8. Positions Page
9. Contact Us / FAQ Page
10. 404 Error Page

---

## Suite 1: Login & Authentication [LOGIN FLOW]

### 1.1 Successful Login with Valid Credentials [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?
2. Verify the login page displays with Innovayte logo, Username field, Password field, "Log In to Sandbox" button, "Remember me" checkbox, and "Forgot Your Password?" link
3. Enter valid username in the Username field
4. Enter valid password in the Password field
5. Click "Log In to Sandbox" button
6. If MFA verification appears, enter the verification code sent to the registered email
7. Click "Verify" button
**Expected:** User is redirected to the Home/Dashboard page displaying "Welcome to the Innovayte Investor Portal, [User Name]"

### 1.2 Login with Invalid Username [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Enter an invalid/non-existent username (e.g., "invaliduser@test.com")
3. Enter any password
4. Click "Log In to Sandbox" button
**Expected:** Error message "Please check your username and password. If you still can't log in, contact your Innovayte Portal administrator." is displayed. Username and Password fields are cleared.

### 1.3 Login with Invalid Password [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Enter a valid username
3. Enter an incorrect password
4. Click "Log In to Sandbox" button
**Expected:** Error message "Please check your username and password. If you still can't log in, contact your Innovayte Portal administrator." is displayed. Fields are cleared.

### 1.4 Login with Empty Username [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Leave the Username field empty
3. Enter any password
4. Click "Log In to Sandbox" button
**Expected:** Error message is displayed or form validation prevents submission. User remains on the login page.

### 1.5 Login with Empty Password [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Enter a valid username
3. Leave the Password field empty
4. Click "Log In to Sandbox" button
**Expected:** Error message is displayed or form validation prevents submission. User remains on the login page.

### 1.6 Login with Both Fields Empty [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Leave both Username and Password fields empty
3. Click "Log In to Sandbox" button
**Expected:** Error message is displayed. User remains on the login page.

### 1.7 Remember Me Checkbox Functionality [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Enter valid credentials
3. Check the "Remember me" checkbox
4. Click "Log In to Sandbox" button
5. Complete MFA if required
6. Log out of the portal
7. Navigate back to the login page
**Expected:** The Username field is pre-populated with the previously used username.

### 1.8 Login Page UI Elements Verification [LOGIN FLOW]
**Starting state:** Unauthenticated user
**Steps:**
1. Navigate to the login page
2. Verify all UI elements are present:
   - Innovayte logo (dark blue)
   - "Username" label and input field
   - "Password" label and input field
   - "Log In to Sandbox" button (dark navy)
   - "Remember me" checkbox (unchecked by default)
   - "Forgot Your Password?" link (teal/green color)
   - "Innovayte LLC employee? Log In" link at the bottom
   - Copyright footer: "© 2026 Innovayte.. All rights reserved."
**Expected:** All elements are present, properly styled, and correctly positioned.

### 1.9 Login Page - Password Field Masking [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Click into the Password field
3. Type a password string
**Expected:** Characters are masked/hidden (displayed as dots or asterisks).

### 1.10 Employee Login Link Navigation [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the portal login page
2. Click "Log In" link in "Innovayte LLC employee? Log In"
**Expected:** User is redirected to the Salesforce/Employee login page showing:
- Innovayte/Accelerayte logo
- Salesforce login form (Username, Password, "Log In to Sandbox")
- "Remember me" checkbox
- "Forgot Your Password?" link
- SSO options: "Log in with Acceleryate_OKTA" and "Log in with Okta ETC"
- Right panel with "Revolutionizing Financial Experiences for Tomorrow" and "Platform Login" button

---

## Suite 2: MFA / Identity Verification [LOGIN FLOW]

### 2.1 MFA Verification with Valid Code [LOGIN FLOW]
**Starting state:** User has entered valid credentials and is on the Verify Your Identity page
**Steps:**
1. Log in with valid credentials
2. On the "Verify Your Identity" page, observe the message indicating a code was sent to the masked email address
3. Retrieve the verification code from the registered email
4. Enter the valid code in the "Verification Code" field
5. Click "Verify" button
**Expected:** User is successfully authenticated and redirected to the Home/Dashboard page.

### 2.2 MFA Verification with Invalid Code [LOGIN FLOW]
**Starting state:** User has entered valid credentials and is on the Verify Your Identity page
**Steps:**
1. Log in with valid credentials
2. On the "Verify Your Identity" page, enter an invalid verification code (e.g., "000000")
3. Click "Verify" button
**Expected:** An error message is displayed indicating the code is invalid. User remains on the verification page.

### 2.3 MFA Verification with Empty Code [LOGIN FLOW]
**Starting state:** User has entered valid credentials and is on the Verify Your Identity page
**Steps:**
1. Log in with valid credentials
2. Leave the "Verification Code" field empty
3. Click "Verify" button
**Expected:** Validation error is displayed. User remains on the verification page.

### 2.4 MFA "Don't Ask Again" Checkbox [LOGIN FLOW]
**Starting state:** User has entered valid credentials and is on the Verify Your Identity page
**Steps:**
1. Log in with valid credentials
2. On the "Verify Your Identity" page, ensure "Don't ask again" checkbox is checked
3. Enter valid verification code and click "Verify"
4. Log out
5. Log back in with the same credentials on the same browser/device
**Expected:** MFA verification is bypassed on subsequent logins from the same device/browser.

### 2.5 MFA Resend Code [LOGIN FLOW]
**Starting state:** User has entered valid credentials and is on the Verify Your Identity page
**Steps:**
1. Log in with valid credentials
2. On the "Verify Your Identity" page, click "Resend Code" link
**Expected:** A new verification code is sent to the registered email. User can use the new code to verify.

### 2.6 MFA Page UI Elements [LOGIN FLOW]
**Starting state:** User has entered valid credentials and is on the Verify Your Identity page
**Steps:**
1. Log in with valid credentials
2. Verify the MFA page displays:
   - Innovayte logo
   - "Verify Your Identity" heading
   - Message about logging in to Innovayte Portal
   - "Enter the verification code we emailed to [masked email]"
   - "Verification Code" label and input field
   - "Verify" button (dark navy)
   - "Don't ask again" checkbox (checked by default)
   - "Resend Code" link
**Expected:** All elements are present and correctly displayed.

---

## Suite 3: Password Reset [LOGIN FLOW]

### 3.1 Navigate to Password Reset Page [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Click "Forgot Your Password?" link
**Expected:** User is redirected to the Password Reset page showing:
- Innovayte logo (white on dark background)
- "PASSWORD RESET" heading
- Descriptive text about needing the username
- Username input field with person icon
- "Reset Password" button (teal)
- "Cancel" link

### 3.2 Password Reset with Valid Username [LOGIN FLOW]
**Starting state:** User on the Password Reset page
**Steps:**
1. Navigate to Forgot Your Password page
2. Enter a valid registered username in the Username field
3. Click "Reset Password" button
**Expected:** A confirmation message is displayed indicating password reset instructions have been sent to the registered email.

### 3.3 Password Reset with Invalid Username [LOGIN FLOW]
**Starting state:** User on the Password Reset page
**Steps:**
1. Navigate to Forgot Your Password page
2. Enter an invalid/non-existent username
3. Click "Reset Password" button
**Expected:** Appropriate error message is displayed, or a generic success message is shown (to avoid username enumeration).

### 3.4 Password Reset with Empty Username [LOGIN FLOW]
**Starting state:** User on the Password Reset page
**Steps:**
1. Navigate to Forgot Your Password page
2. Leave the Username field empty
3. Click "Reset Password" button
**Expected:** Validation error is displayed requiring the username field to be filled.

### 3.5 Password Reset Cancel Button [LOGIN FLOW]
**Starting state:** User on the Password Reset page
**Steps:**
1. Navigate to Forgot Your Password page
2. Click "Cancel" link
**Expected:** User is redirected away from the Password Reset page (observed behavior: redirects to the Salesforce employee login page).

---

## Suite 4: Home / Dashboard [AUTH REQUIRED]

### 4.1 Dashboard Page Load and Content Verification [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Verify the following elements are displayed:
   - Navigation bar: Home (highlighted), Accounts, Documents, Positions, Contact Us
   - User profile icon (top right)
   - Banner image (ocean/beach themed)
   - Welcome message: "Welcome to the Innovayte Investor Portal, [User Name]"
   - Three quick-access cards: Accounts, Documents, Positions (with icons)
   - Portfolio Breakdown section with Total Market Value
   - "Value as of Last Market Close" label
   - Portfolio Breakdown / Positions by Custodian tabs
   - Your Advisor Details section (Advisor, Firm, Email, Phone)
   - Quick Links section
**Expected:** All elements are present, properly rendered, and display accurate data.

### 4.2 Portfolio Breakdown Tab - Default Tab [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Scroll to the Portfolio Breakdown section
3. Verify "Portfolio Breakdown" tab is active/selected by default
**Expected:** "Portfolio Breakdown" tab is highlighted/active. The corresponding portfolio data or chart is displayed below.

### 4.3 Switch to Positions by Custodian Tab [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Scroll to the Portfolio Breakdown section
3. Click "Positions by Custodian" tab
**Expected:** Tab switches to "Positions by Custodian". The content area updates to show positions grouped by custodian.

### 4.4 Switch Back to Portfolio Breakdown Tab [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard viewing Positions by Custodian tab
**Steps:**
1. Ensure "Positions by Custodian" tab is active
2. Click "Portfolio Breakdown" tab
**Expected:** Tab switches back to "Portfolio Breakdown" with the original content.

### 4.5 Verify Total Market Value Display [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Locate the "Total Market Value" section
**Expected:** Total Market Value is displayed in correct currency format (e.g., "$2,071.35") with "Value as of Last Market Close" label below.

### 4.6 Verify Advisor Details Display [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Locate the "Your Advisor Details" section
3. Verify the following fields are displayed:
   - Advisor name
   - Firm name
   - Email (as a clickable mailto: link)
   - Phone number
**Expected:** All advisor details are displayed correctly. Email is a clickable link that opens the default email client.

### 4.7 Advisor Email Link Functionality [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Click on the advisor email link (e.g., "seejmiller@gmail.com")
**Expected:** Email client opens with the advisor's email address pre-populated in the "To" field (or the browser handles the mailto: link appropriately).

### 4.8 Accounts Card Navigation [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Click the "Accounts" card/tile (with the transaction icon)
**Expected:** User is navigated to the Investment Accounts page.

### 4.9 Documents Card Navigation [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Click the "Documents" card/tile (with the document icon)
**Expected:** User is navigated to the Documents page.

### 4.10 Positions Card Navigation [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Click the "Positions" card/tile (with the percentage/chart icon)
**Expected:** User is navigated to the Positions page.

### 4.11 Navigation Bar - Home Link Active State [AUTH REQUIRED]
**Starting state:** Logged-in user on any page
**Steps:**
1. Click "Home" in the navigation bar
**Expected:** Home page loads. "Home" nav item is highlighted/underlined to indicate active state.

---

## Suite 5: Investment Accounts [AUTH REQUIRED]

### 5.1 Accounts Page Load - ETC Brokerage Services Tab (Default) [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Click "Accounts" in the navigation bar
2. Verify the page loads with title "Investment Accounts"
3. Verify "ETC Brokerage Services" tab is active by default
4. Verify the Investment Accounts table header shows columns: ACCOUNT #, NAME, CUSTODIAN, TYPE, CASH BALANCE, TOTAL MARKET VALUE
**Expected:** Page loads correctly. ETC Brokerage Services tab is active. Table structure with proper column headers is displayed.

### 5.2 Switch to Equity Trust Company Tab [AUTH REQUIRED]
**Starting state:** Logged-in user on the Accounts page
**Steps:**
1. Navigate to the Accounts page
2. Click the "Equity Trust Company" tab
**Expected:** Tab switches to Equity Trust Company. The accounts table updates to show Equity Trust Company investment accounts (or "No data returned" if none exist).

### 5.3 Switch Between Custodian Tabs [AUTH REQUIRED]
**Starting state:** Logged-in user on the Accounts page
**Steps:**
1. Navigate to the Accounts page (ETC Brokerage Services tab active)
2. Click "Equity Trust Company" tab
3. Verify the tab is now active
4. Click "ETC Brokerage Services" tab
5. Verify the tab is now active again
**Expected:** Tabs switch correctly. Active tab is visually indicated (highlighted text, underline color). Table data refreshes appropriately for each custodian.

### 5.4 Accounts Table - No Data State [AUTH REQUIRED]
**Starting state:** Logged-in user with no investment accounts
**Steps:**
1. Navigate to the Accounts page
2. Observe the table when no accounts are associated
**Expected:** Table displays "No data returned" message. Account count shows "(0)" in the header.

### 5.5 Accounts Page Refresh Button [AUTH REQUIRED]
**Starting state:** Logged-in user on the Accounts page
**Steps:**
1. Navigate to the Accounts page
2. Click the refresh/reload button (circular arrow icon) in the top right of the accounts table
**Expected:** The accounts data is refreshed. If there are pending updates, they should appear after refresh.

### 5.6 Accounts Table Column Headers Verification [AUTH REQUIRED]
**Starting state:** Logged-in user on the Accounts page
**Steps:**
1. Navigate to the Accounts page
2. Verify all column headers are present: ACCOUNT #, NAME, CUSTODIAN, TYPE, CASH BALANCE, TOTAL MARKET VALUE
**Expected:** All six column headers are displayed in the correct order.

### 5.7 Account Count Display [AUTH REQUIRED]
**Starting state:** Logged-in user on the Accounts page
**Steps:**
1. Navigate to the Accounts page
2. Verify the account count displayed next to "Investment Accounts"
**Expected:** The count in parentheses (e.g., "(0)") matches the actual number of accounts listed in the table.

---

## Suite 6: Documents [AUTH REQUIRED]

### 6.1 Documents Page Load [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Click "Documents" in the navigation bar
2. Verify the page loads with title "Documents"
**Expected:** Documents page loads. Page title is "Documents".

### 6.2 Documents Page - No Financial Accounts State [AUTH REQUIRED]
**Starting state:** Logged-in user with no linked financial accounts
**Steps:**
1. Navigate to the Documents page
**Expected:** Message "No Financial Accounts found." is displayed.

### 6.3 Documents Page via Navigation Bar [AUTH REQUIRED]
**Starting state:** Logged-in user on any other page
**Steps:**
1. Click "Documents" in the top navigation bar
**Expected:** User is navigated to the Documents page. "Documents" nav item is highlighted as active.

---

## Suite 7: Positions [AUTH REQUIRED]

### 7.1 Positions Page Load [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Click "Positions" in the navigation bar
2. Verify the page loads with title "Positions"
**Expected:** Positions page loads with the "Positions" heading.

### 7.2 Positions Page - No Data Charts [AUTH REQUIRED]
**Starting state:** Logged-in user with no position data
**Steps:**
1. Navigate to the Positions page
2. Observe the chart areas
**Expected:** Two chart areas are displayed, each showing "We can't draw this chart because there is no data." message.

### 7.3 Positions Page - Timestamp Verification [AUTH REQUIRED]
**Starting state:** Logged-in user on the Positions page
**Steps:**
1. Navigate to the Positions page
2. Locate the timestamp text
**Expected:** A timestamp is displayed (e.g., "As of Yesterday at 4:19 AM") indicating when the data was last updated.

### 7.4 Positions Page via Navigation Bar [AUTH REQUIRED]
**Starting state:** Logged-in user on any other page
**Steps:**
1. Click "Positions" in the top navigation bar
**Expected:** User is navigated to the Positions page. "Positions" nav item is highlighted as active.

---

## Suite 8: Contact Us / FAQ [AUTH REQUIRED]

### 8.1 Contact Us Page Load [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Click "Contact Us" in the navigation bar
2. Verify the page loads
**Expected:** Page loads with title "Contact Us and Frequently Asked Questions" and introductory text.

### 8.2 FAQ Content - Who is Innovayte? [AUTH REQUIRED]
**Starting state:** Logged-in user on the Contact Us page
**Steps:**
1. Navigate to the Contact Us page
2. Locate the "Q: Who is Innovayte?" section
**Expected:** The question and answer are displayed explaining that Innovayte uses ETC Brokerage Services and/or Equity Trust Company as custodians, and the portal is view-only.

### 8.3 FAQ Content - Where to Send a Check (ETC) [AUTH REQUIRED]
**Starting state:** Logged-in user on the Contact Us page
**Steps:**
1. Navigate to the Contact Us page
2. Locate the "Q: Where do I send a check?" section
3. Find the ETC Brokerage Services subsection
**Expected:** Both Overnight and Regular Mail addresses for ETC Brokerage Services are displayed:
- Overnight: ETC Brokerage Services, 1 Equity Way, Westlake, OH 44145
- Regular Mail: ETC Brokerage Services, P.O. Box 451249, Westlake, OH 44145

### 8.4 FAQ Content - Where to Send a Check (Equity Trust) [AUTH REQUIRED]
**Starting state:** Logged-in user on the Contact Us page
**Steps:**
1. Navigate to the Contact Us page
2. Scroll to the Equity Trust Company section
**Expected:** Both Overnight and Regular Mail addresses for Equity Trust Company are displayed with correct address information.

### 8.5 Contact Us via Navigation Bar [AUTH REQUIRED]
**Starting state:** Logged-in user on any other page
**Steps:**
1. Click "Contact Us" in the top navigation bar
**Expected:** User is navigated to the Contact Us page. "Contact Us" nav item is highlighted as active.

---

## Suite 9: Navigation & Header [AUTH REQUIRED]

### 9.1 Navigation Bar Visibility on All Pages [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Visit each page: Home, Accounts, Documents, Positions, Contact Us
2. Verify the navigation bar is visible on each page
**Expected:** Navigation bar with all five items (Home, Accounts, Documents, Positions, Contact Us) and user profile icon is visible on every page.

### 9.2 Active Navigation State Highlighting [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Click each navigation item one at a time
2. Verify the active item is highlighted/underlined
**Expected:** The currently active page's navigation item is visually distinguished (highlighted text color and underline).

### 9.3 Navigation Consistency Across Pages [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Navigate to Home, then Accounts, then Documents, then Positions, then Contact Us
2. At each page, verify the correct page content loads
**Expected:** Each navigation link leads to the correct page with appropriate content.

### 9.4 Innovayte Logo Display in Navigation [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Navigate to any page
2. Verify the Innovayte logo is displayed in the top-left of the navigation bar
**Expected:** Innovayte logo (white text on purple background) is displayed in the navigation bar header.

### 9.5 User Profile Icon Display [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Navigate to any page
2. Verify the user profile icon is displayed in the top-right corner
**Expected:** A circular user avatar/icon is displayed in the top-right corner of the navigation bar.

### 9.6 User Profile Dropdown - Log Out [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Click the user profile icon in the top-right corner
**Expected:** A dropdown menu appears with "Log Out" option.

---

## Suite 10: Logout [AUTH REQUIRED]

### 10.1 Successful Logout [AUTH REQUIRED]
**Starting state:** Logged-in user on any page
**Steps:**
1. Click the user profile icon in the top-right corner
2. Click "Log Out" from the dropdown menu
**Expected:** User is logged out and redirected to the login page. Session is terminated.

### 10.2 Session Invalidation After Logout [AUTH REQUIRED]
**Starting state:** User who has just logged out
**Steps:**
1. Log in and then log out
2. Use the browser back button to try to access the Home/Dashboard page
**Expected:** User is redirected to the login page. No authenticated content is accessible.

### 10.3 Direct URL Access After Logout [AUTH REQUIRED]
**Starting state:** User who has just logged out
**Steps:**
1. Log in and note the URL of the Home page
2. Log out
3. Attempt to navigate directly to the Home page URL
**Expected:** User is redirected to the login page. The authenticated page is not accessible.

---

## Suite 11: Footer [AUTH REQUIRED]

### 11.1 Footer Content Verification [AUTH REQUIRED]
**Starting state:** Logged-in user on the Accounts page (or other internal pages)
**Steps:**
1. Navigate to the Accounts page
2. Scroll to the bottom of the page
3. Verify footer content
**Expected:** Footer displays:
- "© Innovayte 2026"
- "Clearing, custody or other brokerage services provided by ETC Brokerage Services, LLC. Innovayte is an affiliate of ETC Brokerage Services, LLC."
- "Terms and Conditions" link
- "Disclosures" link

### 11.2 Terms and Conditions Link [AUTH REQUIRED]
**Starting state:** Logged-in user on a page with footer
**Steps:**
1. Navigate to a page showing the footer (e.g., Accounts)
2. Click "Terms and Conditions" link
**Expected:** Terms and Conditions content is displayed (either new page, modal, or PDF opens).

### 11.3 Disclosures Link [AUTH REQUIRED]
**Starting state:** Logged-in user on a page with footer
**Steps:**
1. Navigate to a page showing the footer (e.g., Accounts)
2. Click "Disclosures" link
**Expected:** Disclosures content is displayed (either new page, modal, or PDF opens).

### 11.4 Login Page Footer [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Verify the footer content
**Expected:** Footer displays "© 2026 Innovayte.. All rights reserved."

---

## Suite 12: Error Handling & Edge Cases

### 12.1 404 Page - Invalid URL [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Navigate to an invalid URL path within the portal (e.g., /InnovaytePortal/s/invalid-page)
**Expected:** A "Page not available" error page is displayed with the message "Maybe the page was deleted, the URL is incorrect, or something else went wrong. If you know the page exists but you still can't get to it, please ask the community administrator for help."

### 12.2 Direct URL Access Without Authentication
**Starting state:** Unauthenticated user (not logged in)
**Steps:**
1. Open a browser with no active session
2. Navigate directly to an authenticated page URL (e.g., the Home/Dashboard URL)
**Expected:** User is redirected to the login page. No authenticated content is shown.

### 12.3 Session Timeout Handling [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Log in successfully
2. Wait for the session timeout period (idle)
3. Attempt to interact with the portal (e.g., click a navigation link)
**Expected:** User is redirected to the login page with an appropriate session expired message.

### 12.4 Multiple Tab Login [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Log in successfully in one browser tab
2. Open the portal login URL in a new tab
**Expected:** User should either be redirected to the Home page automatically (session already active) or see the login page.

### 12.5 Browser Back Button After Login [AUTH REQUIRED]
**Starting state:** Recently logged-in user on the Home page
**Steps:**
1. Log in successfully
2. Click the browser back button
**Expected:** User should not see the login page with entered credentials. Either stays on the current page or is redirected to the login page.

### 12.6 Special Characters in Login Fields [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Enter special characters in the Username field (e.g., `<script>alert('xss')</script>`)
2. Enter special characters in the Password field
3. Click "Log In to Sandbox"
**Expected:** Application handles input gracefully without XSS execution. Standard error message is displayed.

### 12.7 SQL Injection Attempt in Login [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Enter a SQL injection string in the Username field (e.g., `' OR 1=1 --`)
2. Enter any password
3. Click "Log In to Sandbox"
**Expected:** Application handles input securely. Login fails with standard error message. No unauthorized access granted.

### 12.8 Very Long Input in Login Fields [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Enter an extremely long string (500+ characters) in the Username field
2. Enter an extremely long string in the Password field
3. Click "Log In to Sandbox"
**Expected:** Application handles long input gracefully. Either truncates input or shows appropriate error. No server crash.

---

## Suite 13: Responsive Design & Cross-Browser

### 13.1 Login Page Responsive Layout
**Starting state:** Unauthenticated user
**Steps:**
1. Open the login page on a mobile-sized viewport (375px width)
2. Verify all elements are visible and properly positioned
**Expected:** Login form is responsive. Fields, buttons, and links are usable on mobile viewport.

### 13.2 Dashboard Responsive Layout [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Open the Home page on a mobile-sized viewport
2. Verify navigation, cards, portfolio section, and advisor details
**Expected:** Content reflows appropriately. Navigation may collapse into a hamburger menu. Cards stack vertically.

### 13.3 Accounts Page Responsive Layout [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Open the Accounts page on a mobile-sized viewport
2. Verify table display and tab functionality
**Expected:** Table is scrollable or columns adjust. Tabs remain functional.

### 13.4 Contact Us Page Responsive Layout [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Open the Contact Us page on a mobile-sized viewport
2. Verify FAQ content is readable
**Expected:** Text content reflows properly. All FAQ content is readable without horizontal scrolling.

---

## Suite 14: Accessibility

### 14.1 Login Page Keyboard Navigation [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Navigate to the login page
2. Use Tab key to navigate through all interactive elements
3. Verify focus order: Username → Password → Log In to Sandbox → Remember me → Forgot Your Password
**Expected:** All interactive elements are reachable via keyboard. Focus indicators are visible.

### 14.2 Portal Navigation Keyboard Access [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Use Tab key to navigate through the navigation bar items
2. Press Enter on each navigation item
**Expected:** All navigation items are keyboard accessible. Enter/Space activates links.

### 14.3 Screen Reader Compatibility - Login Page [LOGIN FLOW]
**Starting state:** Unauthenticated user
**Steps:**
1. Enable a screen reader
2. Navigate to the login page
3. Verify all labels, buttons, and links are announced correctly
**Expected:** Screen reader correctly announces: Username field, Password field, Log In to Sandbox button, Remember me checkbox, Forgot Your Password link.

### 14.4 Color Contrast Verification [LOGIN FLOW]
**Starting state:** Unauthenticated user
**Steps:**
1. Navigate to the login page
2. Check color contrast ratios for text elements against their backgrounds
**Expected:** All text meets WCAG 2.1 AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text).

---

## Suite 15: Employee Login Page

### 15.1 Employee Login Page Elements [LOGIN FLOW]
**Starting state:** Unauthenticated user
**Steps:**
1. Navigate to the portal login page
2. Click "Innovayte LLC employee? Log In"
3. Verify all elements on the employee login page
**Expected:** Page displays:
- Innovayte/Accelerayte logo
- "To access this page, you have to log in to Salesforce." message
- "Salesforce login" heading
- Username and Password fields
- "Log In to Sandbox" button
- "Remember me" checkbox
- "Forgot Your Password?" link
- "Or" separator
- "Log in with Acceleryate_OKTA" button
- "Log in with Okta ETC" button
- Right panel: Marketing content with "Platform Login" button

### 15.2 Employee SSO - Acceleryate_OKTA [LOGIN FLOW]
**Starting state:** User on the employee login page
**Steps:**
1. Navigate to the employee login page
2. Click "Log in with Acceleryate_OKTA"
**Expected:** User is redirected to the Acceleryate OKTA SSO login page.

### 15.3 Employee SSO - Okta ETC [LOGIN FLOW]
**Starting state:** User on the employee login page
**Steps:**
1. Navigate to the employee login page
2. Click "Log in with Okta ETC"
**Expected:** User is redirected to the Okta ETC SSO login page.

### 15.4 Platform Login Button [LOGIN FLOW]
**Starting state:** User on the employee login page
**Steps:**
1. Navigate to the employee login page
2. Click "Platform Login" button on the right panel
**Expected:** User is navigated to the Innovayte platform login page or application.

---

## Suite 16: Data Integrity & Display

### 16.1 Portfolio Value Accuracy [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Note the "Total Market Value" amount
3. Compare with the sum of all individual account market values on the Accounts page
**Expected:** Total Market Value on the dashboard matches the sum of Total Market Values across all accounts.

### 16.2 Account Count Consistency [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Navigate to the Accounts page
2. Note the count in "Investment Accounts (X)" for ETC Brokerage Services tab
3. Count the actual rows in the table
4. Repeat for Equity Trust Company tab
**Expected:** The displayed count matches the actual number of account rows in the table for each tab.

### 16.3 Advisor Details Accuracy [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Verify advisor details (Name, Firm, Email, Phone) are displayed
3. Confirm the email format is valid
4. Confirm the phone format is valid
**Expected:** All advisor details are present, properly formatted, and represent actual advisor information.

### 16.4 Currency Format Verification [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Navigate to the Home page
2. Check the format of "Total Market Value"
**Expected:** Currency values are displayed with dollar sign ($), proper comma separators, and two decimal places (e.g., "$2,071.35").

---

## Suite 17: Performance & Loading

### 17.1 Login Page Load Time
**Starting state:** Unauthenticated user
**Steps:**
1. Navigate to the login page
2. Measure the time until the page is fully rendered
**Expected:** Login page loads within 3 seconds.

### 17.2 Dashboard Load Time [AUTH REQUIRED]
**Starting state:** User completing login
**Steps:**
1. Log in successfully
2. Measure the time until the dashboard is fully rendered (including portfolio data)
**Expected:** Dashboard loads within 5 seconds after authentication.

### 17.3 Page Navigation Load Time [AUTH REQUIRED]
**Starting state:** Logged-in user on the dashboard
**Steps:**
1. Click each navigation item (Accounts, Documents, Positions, Contact Us)
2. Measure load time for each page
**Expected:** Each page loads within 3 seconds.

---

## Suite 18: Security

### 18.1 HTTPS Enforcement
**Starting state:** Unauthenticated user
**Steps:**
1. Attempt to access the portal using HTTP (non-secure)
**Expected:** Request is automatically redirected to HTTPS.

### 18.2 Password Not Visible in Page Source [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Enter a password in the Password field
2. View the page source or inspect the element
**Expected:** Password value is not visible in plain text in the page source. The input type remains "password".

### 18.3 Authentication Token Security [AUTH REQUIRED]
**Starting state:** Logged-in user
**Steps:**
1. Log in successfully
2. Inspect browser cookies and local storage
**Expected:** Session tokens are properly secured (HttpOnly, Secure flags set). No sensitive data stored in local storage.

### 18.4 Account Lockout After Failed Attempts [LOGIN FLOW]
**Starting state:** Unauthenticated user on the login page
**Steps:**
1. Attempt to log in with an invalid password 5+ times consecutively
**Expected:** Account is temporarily locked or additional verification is required after multiple failed attempts. Appropriate message is displayed.
