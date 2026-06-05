
================================================================================
          MCPD UNIVERSITY
          Department of Computer Science & Applications
================================================================================

           PROJECT REPORT

       Submitted in partial fulfilment of the requirements for the degree of

                  MASTER OF COMPUTER APPLICATIONS (MCA)

                              ON THE PROJECT

       "EduNova — IT Coaching Institute Management System"

--------------------------------------------------------------------------------

  Submitted By:
  Name           :  Sujal Kumar
  University Roll No. :  2432027
  Programme      :  MCA (Final Year)
  Batch          :  2024–2026

  Under the Supervision of:
  Guide Name     :  Mr. Rakesh Kumar
  Designation    :  Assistant Professor
  Department     :  Computer Science & Applications

================================================================================
                        MCPD UNIVERSITY
                        Year: 2026
================================================================================



================================================================================
CERTIFICATE
================================================================================

This is to certify that the project titled "EduNova — IT Coaching Institute
Management System" is a bonafide work carried out by Sujal Kumar
(University Roll No. 2432027) in partial fulfilment of the requirements for
the award of the degree of Master of Computer Applications (MCA) from
GGNIMT College, Ludhiana.

This project has been completed under my supervision and guidance and has
not been submitted for the award of any other degree or diploma at this
or any other institution.

Date: _______________

Place: _______________


Supervisor:                               Head of Department:
Mr. Rakesh Kumar                          ___________________
Assistant Professor                       Department of Computer Science
Dept. of Computer Science & Applications  GGNIMT College, Ludhiana
GGNIMT College, Ludhiana



================================================================================
DECLARATION
================================================================================

I, Sujal Kumar, Roll No. 2432027, student of Master of Computer Applications
(MCA), Final Year, GGNIMT College, Ludhiana, hereby declare that the project report
entitled "EduNova — IT Coaching Institute Management System" submitted by me
is an original work done by me under the guidance of Mr. Rakesh Kumar,
Assistant Professor, Department of Computer Science & Applications.

I further declare that this project work has not been submitted for the award
of any degree or diploma from any other university or institution.

Date: _______________

Place: _______________


Sujal Kumar
Roll No.: 2432027
MCA Final Year
GGNIMT College, Ludhiana



================================================================================
ACKNOWLEDGEMENT
================================================================================

I would like to express my sincere gratitude and heartfelt thanks to all those
who helped me in the successful completion of this project.

First and foremost, I am deeply grateful to my project guide, Mr. Rakesh Kumar,
Assistant Professor, Department of Computer Science & Applications, MCPD
University, for his invaluable guidance, continuous support, constructive
suggestions, and constant encouragement throughout the development of this
project. His expertise and insights have been a guiding light during the entire
project duration.

I also extend my sincere thanks to the Head of the Department of Computer
Science & Applications, GGNIMT College, Ludhiana, for providing the necessary
infrastructure and academic support.

I am grateful to all the faculty members of the department for their
encouragement and academic support throughout my MCA programme.

I would also like to thank my family and friends for their moral support,
patience, and motivation during the completion of this project.

Finally, I extend my gratitude to the developers of the open-source tools and
frameworks — FastAPI, Python, AWS (DynamoDB, EC2, CloudFront), and Razorpay —
whose platforms formed the technical backbone of this project.

Sujal Kumar
Roll No.: 2432027
GGNIMT College, Ludhiana



================================================================================
ABSTRACT
================================================================================

EduNova is a full-stack web-based IT Coaching Institute Management System
designed to automate and streamline the administrative and financial operations
of a coaching institute. The system replaces manual, paper-based record keeping
with a centralized, secure, cloud-hosted digital platform.

The application covers the complete student lifecycle — from admission and
course enrollment to fee collection, due tracking, clearance certification, and
passout. Key modules include: Student Management, Course & Fee Structure
Management, Fee Collection (Cash, Demand Draft, and Online via Razorpay),
Dues & Defaulter Tracking, Reminder Scheduling, Financial Reports, and
Role-based User Management.

