# How to Run the AI Curriculum Builder

## Prerequisites

- Python 3.11 installed
- Virtual environment already created (located in `venv/` folder)
- All dependencies installed

## Quick Start (Recommended)

### Option 1: Using the Batch File

Simply double-click:
```
START_SERVERS.bat
```

This will start both the backend and frontend servers automatically.

### Option 2: Manual Start

#### Step 1: Start the Backend Server

Open a terminal in the project root directory and run:

```powershell
.\venv\Scripts\activate.ps1
cd backend
python app.py
```

You should see:
```
============================================================
Module Summarization API Starting...
============================================================
✓ MATHEMATICS curriculum found
✓ AIML curriculum found
✓ PROGRAMMING_C curriculum found

API Endpoints:
  POST /api/summarize       - Generate module summary
  GET  /api/modules         - List all modules
  GET  /api/health          - Health check
  POST /api/progress/save   - Save quiz result & track progress
  GET  /api/progress        - Get all progress data
  GET  /api/progress/<id>   - Get specific module progress
  POST /api/learning-assist - AI learning guidance (Gemini)

AI Learning Assistant: ENABLED (Gemini API)

Starting server on http://localhost:5000
============================================================
```

**Keep this terminal open!** The backend must run continuously.

#### Step 2: Start the Frontend Server

Open a **new terminal** in the project root directory and run:

```powershell
.\venv\Scripts\activate.ps1
python serve_frontend.py
```

You should see:
```
Frontend server running on http://localhost:8000
```

**Keep this terminal open too!**

#### Step 3: Open in Browser

Open your web browser and navigate to:
```
http://localhost:8000/roadmap.html
```

## What You'll See

1. **Roadmap Page**: Choose a subject (Mathematics, AI/ML, or Programming in C)
2. **Module Pages**: Click on any module to view content
3. **AI Features**:
   - **AI Summary**: Click to get an AI-generated summary
   - **Need Help?**: Click to get learning guidance from the AI assistant
4. **Quizzes**: Test your knowledge and track progress

## Using the AI Learning Assistant

1. Navigate to any module page
2. Click the **"Need Help?"** button (purple button next to AI Summary)
3. Optionally, type what you're struggling with
4. Click **"Get Guidance"**
5. The AI will suggest prerequisite modules and learning paths

## Stopping the Servers

### If using START_SERVERS.bat:
- Close the command prompt window

### If started manually:
- Press `Ctrl+C` in each terminal window
- Or simply close the terminal windows

## Troubleshooting

### Backend won't start
**Error**: `Port 5000 already in use`

**Solution**:
```powershell
# Find and kill the process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Frontend won't start
**Error**: `Port 8000 already in use`

**Solution**:
```powershell
# Find and kill the process using port 8000
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
```

### Virtual environment not activating
**Error**: `Execution of scripts is disabled on this system`

**Solution**:
```powershell
# Run PowerShell as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### AI Learning Assistant not working
**Check**:
1. Backend server is running (check terminal for errors)
2. Gemini API key is configured in `backend/app.py` (line 30)
3. Internet connection is active
4. Test with: `python test_gemini.py`

### Module pages not loading
**Check**:
1. Both backend AND frontend servers are running
2. You're accessing `http://localhost:8000` (not `localhost:5000`)
3. Curriculum JSON files exist in the project root

## Project Structure

```
updated_ai cirriculum builder/
├── backend/
│   ├── app.py                    # Flask backend server
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── css/                      # Stylesheets
│   ├── js/                       # JavaScript files
│   ├── roadmap.html             # Main entry point
│   └── module.html              # Module viewer
├── venv/                         # Virtual environment
├── *_curriculum.json            # Curriculum data files
├── START_SERVERS.bat            # Quick start script
└── serve_frontend.py            # Frontend server
```

## Development Mode

If you want to make changes and see them live:

1. **Backend changes**: Restart the backend server (Ctrl+C, then `python app.py`)
2. **Frontend changes**: Just refresh your browser (no restart needed)
3. **CSS/JS changes**: Hard refresh with `Ctrl+F5` to clear cache

## Production Deployment

For production deployment, see `render.yaml` for configuration or use:

```bash
gunicorn backend.app:app
```

## Need Help?

- Check the [Walkthrough](file:///C:/Users/dines/.gemini/antigravity/brain/c72535de-0ff1-435a-a95a-2a202eef7dc4/walkthrough.md) for detailed documentation
- Check the [Student Guide](file:///C:/Users/dines/.gemini/antigravity/brain/c72535de-0ff1-435a-a95a-2a202eef7dc4/student_guide.md) for using the AI assistant
- Run tests: `python test_learning_assistant.py`
