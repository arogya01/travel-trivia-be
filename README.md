# Globetrotter Backend

This is the backend API for the Globetrotter travel puzzle game, where users solve cryptic clues about famous destinations worldwide.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Programming language
- **Prisma** - ORM for database access (for user data)
- **Supabase** - PostgreSQL database provider
- **Static JSON** - For destination data

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Supabase account (for database)

### Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd globetrotter-be
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   ```
   cp .env.example .env
   ```
   Update the `.env` file with your Supabase credentials and other configuration values.

4. Generate Prisma client
   ```
   npm run prisma:generate
   ```

5. Push database schema to Supabase
   ```
   npm run prisma:push
   ```

6. (Optional) Seed the database with a sample user
   ```
   npm run seed
   ```

7. Start the development server
   ```
   npm run dev
   ```

The API will be running at `http://localhost:3000`.

## Data Structure

### Static Data
- Destinations, clues, and facts are stored in a static JSON file (`data/destinations.json`)
- This prevents client-side access to answers and simplifies the implementation

### Database Models
The database uses the following model:

- **User** - User profiles and statistics (games played, correct/incorrect answers)

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Destinations
- `GET /api/destinations` - Get all destinations (without clues)
- `GET /api/destinations/:id` - Get a specific destination with limited clue information

### Game
- `GET /api/game/random` - Get a random destination with clues and multiple choice options
- `POST /api/game/verify` - Verify a user's answer and update statistics if userId provided

### Users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get a specific user with their statistics

## Development

### Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the TypeScript code
- `npm run start` - Start the production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema changes to the database
- `npm run prisma:studio` - Open Prisma Studio to manage data
- `npm run seed` - Seed the database with a sample user
- `npm run lint` - Run TypeScript type checking without emitting files

## License

[MIT](LICENSE) 