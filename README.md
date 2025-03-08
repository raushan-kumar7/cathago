# DocScan - Automate, Scan, Match, Secure Docs
**DocScan** is a powerful, self-contained document scanning and matching system designed for secure and efficient document management. It leverages AI-powered text extraction, PDF and Word file parsing, and intelligent document matching. With robust authentication, credit-based access, and an intuitive UI, users can securely upload, scan, and manage documents. Admins can oversee user activities, credit requests, and system logs. DocScan ensures seamless workflow automation, enhancing productivity while maintaining top-tier security and accuracy in document processing. 

## 🚀 Features  

### 🔐 **Secure Authentication & Access Control**  
✔️ User authentication using **JWT** 🔑  
✔️ Secure password hashing with **BcryptJS** 🔒  
✔️ Role-based access control for **Users & Admins** 🏢  

### 📄 **Advanced Document Management**  
✔️ Upload and store **PDF & DOCX** files 📂  
✔️ Extract text using **PDF-Parse & Mammoth** 📜  
✔️ AI-powered document matching with **OpenAI & Google AI** 🤖  

### 🎯 **AI-Powered Scanning & Matching**  
✔️ Smart document comparison & text similarity analysis 🧠  
✔️ AI-driven insights for document verification 🔍  
✔️ Export scan reports for reference 📑  

### 💰 **Credit-Based System**  
✔️ Users require credits to perform document scans 💳  
✔️ Request and manage credits via the admin panel ⚖️  

### 📊 **User & Admin Dashboard**  
✔️ View uploaded documents & scan history 🗂️  
✔️ Monitor credit usage and activity 📈  
✔️ Admins can manage users, documents, and logs ⚙️  

### 🎨 **Modern & Responsive UI**  
✔️ Built with **EJS-Mate** templating 🎭  
✔️ Styled using **TailwindCSS** for a sleek interface 🎨  
✔️ Fully responsive for desktop & mobile 📱  

### 🛡️ **Robust Security & Performance**  
✔️ Secure session management with **Helmet** 🛡️  
✔️ Optimized performance with **SQLite & Sequelize** ⚡  
✔️ File system utilities with **Multer & FS-Extra** 📁

## 🛠️ Tech Stack  

### **Backend**  
✔️ 🟢 **Node.js** – JavaScript runtime  
✔️ ⚡ **Express.js** – Web framework  

### **Database**  
✔️ 🗄️ **SQLite** – Lightweight database  
✔️ 🔗 **Sequelize** – ORM for database management  

### **Security**  
✔️ 🔑 **JWT** – Authentication & authorization  
✔️ 🛡️ **Helmet** – Security middleware  
✔️ 🔒 **BcryptJS** – Password hashing  

### **Templating & UI**  
✔️ 🎨 **EJS-Mate** – Enhanced templating engine  
✔️ 🎨 **TailwindCSS** – Utility-first CSS framework  

### **File Handling & AI**  
✔️ 📂 **Multer** – File uploads  
✔️ 📁 **FS-Extra** – File system utilities  
✔️ 📜 **PDF-Parse** – Extract text from PDFs  
✔️ 📄 **Mammoth** – Extract text from DOCX files  
✔️ 🤖 **OpenAI & Google Generative AI** – AI-powered document matching  

### **Database Schema Image**

<img width="950px;" src="https://res.cloudinary.com/cloud-alpha/image/upload/v1741433490/Common/DocScan-Schema_r9aahw.png"/>

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

### DocScan Website Images
<img width="950px;" src="https://res.cloudinary.com/cloud-alpha/image/upload/v1741434947/Common/home_a5jisu.png"/>
<img width="950px;" src="https://res.cloudinary.com/cloud-alpha/image/upload/v1741434947/Common/home1_luzsdl.png"/>
<img width="950px;" src="https://res.cloudinary.com/cloud-alpha/image/upload/v1741434783/Common/login_pdvgzt.png"/>
<img width="950px;" src="https://res.cloudinary.com/cloud-alpha/image/upload/v1741434783/Common/register_cqh2xb.png"/>
<img width="950px;" src="https://res.cloudinary.com/cloud-alpha/image/upload/v1741434782/Common/user-dash_tnr8qn.png"/>
<img width="950px;" src="https://res.cloudinary.com/cloud-alpha/image/upload/v1741434782/Common/scan_reryw8.png"/>
<img width="950px;" src="https://res.cloudinary.com/cloud-alpha/image/upload/v1741435157/Common/admin-dash_ppyxgd.png"/>

## 🛠️ Installation Steps  

Follow these steps to set up and run the project on your local machine.  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/your-username/cathago.git
cd cathago
```

### **2️⃣ Install Dependencies**  
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**  
Create a `.env` file in the root directory and add the necessary configurations. Use the `.env.example` file as a reference.  

### **4️⃣ Run the Development Server**  
```sh
npm run dev
```
Your app will be running at **[http://localhost:3400](http://localhost:3400)** 🚀  

### **5️⃣ Start the Production Server**  
```sh
npm start
```

### **6️⃣ Build TailwindCSS (Optional, for UI changes)**  
```sh
npm run build:css
```

### **7️⃣ Create an Admin User (Optional, for first-time setup)**  
```sh
npm run create-admin
```

Now, your **DocScan** system is ready to use! 🎉