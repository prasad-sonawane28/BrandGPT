# BrandGPT

An AI marketing assistant that learns a company's brand profile and generates on-brand marketing content. Built as a full-stack portfolio project with React and Flask.

![BrandGPT home screen](docs/screenshot-home.png)

## Features

- **Brand profiles:** create, edit and delete brands, each with industry, description, target audience, brand voice and products
- **Content generation:** pick a brand, describe a task (for example "write an Instagram caption for our new trail running shoe"), and get content written from that brand's profile
- **Saved history:** every generation is stored per brand, with one-click copy
- **Mock mode:** the whole app runs without an API key, returning placeholder text that also shows the exact system prompt a real call would send

## How it works

The brand's fields are assembled into a **system prompt** (standing instructions: who the model is writing for and in what voice). The user's request is sent as the **user message**. Empty fields are left out of the prompt. Results are saved in a `generations` table linked to the brand by a foreign key, and deleting a brand cascades to its history.

## Tech stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | React, Vite                                   |
| Backend  | Flask, Flask-SQLAlchemy, Flask-CORS           |
| Database | SQLite                                        |
| AI       | Anthropic API (`claude-haiku-5-5` by default) |

## Getting started

### Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

The API runs at `http://localhost:5000`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Optional: real AI output

Without an API key the app runs in mock mode. To use the real model, create `backend/.env`:

```
ANTHROPIC_API_KEY=your-key-here
```

Real mode switches on automatically when a key is present. Set `MOCK_AI=1` in the same file to force mock mode.

## API

| Method | Endpoint                       | Description                                      |
| ------ | ------------------------------ | ------------------------------------------------ |
| GET    | `/api/health`                  | Health check                                     |
| GET    | `/api/brands`                  | List all brands                                  |
| POST   | `/api/brands`                  | Create a brand                                   |
| GET    | `/api/brands/<id>`             | Get one brand                                    |
| PUT    | `/api/brands/<id>`             | Update a brand                                   |
| DELETE | `/api/brands/<id>`             | Delete a brand and its history                   |
| POST   | `/api/brands/<id>/generate`    | Generate content for a brand (`{"task": "..."}`) |
| GET    | `/api/brands/<id>/generations` | List a brand's saved generations                 |

## Project structure

```
BrandGPT/
├── backend/
│   ├── app.py            # app setup, blueprint registration
│   ├── database.py       # SQLAlchemy instance
│   ├── models.py         # Brand and Generation models
│   └── routes/
│       ├── brands.py     # brand CRUD endpoints
│       └── generate.py   # prompt building, mock mode, history
└── frontend/
    └── src/
        ├── App.jsx           # top-level state and layout
        ├── BrandForm.jsx     # create/edit form
        ├── BrandList.jsx     # brand cards with edit/delete
        └── GeneratePanel.jsx # generation UI and history
```

## Roadmap

- Streaming responses
- Delete individual generations
- Database migrations with Flask-Migrate
- Deployment
