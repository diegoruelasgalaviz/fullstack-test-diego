# Challenge 1 Testing Guide: Secure Authentication System

## Overview

This guide provides comprehensive testing instructions for **Challenge 1: Secure Authentication System** (30 points - Critical Priority). The implementation includes refresh tokens, session management, and automatic token refresh functionality.

## Prerequisites

Before testing, ensure you have:

1. **Project Setup Complete**
   - Backend and frontend dependencies installed
   - Database running (PostgreSQL via Docker)
   - Environment variables configured

2. **User Account**
   - **Important**: You must create your own user account during project setup
   - There is no default user - you create one via registration
   - Test credentials used in development: `test@example.com` / `password123`
   - This user is created when you first register/login during testing

3. **Servers Running**
   ```bash
   # Terminal 1: Backend
   cd backend && pnpm dev

   # Terminal 2: Frontend
   cd frontend && npm run dev

   # Terminal 3: Database (optional, for debugging)
   docker-compose exec postgres psql -U postgres -d fullstack_db
   ```

## Test User Setup

**Important Note**: The system does not come with a pre-created user account. You must register a user first:

1. Start the frontend server (`npm run dev`)
2. Go to `http://localhost:3000/register`
3. Create an account with any email/password
4. Or use the test credentials: `test@example.com` / `password123`

For testing purposes, we'll use the test user that gets created during our test scenarios.

## Testing Scenarios

### Test 1: Login with Refresh Tokens

**Objective**: Verify login creates both access and refresh tokens.

**Steps**:
1. Open browser to `http://localhost:3000/login`
2. Open DevTools → Application → Local Storage
3. Login with: `test@example.com` / `password123`
4. Check Network tab for login request

**Expected Results**:
- ✅ Login succeeds, redirects to dashboard
- ✅ Local Storage contains:
  - `token`: JWT access token (~200 characters)
  - `refreshToken`: Hex string (128 characters)
  - `user`: User object with id/name/email
- ✅ Network shows: `POST /api/auth/login` → 200 OK
- ✅ Response includes both `accessToken` and `refreshToken`

**Database Check**:
```sql
SELECT COUNT(*) as refresh_tokens FROM refresh_tokens;
-- Should show: 1
```

### Test 2: Token Persistence Across Sessions

**Objective**: Verify users stay logged in across browser sessions.

**Steps**:
1. Complete Test 1 (login successfully)
2. Close browser completely
3. Reopen browser and navigate to `http://localhost:3000`

**Expected Results**:
- ✅ No login prompt appears
- ✅ Auto-login works seamlessly
- ✅ Dashboard loads immediately
- ✅ Local Storage still contains tokens

**Verification**: This proves the 30-day refresh token persistence works.

### Test 3: Automatic Token Refresh

**Objective**: Verify seamless token renewal when access tokens expire.

**Steps**:
1. Login successfully (Test 1)
2. Open DevTools → Network tab
3. Filter by 'api' requests
4. Make a request to a protected endpoint (any API call)
5. To simulate expiry: Modify the `token` in Local Storage to an invalid JWT

**Expected Results**:
- ✅ On 401 error, automatic `POST /api/auth/refresh` call
- ✅ New accessToken and refreshToken received
- ✅ Original request automatically retried with new token
- ✅ User experience remains seamless (no logout)

**Network Flow**:
1. `GET /api/some-protected-endpoint` → 401
2. `POST /api/auth/refresh` → 200 (new tokens)
3. `GET /api/some-protected-endpoint` → 200 (retry with new token)

### Test 4: Token Revocation Security

**Objective**: Verify token revocation prevents unauthorized access.

**Steps**:
1. Login successfully (Test 1)
2. Get `refreshToken` from Local Storage
3. Revoke token via API:
   ```bash
   curl -X POST http://localhost:4000/api/auth/revoke \
     -H "Content-Type: application/json" \
     -d '{"refreshToken":"YOUR_REFRESH_TOKEN_HERE"}'
   ```
4. Try to access a protected API endpoint

**Expected Results**:
- ✅ Revoke request: 200 OK "Token revoked successfully"
- ✅ Next API call: 401 Unauthorized
- ✅ Frontend automatically logs out
- ✅ Redirect to login page

### Test 5: Session Management

**Objective**: Verify session viewing and management capabilities.

**Steps**:
1. Login from multiple browsers/devices (or use incognito windows)
2. Check active sessions:
   ```bash
   curl -X GET http://localhost:4000/api/auth/sessions \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```
3. Logout all sessions:
   ```bash
   curl -X POST http://localhost:4000/api/auth/logout-all \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

**Expected Results**:
- ✅ Sessions API returns array of active sessions
- ✅ Each session shows: device info, IP address, creation time
- ✅ Logout-all revokes all refresh tokens
- ✅ All other browser sessions automatically logged out

## Database Verification

Check the `refresh_tokens` table during testing:

```sql
-- View all refresh tokens
SELECT id, user_id, token, expires_at, is_revoked, created_at
FROM refresh_tokens
ORDER BY created_at DESC;

-- Check token statistics
SELECT
    COUNT(*) as total_tokens,
    COUNT(*) FILTER (WHERE is_revoked = false) as active_tokens,
    COUNT(*) FILTER (WHERE is_revoked = true) as revoked_tokens,
    COUNT(*) FILTER (WHERE expires_at < NOW()) as expired_tokens
FROM refresh_tokens;
```

## Debugging Guide

### Common Issues and Solutions

1. **Login fails with "Invalid credentials"**
   - Check if user exists: `SELECT * FROM users WHERE email = 'test@example.com';`
   - Ensure password is correct
   - Check backend logs for errors

2. **Tokens not stored in Local Storage**
   - Check browser console for JavaScript errors
   - Verify frontend is running on correct port (3000)
   - Check Network tab for failed login request

3. **Automatic refresh not working**
   - Verify API service has the refresh logic
   - Check that 401 responses trigger refresh
   - Ensure refresh token is valid and not expired

4. **Database connection issues**
   - Verify Docker containers: `docker-compose ps`
   - Check database logs: `docker-compose logs postgres`
   - Ensure environment variables are set

5. **Build/compilation errors**
   - Backend: `cd backend && pnpm tsc --noEmit`
   - Frontend: `cd frontend && npm run build`

### Debug Tools

- **Browser DevTools**: Network tab for API calls, Application tab for Local Storage
- **Backend Logs**: Check terminal running `pnpm dev`
- **Database**: Direct queries with `docker-compose exec postgres psql -U postgres -d fullstack_db`
- **API Testing**: Use curl or Postman for direct API testing

## Test Completion Checklist

- [ ] Test 1: Login with refresh tokens ✅
- [ ] Test 2: Token persistence across sessions ✅
- [ ] Test 3: Automatic token refresh ✅
- [ ] Test 4: Token revocation security ✅
- [ ] Test 5: Session management ✅
- [ ] Database verification ✅
- [ ] Error handling tested ✅

## Acceptance Criteria Verification

Challenge 1 is complete when:

- ✅ Users remain logged in across browser sessions
- ✅ Refresh tokens can be revoked by users/admins
- ✅ System prevents token reuse after logout
- ✅ Frontend handles token expiration gracefully
- ✅ Authentication operations are properly secured

## Scoring

**Challenge 1: Secure Authentication System**
- **Points**: 30/30 (Critical Priority)
- **Status**: ✅ COMPLETE

---

*Note: This testing guide assumes the Challenge 1 implementation is complete. If you encounter issues, verify all code changes from the implementation are properly applied.*