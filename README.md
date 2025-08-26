# 🏃‍♂️ Tal3a (طلعة) - Decentralized Social Fitness Platform

[![IC](https://img.shields.io/badge/Internet%20Computer-Protocol-blue)](https://internetcomputer.org)
[![Rust](https://img.shields.io/badge/Rust-Backend-orange)](https://www.rust-lang.org)
[![React](https://img.shields.io/badge/React-Frontend-blue)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Connecting Egypt's Athletic Community Through Web3**

Tal3a is a decentralized social fitness platform built on the Internet Computer (ICP), designed to connect, motivate, and reward the athletic community in Egypt. It bridges the gap between the desire to be physically active and the logistical challenges that prevent it.

## 🎯 Mission

To build the future of sports communities in Egypt by breaking down barriers of isolation and disorganization that hinder athletic participation. We create a seamless, engaging, and rewarding digital environment that empowers every individual to pursue a healthier lifestyle.

## 🚀 Key Features

### 🏘️ Community Hub

- **Public Groups**: Find and join sports groups based on location and sport type
- **Private Clubs**: Create intimate, trusted circles for friends and teammates
- **City-based Organization**: Groups organized by Egyptian governorates and cities

### 📅 Smart Event Coordination ("Tal3a")

- **Event Creation**: Users can create sporting activities with detailed information
- **RSVP Management**: Automated participant tracking and management
- **Notifications**: Smart reminders and updates for all participants
- **Location Integration**: GPS-based event discovery and navigation

### 🏆 Incentivized Participation

- **Participate-to-Earn**: Reward users with points for activity participation
- **NFT Achievements**: Collectible badges for milestones and achievements
- **Marketplace Integration**: Redeem points for real-world rewards
- **Progress Tracking**: Monitor workouts and fitness milestones

### 🌍 Centralized Discovery

- **Event Discovery**: One-stop shop for local sporting events
- **Marathon Listings**: Official and community-organized races
- **Tournament Information**: Local competitions and challenges

## 🏗️ Technical Architecture

### Backend Canisters (Rust)

```
src/
├── user_canister/          # User management and authentication
├── social_canister/        # Groups, posts, and social features
└── event_canister/         # Event management and coordination
```

**Canister IDs (IC Mainnet):**

- **User Canister**: `bhg4e-ziaaa-aaaai-atlfq-cai`
- **Social Canister**: `bsbnj-yaaaa-aaaai-atlga-cai`
- **Event Canister**: `bval5-vyaaa-aaaai-atlgq-cai`

### Frontend (React + Vite)

```
src/frontend_canister/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   ├── context/           # React context providers
│   └── utils/             # Utility functions
├── public/                # Static assets
└── dist/                  # Built application
```

## 🛠️ Development Setup

### Prerequisites

- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/) >= 0.28.0
- [Rust](https://rustup.rs/) with `wasm32-unknown-unknown` target
- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 7.0.0

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/MazenMarei/Tal3a.git
cd Tal3a
```

2. **Install dependencies:**

```bash
npm install --legacy-peer-deps
```

3. **Start local replica:**

```bash
dfx start --clean --background
```

4. **Deploy canisters:**

```bash
dfx deploy
```

5. **Start development server:**

```bash
npm run dev
```

### Project Structure

```
Tal3a/
├── Cargo.toml                 # Rust workspace configuration
├── dfx.json                   # DFX configuration
├── package.json               # Node.js dependencies
├── src/
│   ├── event_canister/        # Event management backend
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── storage.rs
│   │   │   ├── types/
│   │   │   ├── services/
│   │   │   └── contracts/
│   │   └── event_canister.did
│   │
│   ├── social_canister/       # Social features backend
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── storage.rs
│   │   │   ├── types/
│   │   │   ├── services/
│   │   │   └── contracts/
│   │   └── social_canister.did
│   │
│   ├── user_canister/         # User management backend
│   │   ├── src/
│   │   │   ├── lib.rs
│   │   │   ├── storage.rs
│   │   │   ├── types/
│   │   │   ├── services/
│   │   │   └── contracts/
│   │   └── user_canister.did
│   │
│   └── frontend_canister/     # React frontend
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── context/
│       │   └── utils/
│       ├── package.json
│       └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🔧 Technical Challenges Solved

### 1. Scalable Group & Event Management

- Optimized canister-to-canister communication
- Efficient data indexing for social feeds
- Performance optimization for thousands of concurrent groups
- Smart RSVP and notification management


### 2. Stable Memory Management

- Large-scale user data persistence using `StableBTreeMap`
- Memory growth optimization
- Robust data migration strategies
- Zero-downtime canister upgrades

### 5. Cross-Platform UI/UX

- Consistent experience between web and mobile
- Unified state management
- Location services integration
- Push notifications across platforms

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start frontend development server
npm run build           # Build frontend for production
npm run preview         # Preview production build

# DFX Commands
dfx start               # Start local replica
dfx deploy              # Deploy all canisters
dfx generate            # Generate type declarations
dfx canister call       # Call canister methods

# Testing
npm test                # Run tests
cargo test              # Run Rust tests
```

## 🌐 Environment Configuration

### Local Development

```bash
# .env (auto-generated)
VITE_DFX_NETWORK=local
CANISTER_ID_USER_CANISTER=local_canister_id
CANISTER_ID_SOCIAL_CANISTER=local_canister_id
CANISTER_ID_EVENT_CANISTER=local_canister_id
```

### IC Mainnet

```bash
VITE_DFX_NETWORK=ic
CANISTER_ID_USER_CANISTER=bhg4e-ziaaa-aaaai-atlfq-cai
CANISTER_ID_SOCIAL_CANISTER=bsbnj-yaaaa-aaaai-atlga-cai
CANISTER_ID_EVENT_CANISTER=bval5-vyaaa-aaaai-atlgq-cai
```

## 🔐 Authentication

Tal3a supports multiple authentication methods:

- **Internet Identity**: Native IC authentication
- **NFID**: User-friendly Web3 wallet
- **Plug Wallet**: Browser extension wallet

## 🏆 Core Data Models

### User Profile

```rust
pub struct User {
    pub principal_id: Principal,
    pub username: String,
    pub city: CityData,
    pub governorate: GovernorateData,
    pub sports: Vec<Sports>,
    pub free_days: Option<Vec<String>>,
    // ... more fields
}
```

### Group/Club

```rust
pub struct Group {
    pub id: String,
    pub name: String,
    pub sport_type: Sports,
    pub city_id: u16,
    pub governorate_id: u8,
    pub public: bool,
    pub parent_group_id: Option<String>,
    // ... more fields
}
```

### Event ("Tal3a")

```rust
pub struct Event {
    pub id: String,
    pub title: String,
    pub group_id: String,
    pub location: Location,
    pub date_time: u64,
    pub max_participants: u32,
    // ... more fields
}
```

## 📱 Supported Sports

- ⚽ Football
- 🏀 Basketball
- 🎾 Tennis
- 🏃 Running
- 🚴 Cycling
- 🏊 Swimming
- 🥊 Boxing
- 🧘 Yoga
- 🏋️ Weightlifting
- 🏐 Volleyball
- And more...

## 🗺️ Coverage Areas

Currently serving all Egyptian governorates:

- Cairo, Alexandria, Giza
- Dakahlia, Red Sea, Beheira
- Fayoum, Gharbeya, Ismailia
- And all other governorates

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and submission process.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Internet Computer Protocol** for providing the decentralized infrastructure
- **Dfinity Foundation** for the development tools and resources
- **Egyptian Sports Community** for inspiration and feedback

## 📞 Contact & Support

- **Website**: [Coming Soon]
- **Email**: tal3a.egypt@gmail.com
- **Twitter**: [@Tal3aEgypt](https://twitter.com/Tal3aEgypt)
- **Discord**: [Join our community](https://discord.gg/tal3a)

---

<div align="center">
  <strong>Made with ❤️ for the Egyptian Sports Community</strong>
</div>

---

## 🔄 Recent Updates

- ✅ **v1.0**: Core platform with groups and events
- 🚧 **v1.1**: NFT achievements system (in progress)
- 📅 **v1.2**: Mobile app development (planned)
- 📅 **v2.0**: Advanced analytics and ML recommendations (planned)
