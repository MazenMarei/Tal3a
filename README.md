# Tal'a Landing Page - Social Fitness App

A modern, responsive landing page for "Tal'a", a social fitness platform that connects Egyptians through sports activities. Built with React 19, TypeScript, TanStack Router, TanStack Query, and Tailwind CSS.

![Tal'a Logo](https://placehold.co/200x100/00B894/FFFFFF?text=TAL'A)

## 🌟 Features

- **🌙 Dark/Light Theme Support** - Toggle between beautiful light and dark themes
- **🌍 Internationalization** - Full Arabic (RTL) and English (LTR) language support
- **📱 Fully Responsive** - Perfect experience on desktop, tablet, and mobile
- **⚡ Modern Tech Stack** - React 19, TypeScript, Vite for blazing fast development
- **🎨 Beautiful UI** - Custom Tailwind CSS styling with Egyptian-inspired colors
- **🔄 Dynamic Data** - TanStack Query for efficient data fetching and caching
- **🧭 Type-Safe Routing** - TanStack Router for robust navigation

## 🎨 Design System

### Colors
- **Primary (Nile Green)**: `#00B894` - Representing the vitality of the Nile
- **Accent (Sunset Gold)**: `#FDC500` - Inspired by Egyptian sunsets
- **Deep Ocean**: `#004E64` - Deep, trust-inspiring blue
- **Light Theme**: Background `#F8F9FA`, Text `#2E2E2E`
- **Dark Theme**: Background `#2E2E2E`, Text `#F8F9FA`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation with theme/language switchers
│   ├── Hero.tsx        # Landing hero section
│   ├── FeaturesShowcase.tsx  # Dynamic activities display
│   ├── HowItWorks.tsx  # 3-step process guide
│   ├── Gamification.tsx # Rewards & badges system
│   └── Footer.tsx      # Site footer
├── contexts/           # React contexts
│   └── AppProvider.tsx # Theme & language context
├── hooks/              # Custom React hooks
│   └── useLiveTalat.ts # Data fetching with TanStack Query
├── locales/           # Internationalization
│   ├── ar/            # Arabic translations (RTL)
│   └── en/            # English translations (LTR)
├── routes/            # File-based routing
│   ├── __root.tsx     # Root layout
│   ├── index.tsx      # Landing page
│   └── login.tsx      # Login placeholder
├── types/             # TypeScript definitions
│   └── tal3a.ts       # App-specific types
├── i18n.ts           # i18next configuration
├── main.tsx          # App entry point
└── styles.css        # Global styles & Tailwind config
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tal3a-landing-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run check` - Run both formatting and linting

## 🎯 Key Components

### Navigation (Header)
- Responsive navigation with mobile-friendly design
- Theme toggle (light/dark mode)
- Language switcher (Arabic ↔ English) with RTL/LTR support
- Smooth scroll anchor links
- Call-to-action button leading to login

### Hero Section
- Compelling headline in both languages
- Engaging sports-themed illustration
- Gradient backgrounds that adapt to theme
- Interactive CTA button with hover effects

### Features Showcase
- **Dynamic content** powered by TanStack Query
- Real-time loading states and error handling
- **Mock data** simulating live sports activities
- Responsive card grid layout
- Sport-specific icons and difficulty indicators

### How It Works
- Clean 3-step process visualization
- **Discover** → **Join** → **Earn** workflow
- Interactive step indicators
- Color-coded progression

### Gamification System
- **Points system** with activity-based rewards
- **NFT badges** with rarity classifications
- **Leaderboard** showing top community members
- Visual reward system encouraging engagement

## 🌐 Internationalization

The app fully supports:
- **Arabic (العربية)** - Right-to-left (RTL) layout, default language
- **English** - Left-to-right (LTR) layout

### Key Features:
- Automatic direction switching (`dir="rtl"` / `dir="ltr"`)
- Language-specific font optimizations
- Cultural adaptation of UI elements
- Persistent language preferences

## 🔧 Technical Highlights

### TanStack Router
- File-based routing system
- Type-safe navigation
- Automatic route generation
- Lazy loading support

### TanStack Query
- Intelligent caching strategies
- Loading and error state management
- Background refetching
- Optimistic updates ready

### Tailwind CSS v4
- Custom color palette configuration
- Dark mode with CSS variables
- RTL/LTR logical properties
- Responsive design utilities
- Component-based styling

### TypeScript
- Strict type checking enabled
- Custom type definitions
- Enhanced developer experience
- Runtime error prevention

## 📱 Responsive Breakpoints

- **Mobile**: < 768px - Single column layout, hamburger menu
- **Tablet**: 768px - 1024px - Adapted grid layouts
- **Desktop**: > 1024px - Full multi-column layouts
- **Large Desktop**: > 1440px - Optimized spacing

## 🔮 Future Enhancements

- [ ] Real authentication system integration
- [ ] Backend API integration
- [ ] User dashboard
- [ ] Real-time notifications
- [ ] Social media integration
- [ ] Advanced filtering and search
- [ ] Location-based activity discovery
- [ ] Payment processing
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Egyptian sports community inspiration
- TanStack team for excellent developer tools
- Tailwind CSS for the utility-first approach
- Lucide React for beautiful icons
- The React community for continuous innovation

---

**Built with ❤️ for the Egyptian sports community**

*Tal'a - Your Reliable Sports Buddy (صاحبك الجدع في الرياضة)*