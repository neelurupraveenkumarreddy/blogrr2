# Blogrr

A full-stack blogging platform built with **Java Spring Boot (JDBC)** for the backend and **React.js** for the frontend.  
The project provides a simple yet powerful blogging experience with user management, post creation, categories, tags, and an admin dashboard.

---

## 🚀 Features
- 📝 Create, edit, and delete blog posts  
- 🧑‍🤝‍🧑 User authentication & profile management  
- 🏷️ Category and tag management  
- 📊 Admin dashboard with statistics (users, posts, popular tags, etc.)  
- 🔍 Search & filter posts by category/tag  
- 📅 Track post creation & update times  

---

## 🛠️ Tech Stack
**Frontend:** React.js  
**Backend:** Java, Spring Boot, JDBC  
**Database:** MySQL 
**Other:** REST APIs, JSON

---

## Screenshots
<img width="1918" height="1025" alt="image" src="https://github.com/user-attachments/assets/781a6b9b-5ee8-49c7-a06f-52bbdbdd1be0" />
<img width="1919" height="1037" alt="image" src="https://github.com/user-attachments/assets/e4fd220c-5f97-4650-a178-13dcc6cc7bc0" />
<img width="1913" height="1026" alt="image" src="https://github.com/user-attachments/assets/0ee8612b-41a4-49c7-8cd9-c13c56e33d20" />
<img width="1919" height="1033" alt="image" src="https://github.com/user-attachments/assets/0fb854b1-c8e3-414b-93a1-5052b1838312" />
<img width="1913" height="1033" alt="image" src="https://github.com/user-attachments/assets/5b629b14-7353-4da6-b089-277e36a511fd" />
<img width="1919" height="1031" alt="image" src="https://github.com/user-attachments/assets/11d993b0-bc8a-49a4-b99b-a9f45ea0be91" />
<img width="1913" height="1043" alt="image" src="https://github.com/user-attachments/assets/57b04a0d-b19c-45ee-8cc0-268e677683a8" />
<img width="1919" height="1008" alt="image" src="https://github.com/user-attachments/assets/6a7291c5-cd89-4295-9d1c-a21fd92b79dd" />
<img width="1911" height="1022" alt="image" src="https://github.com/user-attachments/assets/a106a1d6-227c-488a-8ac6-dbccfe78d7c3" />



## ⚙️ Setup & Installation

### Backend (Spring Boot + JDBC)
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Update your **`application.properties`** with DB credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/blogrr
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```

3. Run the backend:
   ```bash
   mvn spring-boot:run
   ```

---

### Frontend (React)
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React dev server:
   ```bash
   npm start
   ```



