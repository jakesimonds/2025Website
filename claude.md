# Personal Website with Embedded Leaflet - Project Plan

## Goal
Create a React personal website (no backend) that embeds Leaflet documents/content

## Research Results ✅

### What is Leaflet.pub?
- **Open source** (MIT license): https://github.com/hyperlink-academy/leaflet
- Built with: React + Next.js + Supabase + Replicache + TypeScript
- Two features: Shared docs (collaborative) + Publications (atproto/Bluesky-based)
- No account needed to create/share docs

### Integration Options Discovered

**Option 1: iframe Embed (Simplest)**
- Leaflet provides shareable URLs for documents
- Can iframe published Leaflet docs into your React app
- ✅ Pros: Easy, no maintenance
- ❌ Cons: Limited styling control, relies on Leaflet hosting

**Option 2: Self-Host Leaflet (Full Control)**
- Clone the open-source repo
- Run your own Leaflet instance
- ✅ Pros: Complete control, can customize everything
- ❌ Cons: Need to maintain Supabase backend, more complex

**Option 3: Export + Custom Renderer**
- Export Leaflets as JSON
- Build custom React components to render Leaflet blocks
- ✅ Pros: Full design control, static content (fast)
- ❌ Cons: No real-time collaboration, manual export workflow

**Option 4: Custom Frontend + Appview**
- README mentions "bring your own frontend using our appview"
- Use Leaflet backend, build custom React frontend
- ✅ Pros: Custom UI, Leaflet infrastructure
- ❌ Cons: Need to understand appview API, moderate complexity

**Option 5: ATProto/Bluesky Integration**
- For Publications specifically (blogs/newsletters)
- Fetch data directly from atproto/PDS
- ✅ Pros: Decentralized, future-proof
- ❌ Cons: Only works for Publications, not regular docs

## Recommended Approach

**For a personal website with NO backend:** Option 1 (iframe) or Option 3 (export JSON) are best.

### Recommended: Option 1 - iframe Embed
Simplest approach for a static React site. Steps:
1. Create Leaflet documents at leaflet.pub
2. Get shareable URLs
3. Embed in React components using iframes
4. Style iframe containers to match your site

### Alternative: Option 3 - Export + Custom Components
For more control over styling:
1. Create/edit content in Leaflet
2. Export as JSON
3. Build React components to render Leaflet block types
4. Import JSON and render with custom styling

---

## Implementation Plan (Option 1 - iframe Embed)

### Phase 1: Set Up React Personal Website
- [ ] Initialize React app with Vite
- [ ] Install dependencies (React Router, styling library)
- [ ] Set up project structure
- [ ] Create basic layout/navigation components
- [ ] Set up routing

### Phase 2: Build Core Pages
- [ ] Home page - introduce yourself
- [ ] About page - background, skills, experience
- [ ] Projects/Portfolio page - showcase work
- [ ] Blog/Writing section - where Leaflet content will live
- [ ] Contact section - links, email, social

### Phase 3: Create Leaflet Content
- [ ] Go to leaflet.pub and create test document(s)
- [ ] Write blog posts or documentation in Leaflet
- [ ] Get shareable public URLs
- [ ] Test that URLs are accessible

### Phase 4: Integrate Leaflet Embeds
- [ ] Create LeafletEmbed component (wrapper for iframe)
- [ ] Add responsive styling for iframes
- [ ] Embed Leaflet docs in Blog section
- [ ] Test iframe responsiveness on different screen sizes
- [ ] Add fallbacks/loading states

### Phase 5: Styling & Polish
- [ ] Choose color scheme / design system
- [ ] Make embeds feel integrated (not like foreign iframes)
- [ ] Add transitions/animations
- [ ] Ensure accessibility (a11y)
- [ ] Mobile responsive testing

### Phase 6: Deployment
- [ ] Build for production
- [ ] Deploy to Netlify/Vercel/GitHub Pages
- [ ] Test deployed site
- [ ] Optional: Set up custom domain via Route 53
- [ ] Optional: Analytics setup

## Tech Stack Decision

### Recommended Stack
- **Framework**: React with Vite (fast dev, modern tooling)
- **Styling**: Tailwind CSS (utility-first, rapid development)
- **Routing**: React Router v6 (standard for SPAs)
- **Hosting**: Vercel or Netlify (free tier, auto-deploy from Git)
- **Content**: Leaflet.pub (embedded via iframe)

### Why This Stack?
- **Vite**: Fast HMR, modern ESM-based build tool
- **Tailwind**: Quick styling, responsive utilities, easy customization
- **No backend needed**: Static site generation, Leaflet handles content
- **Free hosting**: Both Vercel/Netlify have generous free tiers

## Key Findings Summary
✅ **Embedding is possible!** Multiple viable options exist
✅ **Leaflet is open source** (MIT) - can self-host if needed later
✅ **iframe approach is simplest** for static React site with no backend
✅ **Can also export JSON** if you want full control over rendering
✅ **Custom domains supported** by Leaflet (via DNS/Route 53)

## Next Steps
**Decision needed:** Which integration approach do you prefer?
1. **iframe embed** (recommended for simplicity)
2. **Export JSON + custom renderer** (more control, more work)
3. **Something else?**

Once decided, we can start building! 🚀
