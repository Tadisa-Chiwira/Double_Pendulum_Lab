# Double Pendulum Simulation

This project is my take on the classic double pendulum problem—using Runge-Kutta 4th order (RK4) integration to model the wild, unpredictable motion that emerges from simple equations. It's a visual playground for exploring how tiny changes in parameters (like gravity or masses) can lead to massive differences in behavior. Perfect for anyone fascinated by chaos theory, numerical methods, or just watching pendulums go haywire.

It showcases the following skills: React frontend for the interactive UI, FastAPI backend handling the heavy physics computations, and real-time rendering with Canvas. Sliders let you tweak gravity, masses, and watch the simulation respond instantly. It's a fun way to demonstrate numerical stability and deployment chops for quant internships.

## Live Demo
[Check it out live here!](placeholdertextandstuff)

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

### Technologies
- **Frontend**: React, TypeScript, Vite, Canvas API
- **Backend**: FastAPI, NumPy, RK4 Integration
- **Physics**: Lagrangian mechanics for double pendulum equations

Inspired by chaos theory and numerical analysis—great for learning or impressing at interviews. Feel free to fork and experiment!