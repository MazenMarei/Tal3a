# Tal3a 🏆

_Building the Future of Sports Communities in Egypt_

<div align="center">

[![Made in Egypt](https://img.shields.io/badge/Made%20in-Egypt-red?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIGZpbGw9IiNDRTExMjYiLz4KPHJlY3QgeT0iOCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3QgeT0iMTYiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPgo=)](https://github.com/MazenMarei/Tal3a)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Internet Computer](https://img.shields.io/badge/Internet%20Computer-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white)](https://internetcomputer.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**نحن نبني مستقبل المجتمعات الرياضية في مصر**

</div>

## 🎯 About Tal3a

In Egypt, people who want to play sports or stay active often face a lack of organization, difficulty in finding local events or teammates, and limited access to safe, trusted, and verified communities. Whether it's joining a football match, organizing a cycling ride, or finding a fitness group, individuals struggle with scattered communication, trust issues, and no centralized platform to connect like-minded athletes.

**Tal3a solves this by creating a decentralized, sport-specific social hub** where users can easily create, discover, and join verified sporting events and groups in their area. Through integrated tools like group chats, wallets, ride requests, and a recommendation system, Tal3a makes it easy for Egyptians to stay active, meet new people, and build a healthier, more connected community.

### 🌟 Why Tal3a?

- **🏟️ Real Sports Events**: Connect with real athletes in your city
- **🔐 Blockchain Security**: Built on Internet Computer for transparent and secure transactions
- **🇪🇬 Made for Egypt**: Arabic support, local payment methods, Egyptian sports culture
- **👥 Community First**: Build lasting friendships through sports
- **⚡ Web3 Technology**: Decentralized, transparent, and user-owned platform


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

### System Architecture Diagram
![TAL3A PLATFORM ARCHITECTURE](https://github.com/MazenMarei/Tal3a/blob/main/Tal3a%20Architecture%20diagram.drawio)

```
                           TAL3A PLATFORM ARCHITECTURE
                     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                    ┌───────────────────────────────────┐
                    │               CLIENT LAYER        │ 
                    ├─────────────────┬─────────────────┤
                    │   Web Browser   │  Mobile App     │
                    │   (React SPA)   │ (React Native)  │
                    └─────────────────┴─────────────────┴
         │                    │                    │                   │
         └────────────────────┼────────────────────┼───────────────────┘
                              │                    │
                          Requests        Authentication
                              │                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INTERNET COMPUTER NETWORK                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                            BOUNDARY NODES                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │   Load Balancer │  │  Asset Gateway  │  │   API Gateway   │            │
│  │   Distribution  │  │   Static Files  │  │  Query/Update   │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                               Canister Calls
                                      │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CANISTER SUBNET                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  USER CANISTER  │    │ SOCIAL CANISTER │    │ EVENT CANISTER  │         │
│  │ bhg4e-ziaaa-... │    │ bsbnj-yaaaa-... │    │ bval5-vyaaa-... │         │
│  │                 │    │                 │    │                 │         │
│  │ • User Profiles │    │ • Groups/Clubs  │    │ • Events/Tal3at │         │
│  │ • Authentication│    │ • Posts/Feed    │    │ • Registrations │         │
│  │ • Notifications │    │ • Comments      │    │ • Locations     │         │
│  │ • Settings      │    │ • Memberships   │    │ • Schedules     │         │
│  │ • Activity Log  │    │ • Social Graph  │    │ • Participants  │         │
│  │ • Governorates  │    │ • Moderation    │    │ • Reminders     │         │
│  │ • Cities Data   │    │ • Group Types   │    │ • Event Types   │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │               │
│           └───────────────────────┼───────────────────────┘               │
│                                   │                                       │
│                        Inter-Canister Calls                               │
│                                   │                                       │
│  ┌─────────────────┐              │              ┌─────────────────┐      │
│  │ FRONTEND        │              │              │    FUTURE       │      │
│  │ CANISTER        │              │              │   CANISTERS     │      │
│  │                 │              │              │                 │      │
│  │ • Static Assets │              │              │ • Token/NFT     │      │
│  │ • HTML/CSS/JS   │              │              │ • Rewards       │      │
│  │ • PWA Manifest  │              │              │ • Analytics     │      │
│  │ • Service Worker│              │              │ • ML/AI         │      │
│  │ • Media Files   │              │              │ • Payments      │      │
│  └─────────────────┘              │              └─────────────────┘      │
│                                   │                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                         Data Persistence Layer
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                            STABLE MEMORY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   USER DATA     │    │   SOCIAL DATA   │    │   EVENT DATA    │         │
│  │                 │    │                 │    │                 │         │
│  │ StableBTreeMap  │    │ StableBTreeMap  │    │ StableBTreeMap  │         │
│  │                 │    │                 │    │                 │         │
│  │ • User Profiles │    │ • Groups        │    │ • Events        │         │
│  │ • User Sessions │    │ • Posts         │    │ • Participants  │         │
│  │ • Notifications │    │ • Comments      │    │ • Locations     │         │
│  │ • Activities    │    │ • Memberships   │    │ • Schedules     │         │
│  │ • Preferences   │    │ • Social Links  │    │ • Event History │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                              Consensus Layer
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BLOCKCHAIN SUBSTRATE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ CONSENSUS       │    │ NETWORKING      │    │ CRYPTOGRAPHY    │         │
│  │                 │    │                 │    │                 │         │
│  │ • Chain Key     │    │ • P2P Protocol  │    │ • Digital Sigs  │         │
│  │ • Validation    │    │ • Node Comm     │    │ • Hash Functions│         │
│  │ • Finalization  │    │ • Replication   │    │ • Key Management│         │
│  │ • Fork Choice   │    │ • Load Balancing│    │ • Authentication│         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                            External Integrations
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ IDENTITY        │    │ THIRD-PARTY     │    │ REAL-WORLD      │         │
│  │ PROVIDERS       │    │ APIS            │    │ INTEGRATIONS    │         │
│  │                 │    │                 │    │                 │         │
│  │ • Internet ID   │    │ • Maps/GPS      │    │ • Sports Venues │         │
│  │ • NFID          │    │ • Weather APIs  │    │ • Gyms/Clubs    │         │
│  │ • Plug Wallet   │    │ • Social Media  │    │ • Event Venues  │         │
│  │ • Custom Auth   │    │ • Analytics     │    │ • Local Partners│         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

                              DATA FLOW PATTERNS
                     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request



## 🙏 Acknowledgments

- **Internet Computer Protocol** for providing the decentralized infrastructure
- **Dfinity Foundation** for the development tools and resources
- **Egyptian Sports Community** for inspiration and feedback

---

<div align="center">
  <strong>Made with ❤️</strong>
</div>

---
