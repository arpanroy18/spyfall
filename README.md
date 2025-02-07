# 🕵️ Spyfall Online

![Spyfall Online Logo/Screenshot Placeholder](placeholder-image.png)

**Play Spyfall with friends online!** No registration, completely free, and open source.

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/Built%20with-React-blue.svg)](https://reactjs.org/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-teal.svg)](https://tailwindcss.com/)
[![Powered by Firebase](https://img.shields.io/badge/Powered%20by-Firebase-orange.svg)](https://firebase.google.com/)

---

## 📖 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Code Structure](#-code-structure)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎮 About
**Spyfall Online** is a free and open-source web application that lets you play the popular social deduction party game, **Spyfall**, with your friends online. Built using **React**, **TypeScript**, **Tailwind CSS**, and **Firebase**.

---

## ✨ Features
- Real-time Multiplayer (up to 12 players)
- Custom game configurations
- Multiple region-based locations
- In-game timer and role management
- Mobile-responsive design
- Free and open source

---

## 🚀 Getting Started


### ✅ Prerequisites
- Node.js v18+
- npm or yarn

### 📥 Installation
```bash
git clone <your-repository-url>
cd spyfall
npm install  # or yarn install
```

### ▶️ Running the Server
```bash
# Using npm
npm install

# OR using yarn
yarn install
```

### 🎲 Usage
🔹 Creating a Game
- Open the application in your browser.
- Click "Create New Game" on the landing page.
- Configure your game settings:
- Region for locations.
- Number of Spies.
- Time Limit for each round.
Enter your name and click "Create Game".
Share the Game Code displayed at the top with friends.
When all players have joined, the leader (crown icon) clicks "Start Game".

### 🔹 Joining a Game
Open the application in your browser.
Enter the Game Code provided by the host.
Click the Join button or press Enter.
Enter your name and click "Join Game".
Wait in the lobby until the leader starts the game.
🔹 Playing the Game
Roles are assigned at the start.
Non-spies see the location.
The spy does not and must figure it out.
Players take turns questioning each other.
Questioning round:
Players ask indirect questions to identify the spy.
The spy must blend in without revealing they don't know the location.
Game ends when:
A vote to accuse a player as the spy succeeds.
The time runs out and the spy guesses the location.
The wrong player is indicted, giving the spy the win.
