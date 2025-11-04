# Get Rid of Cloudflare - Switch to Route 53

## Current Problem
- Amplify is stuck trying to add domain
- Cloudflare is handling DNS (conflicting with AWS)
- Need to switch to Route 53 completely

---

## Step-by-Step: Switch to Route 53

### Step 1: Cancel Stuck Amplify Domain Setup

**In Amplify Console:**
1. Go to: https://console.aws.amazon.com/amplify/home
2. Click your app: `2025Website`
3. Go to "Hosting" → "Custom domains"
4. Find `latenthomer.com`
5. Click "Actions" → "Remove domain" or just let it fail and remove after
6. If it won't let you remove, that's OK - we'll fix it after DNS change

**OR just wait for it to timeout/fail - doesn't matter**

---

### Step 2: Find Your Domain Registrar

**Where did you buy latenthomer.com?**

Check one of these:
- Namecheap: https://www.namecheap.com/
- GoDaddy: https://www.godaddy.com/
- Google Domains: https://domains.google/
- Route 53 (AWS): https://console.aws.amazon.com/route53/domains/home

**Or check your email** for the domain purchase receipt.

---

### Step 3: Change Nameservers at Registrar

**You need to change from Cloudflare to Route 53:**

**OLD (Cloudflare) nameservers:**
```
dorthy.ns.cloudflare.com
seth.ns.cloudflare.com
```

**NEW (Route 53) nameservers:**
```
ns-1463.awsdns-54.org
ns-1929.awsdns-49.co.uk
ns-7.awsdns-00.com
ns-1012.awsdns-62.net
```

**How to do it (varies by registrar):**

**If using Namecheap:**
1. Login to Namecheap
2. Go to Domain List
3. Click "Manage" next to latenthomer.com
4. Find "Nameservers" section
5. Select "Custom DNS"
6. Enter the 4 Route 53 nameservers above
7. Save

**If using GoDaddy:**
1. Login to GoDaddy
2. Go to My Products → Domains
3. Click DNS next to latenthomer.com
4. Scroll to "Nameservers"
5. Click "Change"
6. Select "Custom"
7. Enter the 4 Route 53 nameservers
8. Save

**If domain is already in Route 53:**
1. Go to: https://console.aws.amazon.com/route53/domains/home
2. Click on latenthomer.com
3. Check nameservers - they should match your hosted zone
4. If not, update them to the Route 53 nameservers above

---

### Step 4: Wait for DNS Propagation

**Time:** 1-48 hours (usually 2-6 hours)

**Check progress:**
```bash
dig latenthomer.com NS +short
```

When you see:
```
ns-1463.awsdns-54.org
ns-1929.awsdns-49.co.uk
ns-7.awsdns-00.com
ns-1012.awsdns-62.net
```

You're ready to proceed!

---

### Step 5: Re-Add Domain to Amplify

**Once DNS propagation is complete:**

1. Go to Amplify Console
2. Your app → Hosting → Custom domains
3. Click "Add domain"
4. Enter: `latenthomer.com`
5. Amplify will auto-detect it's in Route 53
6. It will automatically create DNS records
7. It will automatically create SSL certificate
8. Wait 5-10 minutes
9. Done!

---

### Step 6: Verify Everything Works

**Test URLs:**
```bash
# Personal site
curl -I https://latenthomer.com

# WikiSurfer (should work - Route 53 records already exist)
curl -I https://wikisurfer.latenthomer.com
curl -I https://api.wikisurfer.latenthomer.com

# Amplify URL (should still work)
curl -I https://prod.d3p3g9o4hyr40...amplifyapp.com
```

---

## What Happens After Nameserver Change

### Immediate Effects:
- ✅ Route 53 DNS records become active
- ✅ WikiSurfer records already in Route 53 will start working
- ✅ Your existing DNS setup is preserved
- ✅ Cloudflare stops handling DNS

### What Works Right Away (once DNS propagates):
- ✅ `wikisurfer.latenthomer.com` → CloudFront
- ✅ `api.wikisurfer.latenthomer.com` → Load Balancer
- ✅ All Route 53 records you already have

### What Needs Setup:
- ⏳ `latenthomer.com` → Need to re-add to Amplify after propagation
- ⏳ Any other subdomains you want

---

## Do This Now

**Step 1: Find where you registered latenthomer.com**

Tell me and I'll give you exact instructions for changing nameservers.

**Step 2: Cancel the stuck Amplify domain (optional)**

Just go to Amplify → Custom domains → Remove it if you can.

**Or skip this and just change nameservers - we can clean up Amplify later.**

---

## Timeline

**Hour 0:** Change nameservers at registrar
**Hour 1-2:** DNS starts propagating
**Hour 2-6:** Most DNS servers updated
**Hour 6-24:** Full propagation complete
**Hour 24:** Re-add domain to Amplify
**Hour 24.5:** Everything works!

---

## Quick Alternative: Use Amplify URL Now

While you wait for DNS:

Your Amplify app IS live at:
`https://prod.d3p3g9o4hyr40...amplifyapp.com` (or similar)

You can use this now and worry about custom domain later!

---

**Where did you buy latenthomer.com?** Tell me and I'll give you exact steps to change the nameservers!
