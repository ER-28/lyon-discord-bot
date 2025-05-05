# lyon-discord-bot

# Discord Bot Project Architecture

## Directory Structure
```
project-root/
├── config/
│   └── config.js     # Configuration settings
├── src/
│   ├── index.js      # Main entry point
│   ├── bot.js        # Client setup and initialization
│   ├── commands/     # Command handlers
│   │   ├── index.js  # Command registry
│   │   ├── ping.js   # Ping command
│   │   └── hello.js  # Hello command
│   ├── events/       # Event handlers
│   │   ├── index.js  # Event registry
│   │   ├── ready.js  # Ready event
│   │   ├── messageCreate.js # Message event
│   │   ├── guildMemberAdd.js # New member event
│   │   └── messageReactionAdd.js # Reaction event
│   └── utils/        # Utility functions
│       └── welcomeManager.js # Welcome channel management
└── package.json      # Project dependencies
```

## Core Components

1. **Entry Point (index.js)** - Initializes the bot and handles errors

2. **Bot Configuration (bot.js)** - Sets up the Discord client with intents

3. **Commands System** - Modular command handlers

4. **Events System** - Modular event handlers

5. **Welcome Manager** - Handles the welcome channel flow and approval process

This architecture follows the separation of concerns principle, making the code more maintainable and easier to extend.