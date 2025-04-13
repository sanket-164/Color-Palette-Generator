# Project setup

1. Install packages
   ```shell
    npm install # or bun install
   ```
2. Setup .env
   ```shell
    cp .env.example .env
   ```
3. pull backend image if already not done
   ```shell
   make pull-image
   ```
4. Start docker container using makefile
   ```shell
   make start-backend
   ```
5. start frontend
   ```shell
   npm run dev # or bun run dev
   ```
