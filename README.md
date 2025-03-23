# Task Management Backend API

## Description

This is the backend API for a task management application built with **NestJS** and **MongoDB**. It provides authentication, task management, and LinkedIn profile scraping using Puppeteer.

## Technologies

- **NestJS 8**
- **MongoDB 5+**
- **TypeScript 4**
- **playwright**
- **JWT Authentication**


## Installation  
1. Clone the repository:  
   ```sh
   git clone https://github.com/your-username/task-management-backend.git  
   cd task-management-backend  

## Video Demo  
https://drive.google.com/file/d/1zj_NHWgQdARGoGcaxJg6MyDudqh2w1pd/view?usp=sharing


 Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login and get JWT token
GET	/tasks	Get all tasks
POST	/tasks	Create a new task
PUT	/tasks/:id	Update a task
DELETE	/tasks/:id	Delete a task
