# StudyFlow - Your Personal AI-Powered Study Companion

StudyFlow is a modern, AI-powered study application designed to help you master any subject. Upload your study materials, and StudyFlow will automatically generate flashcards, practice questions, and more. Track your progress, collaborate with friends, and customize your study experience to fit your learning style.

## Features

- **AI-Powered Content Generation**: Upload PDF, TXT, or DOCX files, and StudyFlow will automatically create flashcards and practice quizzes based on the content.
- **Interactive Flashcards**: Create, edit, and study flashcards with a sleek, interactive interface.
- **Practice Quizzes**: Test your knowledge with multiple-choice quizzes generated from your study materials.
- **Progress Tracking**: Visualize your study sessions and track your performance over time with detailed analytics and charts.
- **Dynamic Scheduling**: Plan your study sessions with a fully interactive calendar.
- **Collaborative Study Groups**: Create or join study groups to chat and share materials with your peers.
- **Customizable Settings**: Tailor the application to your needs with customizable themes and data management options.
- **Large File Support**: Upload and process files up to 1GB, with chunked uploading and progress tracking.

## Tech Stack

### Frontend

- **Angular 18**: A powerful framework for building dynamic single-page applications.
- **TypeScript**: For robust, type-safe code.
- **SCSS**: For advanced and maintainable styling.
- **LocalStorage**: To persist data and provide an offline-first experience.

### Backend

- **Node.js & Express**: For a fast and scalable server.
- **TypeScript**: For type safety and consistency with the frontend.
- **PostgreSQL**: A powerful, open-source relational database.
- **Multer**: For handling file uploads efficiently.
- **JSON Web Tokens (JWT)**: For secure user authentication.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Node.js**: Version `20.19.0` or higher. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.
- **PostgreSQL**: A running PostgreSQL server. We recommend [Postgres.app](https://postgresapp.com/) for macOS users.
- **Angular CLI**: `npm install -g @angular/cli`

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd studyflow
```

### 2. Install Node.js Version

If you have `nvm`, run the following command to install and use the correct Node.js version:

```bash
nvm install
nvm use
```

### 3. Install Dependencies

Install the necessary packages for both the frontend and backend.

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 4. Set Up the Database

1.  **Start PostgreSQL**: If you're using Postgres.app, open the application and click "Start".
2.  **Create the Database**: Run the following command in your terminal:
    ```bash
    createdb studyflow_db
    ```

### 5. Configure Environment Variables

1.  Navigate to the `backend` directory.
2.  Create a new file named `.env`.
3.  Copy the following content into the `.env` file and replace the placeholders with your own PostgreSQL credentials. Your `DB_USER` is typically your system username.

    ```env
    DB_USER=your_postgres_user
    DB_HOST=localhost
    DB_NAME=studyflow_db
    DB_PASSWORD=your_postgres_password
    DB_PORT=5432
    JWT_SECRET=this_is_a_super_secret_key_for_jwt
    FRONTEND_URL=http://localhost:4204
    ```

### 6. Run the Application

You'll need to run both the backend and frontend servers simultaneously.

- **Start the Backend Server** (from the root directory):
  ```bash
  cd backend
  npm run dev
  ```

- **Start the Frontend Server** (from the root directory, in a separate terminal):
  ```bash
  ng serve
  ```

The application will be available at http://localhost:4204.

## Pushing Changes to GitHub

Once you've made your changes, you can commit and push them to your repository.

```bash
# Stage all changes
git add .

# Commit your changes with a message
git commit -m "feat: Full-stack setup with database and file uploads"

# Push to your main branch
git push origin main
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── navigation/
│   ├── pages/
│   │   ├── dashboard/
│   │   ├── flashcards/
│   │   ├── practice/
│   │   ├── progress/
│   │   ├── schedule/
│   │   ├── collaborate/
│   │   └── settings/
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
├── index.html
├── main.ts
└── styles.scss
```

## Contributing

This is a prototype version. More features coming soon! 