The backend is built using Python FastAPI, providing a RESTful API architecture
with JWT-based authentication. Data is stored on AWS DynamoDB (NoSQL), ensuring
scalability and high availability. The frontend is a single-page application
(SPA) built with vanilla HTML, CSS, and JavaScript, served via AWS CloudFront
CDN for fast global delivery. The server runs on an AWS EC2 instance in the
ap-south-1 (Mumbai) region.

The system integrates Razorpay Payment Gateway for secure online fee collection,
and Twilio WhatsApp API for OTP-based password reset. A PDF receipt is generated
automatically after every payment.

EduNova significantly reduces administrative workload, eliminates fee record
discrepancies, and gives the institute real-time visibility into student dues,
monthly collections, and course-wise revenue — all from any device with a
browser.

Keywords: Coaching Institute Management, Fee Management System, FastAPI,
AWS DynamoDB, Razorpay, Cloud Deployment, MCA Project



================================================================================
TABLE OF CONTENTS
================================================================================

Chapter 1  — Introduction
Chapter 2  — Objectives
Chapter 3  — System Analysis
Chapter 4  — System Design
Chapter 5  — Implementation
Chapter 6  — Testing
Chapter 7  — Conclusion & Future Scope
              References



================================================================================
CHAPTER 1 — INTRODUCTION
================================================================================

1.1 Background
--------------
Educational institutes, particularly private coaching centres, handle a large
volume of administrative tasks daily — managing student admissions, tracking
fee payments, issuing clearance certificates, and following up with fee
defaulters. In most small and mid-sized institutes, these processes are still
managed manually using registers, spreadsheets, or disconnected local software.

Manual systems suffer from several drawbacks:
  - Fee records are prone to human error and data loss
  - No centralised view of dues across all students
  - Fee receipts are written by hand and difficult to retrieve
  - No easy way to track which students are on break, have left, or have
    completed their course
  - Generating monthly reports requires significant manual effort

EduNova was conceived to solve these problems by providing a single, web-based
platform that automates all these tasks and makes them accessible from any
device.

1.2 Project Overview
--------------------
EduNova is an IT Coaching Institute Management System built as a cloud-hosted
web application. It is designed specifically for small to mid-sized coaching
institutes offering computer courses such as BCA, MCA, DCA, PGDCA, and related
programmes.

The system provides two categories of users:
  - Admin: Full access to all modules — student management, fee collection,
    course setup, reports, user management, and settings.
  - Staff: Access to student records, fee collection, and dues.

The application operates entirely through a web browser — no installation is
required on the user's device.

1.3 Technology Stack
--------------------
  Backend   : Python 3.11, FastAPI (REST API framework)
  Database  : AWS DynamoDB (NoSQL, serverless)
  Frontend  : HTML5, CSS3, Vanilla JavaScript (Single Page Application)
  Hosting   : AWS EC2 (ap-south-1, Mumbai region)
  CDN       : AWS CloudFront (global content delivery)
  Payments  : Razorpay Payment Gateway (test + live mode)
  OTP/Auth  : Twilio WhatsApp API (password reset via WhatsApp OTP)
  Auth      : JWT (JSON Web Tokens) — Bearer token in sessionStorage
  PDF       : Browser-native print-to-PDF for fee receipts

1.4 Scope of the Project
------------------------
The scope of EduNova covers:
  - Registration and management of students and their course enrollments
  - Automated fee installment scheduling based on course duration and fee type
  - Collection of fees via Cash, DD, and Razorpay (online)
  - Automatic due calculation and defaulter identification
  - Clearance certificate generation for eligible students
  - Monthly and yearly financial report generation
  - Reminder scheduling for fee follow-up
  - Role-based access for admin and staff users
  - WhatsApp OTP-based secure password reset



================================================================================
CHAPTER 2 — OBJECTIVES
================================================================================

The primary objectives of the EduNova project are as follows:

2.1 Core Objectives
-------------------
1. Digitise Student Records
   Replace paper-based student registers with a searchable, filterable digital
   database containing complete student profiles including personal information,
   course enrollment, fee history, and current status.

2. Automate Fee Installment Scheduling
   Automatically generate monthly or yearly installment schedules at the time
   of student admission based on the course fee structure, so staff never need
   to manually calculate due dates.

