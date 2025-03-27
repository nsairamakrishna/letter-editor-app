# Letter Editor App

The **Letter Editor App** is a full-stack web application that allows users to sign up and log in using Google authentication, create and edit text-based letters, and save those letters directly to their Google Drive in Google Docs format. 

## Features

- **Google Authentication**: Users can sign up and log in using their Google accounts via OAuth.
- **Letter Creation & Editing**: A simple text editor for writing and editing letters.
- **Google Drive Integration**: Save letters as Google Docs directly to the user's Google Drive.
- **Responsive UI**: The app is responsive and works on both desktop and mobile devices.
- **Logout**: Users can log out and end their session securely.

## Tech Stack

- **Frontend**: React.js (for building the user interface)
- **Backend**: Node.js with Express (for handling server-side logic)
- **Authentication**: Google OAuth via Passport.js
- **Storage**: Google Drive API (for saving letters as Google Docs)
- **Database**: MongoDB (for storing user and letter data)
- **Deployment**: Heroku (for deploying both the frontend and backend)
- **Version Control**: GitHub for managing the codebase

## Getting Started

### Prerequisites

Before running the app locally, make sure you have the following installed:

- Node.js and npm (or yarn)
- MongoDB (if running locally, or use MongoDB Atlas for cloud hosting)
- A Google Developer Account for enabling Google OAuth and Drive API

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/letter-editor-app.git
   cd letter-editor-app
