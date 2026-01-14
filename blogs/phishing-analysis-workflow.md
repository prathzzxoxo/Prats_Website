# Email Security: Building an Effective Phishing Analysis Workflow

Phishing remains one of the most common attack vectors in cybersecurity. As someone who has analyzed thousands of suspicious emails using Mimecast and other email security platforms, I've developed a systematic workflow that ensures thorough analysis while maintaining efficiency.

## The Scale of the Phishing Problem

Consider these sobering statistics:
- 90% of data breaches start with a phishing email
- Average cost of a successful phishing attack: $4.65M
- Phishing attempts increased 65% in 2023

An effective email analysis workflow is not optional—it's essential.

## Building Your Phishing Analysis Workflow

### Phase 1: Initial Triage (2-5 minutes)

When a suspicious email is reported, start with quick wins:

**Quick checks:**
* Is the sender address legitimate?
* Are there obvious grammar/spelling errors?
* Does the sender match the email domain?
* Are there suspicious links or attachments?
* Is there urgency or threatening language?

**Red flags:**
```
From: paypal-security@paypa1-verify.com  ← Suspicious domain
Subject: URGENT: Your account will be locked!  ← Creates urgency
Body: "Click here immediately to verify..."   ← Vague threat
```

### Phase 2: Email Header Analysis (5-10 minutes)

Headers tell the truth. Key headers to examine:

```
Authentication Results:
- SPF: Should be "pass" for legitimate senders
- DKIM: Should be "pass" with valid signature
- DMARC: Should be "pass" with proper alignment

Return-Path vs From Address:
- Should match for legitimate email
- Mismatch often indicates spoofing

Received Headers:
- Trace the email's journey
- Identify originating server
- Look for suspicious hops
```

**Example analysis:**
```
Received: from suspicious-server.xyz (unknown [192.0.2.1])
SPF: fail (sender IP not authorized)
DKIM: none
DMARC: fail

Verdict: Almost certainly malicious
```

### Phase 3: Link Analysis (5-10 minutes)

Phishing emails often contain malicious links. Analyze safely:

**Tools to use:**
- URLscan.io
- VirusTotal
- Hybrid Analysis
- Any.run (sandbox)

**What to check:**
* Where does the link actually go? (hover or use URL decoder)
* Is the domain recently registered?
* Does it mimic a legitimate service?
* What does the sandbox reveal?

**Safe analysis approach:**
```
1. DO NOT click links directly
2. Copy link address (right-click)
3. Paste into URLscan.io
4. Review sandbox results
5. Check domain registration date
6. Document findings
```

### Phase 4: Attachment Analysis (10-20 minutes)

Malicious attachments require careful handling:

**File types to be suspicious of:**
- `.exe`, `.scr`, `.com` (executables)
- `.zip`, `.rar` (compressed, may contain malware)
- `.doc`, `.xls` with macros
- `.pdf` with embedded JavaScript
- `.html` (may redirect to phishing sites)

**Analysis workflow:**
```
1. Extract attachment metadata (DO NOT OPEN)
2. Calculate file hash (SHA256)
3. Check hash in VirusTotal
4. If unknown, submit to sandbox:
   - Any.run
   - Hybrid Analysis
   - Joe Sandbox
5. Review sandbox behavior
6. Document IOCs
```

### Phase 5: Scope Assessment (10-15 minutes)

Determine impact:

**Key questions:**
* How many users received this email?
* Did anyone click links or open attachments?
* Is this part of a larger campaign?
* Have similar emails been reported?

**Using Mimecast:**
```
1. Search for similar messages:
   - Same sender domain
   - Same subject pattern
   - Same attachment hash

2. Check Click Protect logs:
   - Did anyone click malicious links?
   - When did clicks occur?
   - Which users were affected?

3. Generate recipient list:
   - Who received the email?
   - What actions did they take?
   - Do we need to notify anyone?
```

## Incident Response Actions

### If Phishing is Confirmed

