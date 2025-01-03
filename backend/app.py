from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import datetime

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # Expose all headers
)


@app.get("/api/hello")
async def hello():
    return {"greeting": "Welcome sanchay the great", "status": "online"}


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "CA Offline Suite Backend",
        "version": "1.0.0",
        "framework": "FastAPI",
        "python": "3.x",
        "uptime": "active",
        "timestamp": datetime.datetime.now().isoformat(),
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7500)
