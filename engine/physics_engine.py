import numpy as np

# constants for the simulation
G = 9.81 # accelaration due to gravity
L1 = 1.0 # length of first rod
L2 = 1.0 # length of second rod
M1 = 1.0 # mass of the first bob
M2 = 1.0 # mass of the second bob

def get_derivatives(state,t):
    # Calculates the derivatives for double pendulum using equations derived from the Lagrangrian
    theta1,theta2,z1,z2 = state

    # pre-calculating common terms for efficiency
    delta = theta2 - theta1
    den1 = (M1 + M2) * L1 - M2 * L1 * np.cos(delta) * np.cos(delta)
    den2 = (L2/L1) * den1

    # the Ordinary Differential Equations (ODEs) for angular velocity
    d_theta1 = z1
    d_theta2 = z2

    # The acceleration for theta1 (derived from Euler-Lagrande)
    d_z1 = (M2 * G * np.sin(theta2) * np.cos(delta) - M2 * np.sin(delta) * (L1 * z1**2 * np.cos(delta) + L2 * z2**2) - (M1 + M2) * G * np.sin(theta1)/den1)

    # the acceleration for theta2
    d_z2 = ((M1 + M2) * (L1 * z1**2 * np.sin(delta) - G * np.sin(theta2) + G * np.sin(theta1) * np.cos(delta)) + M2 * L2 * z2**2 * np.sin(delta) * np.cos(delta))/den2

    return np.array([d_theta1, d_theta2, d_z1, d_z2])