3. Enable Multi-Mode Fee Collection
   Allow institute staff to record fee payments made in Cash, Demand Draft
   (DD), or Online (Razorpay) — all from a single interface — and generate a
   professional printed receipt instantly.

4. Track Outstanding Dues in Real Time
   Provide a live dashboard showing which students have pending dues, how much
   is owed, and how overdue the payments are, so the institute can follow up
   proactively.

5. Identify and Manage Defaulters
   Automatically flag students who have been overdue for 2 or more months
   as serious defaulters, with their contact details visible for follow-up.

6. Reminder Scheduling
   Allow staff to set payment reminders against specific students with a
   promise amount and a follow-up date, so no follow-up is missed.

7. Generate Financial Reports
   Provide monthly collection summaries, course-wise revenue breakdown, and
   year-wise admission trends — all exportable as CSV files.

8. Clearance Certificate Management
   Allow the institute to mark students as cleared (all dues paid) and generate
   a printable clearance certificate.

9. Secure, Role-Based Access
   Ensure that sensitive operations (user management, fee structure changes) are
   restricted to admin users, while staff users have appropriate read/write
   access to operational data.

10. Cloud Deployment for Anywhere Access
    Host the application on AWS so that authorised staff can access it from any
    device (desktop, tablet, mobile) without installing any software.

2.2 Secondary Objectives
------------------------
- Provide a fast, responsive user interface that works well on both desktop and
  mobile screens.
- Send WhatsApp OTP messages for secure, self-service password reset.
- Export all major data sets (students, payments, reports) as CSV for
  offline analysis.
- Maintain a complete audit trail of all payments against each student.



================================================================================
CHAPTER 3 — SYSTEM ANALYSIS
================================================================================

3.1 Existing System
-------------------
The existing system at most small coaching institutes relies on:
  - Handwritten admission registers
  - Manual fee receipt books
  - Excel spreadsheets for tracking dues
  - No centralised storage — data spread across files, books, and individual
    staff members' computers

Problems with the Existing System:
  - Data loss risk due to physical damage or hardware failure
  - Duplicate or missing fee entries due to manual handling
  - No real-time view of who has paid and who has not
  - Generating a monthly collection report takes hours of manual effort
  - No way to track student status (studying / on break / left / passout)
  - Fee receipts are handwritten and cannot be reprinted if lost

3.2 Proposed System
-------------------
EduNova proposes a web-based, cloud-hosted management system that addresses
all the above problems:

  - Centralised cloud database (AWS DynamoDB) — no data loss, accessible
    from anywhere
  - Automated fee calculations — no manual math required
  - Real-time dashboard with today's collection, monthly collection, and
    due student count
  - One-click fee collection with automatic receipt generation
  - Defaulter tracking with escalation after 2+ months overdue
  - CSV exports for all reports
  - WhatsApp OTP for secure password management

3.3 Feasibility Study
---------------------

3.3.1 Technical Feasibility
  The project uses mature, production-ready technologies:
  - Python FastAPI is widely used for building scalable REST APIs
  - AWS DynamoDB offers serverless, auto-scaling NoSQL storage
  - AWS EC2 provides reliable, configurable virtual server hosting
  - AWS CloudFront ensures fast page load times via CDN caching
  - Razorpay is a leading Indian payment gateway with full test mode support
  All these technologies are well-documented, actively maintained, and
  supported by large developer communities. The project is technically feasible.

3.3.2 Economic Feasibility
  AWS Free Tier covers EC2 (t2.micro), DynamoDB (25 GB, 25 read/write units),
  and CloudFront (1 TB transfer) — making initial deployment near-zero cost.
  Razorpay charges 2% per online transaction with no monthly fee.
  The system eliminates the need for manual staff time spent on record keeping,
  which represents a significant cost saving for the institute.

3.3.3 Operational Feasibility
  The system is designed with a simple, intuitive interface requiring minimal
  training. Any staff member familiar with a web browser can operate it within
  a few hours. The admin panel for settings and user management is separate,
  reducing the risk of accidental configuration changes by staff.

3.4 Requirements Analysis
--------------------------

