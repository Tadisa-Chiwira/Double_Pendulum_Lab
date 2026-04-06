import numpy as np
import matplotlib.pyplot as plt
from physics_engine import rk4_step # importing the solver I wrote

def verify():
    # Initial state: [theta1, theta2, omega1, omega2]
    # I'll drop it from 90 degrees or pi/2 to see some chaotic motion
    state = np.array([np.pi/2, np.pi/2, 0.0, 0.0])
    dt = 0.01
    steps = 1000

    history = []

    for _ in range(steps):
        state = rk4_step(state, dt)
        history.append(state.copy())
    history = np.array(history)

    # plotting the angles over time
    plt.figure(figsize=(10,5))
    plt.plot(history[:, 0], label='Theta 1 (Top)')
    plt.plot(history[:, 1], label='Theta 2 (Bottom)')
    plt.title("Double Pendulum: Angular Displacement (RK4)")
    plt.xlabel("Time Steps")
    plt.ylabel("Radians")
    plt.legend()
    plt.grid(True)
    plt.show()

if __name__ == "__main__":
    verify()
