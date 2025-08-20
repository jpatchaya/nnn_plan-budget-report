# Requirements Document

## Introduction

การออกแบบ UX/UI ใหม่สำหรับระบบแผนงาน งบประมาณ และการรายงานผลของกรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช ให้ครอบคลุมทุกฟีเจอร์ตาม TOR และปรับปรุงประสบการณ์การใช้งานให้ดีขึ้น โดยเน้นการใช้งานที่ง่าย เข้าใจง่าย และมีประสิทธิภาพสูง

## Requirements

### Requirement 1: ระบบการตั้งค่าข้อมูลหลัก (Master Data Management)

**User Story:** As a system administrator, I want to configure master data for budget planning, so that all departments can use standardized data for budget preparation.

#### Acceptance Criteria

1. WHEN accessing master data configuration THEN system SHALL display hierarchical data structure including strategic allocation, programs, ministry strategies, department strategies, service targets, outputs/projects, main activities, sub-activities, budget categories, expense types, items, and units
2. WHEN setting standard price criteria THEN system SHALL allow configuration of standard rates (e.g., government lecturer fee ≤ 600 baht, private lecturer fee ≤ 1,200 baht)
3. WHEN recording annual main activity details THEN system SHALL store complete activity information for the fiscal year
4. WHEN recording output/project details THEN system SHALL store comprehensive project information for the fiscal year
5. WHEN recording service target details THEN system SHALL store department service targets for the fiscal year
6. WHEN viewing data relationships THEN system SHALL display linkage between strategic allocation, programs, strategic targets, allocation policies, service targets, indicators, strategic issues, outputs/projects, main activities, and sub-activities
7. WHEN comparing budget data THEN system SHALL show comparison between current year and previous years at program-output-activity-item levels
8. WHEN generating reports THEN system SHALL export reports in Microsoft Word, Excel, or print format as specified by the department

### Requirement 2: ระบบการจัดทำคำของบประมาณ (Budget Request System)

**User Story:** As a department officer, I want to prepare budget requests for my department, so that I can submit accurate budget proposals for approval.

#### Acceptance Criteria

1. WHEN creating budget requests THEN system SHALL allow recording of annual budget expenditure requests for departments (bureaus/divisions/centers/groups)
2. WHEN processing budget data THEN system SHALL calculate and validate budget amounts for each department and allow internal adjustments
3. WHEN submitting budget requests THEN system SHALL send approved budget requests to Planning and Information Bureau and lock data from further editing after confirmation
4. WHEN monitoring submissions THEN Planning and Information Bureau SHALL be able to track and receive requests from all departments
5. WHEN reviewing submissions THEN system SHALL allow Planning and Information Bureau to edit or return incorrect budget requests to originating departments
6. WHEN consolidating requests THEN system SHALL process all department requests into a comprehensive department-wide budget request
7. WHEN recording minimum expenses THEN system SHALL store department minimum expense requirements
8. WHEN tracking budget adjustments THEN system SHALL record budget reductions through various approval stages (management, Budget Bureau, Cabinet, committees, Parliament)
9. WHEN recording final approval THEN system SHALL store approved budget act results for use in work plan preparation
10. WHEN generating reports THEN system SHALL export budget request reports in specified formats

### Requirement 3: ระบบการจัดทำแผนปฏิบัติงานและแผนการใช้จ่ายเงิน (Work Plan and Expenditure Plan System)

**User Story:** As a department officer, I want to create work plans and expenditure plans based on approved budgets, so that I can effectively manage budget execution throughout the year.

#### Acceptance Criteria

1. WHEN linking approved budgets THEN system SHALL connect approved annual budget expenditure data as baseline for work plan and expenditure plan preparation
2. WHEN creating plans THEN departments SHALL be able to record and edit their work plans and expenditure plans on monthly or quarterly basis
3. WHEN validating amounts THEN system SHALL lock budget amounts for each activity to prevent planning beyond allocated budget
4. WHEN consolidating plans THEN system SHALL compile and validate work plans and expenditure plans for each department
5. WHEN submitting plans THEN system SHALL send approved plans to Planning and Information Bureau and lock data after confirmation
6. WHEN processing submissions THEN Planning and Information Bureau SHALL receive, validate, and process data from all departments into comprehensive department-wide plans
7. WHEN finding errors THEN system SHALL allow returning incorrect plans to originating departments for correction
8. WHEN generating standard reports THEN system SHALL print reports in formats สงป.301, 302, 302-1, 302-2, 302-3 and อส.101, 102, 103, 104
9. WHEN exporting data THEN system SHALL generate reports in Microsoft Word, Excel, or print format

