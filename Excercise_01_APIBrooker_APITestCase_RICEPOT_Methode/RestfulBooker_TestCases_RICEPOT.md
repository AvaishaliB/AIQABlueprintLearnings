# Restful-Booker API Test Cases (RICEPOT Method)

This document contains comprehensive test cases for the Restful-Booker API, following the RICEPOT methodology.

---

## 1. Authentication (POST /auth)

| Role | Input | Criticality | Expected Result | Preconditions | Output / Observables | Test Do’s / Don’ts |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| QA Tester | POST `/auth`<br>Headers: `Content-Type: application/json`<br>Body: `{"username": "admin", "password": "password123"}` | **Critical** | HTTP 200 OK<br>JSON Response: `{"token": "<token_string>"}` | API server is reachable. | Token generated and visible in response body. | **Do:** Validate that the token is a non-empty string.<br>**Don't:** Hardcode the token for future tests. |
| QA Tester | POST `/auth`<br>Headers: `Content-Type: application/json`<br>Body: `{"username": "invalid", "password": "password123"}` | High | HTTP 200 OK<br>JSON Response: `{"reason": "Bad credentials"}` | API server is reachable. | "Bad credentials" message in response. | **Do:** Verify that status code is 200 even on failure (as per API design).<br>**Don't:** Expect 401 Unauthorized unless API spec changes. |
| QA Tester | POST `/auth`<br>Headers: `Content-Type: application/json`<br>Body: `{"username": "admin"}` (Missing password) | Medium | HTTP 200 OK<br>JSON Response: `{"reason": "Bad credentials"}` | API server is reachable. | Error message in response body. | **Do:** Check for missing mandatory fields.<br>**Don't:** Skip field validation. |

---

## 2. Booking Management

### 2.1 Get Booking IDs (GET /booking)

| Role | Input | Criticality | Expected Result | Preconditions | Output / Observables | Test Do’s / Don’ts |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| QA Tester | GET `/booking` | High | HTTP 200 OK<br>Array of objects containing `bookingid`. | At least one booking exists. | List of booking IDs returned. | **Do:** Validate array structure.<br>**Don't:** Assume fixed number of bookings. |
| QA Tester | GET `/booking?firstname=Sally&lastname=Brown` | Medium | HTTP 200 OK<br>Filtered list of booking IDs. | Booking for "Sally Brown" exists. | Only IDs matching criteria are returned. | **Do:** Verify query params are correctly applied.<br>**Don't:** Mix different search terms in one case. |

### 2.2 Get Booking Detail (GET /booking/{id})

| Role | Input | Criticality | Expected Result | Preconditions | Output / Observables | Test Do’s / Don’ts |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| QA Tester | GET `/booking/1`<br>Header: `Accept: application/json` | High | HTTP 200 OK<br>JSON with firstname, lastname, prices, dates, etc. | Booking with ID 1 exists. | Detailed booking JSON returned. | **Do:** Validate all fields present in response.<br>**Don't:** Ignore header `Accept`. |
| QA Tester | GET `/booking/999123`<br>Header: `Accept: application/json` | Medium | HTTP 404 Not Found | Booking with ID 999123 does not exist. | 404 status code returned. | **Do:** Test for non-existent resource.<br>**Don't:** Expect a generic 500 error. |

### 2.3 Create Booking (POST /booking)

| Role | Input | Criticality | Expected Result | Preconditions | Output / Observables | Test Do’s / Don’ts |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| QA Tester | POST `/booking`<br>Headers: `Content-Type: application/json`, `Accept: application/json`<br>Body: `{"firstname": "Jim", "lastname": "Brown", "totalprice": 111, "depositpaid": true, "bookingdates": {"checkin": "2018-01-01", "checkout": "2019-01-01"}, "additionalneeds": "Breakfast"}` | **Critical** | HTTP 200 OK<br>JSON response with `bookingid` and the created `booking`. | API server is running. | New booking ID created; DB side effect: booking persists. | **Do:** Validate response matches input fields.<br>**Don't:** Use invalid date formats. |
| QA Tester | POST `/booking`<br>Body: `{ "firstname": "Jim" }` (Missing fields) | Medium | HTTP 500 Internal Server Error (or site-specific error) | API server is running. | Error response or status code. | **Do:** Test boundary/missing fields.<br>**Don't:** Assume API handles partial data gracefully if PUT/POST requires full schema. |

### 2.4 Update Booking (PUT /booking/{id})

| Role | Input | Criticality | Expected Result | Preconditions | Output / Observables | Test Do’s / Don’ts |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| QA Tester | PUT `/booking/1`<br>Headers: `Content-Type: application/json`, `Accept: application/json`, `Cookie: token=<valid_token>` (or Auth header)<br>Body: Fully populated JSON with updated values. | **Critical** | HTTP 200 OK<br>JSON response with updated booking details. | 1. Booking with ID 1 exists.<br>2. Valid Auth token generated. | Booking details updated in DB; Response reflects new data. | **Do:** Ensure ALL fields are sent (PUT rule).<br>**Don't:** Forget the Authentication header/cookie. |
| QA Tester | PUT `/booking/1`<br>Headers: `Content-Type: application/json`<br>Body: {...} (No Token) | High | HTTP 403 Forbidden | Booking with ID 1 exists. | 403 status code returned. | **Do:** Validate security constraints.<br>**Don't:** Skip authentication testing. |

### 2.5 Delete Booking (DELETE /booking/{id})

| Role | Input | Criticality | Expected Result | Preconditions | Output / Observables | Test Do’s / Don’ts |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| QA Tester | DELETE `/booking/1`<br>Headers: `Cookie: token=<valid_token>` | **Critical** | HTTP 201 Created (Success per documentation) | 1. Booking with ID 1 exists.<br>2. Valid Auth token generated. | Booking removed from DB; Subsequent GET returns 404. | **Do:** Verify resource is gone after deletion.<br>**Don't:** Re-use the same ID without re-creating. |
| QA Tester | DELETE `/booking/999123`<br>Headers: `Cookie: token=<valid_token>` | Medium | HTTP 405 Method Not Allowed (or 404 depending on impl) | Valid Auth token generated. | Error status code returned. | **Do:** Test deletion of non-existent resource.<br>**Don't:** Expect success on invalid IDs. |
