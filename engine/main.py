from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from physics_engine import rk4_step
import numpy as np

config= {
    "G": 9.81,
    "M1": 1.0,
    "M2": 1.0,
    "L1": 1.0,
    "L2": 1.0
}

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
    current_state = rk4_step(
        current_state, 
        dt,
        G = config["G"],
        M1 = config["M1"],
        M2 = config["M2"]
    )

    # convert angles to (x, y) coordinates for the frontend Canvas
    # L1 and L2 are lengths of the rods
   
    x1 = config["L1"] * np.sin(current_state[0])
    y1 = -config["L1"] * np.cos(current_state[0])

    x2 = x1 + config["L2"] * np.sin(current_state[1])
    y2 = y1 - config["L2"] * np.cos(current_state[1])

    return {
        "x1": x1, "y1": y1,
        "x2": x2, "y2": y2,
        "theta1": current_state[0],
        "theta2": current_state[1]
    }
    
@app.get("/update_params")
def update_params(G: float = 9.81, M1: float = 1.0, M2: float = 1.0):
    global config
    config["G"] = G
    config["M1"] = M1
    config["M2"] = M2
    return {"status": "paramters updated", "config": config}  

@app.get("/reset")
def reset_sim():
    global current_state
    current_state = np.array([np.pi/2, np.pi/2, 0.0, 0.0])
    return {"status": "reset"}