# Tone Picker - Text Tone Adjustment Tool

A React-based web application that allows users to adjust the tone of their text using AI-powered transformations. Transform text between formal, casual, technical, and creative styles with a simple 2x2 matrix interface.

## Features

- **Text Editor**: Real-time text input with live word/character counting
- **2x2 Tone Matrix**: Four distinct tone styles (Formal, Casual, Technical, Creative)
- **Undo/Redo**: Full history tracking with chronological undo/redo functionality
- **Reset Button**: Return to original text at any time
- **AI Integration**: Powered by Mistral AI's small model for high-quality tone transformations
- **Responsive Design**: Clean, intuitive interface that works on all devices
- **Persistent Storage**: Text automatically saved to localStorage across sessions
- **Error Handling**: Graceful error handling with user-friendly feedback
- **Caching**: API response caching to optimize performance and reduce costs

## Tech Stack

- **Frontend**: React + TypeScript, TailwindCSS, Shadcn/ui components
- **Backend**: Express.js + TypeScript
- **AI Service**: Mistral AI API (mistral-small-latest model)
- **Build Tool**: Vite
- **Database**: In-memory storage with PostgreSQL schema support
- **State Management**: Custom hooks with TanStack Query

## Prerequisites

- Node.js 20+ 
- npm or yarn
- Mistral AI API key (free tier available)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd tone-picker

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
```

**Getting a Mistral API Key:**
1. Visit [Mistral Console](https://console.mistral.ai/)
2. Create a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key to your `.env` file

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── text-editor.tsx # Text input component
│   │   ├── tone-matrix.tsx # 2x2 tone picker
│   │   └── tone-controls.tsx # Control panel
│   ├── hooks/              # Custom React hooks
│   │   └── use-text-history.ts # Undo/redo logic
│   ├── lib/                # Utilities and configurations
│   └── pages/              # Application pages
├── server/
│   ├── index.ts            # Express server setup
│   ├── routes.ts           # API endpoints
│   └── storage.ts          # Data storage interface
├── shared/
│   └── schema.ts           # TypeScript types and Zod schemas
└── README.md
```

## Usage

1. **Type or paste text** in the editor on the left
2. **Select a tone** from the 2x2 matrix on the right:
   - **Formal**: Professional business communication
   - **Casual**: Friendly and approachable
   - **Technical**: Detailed and precise
   - **Creative**: Engaging and vivid
3. **Use undo/redo** to navigate through changes
4. **Reset** to return to original text
5. **Text persists** automatically across browser sessions

## API Endpoints

- `POST /api/tone-adjustment` - Transform text tone
- `GET /api/text-history/:sessionId` - Retrieve user's history
- `GET /api/health` - Health check

## Technical Architecture

### State Management
- **Local State**: React hooks for UI state
- **Server State**: TanStack Query for API data
- **History Management**: Custom hook implementing chronological stack for undo/redo
- **Persistence**: localStorage for cross-session text retention

### API Integration
- **Security**: API key handled server-side, never exposed to client
- **Caching**: 5-minute TTL cache to optimize API usage
- **Error Handling**: Comprehensive error boundaries with user-friendly messages
- **Rate Limiting**: Built-in through Mistral AI's service

### Performance Optimizations
- **Response Caching**: Duplicate requests return cached results
- **Debounced Operations**: Prevents excessive API calls
- **Lazy Loading**: Components loaded as needed
- **Optimized Bundles**: Vite-powered build optimization

## Error Handling

The application gracefully handles various error scenarios:
- **Network Failures**: Retry logic with user feedback
- **API Rate Limits**: Proper error messages and guidance
- **Invalid Inputs**: Client-side validation before API calls
- **Server Errors**: Fallback responses and error logging

## Deployment

### Local Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MISTRAL_API_KEY=your_production_api_key
```

## Development

### Running Tests
```bash
npm test
```

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Husky for pre-commit hooks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the error messages in the browser console
2. Verify your Mistral API key is valid
3. Ensure all dependencies are installed
4. Check that the server is running on port 5000

## Acknowledgments

- Built with [Mistral AI](https://mistral.ai/) for text transformations
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)