3.4.1 Functional Requirements
  FR-01  The system shall allow admin to add, edit, and manage student records.
  FR-02  The system shall generate installment schedules on student admission.
  FR-03  The system shall allow fee collection via Cash, DD, and Razorpay.
  FR-04  The system shall generate and print a fee receipt after payment.
  FR-05  The system shall display all students with outstanding dues.
  FR-06  The system shall flag students overdue by 2+ months as defaulters.
  FR-07  The system shall allow staff to set payment reminders with dates.
  FR-08  The system shall generate monthly and yearly financial reports.
  FR-09  The system shall allow export of students and payments as CSV.
  FR-10  The system shall support role-based login (Admin / Staff).
  FR-11  The system shall allow password reset via WhatsApp OTP.
  FR-12  The system shall generate clearance certificates for cleared students.
  FR-13  The system shall support updating student status (Studying / Break /
         Left / Passout).

3.4.2 Non-Functional Requirements
  NFR-01  Security  : All API endpoints require JWT Bearer token authentication.
  NFR-02  Performance : API response time must be under 2 seconds for all
          standard operations.
  NFR-03  Availability : System must be available 99% of the time (AWS SLA).
  NFR-04  Scalability : DynamoDB auto-scales with data volume.
  NFR-05  Usability : Interface must be usable without prior technical training.
  NFR-06  Portability : Application must work on any modern browser without
          installation.

3.5 Data Flow Diagram (DFD)
-----------------------------

Level 0 — Context Diagram:

  [Admin/Staff] ---login/token---> [EduNova System] <---fees--- [Razorpay]
                <--dashboard/reports--                --->OTP--- [Twilio WA]
                                        |
                                   [DynamoDB]

Level 1 — Main Processes:
  P1: Authentication (Login, JWT Issue, OTP Reset)
  P2: Student Management (Add / Edit / Status Change / Search)
  P3: Course Management (Add / Edit / Fee Structure)
  P4: Fee Collection (Cash / DD / Online → Receipt)
  P5: Dues & Defaulters (Scan overdue installments)
  P6: Reminders (Create / Reschedule / Mark Done)
  P7: Reports (Monthly collections, Course-wise, Admissions)
  P8: Clearance (Check dues cleared → Issue certificate)
  P9: User Management (Add/Edit admin and staff accounts)



================================================================================
CHAPTER 4 — SYSTEM DESIGN
================================================================================

4.1 Architecture Overview
--------------------------
EduNova follows a three-tier architecture:

  Tier 1 — Presentation Layer (Frontend)
    Single-Page Application (SPA) built with HTML, CSS, and JavaScript.
    Served via AWS CloudFront CDN. Communicates with the backend exclusively
    through REST API calls using fetch() with JWT Bearer tokens.

  Tier 2 — Application Layer (Backend)
    Python FastAPI application running on AWS EC2 (ap-south-1).
    Exposes 25+ RESTful API endpoints grouped into routers:
    auth, students, courses, payments, dues, defaulters, reminders,
    reports, clearance, dashboard, admin, users.

  Tier 3 — Data Layer (Database)
    AWS DynamoDB — single-table design with PK/SK (partition/sort key) pattern.
    GSI (Global Secondary Index) used for cross-entity queries.

4.2 Database Design — DynamoDB Single Table
--------------------------------------------
Table Name: clerk_app

Entity         PK                  SK            GSI1_PK         GSI1_SK
----------     ----------------    ----------    -------------   ----------------
Student        STUDENT#{id}        #META         ALL#STUDENTS    STUDENT#{id}
Payment        STUDENT#{id}        PAYMENT#{id}  ALL#PAYMENTS    {date}#{id}
Course         COURSE#{code}       #META         ALL#COURSES     COURSE#{code}
User           USER#{username}     #META         ALL#USERS       USER#{username}
Reminder       REMINDER#{id}       #META         ALL#REMINDERS   REMINDER#{date}#{id}

Key Student Fields:
  id, name, course, feeType (monthly/yearly), status (studying/break/left/passout),
  totalFees, paid, due, waiverAmount, installments[], admissionDate,
  contact, fatherName, fatherMobile, aadhaar, dob, address, photo

