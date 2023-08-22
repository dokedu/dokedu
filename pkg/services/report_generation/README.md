# Report Generation

```yaml
# Report
- ID: ID
- Status: ReportStatus
- Format: ReportFormat
- Kind: ReportKind
- Props: JSON
- UserID: ID
- OrganisationID: ID
- CreatedAt: Timestamptz
- UpdatedAt: Timestamptz
```

`Props` is defined and parsed for each report kind. `Props` is `json` and therefore can contain any data. 

We have a report processing pipeline. Perhaps we should execute report generation in a separate server/separate task. That is something for later.

Whenever a report is inserted, we check what function to call to process the report. Each report kind processor will do the following:

1. Validate `Props`
2. Determine if `Format` is allowed
3. Fetch data
4. Generate _head, _content and _foot
5. Store result