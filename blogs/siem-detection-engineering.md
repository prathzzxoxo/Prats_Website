# SIEM Detection Engineering: From Raw Logs to Actionable Alerts

As a Security Engineer working with multiple SIEM platforms including Azure Sentinel, Elastic SIEM, and LevelBlue USM, I've learned that effective detection engineering is both an art and a science. In this post, I'll share practical insights on transforming raw security logs into meaningful detection rules.

## The Challenge of Detection Engineering

Every security team faces the same fundamental challenge: **how do you identify real threats in an ocean of security events?** With thousands of logs generated every second, the key is building detections that catch genuine threats while keeping false positives to a minimum.

### Common Pitfalls

* **Over-alerting**: Too many false positives lead to alert fatigue
* **Under-alerting**: Missed threats due to overly specific rules
* **Poor context**: Alerts without sufficient information for investigation
* **Maintenance burden**: Rules that break with environment changes

## The Detection Engineering Workflow

### 1. Understand Your Data Sources

Before writing any detection rules, you need to understand what data you're working with. Key questions to ask:

* What log sources are ingested into your SIEM?
* What fields are available for correlation?
* How reliable is the data quality?
* What is the data retention period?

### 2. Define Your Use Cases

Start with the MITRE ATT&CK framework to identify relevant techniques for your environment:

```kql
// Example: Detecting suspicious PowerShell execution
SecurityEvent
| where EventID == 4688
| where Process contains "powershell.exe"
| where CommandLine contains "-enc" or CommandLine contains "-w hidden"
| project TimeGenerated, Computer, Account, CommandLine
```

### 3. Build and Test

My approach to building detection rules:

**Start broad, then refine**
- Begin with a basic rule that catches the technique
- Test against historical data
- Refine to reduce false positives
- Add context for analysts

**Include proper context**
Every alert should answer:
- *What* happened?
- *Where* did it happen?
- *When* did it occur?
- *Who* was involved?

### 4. Validate and Tune

Testing is crucial. For each rule:

* Test against known malicious activity
* Validate against normal operations
* Calculate false positive rate
* Measure time to detection

## Real-World Example: Detecting Lateral Movement

Here's a practical example of a detection rule for potential lateral movement using Azure Sentinel KQL:

```kql
// Detect suspicious lateral movement via remote services
SecurityEvent
| where EventID in (4624, 4625) // Logon events
| where LogonType == 3 // Network logon
| where Account !endswith "$" // Exclude computer accounts
| summarize
    SuccessCount = countif(EventID == 4624),
    FailCount = countif(EventID == 4625),
    UniqueDestinations = dcount(Computer)
    by Account, IpAddress, bin(TimeGenerated, 10m)
| where UniqueDestinations > 5 // Multiple targets
| where FailCount > 0 or SuccessCount > 10
| project TimeGenerated, Account, IpAddress,
    UniqueDestinations, SuccessCount, FailCount
```

This rule identifies accounts connecting to multiple systems in a short timeframe—a key indicator of lateral movement.

## Best Practices from the Field

### 1. Document Everything

Maintain clear documentation for each detection rule:
- **Purpose**: What threat does this detect?
- **Logic**: How does the detection work?
- **Expected FP rate**: Normal vs. suspicious
- **Response**: What should analysts do?

### 2. Implement Tiering

Not all detections are equal. Implement severity tiering:

* **Critical**: Confirmed malicious activity
* **High**: Strong indicators of compromise
* **Medium**: Suspicious activity requiring investigation
* **Low**: Baseline violations or policy checks

### 3. Continuous Improvement

Detection engineering is never "done":

* Review alerts weekly
* Gather feedback from analysts
* Update rules as threats evolve
* Remove outdated or ineffective rules

## Tools and Platforms

### Azure Sentinel

**Pros:**
- Native integration with Microsoft ecosystem
- Powerful KQL query language
- Built-in threat intelligence
- Cloud-native scalability

**Cons:**
- Cost can escalate with log volume
- Learning curve for KQL
- Limited on-premises support

### Elastic SIEM

**Pros:**
- Open-source flexibility
- Strong on-premises support
- Excellent search capabilities
- Active community

**Cons:**
- Requires more maintenance
- Steeper learning curve
- Resource-intensive

## Measuring Success

Track these metrics to evaluate your detection program:

* **Mean Time to Detect (MTTD)**: How quickly are threats identified?
* **False Positive Rate**: What percentage of alerts are false positives?
* **Coverage**: What percentage of MITRE ATT&CK techniques are covered?
* **Alert Quality**: Are alerts actionable and well-contextualized?

## Conclusion

Effective detection engineering requires a balance of technical skill, threat intelligence, and operational awareness. Focus on building high-quality rules that provide value to your analysts, and continuously refine based on feedback and evolving threats.

Remember: **A detection rule is only as good as the action it enables.**

---

*What are your biggest challenges in detection engineering? Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/prathana-mahendran-16b65319a/) to discuss SIEM strategies and security operations.*
