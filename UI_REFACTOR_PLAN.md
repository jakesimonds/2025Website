# CameraUpload UI Refactor Plan

## Current State (What's Working)
✅ Filters are working and faithful (preview matches Bluesky upload):
- Normal
- Vintage (sepia)
- Retro (pixelate with 1-second preview)
- Inverted

## User's Requirements (from conversation)

### Flow Changes
1. **Landing page**: Single view with:
   - Info text: "Say 👋 to the ATmosphere"
   - Small disclaimer text about posting to @elevatorselfie.jakesimonds.com
   - Live camera feed (large, square)
   - 4 filter selector buttons below camera (radio-style selection)
   - Default filter: Normal (no filter)
   - "cheese!" capture button

2. **Post-capture state**: Same layout but:
   - Camera replaced with captured photo preview
   - Filter buttons greyed out (disabled) showing which was selected
   - "cheese!" button replaced with:
     - "Post to ATmosphere" button
     - "retake" button (goes back to landing page)

3. **Loading state**:
   - Hourglass/spinner animation
   - Cycle through ATProto facts (rotate every 2-3 seconds)
   - Dictionary/array of facts about ATProto

4. **Success page**: NEW route at `/elevatorselfie`
   - Purpose: Hide secret URL from user
   - Themed similar to camera page (same gradient background)
   - Simple "Thanks!" message
   - Link to view Bluesky post (if desired)
   - "Take another" button → redirects to secret URL

### Key Design Goals
- **Minimal text** - Keep it simple, no cramped feeling on mobile
- **Single-page flow** for capture (no multi-step navigation until success)
- **Radio button behavior** for filters (select one, see it live)
- **Visual feedback** when filters are disabled after capture

---

## Implementation Plan

### Phase 1: Restructure Main View (Landing Page)
**Goal**: Combine info + camera + filter selector into one view

**Changes**:
1. Remove current multi-view logic (`filterSelect`, `camera`, `preview` as separate views)
2. Create new `main` view with three states:
   - `ready`: Camera live, filters active, "cheese!" button
   - `captured`: Photo preview, filters disabled, "Post" + "retake" buttons
   - (keep `loading` and `result` states)

3. Layout structure:
   ```
   <div className="main-container">
     <InfoText />
     <SquareCameraOrPreview />
     <FilterSelector active={!captured} selectedFilter={selectedFilter} />
     <ActionButtons state={state} />
   </div>
   ```

4. Info text component:
   - Main: "Say 👋 to the ATmosphere"
   - Disclaimer: Small text about posting to elevatorselfie.jakesimonds.com

5. Filter selector:
   - 4 buttons in a row (or 2x2 grid if too cramped)
   - Radio button style (one selected at a time)
   - When disabled: grey out, keep selection visible

### Phase 2: Update Camera/Preview Component
**Changes**:
1. Single component that shows either:
   - Live camera feed (when `state === 'ready'`)
   - Captured photo (when `state === 'captured'`)

2. Always apply selected filter:
   - Live: CSS filters (except pixelate = canvas)
   - Preview: CSS filters to show what will be uploaded

3. Square aspect ratio maintained

### Phase 3: Filter Selector Component
**Changes**:
1. Horizontal row of 4 filter buttons (or 2x2 grid)
2. Each button shows filter name
3. Selected filter highlighted (purple glow or bold)
4. When disabled (after capture):
   - All buttons greyed out except selected
   - Selected button stays highlighted but disabled

### Phase 4: Action Buttons Component
**States**:
1. **Ready state**: "cheese!" button (large, green)
2. **Captured state**:
   - "Post to ATmosphere" (large, blue)
   - "retake" (smaller, grey)
3. **Loading state**: Hidden (show loading spinner instead)
4. **Result state**: Hidden (redirect happens)

### Phase 5: Loading State with ATProto Facts
**Changes**:
1. Create facts dictionary:
   ```javascript
   const atprotoFacts = [
     "ATProto is a decentralized social protocol",
     "Your data lives on a Personal Data Server (PDS)",
     "Bluesky runs on ATProto",
     "You can host your own PDS",
     "ATProto uses content addressing",
     "Your handle can be your domain name",
     "Posts are cryptographically signed",
     "ATProto supports custom feeds"
   ]
   ```

2. Loading component:
   - Hourglass icon/spinner
   - Rotating fact (change every 2-3 seconds)
   - Format:
     ```
     ⏳ Posting to the ATmosphere...

     Did you know?
     [Rotating fact here]
     ```

### Phase 6: Success Page (New Route)
**Changes**:
1. Create new component: `ElevatorSelfieSuccess.jsx`

2. Route structure:
   - Secret URL: `/qr7f9k2h8d4j6m1p3s5w` (camera page)
   - Public URL: `/elevatorselfie` (success page)

