# SkillSwap

A web app that matches people who want to **teach** a skill with people who want to
**learn** one, through a swipe-based interface inspired by dating apps.

![SkillSwap demo](docs/demo.gif)

## The idea

Someone who plays guitar but wants to learn Python, and someone who codes but
wants to play guitar, should be able to find each other in two swipes. SkillSwap
builds a profile from the skills you offer and the skills you want, then surfaces
mutual matches.

## Features

- Swipe-based matching interface
- Skill profiles: "can teach Guitar" / "wants to learn Coding"
- Mutual-match detection
- FastAPI backend serving a lightweight vanilla-JS frontend

## Tech stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Backend   | Python 3, FastAPI, Uvicorn  |
| Frontend  | HTML, CSS, JavaScript       |
| Config    | python-dotenv               |

## Project structure

```
main.py            # FastAPI entry point
backend/           # API routes, matching logic, data layer
frontend/          # pages, styles and client-side JS
requirements.txt
```

## Running locally

```bash
git clone https://github.com/can-yazicioglu/SkillSwap.git
cd SkillSwap

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env            # then fill in your own values

uvicorn main:app --reload
```

Then open http://127.0.0.1:8000

## What I worked on

I set up and led this project. My focus was on the Login/Logout pages. I have also done the common sections of the pages such as NavBar, Background etc. It was also my responsibility to organise the structure of the website and lead the project, assign everyone their roles... 

## Team

Built as a first-year group project at the University of Manchester by
ALi Ahmari, Yusuf Hussein, Henry Li, Isaac Chung, Shivam Babbar and Can Yazıcıoğlu.

## License

MIT