Key Payment Fields:
  txnId, studentId, studentName, course, amount, method, date,
  displayTime, status (Paid), online (razorpayData if online payment)

Key Installment Schema (embedded in Student):
  { num, amount, dueDate, paid, partial, paidAmount, paidDate }

4.3 API Design
--------------

Base URL: https://d1k9o742oz00mf.cloudfront.net/api

Authentication Routes (/api/auth):
  POST   /login          — Username/password login, returns JWT token
  POST   /forgot         — Send WhatsApp OTP for password reset
  POST   /verify-otp     — Verify OTP, allow password change
  GET    /me             — Get current logged-in user info

Student Routes (/api/students):
  GET    /               — List all students
  POST   /               — Add new student
  GET    /{id}           — Get student by ID
  PUT    /{id}           — Update student details
  PUT    /{id}/status    — Change student status (break/left/passout)
  DELETE /{id}           — Delete student

Course Routes (/api/courses):
  GET    /               — List all courses
  POST   /               — Add new course
  PUT    /{code}         — Update course details
  PUT    /{code}/fee-structure — Update monthly/yearly fee

Payment Routes (/api/payments):
  GET    /               — List all payments
  POST   /               — Record new payment (Cash/DD/Online)
  GET    /student/{id}   — Get payments for a specific student
  GET    /razorpay-key   — Return Razorpay key_id for frontend checkout

Dues Route (/api/dues):
  GET    /               — List all students with outstanding dues

Defaulters Route (/api/defaulters):
  GET    /               — List students overdue 1+ month (escalated after 3)

Reminders Routes (/api/reminders):
  GET    /               — List active reminders
  POST   /               — Create new reminder
  PUT    /{id}/done      — Mark reminder as done
  PUT    /{id}/reschedule — Reschedule reminder date

Reports Route (/api/reports):
  GET    /               — Financial summary + monthly admissions + course-wise

Clearance Routes (/api/clearance):
  GET    /               — List clearance records
  POST   /               — Issue clearance for student

Dashboard Route (/api/dashboard):
  GET    /               — Today's collection, this month, due count, recent txns

4.4 Frontend Module Design
---------------------------
The SPA is structured as separate JS modules loaded in order:

  data.js        — Global state: STUDENTS, COURSES, PAYMENTS arrays
  auth.js        — Login, forgot password, OTP verification
  router.js      — Page routing (hash-based navigation)
  utils.js       — Utility functions: api(), fmtDate(), numberToWords()
  dashboard.js   — Dashboard charts and summary cards
  students.js    — Student list, search, filter, status badges, CSV export
  students-form.js — Add/Edit student form with validation
  payments.js    — Fee collection modal (Cash/DD/Razorpay), receipt, export
  dues.js        — Dues page with overdue highlighting and course filter
  reminders.js   — Reminder creation, done, reschedule
  reports.js     — Charts (Chart.js), course-wise table, defaulters list
  admin.js       — Course management, fee structure editor
  clearance.js   — Clearance certificate generation
  settings.js    — Institute settings, user management
  app.js         — App initialisation, navigation event handlers

4.5 Security Design
--------------------
  - All API routes (except /login, /forgot, /verify-otp) require a valid
    JWT Bearer token in the Authorization header.
  - JWT tokens expire after 8 hours and are stored in sessionStorage
    (cleared when the browser tab is closed).
  - Passwords are hashed with bcrypt before storage.
  - CORS is configured to allow only the specific frontend domain.
  - Razorpay key_secret is stored only in the backend .env file and never
    exposed to the frontend; only key_id is returned via the API.
  - WhatsApp OTP is valid for 10 minutes and single-use.

