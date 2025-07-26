# Tala3a 🏆

_Building the Future of Sports Communities in Egypt_

<div align="center">

[![Made in Egypt](https://img.shields.io/badge/Made%20in-Egypt-red?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIGZpbGw9IiNDRTExMjYiLz4KPHJlY3QgeT0iOCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3QgeT0iMTYiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPgo=)](https://github.com/MazenMarei/Tal3a)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Internet Computer](https://img.shields.io/badge/Internet%20Computer-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white)](https://internetcomputer.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**نحن نبني مستقبل المجتمعات الرياضية في مصر**

</div>

## 🎯 About Tala3a

In Egypt, people who want to play sports or stay active often face a lack of organization, difficulty in finding local events or teammates, and limited access to safe, trusted, and verified communities. Whether it's joining a football match, organizing a cycling ride, or finding a fitness group, individuals struggle with scattered communication, trust issues, and no centralized platform to connect like-minded athletes.

**Tala3a solves this by creating a decentralized, sport-specific social hub** where users can easily create, discover, and join verified sporting events and groups in their area. Through integrated tools like group chats, wallets, ride requests, and a recommendation system, Tala3a makes it easy for Egyptians to stay active, meet new people, and build a healthier, more connected community.

### 🌟 Why Tala3a?

- **🏟️ Real Sports Events**: Connect with real athletes in your city
- **🔐 Blockchain Security**: Built on Internet Computer for transparent and secure transactions
- **🇪🇬 Made for Egypt**: Arabic support, local payment methods, Egyptian sports culture
- **👥 Community First**: Build lasting friendships through sports
- **⚡ Web3 Technology**: Decentralized, transparent, and user-owned platform

## 🚀 Quick Start

### Prerequisites

Before running the project, make sure you have:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **DFX** (Internet Computer SDK)
- **Rust** (for backend development)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/MazenMarei/Tal3a.git
   cd Tal3a
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development environment**
   ```bash
   npm run dev
   ```

This command will:

- Stop any running DFX processes
- Start a clean local Internet Computer replica
- Deploy all canisters (backend and frontend)
- Generate type declarations

4. **Access the application**

   Once deployment is complete, your application will be available at:

   ```
   http://localhost:4943?canisterId={frontend_canister_id}
   ```

### 🛠️ Development Scripts

| Command                  | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| `npm run dev`            | Start development environment (DFX + Deploy + Generate) |
| `npm run build`          | Build all workspaces                                    |
| `npm start`              | Start frontend development server                       |
| `npm test`               | Run tests                                               |
| `dfx start --background` | Start DFX replica in background                         |
| `dfx deploy`             | Deploy canisters                                        |
| `dfx generate`           | Generate type declarations                              |

## 🏗️ Project Structure

```
Tal3a/
├── 📁 src/
│   ├── 📁 tal3a_backend/          # Rust backend canister
│   │   ├── src/lib.rs             # Main backend logic
│   │   ├── Cargo.toml             # Rust dependencies
│   │   └── tal3a_backend.did      # Candid interface
│   │
│   ├── 📁 tal3a_frontend/         # React frontend
│   │   ├── src/
│   │   │   ├── App.jsx           # Main app component
│   │   │   ├── pages/            # Page components
│   │   │   ├── components/       # Reusable UI components
│   │   │   ├── assets/           # Static assets
│   │   │   └── styles/           # CSS and styling
│   │   ├── package.json          # Frontend dependencies
│   │   ├── vite.config.js        # Vite configuration
│   │   └── tailwind.config.js    # Tailwind CSS config
│   │
│   └── 📁 declarations/           # Auto-generated type declarations
│
├── dfx.json                       # DFX configuration
├── Cargo.toml                     # Workspace configuration
└── package.json                   # Root package configuration
```

## ✨ Current Features

### 🎯 Core Platform Features

- **🔐 Internet Identity Integration**: Secure Web3 authentication
- **🏠 Landing Page**: Professional homepage with hero section
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🌙 Dark/Light Mode**: Theme switching support
- **🇪🇬 Arabic Support**: RTL text and Arabic translations

### 🏃‍♂️ Sports & Events

- **⚽ Football Events**: Join local football matches
- **🚴 Cycling Groups**: Discover cycling rides and events
- **💪 Fitness Activities**: Find fitness bootcamps and training sessions
- **📍 Location-based Discovery**: Find events in your city
- **⭐ Community Ratings**: User reviews and ratings system

### 👥 Community Features

- **👤 User Profiles**: Personalized athlete profiles
- **💬 Group Chat**: Integrated communication tools
- **🏆 Achievement System**: Track your sports activity
- **📊 Statistics Dashboard**: Personal and community stats

### 🏆 Tournament System

- **🏆 Multi-stage Tournaments**: Organize and participate in tournaments
- **📊 Bracket Management**: Visual tournament brackets
- **🏅 Leaderboards**: Competitive rankings and achievements

## 🛠️ Technology Stack

### Frontend

- **⚛️ React 19.1** - Modern UI library
- **⚡ Vite** - Fast build tool and development server
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 Lucide React** - Beautiful icon library
- **📱 Radix UI** - Accessible component primitives

### Backend

- **🦀 Rust** - Systems programming language
- **🌐 Internet Computer** - Decentralized cloud platform
- **📡 IC-CDK** - Internet Computer development kit
- **🔧 Candid** - Interface description language

### Development Tools

- **📦 NPM Workspaces** - Monorepo management
- **🔧 DFX** - Internet Computer development environment
- **🎯 ESLint** - Code linting and formatting
- **🔄 Git** - Version control

<div align="center">

**Built with ❤️ in Egypt for the Egyptian Sports Community**

</div>
