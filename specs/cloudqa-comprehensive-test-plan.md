            # CloudQA Email Testing Platform - Comprehensive Test Plan

## Overview
CloudQA is a professional email testing platform that allows developers and QA teams to test email functionality in a secure sandbox environment. This test plan covers the entire application workflow including inbox creation, email management, filtering, searching, and email inspection features.

## URL Under Test
https://inbox.cloudqa.io/

## Test Environment
- Browser: Chromium/Firefox/WebKit
- Platform: Cross-browser testing
- Test Data: Dynamic email addresses (username@inbox.cloudqa.io)

---

## Test Suites

### Suite 1: Inbox Creation and Access

#### Test 1.1: Create New Inbox with Valid Username
**Steps:**
1. Navigate to https://inbox.cloudqa.io/
2. Click "Create Inbox" button
3. Enter valid username in the email username field
4. Verify the complete email address is displayed as "username@inbox.cloudqa.io"
5. Click "Access Inbox" button
6. Verify inbox is created and accessible

**Expected Results:**
- Create Inbox dialog appears
- Email preview shows correct format (username@inbox.cloudqa.io)
- User is directed to the inbox view
- Connection status shows "Connected: username@inbox.cloudqa.io"

---

#### Test 1.2: Verify Access Inbox Button Initially Disabled
**Steps:**
1. Navigate to https://inbox.cloudqa.io/
2. Click "Create Inbox" button
3. Observe the "Access Inbox" button state without entering username
4. Attempt to click disabled button

**Expected Results:**
- Access Inbox button is disabled when no username is entered
- Button becomes enabled after username is entered

---

#### Test 1.3: Load Existing Inbox
**Steps:**
1. Navigate to https://inbox.cloudqa.io/
2. Click "Load Inbox" button
3. Enter previously created username
4. Click "Access Inbox" button
5. Verify inbox loads with existing data

**Expected Results:**
- Load Inbox modal appears
- Existing inbox loads with messages if any
- Connection status confirms inbox is loaded

---

#### Test 1.4: Cancel Inbox Creation
**Steps:**
1. Navigate to https://inbox.cloudqa.io/
2. Click "Create Inbox" button
3. Click "Cancel" button
4. Verify return to home page

**Expected Results:**
- Modal closes
- User remains on home page
- No inbox is created

---

### Suite 2: Email Inbox Interface Navigation

#### Test 2.1: Verify Inbox Layout Components
**Steps:**
1. Create and access an inbox
2. Verify all major components are visible
3. Observe search bar, filter buttons, sort dropdown, and view mode buttons

**Expected Results:**
- Search bar is present at top
- Filter buttons (All, Unread, Read, Starred, Attachments) are visible
- Sort dropdown is accessible
- View mode toggle (Compact/Detailed) is available
- Refresh and Logout buttons are present in header

---

#### Test 2.2: Verify Inbox Header Information
**Steps:**
1. Create an inbox with username "testuser123"
2. Observe header display
3. Verify connection status is shown

**Expected Results:**
- Header shows "Connected: testuser123@inbox.cloudqa.io"
- CloudQA logo is visible
- Refresh button is accessible
- Logout button is accessible

---

#### Test 2.3: Verify Empty Inbox Message
**Steps:**
1. Create a new inbox with fresh username
2. Observe inbox area when no emails present

**Expected Results:**
- Empty state message displays "No messages yet"
- Instruction text shows "Send an email to [email]@inbox.cloudqa.io to get started"

---

### Suite 3: Email Filtering

#### Test 3.1: Filter Emails by "All"
**Steps:**
1. Create inbox with existing email
2. Click "All" filter button
3. Verify all emails are displayed

**Expected Results:**
- All button becomes active
- Email count shows in button label
- All emails regardless of status are displayed

---

#### Test 3.2: Filter Emails by "Unread"
**Steps:**
1. Create inbox with unread email
2. Click "Unread" filter button
3. Verify only unread emails are shown

**Expected Results:**
- Unread filter becomes active
- Only unread emails displayed
- Count shows "Unread (X)"

