# BizFlow ERP - ER Diagram (Mermaid)

Paste this into any Mermaid-compatible viewer, or preview directly in VS Code with a Mermaid-enabled Markdown preview extension.

```mermaid
erDiagram
    USER {
      ObjectId _id PK
      string name
      string email UK
      string password
      string role  "Admin | HR | Manager | Employee | CEO"
      string profileImage
      boolean isAccountVerified
      string approvalStatus "Pending | Approved | Rejected"
      string approvalRequiredRole "HR | Admin"
      ObjectId approvedBy FK "ref: USER"
      date approvedAt
      string rejectionReason
      string verifyOtp
      number verifyOtpExpireAt
      string resetOtp
      number resetOtpExpireAt
      string resetPasswordToken
      number resetPasswordExpires
      boolean isActive
      date lastLogin
    }

    EMPLOYEE {
      ObjectId _id PK
      ObjectId user FK "ref: USER (unique)"
      string employeeCode
      string department
      string designation
      date joinDate
      string phone
      string address
      date dob
      string gender
      string bankAccountNumber
      string bankIfsc
      string pan
      string aadhaar
      string employmentStatus "Active | Inactive | OnLeave"
      ObjectId manager FK "ref: USER"
      ObjectId createdBy FK "ref: USER"
    }

    ATTENDANCE {
      ObjectId _id PK
      ObjectId user FK "ref: USER"
      date date "YYYY-MM-DD"
      datetime checkIn
      datetime checkOut
      string status "Present | Absent | Half-Day | OnLeave"
      string notes
      number lat
      number lng
      string deviceMeta
    }

    LEAVE {
      ObjectId _id PK
      ObjectId user FK "ref: USER"
      string type "Sick | Casual | Earned | Unpaid | Other"
      date startDate
      date endDate
      number days
      string reason
      string status "Pending | Approved | Rejected"
      ObjectId approver FK "ref: USER"
      datetime decisionAt
      string comment
    }

    SALARY {
      ObjectId _id PK
      ObjectId user FK "ref: USER"
      string month "YYYY-MM"
      number basic
      number hra
      number allowance
      number deductions
      number net
      string status "Pending | Processed | Paid"
      ObjectId processedBy FK "ref: USER"
      datetime processedAt
      string paymentRef
      string notes
    }

    TASK {
      ObjectId _id PK
      string title
      string description
      ObjectId assignee FK "ref: USER"
      ObjectId reporter FK "ref: USER"
      string status "Open | In Progress | Blocked | Done"
      string priority "Low | Medium | High | Critical"
      date startDate
      date dueDate
      string[] tags
    }

    PROJECT {
      ObjectId _id PK
      string name
      string code UK
      string description
      ObjectId owner FK "ref: USER"
      string status
      date startDate
      date endDate
    }

    NOTIFICATION {
      ObjectId _id PK
      ObjectId user FK "ref: USER"
      string title
      string message
      string type
      string category
      boolean isRead
      datetime createdAt
    }

    INVENTORY {
      ObjectId _id PK
      string itemCode UK
      string name
      string category
      number quantity
      string unit
      string location
      number minLevel
      string vendor
    }

    %% Relationships
    USER ||--o| EMPLOYEE : "has profile"
    USER ||--o{ ATTENDANCE : "marks"
    USER ||--o{ LEAVE : "requests"
    USER ||--o{ SALARY : "gets"
    USER ||--o{ TASK : "assigned"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ PROJECT : "owns (owner)"
    USER ||--o{ EMPLOYEE : "manages (manager)"
    USER ||--o{ LEAVE : "approves (approver)"
    USER ||--o{ SALARY : "processes (processedBy)"
    PROJECT ||--o{ TASK : "contains"
```

## How to view
- VS Code: install an extension like “Markdown Preview Mermaid Support”, then open `docs/erd.md` and preview.
- Online: copy the mermaid block into https://mermaid.live and render.
- GitHub/GitLab: many platforms render Mermaid in Markdown directly.
