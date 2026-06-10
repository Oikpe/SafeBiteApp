# Use the official Python version 3.12 image
FROM python:3.12-slim

# Create a working directory inside the container
WORKDIR /app

# Install system dependencies required by DocTR OCR engine
# libxcb1, libgl1, libglib2.0-0: image processing / rendering
# libsm6, libxext6, libxrender1: X11 display (used by OpenCV/DocTR internally)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libxcb1 \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install the tools
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your actual Python code into the container
COPY main.py .

# Expose the specific port Hugging Face requires
EXPOSE 7860

# The command to start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]