---

#### Test 3.3: Filter Emails by "Read"
**Steps:**
1. Create inbox and mark email as read
2. Click "Read" filter button
3. Verify only read emails are displayed

**Expected Results:**
- Read filter becomes active
- Only read emails displayed
- Count shows "Read (X)"

---

#### Test 3.4: Filter Emails by "Starred"
**Steps:**
1. Create inbox and star an email
2. Click "Starred" filter button
3. Verify only starred emails are shown

**Expected Results:**
- Starred filter becomes active
- Only starred emails displayed
- Count shows "Starred (X)"

---

#### Test 3.5: Filter Emails by "Attachments"
**Steps:**
1. Create inbox with emails containing attachments
2. Click "Attachments" filter button
3. Verify only emails with attachments are shown

**Expected Results:**
- Attachments filter becomes active
- Only emails with attachments displayed
- Count shows "Attachments (X)"

---

### Suite 4: Email Sorting

#### Test 4.1: Sort Emails by Date (Default)
**Steps:**
1. Create inbox with multiple emails
2. Verify default sort is "Date"
3. Verify emails are ordered by date

**Expected Results:**
- Sort dropdown shows "Date" as selected
- Emails are ordered chronologically

---

#### Test 4.2: Sort Emails by Sender
**Steps:**
1. Create inbox with emails from different senders
2. Select "Sender" from sort dropdown
3. Verify emails are sorted by sender name

**Expected Results:**
- Sort dropdown shows "Sender" selected
- Emails display in sender name order

---

#### Test 4.3: Sort Emails by Subject
**Steps:**
1. Create inbox with multiple emails
2. Select "Subject" from sort dropdown
3. Verify emails are sorted by subject line

**Expected Results:**
- Sort dropdown shows "Subject" selected
- Emails display in subject order

---

#### Test 4.4: Sort Emails by Size
**Steps:**
1. Create inbox with emails of varying sizes
2. Select "Size" from sort dropdown
3. Verify emails are sorted by size

**Expected Results:**
- Sort dropdown shows "Size" selected
- Emails display in size order

---

### Suite 5: Email Search

#### Test 5.1: Search Emails by Subject
**Steps:**
1. Create inbox with multiple emails
2. Enter search term in search bar (e.g., "Test")
3. Verify filtered results show only matching emails

**Expected Results:**
- Search results display only emails matching the search term
- Email list updates in real-time
- Matching email subject contains search term

---

#### Test 5.2: Search Emails by Sender
**Steps:**
1. Create inbox with emails from multiple senders
2. Enter sender name in search bar
3. Verify results show only emails from that sender

**Expected Results:**
- Search returns emails from matching sender
- Results update immediately

---

#### Test 5.3: Clear Search Results
**Steps:**
1. Enter search term in search bar
2. Clear the search field
3. Verify all emails display again

**Expected Results:**
- After clearing search, all emails are visible again
- Filter/sort settings are maintained

---

### Suite 6: Email View Modes

#### Test 6.1: Switch to Compact View
**Steps:**
1. Create inbox with emails
2. Click "Compact" view button
3. Observe email list display

**Expected Results:**
- Compact view button becomes active
- Email list shows condensed format
- Each email shows: Subject, Sender, Timestamp

---

#### Test 6.2: Switch to Detailed View
**Steps:**
1. Create inbox with emails
2. Click "Detailed" view button
3. Observe email list display

**Expected Results:**
- Detailed view button becomes active
- Email list shows expanded format
- Each email shows: Subject, Sender, Timestamp, Preview text

---

#### Test 6.3: View Mode Persistence
**Steps:**
1. Select Detailed view
2. Close and reopen inbox
3. Verify view mode is maintained

**Expected Results:**
- View mode preference is retained across sessions

---

### Suite 7: Email Actions - Starring

#### Test 7.1: Star an Email
**Steps:**
1. Create inbox with email
2. Click "Add star" button on email
3. Verify star icon updates
4. Verify "Starred" count increases

