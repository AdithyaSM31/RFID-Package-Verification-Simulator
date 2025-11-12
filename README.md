# RFID Package Verification System

Modern RFID Package Verification System with real-time scanning, dual-mode product management, and comprehensive verification dashboard.

## 🚀 Live Demo

**Production URL**: `https://rfid-package-verification-simulator.vercel.app/`

## ✨ Features

- **Custom Order Management**: Set your own order IDs and names
- **Dual Product Modes**: Choose between catalog products or custom products
- **Flexible Item Placement**: Place items from cart OR extra items for anomaly testing
- **Real-time RFID Scanning**: Automatic tag detection with visual feedback
- **High-Quality Dashboard**: Gradient charts with metrics tracking
- **Modern UI**: Glass-morphism design with responsive layout
- **Comprehensive Verification**: Detects missing items, extra items, and perfect matches

## 🛠️ Tech Stack

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Version Control**: Git + GitHub

## 📦 Local Development

### Prerequisites

- Node.js (>=18 recommended)
- npm (bundled with Node) or Yarn

### Setup

```powershell
# Clone repository
git clone https://github.com/YOUR_USERNAME/rfid-verification-system.git
cd rfid-verification-system

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173/ in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### Notes

- If you see "caniuse-lite is outdated" warnings, run:
  ```powershell
  npx update-browserslist-db@latest
  ```
- The backend Python script is in `backend/advanced_rfid_sim.py` and is independent of the Vite dev server

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide for Vercel
- **[UI_REDESIGN.md](./UI_REDESIGN.md)** - Complete UI/UX redesign documentation (October 2025)
- **[CHART_IMPROVEMENTS.md](./CHART_IMPROVEMENTS.md)** - High-quality chart rendering details
- **[CHANGELOG.md](./CHANGELOG.md)** - Complete list of all changes and modifications
- **[ORDER_MODE_GUIDE.md](./ORDER_MODE_GUIDE.md)** - How to use Catalog vs Custom product modes
- **[DROPDOWN_BEHAVIOR.md](./DROPDOWN_BEHAVIOR.md)** - Explains Step 2 dropdown options
- **[TESTING_SCENARIOS.md](./TESTING_SCENARIOS.md)** - 10 test scenarios for verification testing

## 🚢 Deployment

### Quick Deploy to Vercel

1. **Push to GitHub**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/rfid-verification-system.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Click "Deploy" (auto-detects Vite configuration)
   - Done! 🎉

For detailed instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Build Locally

```powershell
npm run build
npm run preview
```

Build output is in `dist/` directory.

## 🎯 How to Use

1. **Create Order** (Step 1):
   - Enter custom Order ID and Name
   - Choose Catalog or Custom mode
   - Add products to cart
   - Confirm order

2. **Place Items** (Step 2):
   - Select items to place in package
   - Choose from cart OR extra items for testing
   - Canvas shows real-time placement

3. **Scan Package** (Step 3):
   - Click "Start RFID Scan"
   - System detects all RFID tags
   - View verification results in dashboard

4. **Analyze Results**:
   - **Perfect Match**: All items correct ✅
   - **Missing Items**: Expected items not found ❌
   - **Extra Items**: Unexpected items detected ⚠️

## 📁 Project Structure

```
rfid-verification-system/
├── backend/                 # Python RFID simulator
├── src/
│   ├── components/         # React components
│   │   ├── CartManagement.tsx
│   │   ├── ExpectedItems.tsx
│   │   ├── ItemPlacement.tsx
│   │   ├── MetricsDashboard.tsx
│   │   ├── PackageCanvas.tsx
│   │   ├── Scanner.tsx
│   │   └── VerificationModal.tsx
│   ├── data/
│   │   └── products.ts     # Product catalog
│   ├── hooks/
│   │   └── useRFIDSimulation.ts  # Core logic
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   ├── App.tsx             # Main component
│   └── main.tsx            # Entry point
├── .env.example            # Environment template
├── vercel.json             # Vercel config
└── package.json            # Dependencies
```

## 🧪 Testing Scenarios

See **[TESTING_SCENARIOS.md](./TESTING_SCENARIOS.md)** for:
- Perfect match scenarios
- Missing item detection
- Extra item detection
- Catalog vs Custom mode testing
- Edge cases

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
VITE_APP_NAME=RFID Package Verification System
VITE_APP_VERSION=1.0.0
```

### Vercel Configuration

See `vercel.json` for:
- Build settings
- SPA routing
- Asset caching
- Headers

## 📄 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review [TESTING_SCENARIOS.md](./TESTING_SCENARIOS.md) for usage examples
- Open an issue on GitHub

---

**Built with ❤️ using Vite + React + TypeScript**