4.6 UI/UX Design
-----------------
  - Clean, minimal dashboard inspired by modern SaaS admin panels
  - Color scheme: blue primary (#2563eb), green for paid/success,
    red for due/danger, amber for warnings
  - Responsive layout — sidebar collapses on smaller screens
  - All modals use the same backdrop + card pattern for consistency
  - Status badges (Studying, On Break, Left, Passout) color-coded
  - Payment receipt styled as a formal, printable A4 document with
    institute logo, student details, fee table, and progress bar



================================================================================
CHAPTER 5 — IMPLEMENTATION
================================================================================

5.1 Development Environment
-----------------------------
  Operating System : Windows 11
  Code Editor      : Visual Studio Code
  Backend Runtime  : Python 3.11
  Package Manager  : pip
  API Testing      : FastAPI Swagger UI (/docs)
  Version Control  : Git
  Deployment       : AWS EC2 (Amazon Linux 2023), systemd service
  Database         : AWS DynamoDB (ap-south-1)
  CDN              : AWS CloudFront

5.2 Key Libraries & Dependencies
----------------------------------
Backend (requirements.txt):
  fastapi          — Web framework and REST API engine
  uvicorn          — ASGI server to run FastAPI
  python-dotenv    — Load environment variables from .env file
  pydantic         — Data validation and serialisation for API models
  boto3            — AWS SDK for Python (DynamoDB access)
  python-jose      — JWT token creation and verification
  bcrypt           — Password hashing
  twilio           — WhatsApp OTP integration

Frontend (CDN links):
  Chart.js         — Bar/line charts on dashboard and reports
  jsPDF            — (Available) PDF generation support
  Razorpay         — checkout.js for online payment popup

5.3 Module Implementation Details
-----------------------------------

5.3.1 Student Admission Module
  When a student is admitted:
  1. Staff fills the Add Student form (name, course, fee type, admission date,
     contact, father's name, waiver amount, etc.)
  2. Backend fetches the course fee structure (monthly_fee or yearly_fee).
  3. Installment schedule is auto-generated:
     - Monthly: one installment per month for the course duration
     - Yearly: one installment per year
  4. Student record is saved to DynamoDB with status = "studying",
     paid = 0, due = totalFees - waiverAmount.

5.3.2 Fee Collection Module
  Three payment modes are supported:
  a) Cash / DD:
     - Staff opens the fee modal, selects Cash or DD, enters amount and date.
     - Backend updates student's paid/due fields and marks installments.
     - A professional PDF receipt is generated and shown for printing.
  b) Online (Razorpay):
     - Staff opens the fee modal, selects Online tab, enters amount.
     - Frontend fetches Razorpay key_id from /api/payments/razorpay-key.
     - Razorpay checkout popup opens in-browser.
     - On successful payment, Razorpay calls the handler with payment_id.
     - Frontend posts payment record to backend with razorpayData.
     - Receipt is generated automatically.

5.3.3 Dues & Defaulters Module
  - /api/dues scans all student records and returns those with due > 0,
    sorted by highest outstanding balance. Includes next unpaid installment
    date and isOverdue flag.
  - /api/defaulters returns students overdue by 1+ month, with isEscalated
    flag set after 3 months. Students with status "left" or "passout" are
    excluded.

5.3.4 Reminders Module
  - Staff can set a reminder against any student with a date, optional promise
    amount, and a note.
  - Reminders past their date are automatically escalated (status: escalated)
    when the list is fetched.
  - Staff can mark reminders as done or reschedule them.

5.3.5 Reports Module
  The reports page shows:
  - This month's and last month's total collection
  - Total collected vs total outstanding (all time)
  - Monthly admission trend bar chart (by year)
  - Course-wise student count and total collected table
  - Top 20 serious defaulters list
  All data is fetched from a single /api/reports endpoint.

5.3.6 Authentication & Password Reset
  - Login: username + password → bcrypt verify → issue JWT (8hr expiry)
  - Forgot Password:
    1. User enters username
    2. Backend finds user's registered WhatsApp number
    3. Twilio sends 6-digit OTP via WhatsApp
    4. User enters OTP → backend verifies → allows password change

5.4 Deployment on AWS
-----------------------
  Step 1: EC2 Setup
    - t2.micro instance, Amazon Linux 2023, ap-south-1 region
    - SSH access via .pem key pair
    - Port 80 (HTTP) and 443 (HTTPS) opened in Security Group

  Step 2: Application Setup on EC2
    - Python 3.11 installed, virtual environment created
    - FastAPI app started via uvicorn on port 8000
    - systemd service (clerk.service) created for auto-restart on reboot

  Step 3: CloudFront Distribution
    - CloudFront distribution created with EC2 as origin
    - All frontend assets (HTML, JS, CSS) cached at CDN edge locations
    - Cache invalidation run after every deployment: aws cloudfront
      create-invalidation --paths "/*"

  Step 4: DynamoDB
    - Table clerk_app created in ap-south-1
    - GSI (GSI1) created for cross-entity scans
    - IAM role attached to EC2 for DynamoDB access (no hardcoded credentials)



