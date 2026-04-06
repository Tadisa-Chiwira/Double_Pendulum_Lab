from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from physics_engine import rk4_step
import numpy as np

app = FastAPI()

# allows my React app (on a different port) to talk to the Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
)

# global system state
current_state = np.array([np.pi/2, np.pi/2, 0.0, 0.0])

@app.get("/step")
def get_step(dt: float = 0.01):
    global current_state
    current_state = rk4_step(current_state, dt)

    # convert angles to (x, y) coordinates for the frontend Canvas
    # L1 and L2 are lengths of the rods
    l1, l2 = 1.0, 1.0
    x1 = l1 * np.sin(current_state[0])
    y1 = -l1 * np.cos(current_state[0])

    x2 = x1 + l2 * np.sin(current_state[1])
    y2 = y1 - l2 * np.cos(current_state[1])

    return {
        "x1": x1, "y1": y1,
        "x2": x2, "y2": y2,
        "theta1": current_state[0],
        "theta2": current_state[1]
    }
    