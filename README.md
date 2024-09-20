# Prayer Tracker

A full-stack application for tracking daily prayer times and statuses, providing real-time updates and an intuitive user interface.

## Features

- Fetches real-time prayer times using a third-party API.
- Allows users to mark prayers as completed and track daily prayer logs.
- Displays prayer timings and statuses for multiple days.
- Built with **React** for the frontend, **Express.js** for the backend, and **MongoDB** for data storage.
- Fully containerized using **Docker**.

## Requirements

- Docker

## Installation

> **Note**: The live database is not accessible. You will need to configure your own MongoDB instance for local use.

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/prayer-tracker.git
   cd prayer-tracker
   
2. Set up your .env file for environment variables, including your MongoDB connection string.

3. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   
4. Access the application at http://localhost:3000