3. Update `App.jsx`:
   ```jsx
   <Route path="/elevatorselfie" element={<ElevatorSelfieSuccess />} />
   ```

4. Success page content:
   ```
   <div className="success-container">
     <h1>Thanks!</h1>
     <p>Your selfie is live on Bluesky</p>
     {postUrl && <a href={postUrl}>View your post →</a>}
     <button onClick={() => navigate('/qr7f9k2h8d4j6m1p3s5w')}>
       Take another selfie
     </button>
   </div>
   ```

5. Redirect logic in `CameraUpload.jsx`:
   - After successful upload, instead of showing result view:
   - `navigate('/elevatorselfie', { state: { postUrl } })`

---

## Implementation Order

### Step 1: Create Success Page (Easiest, No Breaking Changes)
- Create `ElevatorSelfieSuccess.jsx`
- Add route to `App.jsx`
- Update redirect logic in `CameraUpload.jsx`
- Test: Upload should redirect to `/elevatorselfie`

### Step 2: Create ATProto Facts (Simple Addition)
- Add facts array
- Create rotating fact component
- Integrate into loading view
- Test: Loading shows rotating facts

### Step 3: Refactor Main View State Machine
- Change from multi-view to single-view with states
- Combine camera + filter selector + buttons into one layout
- Test: Basic flow works (capture → preview → post)

### Step 4: Update Filter Selector UI
- Create filter button row/grid
- Add disabled state styling
- Test: Filters select properly, disable after capture

### Step 5: Polish & Mobile Testing
- Ensure no text cramping on mobile
- Test entire flow end-to-end
- Verify secret URL stays hidden from user

---

## Key Technical Decisions

### State Management
Change from:
```javascript
const [view, setView] = useState('filterSelect')
```

To:
```javascript
const [appState, setAppState] = useState('ready') // ready, captured, loading, result
const [capturedImage, setCapturedImage] = useState(null)
const [selectedFilter, setSelectedFilter] = useState('none')
```

### Component Structure
```
CameraUpload
├── InfoText
├── CameraPreview (shows camera or captured image)
├── FilterSelector (4 buttons, radio-style)
└── ActionButtons (cheese / post+retake / loading)
```

### Navigation Flow
```
/qr7f9k2h8d4j6m1p3s5w (secret)
  → Camera page (ready state)
  → Capture photo (captured state)
  → Post to Bluesky (loading state)
  → Redirect to /elevatorselfie (success)
  → "Take another" button → back to secret URL
```

---

## Edge Cases to Handle

1. **Camera permission denied**: Show error message on main view
2. **Upload fails**: Show error, allow retry (stay in captured state)
3. **Slow upload**: Facts keep rotating until complete
4. **User closes tab during upload**: Can't prevent, but ensure no partial state
5. **Direct access to /elevatorselfie**: Show message "No post to show" or default message

---

## Testing Checklist

- [ ] Landing page shows camera + filters + info text
- [ ] Camera permission prompt works
- [ ] Filter selection changes live preview
- [ ] Pixelate preview updates every second
- [ ] Capture creates preview with correct filter
- [ ] Filters disable after capture
- [ ] Retake goes back to camera
- [ ] Post uploads with correct filter applied
- [ ] Loading shows rotating facts
- [ ] Success page appears with correct post URL
- [ ] "Take another" returns to secret URL
- [ ] Mobile: No cramped text
- [ ] Mobile: Buttons are tappable
- [ ] All 4 filters upload faithfully to Bluesky

---

## Questions to Clarify Before Implementation

1. **Filter selector layout**: 1 row of 4 buttons OR 2x2 grid?
2. **ATProto facts**: Need 8-10 facts - should I write them or do you have specific ones?
3. **Success page**: Include preview of posted image or just link?
4. **"cheese!" button**: Keep this text or change to "Capture" or "Take Photo"?
5. **Info text size**: How small should disclaimer be? (vs main emoji message)

---

## Estimated Effort

- **Step 1 (Success page)**: 15 minutes
- **Step 2 (ATProto facts)**: 15 minutes
- **Step 3 (Refactor main view)**: 45 minutes
- **Step 4 (Filter selector UI)**: 30 minutes
- **Step 5 (Polish & test)**: 30 minutes

**Total**: ~2.5 hours of work

---

## Current File to Modify
- `/Users/jakesimonds/Documents/CC-website-leaflet/src/pages/CameraUpload.jsx` (main changes)
- Create: `/Users/jakesimonds/Documents/CC-website-leaflet/src/pages/ElevatorSelfieSuccess.jsx`
- Update: `/Users/jakesimonds/Documents/CC-website-leaflet/src/App.jsx` (add route)

---

## Ready to Start?

Once you confirm the clarifying questions above, I'll start with Step 1 (Success page) since it's non-breaking and easy to test!
