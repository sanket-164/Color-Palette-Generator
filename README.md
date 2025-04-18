# 🎨 AI-Powered Color Palette Generator

A machine learning-based web app that generates custom color palettes from **uploaded images**. Built with **Next.js** (frontend) and **Flask** (backend), using **K-Means Clustering** for image-based color extraction.

## Features

- Upload an image and extract dominant colors using K-Means clustering.
- Copy HEX codes, download palettes, or save them for future use.
- Modern UI built with React (Next.js).
- Fast backend APIs powered by Flask and Python.

## Tech Stack

| Layer        | Technology                |
|--------------|---------------------------|
| Frontend     | Next.js (React, Tailwind) |
| Backend      | Flask (Python)            |
| ML Algorithm | K-Means Clustering        |
| Image Utils  | Pillow (PIL), NumPy       |

## ⚙️ Setup Instructions

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```


4. Open your browser and visit
   ```
   http://localhost:3000
   ```

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

## Running with Docker
### To pull and run the Docker image, follow these steps:

1. Pull the Docker image
   ```sh
   docker pull sanket164/color-palette-generator:frontend
   ```
   ```sh
   docker pull sanket164/color-palette-generator:backend
   ```

2. Run the Docker container
   ```sh
   docker run -d -p 3000:3000 --name frontend sanket164/color-palette-generator:frontend
   ```
   ```sh
   docker run -d -p 5000:5000 --name backend sanket164/color-palette-generator:backend
   ```

3. Open your browser and visit
   ```
   http://localhost:3000
   ```

4. To stop the container
   ```sh
   docker stop frontend
   ```
   ```sh
   docker stop backend
   ```
   
5. To remove the container
   ```sh
   docker rm frontend
   ```
   ```sh
   docker rm backend
   ```


## 📄 License

MIT License