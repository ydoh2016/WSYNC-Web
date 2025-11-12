FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Environment variables for large file support
ENV MAX_UPLOAD_SIZE=2147483648
ENV UPLOAD_TIMEOUT=300

# Run FastAPI with uvicorn with configuration for large files
# --limit-max-requests: Maximum request body size (2GB)
# --timeout-keep-alive: Keep-alive timeout for long uploads
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--limit-max-requests", "2147483648", "--timeout-keep-alive", "300"]