**Expected Results:**
- Star button changes to "Remove star"
- Starred count increments
- Star icon appears on email row
- Success notification shows "Message starred"

---

#### Test 7.2: Remove Star from Email
**Steps:**
1. Create inbox with starred email
2. Click "Remove star" button
3. Verify star is removed

**Expected Results:**
- Star button changes back to "Add star"
- Starred count decrements
- Star icon disappears
- Success notification shows "Message unstarred"

---

#### Test 7.3: Filter Starred Emails
**Steps:**
1. Star multiple emails
2. Click "Starred" filter
3. Verify only starred emails display

**Expected Results:**
- Only starred emails are visible
- Filter accurately reflects starred status

---

### Suite 8: Email Actions - Mark as Read/Unread

#### Test 8.1: Mark Email as Read
**Steps:**
1. Create inbox with unread email
2. Click "Mark as read" button
3. Verify email status changes

**Expected Results:**
- Button changes to "Mark as unread"
- Unread count decreases
- Read count increases
- Email appears in Read filter

---

#### Test 8.2: Mark Email as Unread
**Steps:**
1. Create inbox with read email
2. Click "Mark as unread" button
3. Verify status changes

**Expected Results:**
- Button changes to "Mark as read"
- Unread count increases
- Read count decreases

---

#### Test 8.3: Auto-Mark as Read on Open
**Steps:**
1. Create inbox with unread email
2. Click on email to view details
3. Verify email is automatically marked as read

**Expected Results:**
- Unread count decreases
- Button shows "Mark as unread"
- Success notification shows "Message marked as read"

---

### Suite 9: Email Deletion

#### Test 9.1: Delete Email from List
**Steps:**
1. Create inbox with email
2. Click "Delete message" button on email row
3. Verify email is removed

**Expected Results:**
- Email is removed from list
- Total count decreases
- Deleted email no longer visible in any filter

---

#### Test 9.2: Delete Email from Detail View
**Steps:**
1. Create inbox and open email detail
2. Click "Delete" button in detail view
3. Verify email is deleted and list updates

**Expected Results:**
- Email detail closes
- Email is removed from list
- User returns to inbox view

---

#### Test 9.3: Confirm Deletion Action
**Steps:**
1. Click Delete button
2. Observe confirmation dialog (if present)

**Expected Results:**
- Deletion action completes as expected
- Proper confirmation/feedback is provided

---

### Suite 10: Email Details View

#### Test 10.1: View Email Details
**Steps:**
1. Create inbox with email
2. Click on email row
3. Observe email details panel

**Expected Results:**
- Email detail panel displays on right side
- Shows Subject, From, To, Date/Time
- Shows email body content
- Email is marked as read automatically

---

#### Test 10.2: Verify Email Header Information
**Steps:**
1. Open email details
2. Verify all header information is displayed

**Expected Results:**
- Subject is displayed as heading
- From address shows sender email
- To address shows recipient (inbox email)
- Timestamp shows date and time
- All information is accurate and complete

---

#### Test 10.3: View Email Body Content
**Steps:**
1. Open email details
2. Verify email body is readable
3. Check for proper formatting

**Expected Results:**
- Email body content displays clearly
- Text formatting is preserved
- Content is readable and complete

---

#### Test 10.4: Email Actions in Detail View
**Steps:**
1. Open email details
2. Verify action buttons are available
3. Click each action button (Read, Delete)

**Expected Results:**
- Read/Delete buttons are visible
- Buttons function correctly from detail view
- Actions update email status appropriately

---

### Suite 11: Navigation and UI

#### Test 11.1: Refresh Inbox
**Steps:**
1. Create inbox
2. Click "Refresh" button
3. Verify inbox reloads

**Expected Results:**
- Inbox content refreshes
- New emails are fetched
- Email count updates

---

#### Test 11.2: Logout from Inbox
**Steps:**
1. Access inbox
2. Click "Logout" button
3. Verify return to home page

**Expected Results:**
- User is logged out
- Returned to home page
- Connection status is cleared

---

