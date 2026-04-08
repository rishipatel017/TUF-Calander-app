# Dynamic Productivity Calendar 🗓️

A state-of-the-art, aesthetically engineered web calendar focused on absolute productivity and dynamic immersion. Built with Next.js 15, Framer Motion, and Tailwind CSS v4.

## ✨ Features

- **Dynamic Monthly Theming Engine**: The heart of the application. The entire UI—from the ultra-deep ambient sphere glows, to the primary structural typography (fonts), to the selection hover highlights—seamlessly cross-fades into 12 distinct, emotionally-mapped color palettes based strictly on the current active month. 
- **Fluid Range Selection**: Click, hover-preview, and click again. Advanced gesture interpolation provides buttery-smooth bounding boxes and tooltips to map out your long-term dates instantly.
- **Side-by-Side Immersive Layout**: Experience a completely panoramic "Hero" image stretching across the viewport, while your fluid Calendar and Notes Panel snap perfectly side-by-side to enhance your actual productivity workspace.
- **Smart Notes Integration**: Attach specific, serialized string notes to multiple locked ranges. These notes are safely preserved into your local state payload so your workflows are strictly maintained between reloads.
- **Regional API Automation**: Actively pulls and merges real Federal National Holidays dynamically over the grid (via `date.nager.at`), merging directly with standard weekend layouts.

## 🛠️ Stack Architecture

- **Framework**: `Next.js 15` (App Router)
- **Styling**: `TailwindCSS v4` (`clsx` utility rendering)
- **Fluid Animation**: `Framer Motion`
- **Date Algorithms**: `date-fns`
- **Typography Integration**: Optimized `next/font/google` injections mapped via local CSS variables (`Space Grotesk`, `Playfair Display`, `Outfit`, `Inter`).

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the local dev environment**:
   ```bash
   npm run dev
   ```

3. **Open the Dashboard**: Look for `http://localhost:3000` in your browser. 

Feel free to try clicking the Next/Prev months organically to witness the typography and entire DOM tree seamlessly morphing colors and structure perfectly. 

## 📝 Usage Note
*Because the project runs entirely on the Client payload with `localStorage` bridging, your notes will persist as long as your browser's local cache remains active.*
