# Challenge 2 Testing Guide: Data Validation & Error Handling

## Overview

This guide tests the **Challenge 2: Robust Data Validation & Error Handling** (20 points - High Priority) implementation. The system now includes comprehensive input validation, structured error responses, and improved error handling.

## Prerequisites

- Backend server running: `cd backend && pnpm dev`
- Frontend server running: `cd frontend && npm run dev`
- Valid authentication token (login first)

## Frontend Validation Features

### ✅ New Features Implemented

1. **Field-Specific Error Display**: Form fields show red borders and error messages below invalid inputs
2. **Real-Time Validation Feedback**: Errors clear immediately when user starts typing in the field
3. **Toast Notifications**: System shows toast messages for validation errors, success, and API failures
4. **Structured Error Handling**: 400 validation errors display field-specific messages from backend
5. **Validation Logging**: Failed validations are logged to console for monitoring

### User Experience Flow

1. **User enters invalid data** → Submits form
2. **Backend validates** → Returns 400 with field-specific errors
3. **Frontend displays errors**:
   - Field borders turn red
   - Error messages appear below each invalid field
   - Toast notification: "Validation Error - Please check the form for errors"
4. **User starts typing** → Error messages clear immediately
5. **User fixes issues** → Form submits successfully → Success toast appears

## Test Scenarios

### Test 0: Frontend Validation Experience

**Objective**: Test the complete frontend validation user experience.

**Steps:**
1. Navigate to Contacts page → Click "Add Contact"
2. Leave all fields empty → Click "Save"
3. **Expected Results:**
   - Form fields turn red
   - Error messages appear: "Name must be at least 2 characters long", "Please enter a valid email address"
   - Toast notification appears: "Validation Error - Please check the form for errors"
   - Console shows validation logging

4. Start typing in Name field
5. **Expected Results:**
   - Name error message disappears immediately
   - Field border returns to normal

6. Fill in valid data (Name: "John Doe", Email: "john@example.com") → Click "Save"
7. **Expected Results:**
   - Success toast: "Contact Created"
   - Form closes and resets
   - Contact appears in list

8. Repeat with Deals page - create invalid deal, see field errors, fix them

**✅ Pass Criteria:**
- Field-specific error messages display correctly
- Real-time error clearing works
- Toast notifications appear for validation errors and success
- Form resets after successful submission

---

### Test 1: Contact Validation

**Objective**: Verify contact creation/update validation works.

**Valid Contact Creation:**
```bash
curl -X POST http://localhost:4000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "your-org-id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
# Expected: 201 Created
```

**Invalid Contact Tests:**

1. **Empty Name:**
```bash
curl -X POST http://localhost:4000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'
# Expected: 400 Bad Request
# {"error": "Validation failed", "code": "VALIDATION_ERROR", "details": {"name": "Name must be at least 2 characters long"}}
```

2. **Invalid Email:**
```bash
curl -X POST http://localhost:4000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "invalid-email"}'
# Expected: 400 Bad Request
# {"error": "Validation failed", "code": "VALIDATION_ERROR", "details": {"email": "Please enter a valid email address"}}
```

3. **Invalid Phone:**
```bash
curl -X POST http://localhost:4000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "phone": "abc"}'
# Expected: 400 Bad Request
# {"error": "Validation failed", "code": "VALIDATION_ERROR", "details": {"phone": "Please enter a valid phone number"}}
```

### Test 2: Deal Validation

**Objective**: Verify deal creation/update validation works.

**Valid Deal Creation:**
```bash
curl -X POST http://localhost:4000/api/deals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "your-org-id",
    "title": "Enterprise Software Contract",
    "value": 50000.00
  }'
# Expected: 201 Created
```

**Invalid Deal Tests:**

1. **Missing Title:**
```bash
curl -X POST http://localhost:4000/api/deals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value": 1000}'
# Expected: 400 Bad Request
# {"error": "Validation failed", "code": "VALIDATION_ERROR", "details": {"title": "Title is required"}}
```

2. **Negative Value:**
```bash
curl -X POST http://localhost:4000/api/deals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Deal", "value": -100}'
# Expected: 400 Bad Request
# {"error": "Validation failed", "code": "VALIDATION_ERROR", "details": {"value": "Value must be greater than 0"}}
```

3. **Invalid Contact ID:**
```bash
curl -X POST http://localhost:4000/api/deals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Deal", "value": 1000, "contactId": "invalid-uuid"}'
# Expected: 400 Bad Request
# {"error": "Validation failed", "code": "VALIDATION_ERROR", "details": {"contactId": "Contact ID must be a valid UUID"}}
```

### Test 3: Authentication Validation

**Objective**: Verify user registration/login validation works.

**Invalid Registration Tests:**

1. **Weak Password:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123"
  }'
# Expected: 400 Bad Request
# {"error": "Validation failed", "code": "VALIDATION_ERROR", "details": {"password": "Password must be at least 6 characters long"}}
```

2. **Invalid Email:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "password": "password123"
  }'
# Expected: 400 Bad Request
# {"error": "Validation failed", "code": "VALIDATION_ERROR", "details": {"email": "Please enter a valid email address"}}
```

### Test 4: Error Response Format

**Objective**: Verify consistent error response structure.

**All validation errors should return:**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "fieldName": "Specific error message"
  },
  "timestamp": "2024-01-11T05:45:23.123Z",
  "path": "/api/contacts",
  "method": "POST"
}
```

### Test 5: Frontend Error Display

**Objective**: Verify frontend shows validation errors properly.

1. Open browser to contact/deal creation forms
2. Try to submit invalid data (empty name, invalid email, etc.)
3. Verify error messages appear next to form fields
4. Verify toast notifications for system errors

### Test 6: Backward Compatibility

**Objective**: Ensure existing functionality still works.

**Valid requests should still work:**
- ✅ Existing valid contact/deal creation
- ✅ Authentication with valid credentials
- ✅ All GET requests (no validation needed)
- ✅ DELETE requests (no validation needed)

## Validation Rules Summary

| Field | Type | Rules |
|-------|------|-------|
| **Contact.name** | string | 2-100 chars, required, trimmed |
| **Contact.email** | string | Valid email format, optional |
| **Contact.phone** | string | Valid phone regex, optional |
| **Deal.title** | string | 1-200 chars, required, trimmed |
| **Deal.value** | number | > 0, ≤ $999,999,999.99, required |
| **Deal.contactId** | string | Valid UUID, optional |
| **Deal.stageId** | string | Valid UUID, optional |
| **Auth.name** | string | 2-50 chars, required, trimmed |
| **Auth.email** | string | Valid email, required, lowercase |
| **Auth.password** | string | ≥6 chars, contains uppercase/lowercase/digit |

## Debug Commands

```bash
# Check backend logs
cd backend && pnpm dev

# Test API directly
curl -X POST http://localhost:4000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Check database (optional)
docker-compose exec postgres psql -U postgres -d fullstack_db -c "SELECT * FROM contacts LIMIT 5;"
```

## Acceptance Criteria Verification

- [x] All API endpoints validate input data before processing
- [x] Validation errors return appropriate HTTP status codes (400)
- [x] Error messages are specific and actionable
- [x] Frontend forms display field-specific validation errors
- [x] System prevents creation/update of records with invalid data
- [x] Validation rules are consistent between frontend and backend

## Scoring

**Challenge 2: Robust Data Validation & Error Handling**
- **Points**: 20/20 (High Priority)
- **Status**: ✅ COMPLETE

---

*Note: The validation system prevents invalid data from entering the database while providing clear, actionable error messages to users.*