### Requirement 4: ระบบการจัดสรรกรอบวงเงินงบประมาณ (Budget Allocation Framework System)

**User Story:** As a budget administrator, I want to allocate budget framework amounts, so that departments can execute their approved budgets within allocated limits.

#### Acceptance Criteria

1. WHEN linking work plans THEN system SHALL connect work plan and expenditure plan data as baseline for budget framework allocation
2. WHEN recording allocations THEN system SHALL allow recording, validation, and editing of annual budget framework allocation as approved by Budget Bureau
3. WHEN recording periodic approvals THEN system SHALL store periodic budget release approvals from Budget Bureau for use in expenditure tracking
4. WHEN generating reports THEN system SHALL export allocation reports in specified formats

### Requirement 5: ระบบการโอนเปลี่ยนแปลงเงินงบประมาณ (Budget Transfer and Modification System)

**User Story:** As a department officer, I want to transfer and modify budget allocations, so that I can adjust budget distribution according to operational needs.

#### Acceptance Criteria

1. WHEN linking approved budgets THEN system SHALL connect approved annual budget expenditure data as baseline for budget transfers
2. WHEN recording transfers THEN system SHALL allow departments to record budget transfer and modification data
3. WHEN validating transfers THEN system SHALL allow validation and editing of budget transfers before recording approval
4. WHEN generating reports THEN system SHALL export transfer reports in specified formats

### Requirement 6: ระบบงานการนำเข้าข้อมูลแผนปฏิบัติงานและแผนการใช้จ่ายเงินประจำปี (Budget Data Import System)

**User Story:** As a system administrator, I want to import approved budget data, so that departments can use it as baseline for their work plans and expenditure plans.

#### Acceptance Criteria

1. WHEN importing budget data THEN system SHALL import approved annual budget expenditure data from Budget Act 2025-2026 for use in work plan and expenditure plan preparation
2. WHEN confirming import THEN system SHALL send approved budget data to departments for work plan and expenditure plan preparation
3. WHEN protecting data integrity THEN system SHALL lock budget amounts for each activity to prevent departments from exceeding approved budget allocations

### Requirement 7: ระบบรายงานผลการดำเนินงานโครงการ (Project Performance Reporting System)

**User Story:** As a department officer, I want to report project performance and expenditure results, so that management can track progress and budget utilization.

#### Acceptance Criteria

1. WHEN linking baseline data THEN system SHALL connect work plan and expenditure plan data as baseline for performance and expenditure reporting
2. WHEN recording performance THEN departments SHALL be able to record performance reports and expenditure reports
3. WHEN submitting reports THEN system SHALL send performance and expenditure reports to Planning and Information Bureau
4. WHEN processing reports THEN Planning and Information Bureau SHALL receive, validate, and process data from all departments into comprehensive department-wide reports
5. WHEN generating reports THEN system SHALL export performance reports in specified formats

### Requirement 8: ระบบการเชื่อมโยงข้อมูลบุคลากรและหน่วยงาน (DPIS Integration System)

**User Story:** As a system administrator, I want to integrate personnel and organizational data from DPIS, so that the system can use current organizational structure and personnel information.

#### Acceptance Criteria

1. WHEN connecting to DPIS THEN system SHALL link personnel data (name, surname, position, affiliation) from Department Personnel Information System (DPIS)
2. WHEN updating personnel THEN system SHALL update personnel data for new hires, resignations, or transfers from DPIS
3. WHEN linking organizational structure THEN system SHALL connect organizational structure data from DPIS for use in budget planning and reporting
4. WHEN handling structure gaps THEN system SHALL provide organizational structure management for units not covered by DPIS
5. WHEN managing organizational changes THEN system SHALL handle addition, cancellation, name changes, or affiliation transfers of organizational units

### Requirement 9: ระบบการบริหารจัดการผู้ใช้งาน (User Management System)

