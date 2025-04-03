import subprocess
import os

script_files = [f for f in os.listdir() if f.endswith('.py') and f != "main.py"]

processes = []
for script in script_files:
    print(f"Starting {script}...")
    processes.append(subprocess.Popen(["python", script]))

# Wait for all scripts to finish
for process in processes:
    process.wait()

print("All scripts finished execution.")