#### Test 11.3: Check Message Status Display
**Steps:**
1. Navigate through filtered views
2. Observe message status indicators

**Expected Results:**
- Message status is clearly displayed
- Read/unread distinction is visible
- Star indicator shows correctly

---

### Suite 12: Bulk Actions

#### Test 12.1: Select Multiple Emails
**Steps:**
1. Create inbox with multiple emails
2. Click checkboxes on email rows
3. Verify multiple selection

**Expected Results:**
- Checkboxes allow multiple email selection
- Selected emails are highlighted
- Parent checkbox reflects selection state

---

#### Test 12.2: Select All Emails
**Steps:**
1. Create inbox with multiple emails
2. Click parent/master checkbox
3. Verify all emails are selected

**Expected Results:**
- All email checkboxes become checked
- All emails are highlighted
- Master checkbox shows selected state

---

### Suite 13: Email Content Features

#### Test 13.1: Verify Email Shows Preview Text
**Steps:**
1. Create inbox with email
2. Observe email in list in detailed view
3. Verify preview text is shown

**Expected Results:**
- Email preview text displays in list
- Preview text shows initial content with truncation indicator

---

#### Test 13.2: Verify Sender Information Display
**Steps:**
1. Create inbox with email
2. Verify sender name and email are displayed

**Expected Results:**
- Sender full name shows in list
- Sender email address shows in detail view
- Format: "Name" <email@domain.com>

---

#### Test 13.3: Verify Timestamp Display
**Steps:**
1. Create inbox with email
2. Check timestamp format in list
3. Check full datetime in detail view

**Expected Results:**
- List shows concise time (e.g., "01:01 PM")
- Detail view shows full timestamp (e.g., "3/24/2026, 1:01:41 PM")

---

### Suite 14: Application Performance

#### Test 14.1: Inbox Loads Quickly
**Steps:**
1. Create inbox
2. Measure load time
3. Verify responsive performance

**Expected Results:**
- Inbox loads within acceptable time
- UI remains responsive
- No lag in interactions

---

#### Test 14.2: Search Performs Efficiently
**Steps:**
1. Create inbox with multiple emails
2. Enter search term
3. Verify results update quickly

**Expected Results:**
- Search results display within acceptable time
- No UI freezing during search
- Results are accurate

---

#### Test 14.3: Filter Switching is Quick
**Steps:**
1. Click different filters rapidly
2. Verify UI updates smoothly

**Expected Results:**
- Filters switch without lag
- Email list updates immediately
- No performance degradation

---

### Suite 15: Error Handling and Edge Cases

#### Test 15.1: Handle Invalid Username Format
**Steps:**
1. Click "Create Inbox"
2. Enter special characters or very long username
3. Attempt to create inbox

**Expected Results:**
- System either accepts or provides clear error
- Application handles invalid input gracefully

---

#### Test 15.2: Duplicate Inbox Creation
**Steps:**
1. Create inbox with username "testuser"
2. Create inbox again with same username
3. Verify system handles duplicate

**Expected Results:**
- Existing inbox loads or error is shown
- User is informed of duplicate

---

#### Test 15.3: Session Timeout Handling
**Steps:**
1. Create and access inbox
2. Leave idle for extended period
3. Attempt interaction

**Expected Results:**
- Application handles session timeout appropriately
- Clear message if session expired
- Option to reconnect

---

## Test Execution Notes

### Test Data Requirements
- Multiple email addresses with varying content
- Emails with and without attachments
- Emails from multiple senders
- Emails with different timestamps

### Acceptance Criteria
- All UI elements render correctly
- All filters and sorts work as expected
- Email actions complete successfully
- Email details display accurately
- System responds quickly to user actions
- No console errors during test execution

### Known Limitations
- Email generation requires external email service
- Some features may depend on test data availability

---

## Conclusion
This comprehensive test plan covers the major functionality areas of the CloudQA email testing platform, including inbox management, email filtering, searching, viewing, and various email actions. All test cases should be executed across multiple browsers to ensure cross-browser compatibility.