================================================================================
CHAPTER 6 — TESTING
================================================================================

6.1 Testing Approach
---------------------
The project was tested using a combination of:
  - Manual functional testing via the browser UI
  - API testing via FastAPI Swagger UI (/docs endpoint)
  - Integration testing with live AWS DynamoDB
  - Payment flow testing using Razorpay Test Mode

6.2 Unit Testing — Backend API Endpoints
-----------------------------------------

Test Case ID  Module         Test Input              Expected Result          Status
-----------   ----------     -------------------     ----------------------   ------
TC-01         Auth           Valid username/pass      JWT token returned       PASS
TC-02         Auth           Wrong password           401 Unauthorized         PASS
TC-03         Auth           Invalid JWT token        401 Invalid token        PASS
TC-04         Students       Valid student data       Student created          PASS
TC-05         Students       Missing required field   422 Validation error     PASS
TC-06         Students       Duplicate roll number    Student created (auto)   PASS
TC-07         Courses        Valid course + fees      Course saved             PASS
TC-08         Payments       Cash payment < due       Payment recorded         PASS
TC-09         Payments       Amount > due             400 Invalid amount       PASS
TC-10         Payments       Invalid student ID       404 Not found            PASS
TC-11         Dues           Students with due > 0    Correct list returned    PASS
TC-12         Dues           Cleared students         Not in list              PASS
TC-13         Defaulters     Student overdue 3+ mo    isEscalated = true       PASS
TC-14         Reminders      Create reminder          Reminder saved           PASS
TC-15         Reminders      Mark done                Status = done            PASS
TC-16         Reminders      Past date reminder       Status = escalated       PASS
TC-17         Reports        Year filter              Correct data returned    PASS
TC-18         Clearance      Student due = 0          Clearance issued         PASS
TC-19         Razorpay       Fetch key endpoint       key_id returned          PASS
TC-20         Dashboard      Load dashboard           All 5 fields returned    PASS

6.3 Integration Testing
------------------------

Test Scenario                                         Result
----------------------------------------------        ------
Student added → installments auto-generated           PASS
Fee collected → due updated → receipt printed         PASS
Online payment → Razorpay → backend recorded          PASS
Student status changed → excluded from defaulters     PASS
Reminder created → escalated after due date           PASS
OTP sent via WhatsApp → password reset completed      PASS
CSV export → downloaded with correct data             PASS
CloudFront cache invalidated → new JS served          PASS

6.4 User Interface Testing
---------------------------

Test                                    Browser         Result
-----------------------------------     ----------      ------
Login page loads correctly              Chrome 124      PASS
Dashboard cards show correct data       Chrome 124      PASS
Student search and filter works         Chrome 124      PASS
Fee modal opens with installments       Chrome 124      PASS
Razorpay tab switches correctly         Chrome 124      PASS
Receipt prints in correct format        Chrome 124      PASS
Reports charts render correctly         Chrome 124      PASS
Mobile responsive layout                Mobile Chrome   PASS

6.5 Security Testing
---------------------

Test                                         Result
---------------------------------------      ------
API call without token returns 401           PASS
API call with expired token returns 401      PASS
Razorpay secret not exposed to frontend      PASS
Password stored as bcrypt hash (not plain)   PASS
CORS blocks requests from unknown origins    PASS



================================================================================
CHAPTER 7 — CONCLUSION & FUTURE SCOPE
================================================================================

7.1 Conclusion
--------------
EduNova — IT Coaching Institute Management System has been successfully
designed, developed, and deployed as a cloud-hosted web application. The
project achieves all the objectives outlined in Chapter 2.

