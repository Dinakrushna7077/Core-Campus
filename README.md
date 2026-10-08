# 🎓 CoreCampus

### Smarter Campus | Connected Community | Better Tomorrow

🌐 **Live Demo:** [core-campus.app](https://core-campus.netlify.app/)

> **How Technology Simplifies Everyday Campus Life?**

CoreCampus is a **frontend-only campus management portal prototype** designed to simplify everyday campus activities by bringing important student, faculty, and administrator services into one unified platform.

The main focus of CoreCampus is to provide a **simple and centralized Help Desk and Complaint/Service Request system**, where students can report campus problems, requests can be reviewed and assigned to responsible workers, and the status can be updated for students.

---

## 📌 Problem Statement

### How Technology Simplifies Everyday Campus Life?

Students and faculty may face different day-to-day campus issues such as:

* Electrical problems
* Damaged equipment
* Wi-Fi or infrastructure requirements
* Gate pass requirements
* Hostel leave
* Emergency class leave
* Library services
* Canteen information
* Important campus announcements
* Attendance management

In many situations, these activities can become difficult to manage when there is no centralized platform.

### Main Problem

The primary problem addressed by CoreCampus is the **lack of a simple and centralized complaint/service-request workflow**.

For example, when a student faces an electrical problem, the student should be able to:

**Report the problem → Get it reviewed → Assign the responsible worker → Resolve the issue → Update the status**

CoreCampus provides a digital workflow for this process.

---

# 💡 Proposed Solution

CoreCampus provides a **role-based campus portal** for:

* 👨‍🎓 Students
* 👨‍🏫 Faculty
* 🛡️ Administrators

Each role has access to the functions relevant to its responsibilities.

The system brings different campus activities into one interface and provides clear workflows for requests, approvals, assignments, and updates.

---

# 👨‍🎓 Student Features

Students can access the following modules:

### 🛠️ Help Desk & Service Requests

Students can submit complaints or request new campus services.

A request can contain:

* Description
* Category
* Priority

  * Low
  * Medium
  * High

Students can also view the status of their requests.

### 🔔 Institute Notifications

Students can receive campus announcements and filter them by category.

Example categories:

* Academics
* Events
* Hostel
* Library

### 🚪 Gate Pass

Students can submit gate pass requests with the required information and view the request status.

### 🏠 Hostel Leave

Students can request leave when they need to go home.

### ⚠️ Emergency Class Leave

Students can submit an emergency leave request from class.

### 📚 Library

Students can:

* Browse available books
* View issued books
* Request book return

### 🍽️ Canteen

Students can:

* View the day's menu
* View available items
* Place orders
* View order information where implemented

### 📊 Attendance

Students can view their attendance information where attendance data is available.

---

# 👨‍🏫 Faculty Features

Faculty members can access functions related to their responsibilities.

### 📊 Attendance Management

Faculty can:

* Mark attendance
* Manage attendance information

### 🚪 Gate Pass Approval

Authorized faculty can:

* Review requests
* Approve requests
* Reject requests

### 🏠 Leave Approval

Faculty can review authorized:

* Hostel leave requests
* Emergency class leave requests

### 🛠️ Help Desk

Faculty can review complaints and service requests according to their permissions.

They can help with:

* Reviewing requests
* Updating status
* Assigning/handling requests where permitted

### 📢 Announcements

Authorized faculty can create or manage announcements where this functionality is available to them.

---

# 🛡️ Administrator Features

The administrator manages major campus operations.

### 👥 Student & Faculty Management

Administrators can:

* Add students
* Add faculty
* Manage accounts
* Manage roles/access

### ✅ Request Approvals

Administrators can review and approve/reject:

* Gate pass requests
* Hostel leave requests
* Emergency leave requests

### 🛠️ Help Desk Management

Administrators can:

* Review complaints
* Review service requests
* Assign complaints to responsible workers
* Update request status
* Track progress

### 📢 Announcement Management

Administrators can create categorized announcements and select the target audience:

**Students | Faculty | Everyone**

### 📚 Library Management

Administrators can:

* Add books
* Update books
* Delete books
* Manage availability
* Verify book returns

### 🍽️ Canteen Management

Administrators can maintain:

* Menu
* Items
* Availability
* Orders/functions implemented in the prototype

---

# 🔄 Main Help Desk Workflow

The Help Desk is the primary workflow of CoreCampus.

```text
Student Faces a Problem
          ↓
Student Raises Complaint / Service Request
          ↓
Adds Description + Category + Priority
          ↓
Faculty / Administrator Reviews Request
          ↓
Responsible Worker is Assigned
          ↓
Worker Resolves the Issue
          ↓
Status is Updated
          ↓
Student Sees the Updated Status
```

### Example

A student finds an electrical problem in a classroom.

```text
Electrical Problem
       ↓
Student Reports It
       ↓
Admin / Faculty Reviews
       ↓
Electrician Assigned
       ↓
Problem Fixed
       ↓
Status Updated
       ↓
Student Gets the Update
```

This creates a clear connection between the **student, administration/faculty, and responsible worker**.

---

# 🔄 Other Important Workflows

## Gate Pass

```text
Student Request
      ↓
Faculty / Admin Review
      ↓
Approve / Reject
      ↓
Status Updated
```

## Hostel / Emergency Leave

```text
Student Request
      ↓
Faculty / Admin Review
      ↓
Approve / Reject
      ↓
Status Updated
```

## Announcements

```text
Admin Creates Announcement
      ↓
Select Category
      ↓
Select Audience
      ↓
Publish
      ↓
Target Users Receive Announcement
```

## Library

```text
Admin Manages Books
      ↓
Student Browses Books
      ↓
Issue / Return Request
      ↓
Admin Verifies Return
      ↓
Records Updated
```

## Canteen

```text
Admin Maintains Menu & Items
      ↓
Student Views Menu
      ↓
Student Places Order
      ↓
Order Status / Completion
```

---

# 👥 Role Overview

| Module             |     Student    |     Faculty     |      Admin     |
| ------------------ | :------------: | :-------------: | :------------: |
| Help Desk          |        ✅       |        ✅        |        ✅       |
| Service Requests   |        ✅       |      Review     |     Manage     |
| Attendance         |      View      |      Manage     |        —       |
| Gate Pass          |     Request    |  Approve/Reject | Approve/Reject |
| Hostel Leave       |     Request    |  Approve/Reject | Approve/Reject |
| Emergency Leave    |     Request    |  Approve/Reject | Approve/Reject |
| Notifications      | Receive/Filter |    Authorized   |     Manage     |
| Library            |  Browse/Return |        —        |     Manage     |
| Canteen            |   View/Order   |        —        |     Manage     |
| Student Management |        —       |        —        |        ✅       |
| Faculty Management |        —       |        —        |        ✅       |
| Worker Assignment  |        —       | Where permitted |        ✅       |

---

# 🎯 Key Benefits

### Centralized

Important campus services are available through one portal.

### Simple

Students can submit requests without complicated processes.

### Transparent

Students can view the status of their complaints and requests.

### Organized

Faculty and administrators can manage requests systematically.

### Better Responsibility

Complaints can be assigned to the appropriate worker.

### Better Communication

Categorized announcements can reach the appropriate users.

### Improved Campus Experience

Everyday campus activities become easier to manage.

---

# 🏗️ Project Nature

CoreCampus is currently a **frontend-only prototype**.

The project demonstrates:

* User interfaces
* Role-based dashboards
* Navigation
* Campus service workflows
* Request and approval flows
* Complaint/service tracking concepts
* Library and canteen interfaces
* Announcement management interfaces

Backend services, real-world authentication, persistent databases, and external institute integrations are not represented as fully implemented unless specifically connected in the project.

---

# 🚀 Future Enhancement

One planned enhancement is **attendance integration with the institute's existing website**, if suitable access/API/data is available.

This is a **future enhancement**, not a currently guaranteed feature.

---

# 🖥️ Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* Angular CLI (if required by the project)

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the project:

```bash
cd CoreCampus
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
ng serve
```

Open the application in your browser using the local address shown by Angular.

---

# 📁 Project Structure

A typical structure is:

```text
CoreCampus/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── assets/
│   └── styles/
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

The exact structure may vary depending on the current implementation.

---

# 📸 Project Highlights

CoreCampus focuses on a connected campus experience through:

**Student → Request → Review → Assignment → Resolution → Status Update**

This workflow is especially important for the **Help Desk and Complaint/Service Request module**.

---

# 📜 Project Scope

CoreCampus is designed around three primary roles:

```text
                 CoreCampus
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     Student       Faculty       Admin
        │            │            │
        └────────────┼────────────┘
                     ↓
          Connected Campus Services
```

The goal is not to replace every existing institute system, but to provide a **simple and unified interface for everyday campus activities**.

---

# 🌟 Conclusion

**CoreCampus** aims to make campus life simpler by connecting students, faculty, and administrators through a centralized digital platform.

Its main contribution is a clear **complaint and service-request workflow** that helps transform an unorganized campus problem into a trackable process:

> **Report → Review → Assign → Resolve → Update**

### CoreCampus

**Smarter Campus | Connected Community | Better Tomorrow**
