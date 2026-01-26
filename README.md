# LawSync

## What is LawSync?

**LawSync** is a Windows desktop application designed to help lawyers and legal offices manage cases, documents, and related files in a simple, secure, and offline‑first way.

LawSync runs entirely on the local machine. It does **not** require internet access, cloud accounts, or third‑party services. All data is stored locally and remains fully under the user’s control.

The application combines a modern desktop interface with a powerful local backend to provide a fast and reliable legal case management experience.

---

## Key Features

* **Case Management**

  * Create, update, search, and delete legal cases
  * View full case details at any time

* **File & Document Handling**

  * Attach multiple files to each case
  * Secure local file storage
  * Download or delete case files easily

* **Secure Login System**

  * Password‑protected access
  * Encrypted passwords using hashing
  * Ability to change the main password
  * Backup password for recovery

* **Offline‑First**

  * Works without internet
  * All data stored locally on the user’s machine

* **Portable & Easy Installation**

  * Single Windows installer
  * No need to install Node.js or MongoDB separately

* **Safe Data Handling**

  * Application data is preserved even after uninstall (unless manually removed)

---

## Technologies Used

### Desktop Application

* **Electron** – Desktop application framework

### Backend

* **Node.js** – Embedded runtime (bundled inside the app)
* **Express.js** – Local REST API
* **MongoDB (Embedded)** – Local database engine (bundled with the app)
* **Mongoose** – MongoDB object modeling

### Security

* **bcryptjs** – Password hashing and verification

### File Handling

* **Multer** – File uploads and attachments

### Packaging & Distribution

* **esbuild** – Backend bundling
* **pkg** – Backend executable packaging
* **NSIS** – Windows installer creation

---

## Quick Start (How to Use)

### 1. Setup & Run (Development Mode)

1. Install **Node.js (LTS version)** on your machine

2. Clone the repository to your local machine

3. In the **application** (frontend) folder, create a `.env` file with the following variable:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. In the **server** folder, create a `.env` file with the following variable:

   ```env
   BACKUP_PASSWORD=your_backup_password_here
   ```

5. Open a terminal in the project root (or server folder) and run:

   ```bash
   npm run dev
   ```

The application will start using the local API running on port **5000**.

---

### 2. First Launch

* On first launch, LawSync automatically:

  * Starts its internal database
  * Prepares the local storage
  * Sets a default login password

You are now ready to use the application.

---

### 3. Login

* Enter the default application password -> 000000
* If the main password is forgotten, the backup password can be used
* Passwords can be changed from inside the app

---

### 4. Manage Cases

* Add new legal cases
* Search cases by name or details
* Edit existing cases
* Delete cases when no longer needed

---

### 5. Upload & Manage Files

* Attach documents to cases
* View all files related to a case
* Remove files when necessary

All files are stored securely on the local machine.

---

## Data & Privacy

* All data is stored **locally**
* No data is sent to the cloud
* No tracking or analytics
* Full control remains with the user

---

## System Requirements

* Windows 10 or Windows 11 (64‑bit)
* No internet connection required
* No external database or runtime required

---

## Support & Maintenance

LawSync is designed to be stable, lightweight, and easy to maintain. Future updates can be installed without losing existing data.

---

## License

This application is provided for professional use. Redistribution or modification without permission is not allowed.

---

**LawSync** — Simple. Secure. Local.
