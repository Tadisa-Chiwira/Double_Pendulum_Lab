# Double Pendulum Simulation

This project is my take on the classic double pendulum problem—using Runge-Kutta 4th order (RK4) integration to model the wild, unpredictable motion that emerges from simple equations. It's a visual playground for exploring how tiny changes in parameters (like gravity or masses) can lead to massive differences in behavior. Perfect for anyone fascinated by chaos theory, numerical methods, or just watching pendulums go haywire.

It showcases the following skills: React frontend for the interactive UI, FastAPI backend handling the heavy physics computations, and real-time rendering with Canvas. Sliders let you tweak gravity, masses, and watch the simulation respond instantly. It's a fun way to demonstrate numerical stability and deployment chops for quant internships.

## Live Demo
[Check it out live here!](https://double-pendulum-lab-1.onrender.com/) (it is a little laggy due to render free tier but don't mind that)

## Local Setup

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- Git

### Backend Setup
1. Fork the repo on GitHub, then clone your fork:
   ```
   git clone https://github.com/yourusername/Double-Pendulum-Lab.git
   cd Double-Pendulum-Lab/engine
   ```

2. Install Python dependencies:
   ```
   pip install fastapi uvicorn numpy
   ```

3. Run the backend:
   ```
   python main.py
   ```
   Server starts at `http://127.0.0.1:8000`.

### Frontend Setup
1. In a new terminal, navigate to frontend:
   ```
   cd ../frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the dev server:
   ```
   npm run dev
   ```
   App runs at `http://localhost:5173`.

### Usage
- Open `http://localhost:5173` in your browser.
- Adjust sliders for gravity (G), mass 1 (M1), mass 2 (M2).
- Watch the pendulum trace its chaotic path!
- Click "Reset Simulation" to restart.

## For Forking
If you're forking this repo, here's what you can ignore:

- **Frontend environment variable** (`App.tsx`):
  ```typescript
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  ```
  The `VITE_API_URL` is only used for production deployment. Locally, it falls back to `http://127.0.0.1:8000`, so you don't need to set it.

- **Backend PORT configuration** (`main.py`):
  ```python
  port = int(os.environ.get("PORT", 8000))
  ```
  The `PORT` env var is injected by Render during deployment. Locally, it defaults to port 8000, so you don't need to set it either.

- **Render deployment setup**: The project is deployed on Render (backend as web service, frontend as static site). You won't need this for local development.
- **Frontend build output**: The `dist/` folder is generated during production builds and ignored locally.

Just follow the **Local Setup** steps above, and everything will work out of the box!

### Technologies
- **Frontend**: React, TypeScript, Vite, Canvas API
- **Backend**: FastAPI, NumPy, RK4 Integration
- **Physics**: Lagrangian mechanics for double pendulum equations

Inspired by chaos theory and numerical analysis—great for learning or impressing at interviews. Feel free to fork and experiment <3!
