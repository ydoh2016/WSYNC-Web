# W Sync - Deployment Guide

This guide provides instructions for deploying W Sync (WAV Audio & Subtitle Synchronizer) to various platforms.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Railway Deployment](#railway-deployment)
- [Render Deployment](#render-deployment)
- [Fly.io Deployment](#flyio-deployment)

## Environment Variables

The application supports the following environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MAX_UPLOAD_SIZE` | Maximum file upload size in bytes | `2147483648` (2GB) | No |
| `UPLOAD_TIMEOUT` | Upload timeout in seconds | `300` (5 minutes) | No |
| `ENVIRONMENT` | Environment mode (`development` or `production`) | `production` | No |
| `PORT` | Port to run the application on | `8000` | No |

## Local Development

### Prerequisites

- Python 3.10 or higher
- pip package manager

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd audio-subtitle-viewer
```

2. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the development server:
```bash
uvicorn main:app --reload --port 8000
```

5. Access the application at `http://localhost:8000`

### Using Docker Compose (Recommended for Local Development)

1. Install Docker and Docker Compose

2. Start the application:
```bash
docker-compose up
```

3. Access the application at `http://localhost:8000`

4. Stop the application:
```bash
docker-compose down
```

For development with hot-reloading, the docker-compose.yml is already configured to mount your source code.

## Docker Deployment

### Build Docker Image

```bash
docker build -t audio-subtitle-viewer .
```

### Run Docker Container

```bash
docker run -d \
  -p 8000:8000 \
  -v $(pwd)/uploads:/app/uploads \
  -e MAX_UPLOAD_SIZE=2147483648 \
  -e UPLOAD_TIMEOUT=300 \
  --name audio-subtitle-viewer \
  audio-subtitle-viewer
```

### Stop Container

```bash
docker stop audio-subtitle-viewer
docker rm audio-subtitle-viewer
```

## Railway Deployment

Railway is the easiest deployment option with automatic HTTPS and free tier available.

### Steps

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment Variables** (Optional)
   - Go to your project settings
   - Add environment variables:
     - `MAX_UPLOAD_SIZE`: `2147483648`
     - `UPLOAD_TIMEOUT`: `300`
     - `PORT`: Railway will automatically set this

4. **Deploy**
   - Railway will automatically detect the Dockerfile
   - Deployment starts automatically
   - Wait for deployment to complete

5. **Access Your Application**
   - Railway provides a public URL (e.g., `https://your-app.railway.app`)
   - Click on the URL to access your application

### Notes

- Railway automatically handles HTTPS
- Free tier includes 500 hours/month and 1GB storage
- Automatic deployments on git push
- Persistent storage for uploads directory

## Render Deployment

Render offers free tier for web services with automatic deployments.

### Steps

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `audio-subtitle-viewer`
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Instance Type**: Free or paid tier

4. **Add Environment Variables** (Optional)
   - Click "Advanced"
   - Add environment variables:
     - `MAX_UPLOAD_SIZE`: `2147483648`
     - `UPLOAD_TIMEOUT`: `300`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

6. **Access Your Application**
   - Render provides a public URL (e.g., `https://your-app.onrender.com`)

### Notes

- Free tier includes 750 hours/month
- Automatic HTTPS
- Automatic deployments on git push
- Free tier services spin down after 15 minutes of inactivity

## Fly.io Deployment

Fly.io offers global deployment with good performance and free tier.

### Prerequisites

- Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
- Create account: `fly auth signup`

### Steps

1. **Login to Fly.io**
```bash
fly auth login
```

2. **Create fly.toml Configuration**

Create a `fly.toml` file in your project root:

```toml
app = "audio-subtitle-viewer"
primary_region = "sjc"  # Change to your preferred region

[build]
  dockerfile = "Dockerfile"

[env]
  MAX_UPLOAD_SIZE = "2147483648"
  UPLOAD_TIMEOUT = "300"
  PORT = "8000"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

3. **Launch Application**
```bash
fly launch
```

Follow the prompts:
- Choose app name (or use generated)
- Select region
- Don't add PostgreSQL or Redis
- Deploy now: Yes

4. **Deploy Updates**
```bash
fly deploy
```

5. **Access Your Application**
```bash
fly open
```

### Useful Commands

- View logs: `fly logs`
- Check status: `fly status`
- Scale app: `fly scale count 1`
- SSH into app: `fly ssh console`

### Notes

- Free tier includes 3 shared-cpu-1x VMs with 256MB RAM
- Automatic HTTPS
- Global deployment
- Persistent volumes available for uploads

## Production Considerations

### File Storage

For production deployments, consider:

1. **Persistent Storage**
   - Use cloud storage (AWS S3, Google Cloud Storage, etc.)
   - Mount persistent volumes in Docker
   - Configure backup strategy

2. **File Size Limits**
   - Adjust `MAX_UPLOAD_SIZE` based on your needs
   - Consider platform-specific limits
   - Implement chunked uploads for very large files

3. **Security**
   - Implement authentication/authorization
   - Add rate limiting
   - Validate file types strictly
   - Scan uploaded files for malware

4. **Performance**
   - Use CDN for static files
   - Implement caching
   - Consider horizontal scaling
   - Monitor resource usage

### Monitoring

Add monitoring and logging:

```python
# In main.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
```

### Health Checks

The application includes a health check endpoint at `/` which returns the main page. For API-only health checks, you can add:

```python
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

## Troubleshooting

### Large File Upload Issues

If large file uploads fail:

1. Check `MAX_UPLOAD_SIZE` environment variable
2. Verify platform-specific upload limits
3. Increase `UPLOAD_TIMEOUT` for slow connections
4. Check available disk space

### Container Memory Issues

If the container runs out of memory:

1. Increase container memory allocation
2. Implement streaming for large files
3. Add file cleanup after processing
4. Monitor memory usage

### CORS Issues

If you encounter CORS errors:

1. Check CORS middleware configuration in `main.py`
2. Verify allowed origins
3. Check browser console for specific errors

## Support

For issues or questions:
- Check application logs
- Review error messages
- Consult platform-specific documentation
- Check GitHub issues