The system successfully:
  - Eliminates manual, paper-based fee records and replaces them with a
    secure, searchable, cloud-hosted digital database.
  - Automates installment scheduling, reducing administrative effort at
    the time of student admission.
  - Supports multi-mode fee collection (Cash, DD, Online) with instant
    receipt generation.
  - Provides real-time visibility into student dues, defaulters, and
    monthly financial performance.
  - Integrates Razorpay for secure online payment collection.
  - Uses WhatsApp OTP for a secure, user-friendly password reset flow.
  - Is deployed on AWS with high availability, scalability, and fast
    global access via CloudFront CDN.

The project demonstrates practical application of several technologies
studied in the MCA programme — web application development, RESTful API
design, cloud computing, NoSQL database design, payment gateway integration,
and software security principles.

During the development of this project, practical knowledge was gained in:
  - Designing a scalable single-table NoSQL schema for DynamoDB
  - Building and deploying a Python FastAPI application on AWS EC2
  - Integrating third-party services (Razorpay, Twilio) into a web application
  - Managing frontend state in a Vanilla JS Single Page Application
  - AWS CloudFront CDN configuration and cache invalidation

7.2 Future Scope
-----------------
The following enhancements can be added to EduNova in future versions:

1. Mobile Application
   A dedicated Android/iOS app built with Flutter or React Native for
   students to view their fee status and payment history.

2. SMS / Email Notifications
   Automated SMS and email alerts for upcoming due dates, payment
   confirmation, and clearance certificate issuance.

3. Student Self-Service Portal
   A student-facing login where students can view their own fee records,
   download receipts, and request clearance.

4. Biometric Attendance Integration
   Integration with a biometric device to record daily student attendance
   and link it to the fee management system.

5. AI-Based Defaulter Prediction
   A machine learning model that predicts which students are likely to
   become defaulters based on payment history patterns.

6. Multi-Branch Support
   Support for institutes with multiple branches, with a central admin
   view and branch-level staff access.

7. Tally / Accounting Integration
   Export financial data in a format compatible with Tally ERP for
   integrated accounting.

8. Government Scholarship Integration
   Track scholarship amounts and integrate them with fee calculations
   for government-sponsored students.



================================================================================
REFERENCES
================================================================================

1.  FastAPI Official Documentation — https://fastapi.tiangolo.com/
    Tiangolo (Sebastián Ramírez), 2024.

2.  AWS DynamoDB Developer Guide — Amazon Web Services Documentation.
    https://docs.aws.amazon.com/amazondynamodb/

3.  AWS EC2 User Guide — Amazon Web Services Documentation.
    https://docs.aws.amazon.com/ec2/

4.  AWS CloudFront Developer Guide — Amazon Web Services Documentation.
    https://docs.aws.amazon.com/cloudfront/

5.  Razorpay Developer Documentation — https://razorpay.com/docs/
    Razorpay Software Pvt. Ltd., 2024.

6.  Twilio WhatsApp API Documentation — https://www.twilio.com/docs/whatsapp
    Twilio Inc., 2024.

7.  Pydantic Documentation — https://docs.pydantic.dev/
    Pydantic, 2024.

8.  Chart.js Documentation — https://www.chartjs.org/docs/
    Chart.js Contributors, 2024.

9.  Python Official Documentation — https://docs.python.org/3.11/
    Python Software Foundation, 2024.

10. MDN Web Docs — HTML, CSS, JavaScript Reference.
    Mozilla Developer Network, 2024.
    https://developer.mozilla.org/

11. Pressman, R.S. (2014). Software Engineering: A Practitioner's Approach
    (8th ed.). McGraw-Hill Education.

12. Silberschatz, A., Korth, H., & Sudarshan, S. (2019). Database System
    Concepts (7th ed.). McGraw-Hill Education.

13. Sommerville, I. (2015). Software Engineering (10th ed.). Pearson.

14. boto3 Documentation — AWS SDK for Python.
    https://boto3.amazonaws.com/v1/documentation/api/latest/index.html

================================================================================
                          END OF REPORT
================================================================================
  Student Name    : Sujal Kumar
  Roll No.        : 2432027
  Programme       : MCA — Final Year
  Guide           : Mr. Rakesh Kumar
  University      : GGNIMT College, Ludhiana
  Project         : EduNova — IT Coaching Institute Management System
================================================================================
