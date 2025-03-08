# DocScan - Automate, Scan, Match, Secure Docs
**DocScan** is a powerful, self-contained document scanning and matching system designed for secure and efficient document management. It leverages AI-powered text extraction, PDF and Word file parsing, and intelligent document matching. With robust authentication, credit-based access, and an intuitive UI, users can securely upload, scan, and manage documents. Admins can oversee user activities, credit requests, and system logs. DocScan ensures seamless workflow automation, enhancing productivity while maintaining top-tier security and accuracy in document processing. 

## 🛠️ Tech Stack  
### **Backend**  
- 🟢 **Node.js** – JavaScript runtime  
- ⚡ **Express.js** – Web framework  

### **Database**  
- 🗄️ **SQLite** – Lightweight database  
- 🔗 **Sequelize** – ORM for database management  

### **Security**  
- 🔑 **JWT** – Authentication & authorization  
- 🛡️ **Helmet** – Security middleware  
- 🔒 **BcryptJS** – Password hashing  

### **Templating & UI**  
- 🎨 **EJS-Mate** – Enhanced templating engine  
- 🎨 **TailwindCSS** – Utility-first CSS framework  

### **File Handling & AI**  
- 📂 **Multer** – File uploads  
- 📁 **FS-Extra** – File system utilities  
- 📜 **PDF-Parse** – Extract text from PDFs  
- 📄 **Mammoth** – Extract text from DOCX files  
- 🤖 **OpenAI & Google Generative AI** – AI-powered document matching  

## 🔧 Key Features  
✅ Secure authentication & session management  
✅ AI-powered document scanning & matching  
✅ PDF & Word file parsing  
✅ Credit-based system for controlled access  
✅ Responsive UI with TailwindCSS  

## API End Points
### 🏠 Home Routes  
| 🔹 Method | 🌐 Endpoint       | 📄 Description | 🔒 Access |
|-----------|----------------|----------------|-----------|
| 🟢 GET    | `/`            | 🏡 Renders the landing page | 🌍 Public |
| 🟢 GET    | `/dashboard`   | 📊 Renders the user dashboard | 🔐 Authenticated Users |

### 🔑 Authentication Routes  
| 🔹 Method | 🌐 Endpoint       | 📄 Description | 🔒 Access |
|-----------|----------------|----------------|-----------|
| 🟢 GET    | `/auth/login`  | 🔑 Renders the login page | 🌍 Public |
| 🟠 POST   | `/auth/login`  | 🔓 Handles user login | 🌍 Public |
| 🟢 GET    | `/auth/register` | 📝 Renders the registration page | 🌍 Public |
| 🟠 POST   | `/auth/register` | 📩 Handles user registration | 🌍 Public |
| 🟢 GET    | `/auth/logout` | 🚪 Handles user logout | 🔐 Authenticated Users |

### 📄 Document Routes  
| 🔹 Method | 🌐 Endpoint           | 📄 Description | 🔒 Access |
|-----------|-------------------|----------------|-----------|
| 🟢 GET    | `/documents`       | 📂 Fetches the list of documents | 🔐 Authenticated Users |
| 🟢 GET    | `/documents/upload` | ⬆️ Renders the document upload form | 🔐 Authenticated Users |
| 🟠 POST   | `/documents/upload` | 📤 Uploads a document | 🔐 Authenticated Users |
| 🟢 GET    | `/documents/:id`    | 🗂️ Fetches details of a specific document | 🔐 Authenticated Users |
| 🟠 POST   | `/documents/:id/delete` | 🗑️ Deletes a document | 🔐 Authenticated Users |

### 🖨️ Scan Routes  
| 🔹 Method | 🌐 Endpoint                | 📄 Description | 🔒 Access |
|-----------|------------------------|----------------|-----------|
| 🟢 GET    | `/scans`                | 📜 Fetches the list of scans | 🔐 Authenticated Users |
| 🟢 GET    | `/scans/new`            | 📷 Renders the scan form | 🔐 Authenticated Users |
| 🟠 POST   | `/scans`                | 🆕 Creates a new document scan | 🔐 Authenticated Users |
| 🟢 GET    | `/scans/:id`            | 🔍 Fetches details of a specific scan | 🔐 Authenticated Users |
| 🟢 GET    | `/scans/:id/download`   | 📥 Downloads a scan report | 🔐 Authenticated Users |
| 🟢 GET    | `/scans/history/export` | 📊 Exports scan history | 🔐 Authenticated Users |
| 🟢 GET    | `/scans/:id/documentation` | 📄 Downloads scan documentation | 🔐 Authenticated Users |
| 🟢 GET    | `/scans/ai/new`         | 🤖 Renders the AI scan form | 🔐 Authenticated Users |
| 🟠 POST   | `/scans/ai`             | 🤖 Creates a new AI scan | 🔐 Authenticated Users |
| 🟢 GET    | `/scans/ai/:id`         | 🔎 Fetches AI scan details | 🔐 Authenticated Users |
| 🟢 GET    | `/scans/ai/:id/download` | 📥 Downloads AI scan report | 🔐 Authenticated Users |

### ⚙️ User Settings Routes  
| 🔹 Method | 🌐 Endpoint               | 📄 Description | 🔒 Access |
|-----------|-----------------------|----------------|-----------|
| 🟢 GET    | `/users/settings`     | ⚙️ Fetches the settings page | 🔐 Authenticated Users |
| 🟠 POST   | `/users/update-profile` | 📝 Updates user profile | 🔐 Authenticated Users |
| 🟠 POST   | `/users/change-password` | 🔑 Updates user password | 🔐 Authenticated Users |
| 🟠 POST   | `/users/delete-account` | 🚨 Deletes user account | 🔐 Authenticated Users |

### 💳 Credit Request Routes  
| 🔹 Method | 🌐 Endpoint          | 📄 Description | 🔒 Access |
|-----------|------------------|----------------|-----------|
| 🟢 GET    | `/credit-request` | 💰 Fetches the credit request page | 🔐 Authenticated Users |
| 🟠 POST   | `/credit-request/new` | 🆕 Creates a new credit request | 🔐 Authenticated Users |
| 🟢 GET    | `/credit-request/list` | 📜 Fetches user credit requests | 🔐 Authenticated Users |

### 🛠️ Admin Routes  
| 🔹 Method | 🌐 Endpoint                          | 📄 Description | 🔒 Access |
|-----------|----------------------------------|----------------|-----------|
| 🟢 GET    | `/admin/dashboard`               | 🏆 Renders the admin dashboard | 🔒 Admin Only |
| 🟢 GET    | `/admin/users`                   | 👥 Fetches the list of users | 🔒 Admin Only |
| 🟢 GET    | `/admin/credit-requests`         | 💰 Fetches the list of credit requests | 🔒 Admin Only |
| 🟠 POST   | `/admin/credit-requests/process` | ✅ Processes a credit request | 🔒 Admin Only |
| 🟢 GET    | `/admin/documents`               | 📂 Fetches the list of documents | 🔒 Admin Only |
| 🛑 DELETE | `/admin/documents`               | 🗑️ Deletes a document | 🔒 Admin Only |
| 🟢 GET    | `/admin/documents/:id`           | 📜 Fetches document details | 🔒 Admin Only |
| 🟢 GET    | `/admin/system-activity`         | 📊 Fetches system activity logs | 🔒 Admin Only |
| 🟢 GET    | `/admin/export-logs`             | 📤 Exports system logs | 🔒 Admin Only |
