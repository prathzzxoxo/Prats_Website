# KQL for Threat Hunting: Advanced Queries for Security Operations

Kusto Query Language (KQL) has become an essential skill for security analysts working with Azure Sentinel and other Microsoft security products. As someone who writes KQL queries daily for threat detection and investigation, I'll share practical techniques that have proven effective in real-world SOC operations.

## Why KQL Matters

KQL is the query language for:
- Azure Sentinel (Microsoft's cloud SIEM)
- Microsoft Defender for Endpoint
- Azure Monitor
- Azure Data Explorer

Mastering KQL means faster investigations, better detections, and more efficient threat hunting.

## KQL Fundamentals for Security

### Basic Structure

```kql
TableName
| where TimeGenerated > ago(24h)
| where ColumnName contains "value"
| project TimeGenerated, Computer, Account
| take 10
```

### Key Operators for Security Analysis

**Filtering:**
- `where` - Filter rows
- `contains` - Case-insensitive search
- `has` - Whole word match (faster than contains)
- `in` - Match against list

**Aggregation:**
- `summarize` - Group and aggregate
- `count()` - Count rows
- `dcount()` - Distinct count
- `make_set()` - Create array of values

## Real-World Threat Hunting Queries

### 1. Detecting Suspicious PowerShell Activity

```kql
DeviceProcessEvents
| where TimeGenerated > ago(7d)
| where FileName =~ "powershell.exe"
| where ProcessCommandLine has_any (
    "-enc", "-encodedcommand",
    "-nop", "-noprofile",
    "-w hidden", "-windowstyle hidden",
    "downloadstring", "iex",
    "invoke-expression"
)
| summarize
    Count = count(),
    UniqueCommands = dcount(ProcessCommandLine),
    Commands = make_set(ProcessCommandLine, 5)
    by DeviceName, AccountName
| where Count > 3 or UniqueCommands > 2
| order by Count desc
```

This query identifies:
- Encoded PowerShell commands
- Hidden window execution
- Download and execute patterns
- Multiple suspicious invocations

### 2. Lateral Movement Detection

```kql
// Detect potential pass-the-hash or lateral movement
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID == 4624 // Successful logon
| where LogonType == 3 // Network logon
| where Account !endswith "$" // Exclude computer accounts
| where Account !in ("ANONYMOUS LOGON", "LOCAL SERVICE", "NETWORK SERVICE")
| summarize
    DestinationCount = dcount(Computer),
    FirstSeen = min(TimeGenerated),
    LastSeen = max(TimeGenerated),
    Destinations = make_set(Computer)
    by Account, IpAddress, bin(TimeGenerated, 10m)
| where DestinationCount >= 5
| extend Duration = LastSeen - FirstSeen
| order by DestinationCount desc
```

### 3. Abnormal Authentication Patterns

```kql
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType == "0" // Successful sign-ins
| summarize
    SignInCount = count(),
    UniqueIPs = dcount(IPAddress),
    UniqueLocations = dcount(Location),
    IPs = make_set(IPAddress),
    Locations = make_set(Location)
    by UserPrincipalName, AppDisplayName, bin(TimeGenerated, 1h)
| where UniqueIPs > 3 or UniqueLocations > 2
| order by UniqueIPs desc
```

This detects:
- Impossible travel scenarios
- Multiple IPs for single user
- Potential credential compromise

### 4. Command and Control (C2) Detection

```kql
DeviceNetworkEvents
| where TimeGenerated > ago(24h)
| where RemotePort in (4444, 5555, 8080, 8443, 443, 80)
| where RemoteIPType == "Public"
| summarize
    ConnectionCount = count(),
    TotalBytesSent = sum(BytesSent),
    TotalBytesReceived = sum(BytesReceived),
    FirstConnection = min(TimeGenerated),
    LastConnection = max(TimeGenerated)
    by DeviceName, RemoteIP, RemotePort
| extend
    ConnectionDuration = LastConnection - FirstConnection,
    DataRatio = TotalBytesSent * 1.0 / TotalBytesReceived
| where ConnectionCount > 100 or ConnectionDuration > 1h
| where DataRatio < 0.1 or DataRatio > 10 // Abnormal data flow
| order by ConnectionCount desc
```

## Advanced KQL Techniques

### 1. Join Operations for Correlation

```kql
// Correlate process creation with network connections
let suspiciousProcesses = DeviceProcessEvents
| where TimeGenerated > ago(1h)
| where FileName in~ ("cmd.exe", "powershell.exe", "wscript.exe")
| project DeviceId, ProcessCreationTime = TimeGenerated,
         ProcessId, FileName, ProcessCommandLine;
DeviceNetworkEvents
| where TimeGenerated > ago(1h)
| where RemoteIPType == "Public"
| join kind=inner (suspiciousProcesses) on DeviceId
| where TimeGenerated between (ProcessCreationTime .. (ProcessCreationTime + 10m))
| project TimeGenerated, DeviceName, FileName, ProcessCommandLine,
         RemoteIP, RemotePort
```

### 2. Time-Based Analysis with bin()

```kql
SecurityEvent
| where TimeGenerated > ago(7d)
| where EventID == 4625 // Failed logons
| summarize FailedLogons = count() by Account, bin(TimeGenerated, 1h)
| where FailedLogons > 10
| render timechart
```

### 3. Dynamic Thresholds with percentile()

```kql
// Detect abnormal process executions
DeviceProcessEvents
| where TimeGenerated > ago(30d)
| summarize ProcessCount = count() by FileName, bin(TimeGenerated, 1d)
| summarize
    avg_count = avg(ProcessCount),
    p95_count = percentile(ProcessCount, 95)
    by FileName
| join kind=inner (
    DeviceProcessEvents
    | where TimeGenerated > ago(1d)
    | summarize today_count = count() by FileName
) on FileName
| where today_count > p95_count * 2
| order by today_count desc
```

## Performance Optimization Tips

### 1. Filter Early

**Bad:**
```kql
SecurityEvent
| project TimeGenerated, Account, Computer
| where TimeGenerated > ago(24h)
| where Account == "admin"
```

**Good:**
```kql
SecurityEvent
| where TimeGenerated > ago(24h)
| where Account == "admin"
| project TimeGenerated, Account, Computer
```

### 2. Use has instead of contains

**Slower:**
```kql
| where CommandLine contains "powershell"
```

**Faster:**
```kql
| where CommandLine has "powershell"
```

### 3. Limit Data with take or top

```kql
SecurityEvent
| where TimeGenerated > ago(24h)
| take 1000 // Limit results for faster response
```

## Building Detection Rules

### Converting Queries to Detection Rules

```kql
// Example: Detect credential dumping attempts
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID == 4656 // Handle to object requested
| where ObjectName has "lsass.exe"
| where ProcessName !has "lsass.exe"
| where AccessMask == "0x1410" // Suspicious access rights
| summarize
    AttemptCount = count(),
    Processes = make_set(ProcessName)
    by Computer, Account
| where AttemptCount >= 1
| extend Severity = "High"
| project-reorder TimeGenerated, Computer, Account, Processes, AttemptCount
```

### Adding Context to Alerts

```kql
let SuspiciousActivity =
SecurityEvent
| where TimeGenerated > ago(1h)
| where EventID == 4688
| where CommandLine has_any ("mimikatz", "procdump", "ntdsutil");
SuspiciousActivity
| join kind=leftouter (
    SecurityEvent
    | where EventID == 4624 // Recent logons
    | where TimeGenerated > ago(2h)
    | summarize RecentLogons = count() by Account
) on Account
| extend RiskScore = case(
    RecentLogons > 10, "High",
    RecentLogons > 5, "Medium",
    "Low"
)
```

## Threat Hunting Playbooks

### Playbook 1: Hunt for Living Off the Land (LOLBAS)

```kql
DeviceProcessEvents
| where TimeGenerated > ago(7d)
| where FileName in~ (
    "certutil.exe", "bitsadmin.exe", "mshta.exe",
    "regsvr32.exe", "rundll32.exe", "wmic.exe"
)
| where ProcessCommandLine has_any (
    "download", "http", "script", "javascript",
    "vbscript", "/q", "/s", "-decode"
)
| summarize Count = count(), Commands = make_set(ProcessCommandLine, 10)
    by DeviceName, FileName, AccountName
| order by Count desc
```

### Playbook 2: Hunt for Persistence Mechanisms

```kql
union
(
    DeviceRegistryEvents
    | where RegistryKey has "\\CurrentVersion\\Run"
),
(
    DeviceFileEvents
    | where FolderPath has "\\Startup\\"
),
(
    DeviceProcessEvents
    | where ProcessCommandLine has "schtask"
)
| summarize Count = count(), Details = make_set(ActionType)
    by DeviceName, InitiatingProcessAccountName
```

## Best Practices

1. **Always include time filters** - Improves performance
2. **Use project to limit columns** - Reduces data transfer
3. **Test queries on smaller time ranges** - Validate before running on large datasets
4. **Document your queries** - Add comments explaining logic
5. **Use let statements** - Make queries reusable and readable
6. **Monitor query performance** - Check execution time and optimize

## Common Pitfalls to Avoid

- Not filtering on time early enough
- Using `contains` when `has` would work
- Not accounting for case sensitivity
- Over-complicated joins (use summarize when possible)
- Not testing edge cases

## Resources for Learning

- Microsoft Learn KQL documentation
- Azure Sentinel GitHub (community queries)
- KQL Café (interactive learning)
- Practice with sample data in Log Analytics

## Conclusion

KQL is a powerful tool for threat hunting and detection engineering. Start with simple queries, gradually add complexity, and always test thoroughly. The queries shared here are starting points—adapt them to your environment's specific needs.

Remember: **The best detection is the one that catches real threats without overwhelming your analysts with false positives.**

---

*Want to discuss KQL techniques or share your own queries? Connect with me on [LinkedIn](https://www.linkedin.com/in/prathana-mahendran-16b65319a/).*
