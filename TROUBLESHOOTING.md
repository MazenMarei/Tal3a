# Troubleshooting Guide

## Common Issues and Solutions

### 1. Certificate Verification Errors

**Issue**: `TrustError: Certificate verification error: "Signature verification failed"`

**Cause**: Local development environment certificate validation issues with dfx

**Solutions**:

#### Option A: Restart dfx with clean state

```bash
# In WSL (recommended)
dfx stop
dfx start --clean
```

#### Option B: Use development configuration

The AuthContext has been updated to automatically disable certificate verification in local development:

- `verifyQuerySignatures: false` for local development
- `fetchRootKey: true` to fetch the root key

### 2. Missing Data Fields Error

**Issue**: `Error: Record is missing key "governorate_id"`

**Cause**: Backend data doesn't match frontend expectations

**Solution**: The context providers now include data validation:

- Missing fields are automatically filled with defaults
- Invalid records are filtered out
- Error handling prevents crashes

### 3. Internet Identity Authentication Issues

**Issue**: Login fails or authentication state is incorrect

**Solutions**:

1. **Clear browser storage**: Clear localStorage and cookies for the development domain
2. **Check dfx status**: Ensure dfx is running with `dfx status`
3. **Verify Internet Identity canister**: Should be available at `rdmx6-jaaaa-aaaaa-aaadq-cai`

### 4. Build Errors

**Issue**: Import errors during build

**Solution**: All import paths have been updated to use the new context system:

- Old: `import { useData } from '../context/DataContext'`
- New: `import { useGroups, usePosts } from '../hooks/useCanisterHooks'`

### 5. No Data Loading

**Issue**: Components show empty state despite successful authentication

**Possible Causes & Solutions**:

1. **Canisters not deployed**:

   ```bash
   dfx deploy --with-cycles 1000000000000
   ```

2. **Backend data is empty**: The backend might not have any data yet. Try:

   - Creating a user profile first
   - Adding sample data through the backend
   - Checking canister logs: `dfx canister logs <canister-name>`

3. **Network connectivity**: Verify dfx is accessible:
   ```bash
   curl http://127.0.0.1:4943/api/v2/status
   ```

## Development Environment Setup

### Prerequisites Check

```bash
# Check dfx version
dfx --version  # Should be 0.28.0 or compatible

# Check node version
node --version  # Should be 18+

# Check if WSL is working (if using Windows)
wsl --version
```

### Fresh Start Process

1. Stop all dfx processes: `dfx stop`
2. Clean dfx state: `dfx start --clean --background`
3. Deploy canisters: `dfx deploy --with-cycles 1000000000000`
4. Install frontend deps: `cd src/frontend_canister && npm install`
5. Start development: `npm run dev`

## Testing the Integration

### 1. Authentication Test

- Visit `/whoami` route
- Click "Login with Internet Identity"
- Should redirect to II and back successfully

### 2. Backend Connection Test

- Visit `/integration` route
- Check console for initialization messages
- Should see canister actors being created

### 3. Data Loading Test

- After authentication, check if:
  - Groups load (even if empty)
  - Events load (even if empty)
  - User profile can be created

## Debug Console Commands

```javascript
// Check authentication state
console.log("Auth:", window.authState);

// Check canister actors
console.log("Actors:", window.actors);

// Check if data contexts are working
console.log("Groups:", window.groupsContext);
console.log("Events:", window.eventsContext);
```

## Getting Help

If issues persist:

1. Check the browser console for errors
2. Check dfx logs: `dfx logs`
3. Verify canister status: `dfx canister status --all`
4. Check network connectivity to localhost:4943
5. Try with a fresh browser profile (incognito mode)

## Performance Notes

- First load may be slow as canisters initialize
- Authentication requires Internet Identity popup (allow popups)
- Local development disables some security features (certificate verification)
- Empty data states are normal on first run