**Immediate actions:**
1. Block sender domain in email gateway
2. Remove emails from all inboxes
3. Block malicious URLs in web proxy
4. Add file hashes to EDR blocklist
5. Notify affected users

**Mimecast response:**
```
Actions to take:
□ Create sender policy (block)
□ Add URLs to Blocked category
□ Search and delete messages
□ Review similar emails
□ Update security awareness training
```

### Documentation

Create a detailed incident report:

**Required information:**
* Email headers (full)
* Screenshots of email
* URLs and their verdicts
* Attachment analysis results
* IOCs (IPs, domains, hashes)
* Number of affected users
* Actions taken
* Lessons learned

## Extracting and Sharing IOCs

Make your analysis useful to the broader community:

**IOCs to extract:**
```
Sender Information:
- Email address
- Sender domain
- Reply-to address
- Sender IP

Network IOCs:
- Malicious URLs
- C2 domains
- IP addresses

File IOCs:
- Attachment names
- File hashes (MD5, SHA256)
- File types
```

**Sharing platforms:**
- Internal threat intelligence platform
- MISP
- AlienVault OTX
- Threat intel sharing groups

## Automation Opportunities

As you mature your process, consider automation:

### Automated Triage

```python
# Pseudocode for automated initial triage
def triage_email(email):
    score = 0

    # Check SPF/DKIM/DMARC
    if email.spf == "fail":
        score += 30

    # Check for known malicious domains
    if email.sender_domain in threat_intel_feed:
        score += 50

    # Check link reputation
    for link in email.links:
        if link_reputation(link) == "malicious":
            score += 40

    return "HIGH" if score > 70 else "MEDIUM" if score > 40 else "LOW"
```

### Automated Response

Build playbooks for common scenarios:
* Auto-block known-bad senders
* Auto-remove emails with malicious hashes
* Auto-notify affected users
* Auto-create tickets for investigation

## Common Phishing Techniques

### Business Email Compromise (BEC)

**Characteristics:**
- Appears to come from CEO/executive
- Requests wire transfer or sensitive info
- Often uses spoofing or compromised account
- Creates urgency

**Detection:**
- Check actual sender email vs display name
- Verify unusual requests out-of-band
- Look for slight domain variations

### Credential Harvesting

**Characteristics:**
- Fake login pages
- Requests to "verify account"
- Links to lookalike domains
- Sense of urgency

**Detection:**
- URL analysis shows fake domain
- SSL certificate doesn't match brand
- Form asks for unnecessary information

### Malware Delivery

**Characteristics:**
- Unexpected attachments
- Compressed or obfuscated files
- Macros in Office documents
- Fake invoices or documents

**Detection:**
- Sandbox analysis shows malicious behavior
- File reputation is poor
- Unexpected file type for context

## Measuring Your Program

Track these metrics:

**Volume Metrics:**
- Suspicious emails reported per week
- Confirmed phishing emails
- Response time (report to remediation)

**Effectiveness Metrics:**
- % of phishing caught by filters
- % of phishing reported by users
- Time to block confirmed threats
- False positive rate

**User Awareness:**
- Reporting rate increase over time
- Click rate on simulated phishing
- Time to report suspicious emails

## User Education

Your best defense is educated users:

**Training topics:**
* How to identify phishing emails
* What to do when suspicious email received
* How to report (make it easy!)
* Recent phishing trends
* Consequences of falling for phishing

**Make reporting easy:**
- Phishing report button in email client
- Clear, simple process
- Quick feedback on reports
- Recognition for reporters

## Conclusion

An effective phishing analysis workflow combines systematic analysis, proper tooling, and quick response actions. The key is to be thorough yet efficient, documenting everything for future reference and sharing IOCs with the community.

Remember: **Every phishing email analyzed makes your organization and the broader security community more resilient.**

---

*Questions about email security or phishing analysis? Let's connect on [LinkedIn](https://www.linkedin.com/in/prathana-mahendran-16b65319a/) to discuss email security strategies.*