**User Story:** As a system administrator, I want to manage user access and permissions, so that users can access appropriate system functions based on their roles and organizational affiliation.

#### Acceptance Criteria

1. WHEN setting permissions THEN system SHALL allow configuration of access rights for different user groups and system modules
2. WHEN defining data access THEN system SHALL restrict department staff to view only their own department data, while Planning and Information Bureau staff with appropriate rights can view department-wide data
3. WHEN managing users THEN system SHALL allow adding or removing users within each department
4. WHEN displaying user lists THEN system SHALL show and verify system user accounts
5. WHEN showing active users THEN system SHALL display current system users including username, department, IP address, login date and time
6. WHEN tracking usage THEN system SHALL maintain usage history including username, department, IP address, login/logout dates and times
7. WHEN logging changes THEN system SHALL store history of user data modifications
8. WHEN handling external users THEN system SHALL support user management for external personnel not in DPIS (e.g., TOR contractors)
9. WHEN enforcing password policy THEN system SHALL implement password requirements according to department information security policy and track password change history

### Requirement 10: ระบบรักษาความปลอดภัยและการยืนยันตัวตน (Security and Authentication System)

**User Story:** As a system user, I want secure authentication options, so that I can safely access the system while protecting sensitive budget information.

#### Acceptance Criteria

1. WHEN attempting login THEN system SHALL limit number of failed login attempts
2. WHEN using multi-factor authentication THEN system SHALL support Multi-Factor Authentication (MFA) for enhanced security
3. WHEN using ThaID THEN system SHALL support ThaID authentication for system access
4. WHEN handling concurrent users THEN system SHALL support at least 1,000 concurrent users
5. WHEN logging activities THEN system SHALL maintain audit logs, administrator/operator logs, and application logs
6. WHEN backing up data THEN system SHALL perform automatic data backup at scheduled intervals with verification
7. WHEN testing security THEN system SHALL undergo penetration testing by independent security experts

### Requirement 11: การออกแบบ UX/UI ที่ทันสมัยและใช้งานง่าย (Modern and User-Friendly UX/UI Design)

**User Story:** As a system user, I want an intuitive and modern interface, so that I can efficiently complete my budget-related tasks without confusion.

#### Acceptance Criteria

1. WHEN accessing the system THEN interface SHALL use modern, clean design principles with consistent visual hierarchy
2. WHEN navigating THEN system SHALL provide clear navigation structure with breadcrumbs and logical menu organization
3. WHEN using forms THEN system SHALL implement progressive disclosure, smart defaults, and inline validation
4. WHEN viewing data THEN system SHALL use responsive tables, charts, and dashboards optimized for different screen sizes
5. WHEN performing actions THEN system SHALL provide clear feedback, loading states, and confirmation dialogs
6. WHEN encountering errors THEN system SHALL display helpful error messages with suggested solutions
7. WHEN using mobile devices THEN system SHALL provide responsive design that works effectively on tablets and smartphones
8. WHEN accessing help THEN system SHALL provide contextual help, tooltips, and user guidance
9. WHEN customizing interface THEN system SHALL allow users to personalize dashboard and frequently used functions
10. WHEN ensuring accessibility THEN system SHALL comply with WCAG 2.1 AA accessibility standards

### Requirement 12: ระบบรายงานและการส่งออกข้อมูล (Reporting and Data Export System)

**User Story:** As a manager, I want comprehensive reporting capabilities, so that I can analyze budget performance and make informed decisions.

#### Acceptance Criteria

1. WHEN generating reports THEN system SHALL provide pre-defined report templates for all required government forms
2. WHEN customizing reports THEN system SHALL allow users to create custom reports with filtering, grouping, and sorting options
3. WHEN exporting data THEN system SHALL support export to Microsoft Excel, Word, PDF, and CSV formats
4. WHEN scheduling reports THEN system SHALL allow automated report generation and distribution
5. WHEN viewing dashboards THEN system SHALL provide interactive dashboards with drill-down capabilities
6. WHEN comparing data THEN system SHALL provide year-over-year and period-over-period comparison views
7. WHEN printing reports THEN system SHALL ensure proper formatting for official document printing
8. WHEN sharing reports THEN system SHALL provide secure report sharing with appropriate access controls