
# SauceDemo E-Commerce Application - Comprehensive Test Plan

## Overview
Comprehensive test plan for www.saucedemo.com - A demo e-commerce web application built for testing practice. The application includes user authentication with multiple user types, product browsing with sorting capabilities, shopping cart management, and a complete checkout workflow. This test plan covers all major user flows including login, product selection, cart management, and order completion.

---

## Suite 1: Authentication Tests

### Test 1.1: Login with Valid Credentials - Standard User
**Preconditions:** User is at the login page (https://www.saucedemo.com/)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.saucedemo.com/ | Login page loads with username and password fields, SauceDemo logo visible |
| 2 | Enter 'standard_user' in username field | Username is entered |
| 3 | Enter 'secret_sauce' in password field | Password is entered |
| 4 | Click Login button | User is navigated to inventory page |
| 5 | Verify | Page URL shows /inventory.html, Products page displays product list |

---

### Test 1.2: Login with Invalid Credentials
**Preconditions:** User is at the login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.saucedemo.com/ | Login page loads |
| 2 | Enter 'invalid_user' in username field | Username is entered |
| 3 | Enter 'invalid_password' in password field | Password is entered |
| 4 | Click Login button | Error message displays: "Epic sadface: Username and password do not match any user in this service" |
| 5 | Verify | User remains on login page, username and password fields show error icons |

---

### Test 1.3: Login with Empty Fields
**Preconditions:** User is at the login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.saucedemo.com/ | Login page loads |
| 2 | Leave username and password fields empty | Fields remain empty |
| 3 | Click Login button | Error message is displayed |
| 4 | Verify | User remains on login page |

---

### Test 1.4: Login with Locked Out User
**Preconditions:** User is at the login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.saucedemo.com/ | Login page loads |
| 2 | Enter 'locked_out_user' in username field | Username is entered |
| 3 | Enter 'secret_sauce' in password field | Password is entered |
| 4 | Click Login button | Error message displays: "Epic sadface: Sorry, this user has been locked out." |
| 5 | Verify | User remains on login page |

---

### Test 1.5: Login with Problem User
**Preconditions:** User is at the login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to https://www.saucedemo.com/ | Login page loads |
| 2 | Enter 'problem_user' in username field | Username is entered |
| 3 | Enter 'secret_sauce' in password field | Password is entered |
| 4 | Click Login button | User is redirected to inventory page |
| 5 | Verify | User has access but may see display issues (images may not load properly) |

---

### Test 1.6: Logout Functionality
**Preconditions:** User is logged in and on the inventory page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click menu button (hamburger icon) in top left | Side menu opens |
| 2 | Click 'Logout' option | User is redirected to login page |
| 3 | Verify | Session is terminated, products page is no longer accessible |

---

## Suite 2: Product Browsing and Sorting

### Test 2.1: View All Products on Inventory Page
**Preconditions:** User is logged in and on the inventory page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Observe the products displayed | All 6 products are visible |
| 2 | Verify products | Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt (Red) |
| 3 | Verify product details | Each product displays: image, name, description, price, and 'Add to cart' button in a grid layout |

---

### Test 2.2: Sort Products by Name (A to Z)
**Preconditions:** User is logged in and products are displayed

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on sort dropdown (currently showing 'Name (A to Z)') | Dropdown opens |
| 2 | Select 'Name (A to Z)' option | Option is selected |
| 3 | Verify sorting | Products are sorted alphabetically in ascending order |
| 4 | Verify first product | 'Sauce Labs Backpack' appears first |
| 5 | Verify last product | 'Test.allTheThings() T-Shirt (Red)' appears last |

---

### Test 2.3: Sort Products by Name (Z to A)
**Preconditions:** User is logged in and on inventory page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on sort dropdown | Dropdown opens |
| 2 | Select 'Name (Z to A)' option | Option is selected |
| 3 | Verify sorting | Products are sorted alphabetically in descending order |
| 4 | Verify first product | 'Test.allTheThings() T-Shirt (Red)' appears first |
| 5 | Verify last product | 'Sauce Labs Backpack' appears last |

---

### Test 2.4: Sort Products by Price (Low to High)
**Preconditions:** User is logged in and on inventory page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on sort dropdown | Dropdown opens |
| 2 | Select 'Price (low to high)' option | Option is selected |
| 3 | Verify sorting | Products are sorted by price in ascending order |
| 4 | Verify first product | 'Sauce Labs Onesie - $7.99' is first |
| 5 | Verify last product | 'Sauce Labs Fleece Jacket - $49.99' is last |

---

### Test 2.5: Sort Products by Price (High to Low)
**Preconditions:** User is logged in and on inventory page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on sort dropdown | Dropdown opens |
| 2 | Select 'Price (high to low)' option | Option is selected |
| 3 | Verify sorting | Products are sorted by price in descending order |
| 4 | Verify first product | 'Sauce Labs Fleece Jacket - $49.99' is first |
| 5 | Verify last product | 'Sauce Labs Onesie - $7.99' is last |

---

### Test 2.6: View Product Details
**Preconditions:** User is logged in and on the inventory page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on a product name or image (e.g., 'Sauce Labs Backpack') | Product details page loads |
| 2 | Verify page content | Product name, full description, price, and 'Add to cart' button are displayed |
| 3 | Verify navigation | 'Back to inventory' link is available |

---

## Suite 3: Shopping Cart Management

### Test 3.1: Add Single Product to Cart
**Preconditions:** User is logged in on the inventory page, Cart is empty

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click 'Add to cart' button for 'Sauce Labs Backpack' | Button changes to 'Remove' |
| 2 | Verify cart badge | Cart badge appears or updates to show '1' |
| 3 | Verify cart count | Cart icon updates to reflect 1 item |

---

### Test 3.2: Add Multiple Products to Cart
**Preconditions:** User is logged in on the inventory page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click 'Add to cart' for Sauce Labs Backpack ($29.99) | Button changes to Remove |
| 2 | Click 'Add to cart' for Sauce Labs Bike Light ($9.99) | Button changes to Remove |
| 3 | Click 'Add to cart' for Sauce Labs Bolt T-Shirt ($15.99) | Button changes to Remove |
| 4 | Verify cart badge | Cart badge shows '3' |
| 5 | Verify items added | All three items are added to the cart |

---

### Test 3.3: View Shopping Cart
**Preconditions:** User is logged in, At least one product is in cart

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the shopping cart icon in the top right | User navigates to cart page |
| 2 | Verify URL | Page shows /cart.html |
| 3 | Verify cart display | Cart displays all added products with correct quantities |
| 4 | Verify product info | Product names, prices, and remove buttons are visible |
| 5 | Verify totals | Cart subtotal and item count are displayed |

---

### Test 3.4: Remove Product from Cart
**Preconditions:** User is on shopping cart page with items in cart

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click 'Remove' button for one of the products | Product is removed from the cart |
| 2 | Verify cart update | Cart displays remaining items |
| 3 | Verify count | Item count badge decreases by 1 |

---

### Test 3.5: Empty Cart
**Preconditions:** User is on shopping cart page with multiple items

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Remove all products from the cart one by one | All products are removed |
| 2 | Verify empty state | Cart becomes empty |
| 3 | Verify display | 'Your Cart' page shows empty state indication |
| 4 | Verify count | Items count shows 0 |

---

### Test 3.6: Continue Shopping from Cart
**Preconditions:** User is on the shopping cart page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click 'Continue Shopping' button | User navigates back to inventory page |
| 2 | Verify page | Inventory page displays all products |
| 3 | Verify cart preservation | Previously added items remain in cart |

---

## Suite 4: Checkout Process

### Test 4.1: Complete Checkout with Valid Information
**Preconditions:** User is logged in, Has added products to cart (e.g., Sauce Labs Backpack)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to cart page | Cart page displays items |
| 2 | Click 'Checkout' button | User navigates to checkout step 1 |
| 3 | Verify page | Form displays fields: First Name, Last Name, Zip/Postal Code |
| 4 | Enter 'John' in First Name field | First name is entered |
| 5 | Enter 'Doe' in Last Name field | Last name is entered |
| 6 | Enter '12345' in Zip/Postal Code field | Zip code is entered |
| 7 | Click 'Continue' button | User navigates to checkout step 2 |
| 8 | Verify summary | Order summary displays all items with correct prices |
| 9 | Verify payment info | Payment Information shows: SauceCard #31337 |
| 10 | Verify shipping | Shipping Information shows: Free Pony Express Delivery! |
| 11 | Verify total | Order total is calculated correctly (Item total + Tax) |

---

### Test 4.2: Checkout with Invalid Zip Code
**Preconditions:** User is on checkout step 1 page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter 'John' in First Name field | First name is entered |
| 2 | Enter 'Doe' in Last Name field | Last name is entered |
| 3 | Enter invalid zip code (e.g., 'abc' or special chars) | Invalid input is entered |
| 4 | Click 'Continue' button | Error message is displayed |
| 5 | Verify | User remains on checkout step 1 page |

---

### Test 4.3: Checkout with Missing First Name
**Preconditions:** User is on checkout step 1 page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Leave First Name field empty | Field remains empty |
| 2 | Enter 'Doe' in Last Name field | Last name is entered |
| 3 | Enter '12345' in Zip/Postal Code field | Zip code is entered |
| 4 | Click 'Continue' button | Error message displays: 'Error: First Name is required' |
| 5 | Verify | User remains on checkout step 1 page |

---

### Test 4.4: Checkout with Missing Last Name
**Preconditions:** User is on checkout step 1 page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter 'John' in First Name field | First name is entered |
| 2 | Leave Last Name field empty | Field remains empty |
| 3 | Enter '12345' in Zip/Postal Code field | Zip code is entered |
| 4 | Click 'Continue' button | Error message displays: 'Error: Last Name is required' |
| 5 | Verify | User remains on checkout step 1 page |

---

### Test 4.5: Checkout with Missing Zip Code
**Preconditions:** User is on checkout step 1 page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter 'John' in First Name field | First name is entered |
| 2 | Enter 'Doe' in Last Name field | Last name is entered |
| 3 | Leave Zip/Postal Code field empty | Field remains empty |
| 4 | Click 'Continue' button | Error message displays: 'Error: Postal Code is required' |
| 5 | Verify | User remains on checkout step 1 page |

---

### Test 4.6: Finish Order and View Confirmation
**Preconditions:** User is on checkout step 2 (Checkout Overview) page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Review order details | Order summary is visible |
| 2 | Click 'Finish' button | User navigates to checkout complete page |
| 3 | Verify URL | Page URL shows /checkout-complete.html |
| 4 | Verify message | Message displays: 'Thank you for your order!' |
| 5 | Verify confirmation | Pony Express confirmation image is displayed |
| 6 | Verify navigation | 'Back Home' button is available |

---

### Test 4.7: Cancel Checkout from Step 1
**Preconditions:** User is on checkout step 1 page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click 'Cancel' button | User navigates back to cart page |
| 2 | Verify items | Previously added items are still in the cart |
| 3 | Verify cart state | Cart is not modified |

---

### Test 4.8: Cancel Checkout from Step 2
**Preconditions:** User is on checkout step 2 page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click 'Cancel' button | User navigates back to cart page |
| 2 | Verify items | Previously added items are still in the cart |
| 3 | Verify cart state | Cart is not modified |

---

## Suite 5: Navigation and Menu

### Test 5.1: Open and Close Menu
**Preconditions:** User is logged in and on any page with a menu button

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click the menu button (hamburger icon) | Side menu opens |
| 2 | Verify menu options | Menu shows: All Items, About, Logout, Reset App State |
| 3 | Click close menu button or outside menu | Menu closes |
| 4 | Verify page | User remains on the same page |

---

### Test 5.2: Navigate to About Page
**Preconditions:** User is logged in

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click menu button | Menu opens |
| 2 | Click 'About' link | External About page opens |
| 3 | Verify | Current tab/window shows the Sauce Labs About page |

---

### Test 5.3: Reset App State
**Preconditions:** User is logged in, Has items in cart or performed actions

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click menu button | Menu opens |
| 2 | Click 'Reset App State' option | App resets |
| 3 | Verify cart | Cart becomes empty |
| 4 | Verify state | Any previous actions are cleared |

---

### Test 5.4: Navigate from Product to Inventory
**Preconditions:** User is on a product details page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click 'Back to inventory' link or use menu | User navigates to inventory page |
| 2 | Verify page | All products are displayed |

---

## Suite 6: End-to-End User Workflows

### Test 6.1: Complete Purchase Workflow - Happy Path
**Preconditions:** User starts at login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Log in with 'standard_user' / 'secret_sauce' | User is on inventory page |
| 2 | Add 'Sauce Labs Backpack' to cart | Item is added |
| 3 | Add 'Sauce Labs Bike Light' to cart | Item is added |
| 4 | Verify cart badge | Shows '2' |
| 5 | Click cart icon | User is on cart page with 2 items |
| 6 | Click 'Checkout' | User is on checkout step 1 |
| 7 | Enter checkout info | First='Jane', Last='Smith', Zip='98765' |
| 8 | Click 'Continue' | User is on checkout step 2 |
| 9 | Review order summary | All items and pricing correct |
| 10 | Click 'Finish' | Order is completed successfully |
| 11 | Verify confirmation | User sees 'Thank you for your order!' message |

---

### Test 6.2: Browse and Add Multiple Items
**Preconditions:** User is logged in and on inventory page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sort by 'Price (low to high)' | Cheaper items appear first |
| 2 | Add cheapest item to cart | Item added |
| 3 | Sort by 'Price (high to low)' | More expensive items appear first |
| 4 | Add most expensive item to cart | Item added |
| 5 | Verify cart | Cart shows '2' and contains items from different price ranges |

---

### Test 6.3: Session Timeout Handling
**Preconditions:** User is logged in and on inventory page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Wait for 30+ minutes or trigger session timeout | Session expires |
| 2 | Attempt next action | User may be redirected to login page or session ends |

---

### Test 6.4: Purchase with All Test Users
**Preconditions:** User starts at login page

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as 'locked_out_user' / 'secret_sauce' | Login fails with locked out message |
| 2 | Login as 'error_user' / 'secret_sauce' | Login succeeds, user may see application errors |
| 3 | Login as 'visual_user' / 'secret_sauce' | Login succeeds, may display with visual inconsistencies |

---

## Test Coverage Summary

| Suite | Test Count | Coverage |
|-------|-----------|----------|
| Authentication | 6 | Login flows, credential validation, user types |
| Product Browsing | 6 | Catalog display, sorting functionality |
| Shopping Cart | 6 | Cart operations, item management |
| Checkout | 8 | Multi-step checkout, form validation, order completion |
| Navigation | 4 | Menu operations, page navigation |
| End-to-End | 4 | Complete workflows, cross-feature scenarios |
| **TOTAL** | **34** | **Complete application coverage** |

---

## Key Testing Notes

- **Test Credentials:** 
  - standard_user / secret_sauce (normal user)
  - locked_out_user / secret_sauce (should fail)
  - problem_user / secret_sauce (has display issues)
  - error_user / secret_sauce (shows errors)
  - visual_user / secret_sauce (visual inconsistencies)

- **Products Available:**
  - Sauce Labs Backpack ($29.99)
  - Sauce Labs Bike Light ($9.99)
  - Sauce Labs Bolt T-Shirt ($15.99)
  - Sauce Labs Fleece Jacket ($49.99)
  - Sauce Labs Onesie ($7.99)
  - Test.allTheThings() T-Shirt (Red) ($15.99)

- **Payment & Shipping:**
  - Fixed payment method: SauceCard #31337
  - Fixed shipping: Free Pony Express Delivery
  - Tax calculated automatically

---

## Recommendations

1. **Automation Priority:** Start with high-priority tests (authentication, complete purchase workflow)
2. **Regression Suite:** Use happy path tests in continuous integration
3. **Data:** Use provided test usernames and products
4. **Browser Testing:** Test across Chrome, Firefox, Safari, and Edge
5. **Performance:** Monitor response times during checkout process