# 👑 Empress Wig Boutique

> A modern, elegant e-commerce platform for premium wig collections built with React, TypeScript, and Tailwind CSS.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange?logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?logo=vite)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📦 Installation](#-installation)
- [🎯 Available Scripts](#-available-scripts)
- [🔧 Configuration](#-configuration)
- [📞 Contact & Support](#-contact--support)
- [📄 License](#-license)

---

## ✨ Features

- 🛍️ **Modern E-Commerce Platform** - Browse and purchase premium wigs
- 👤 **User Authentication** - Secure login and registration with Firebase
- 🛒 **Shopping Cart** - Add, remove, and manage products
- 💳 **Checkout System** - Smooth and secure payment process
- 📱 **Responsive Design** - Fully optimized for mobile and desktop
- 🎨 **Beautiful UI** - Elegant design with Shadcn UI components
- 🌙 **Dark Mode Support** - Theme switching with next-themes
- 📧 **Contact Form** - Easy customer communication
- 🔍 **Product Search** - Find wigs by style, color, and price
- 📊 **Admin Dashboard** - Manage products and orders
- 🚀 **Fast Performance** - Built with Vite for optimal speed

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI library
- **TypeScript** 5.8.3 - Type safety
- **Vite** 5.4.19 - Build tool
- **Tailwind CSS** 3.4.17 - Styling
- **Shadcn UI** - Component library

### Backend & Services
- **Firebase** 12.6.0 - Authentication & Database
- **Supabase** 2.81.1 - Alternative backend
- **React Query** 5.83.0 - Data fetching & caching

### UI Components & Libraries
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Icons** - Additional icons
- **Sonner** - Toast notifications
- **Embla Carousel** - Image carousel
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TS linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 📁 Project Structure

```
empress-wig-boutique-main/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── Navigation.tsx   # Header navigation
│   │   └── Footer.tsx       # Footer component
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Shop.tsx        # Product listing
│   │   ├── Contact.tsx     # Contact form
│   │   └── ...
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Utility functions
│   ├── assets/             # Images and static files
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── functions/              # Firebase cloud functions
├── .env                    # Environment variables
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind configuration
├── vite.config.ts          # Vite configuration
└── README.md              # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ or **Bun**
- **npm** or **bun** package manager
- Firebase account (for backend services)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd empress-wig-boutique-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Firebase credentials

4. **Start development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📦 Installation

### Using npm
```bash
npm install
```

### Using Bun
```bash
bun install
```

### Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI Framework |
| typescript | 5.8.3 | Type Safety |
| tailwindcss | 3.4.17 | Styling |
| firebase | 12.6.0 | Backend |
| react-router-dom | 6.30.1 | Routing |
| react-hook-form | 7.61.1 | Form Management |
| zod | 3.25.76 | Validation |
| sonner | 1.7.4 | Notifications |

---

## 🎯 Available Scripts

### Development
```bash
npm run dev          # Start development server
```

### Production
```bash
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

---

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Add your Firebase config to `.env.local`:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Tailwind CSS

Configuration is in `tailwind.config.ts`. Customize:
- Colors
- Fonts
- Spacing
- Breakpoints

### Vite Configuration

Configured in `vite.config.ts` with:
- React SWC plugin for fast compilation
- Optimized build settings
- Development server configuration

---

## 📞 Contact & Support

### Get in Touch

📧 **Email:** abametimprecious@gmail.com  
📱 **Phone:** +234 801 47 188 319  
📍 **Location:** Dn Sam Nujoma Housing Estate, Galadinmawa, Abuja

### Business Hours

| Day | Hours |
|-----|-------|
| Monday - Friday | 9:00 AM - 6:00 PM |
| Saturday | 10:00 AM - 4:00 PM |
| Sunday | Closed |

### Contact Form

Use the contact form on the website to send inquiries about:
- Product information
- Custom orders
- Styling advice
- General inquiries

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary. All rights reserved © 2024 Empress Wig Boutique.

---

## 🎉 Acknowledgments

- Built with ❤️ using React and TypeScript
- UI Components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Firebase](https://firebase.google.com/)

---

**Made with 💖 for Empress Wig Boutique**
