# TokenHolders API

TokenHolders API is a scalable and modular RESTful backend built with **Node.js**, **TypeScript**, and **Express** for managing blockchain-related data such as networks, tokens, users, accounts, and transfers.

This project is designed to serve as a core backend service for crypto platforms, dashboards, exchanges, or internal tools that need structured access to token and holder data.

---

## Features

- 🚀 RESTful API architecture
- 🧩 Modular and maintainable TypeScript codebase
- 🌐 Blockchain network management
- 🪙 Token management
- 👤 User and account management
- 🔁 Transfer tracking
- 🔐 Role-based access control (Admin / User)
- ⚙️ Environment-based configuration
- 🧪 Ready for extension and integration

---

## Tech Stack

- **Node.js**
- **TypeScript**
- **Express**
- **express-async-errors**
- **ESLint & Prettier**
- **dotenv**

---

## Project Structure

```

src/
├── app.ts
├── controllers/
│   ├── accounts.ts
│   ├── networks.ts
│   ├── tokens.ts
│   ├── transfers.ts
│   └── users.ts
├── middlewares/
│   ├── admin.ts
│   └── auth.ts
├── routes/
├── services/
├── utils/
└── @types/

````

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/qaderizadeh/token-holders-api.git
cd token-holders-api
````

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Update environment variables as needed.

---

### 4. Run the project

#### Development mode

```bash
npm run dev
```

#### Production build

```bash
npm run build
npm start
```

---

## API Usage

The API exposes endpoints for:

* **Users** – authentication and user management
* **Accounts** – blockchain accounts and ownership
* **Networks** – supported blockchain networks
* **Tokens** – token metadata and configuration
* **Transfers** – tracking token transfers

(You can easily add Swagger / OpenAPI documentation if needed.)

---

## Security

* Middleware-based authorization
* Admin-only protected routes
* Environment-based secrets
* Designed for easy integration with external auth systems

---

## Use Cases

* Crypto dashboards
* Token holder analytics
* Exchange backend services
* Internal blockchain management tools
* Web3 admin panels

---

## Roadmap (Optional)

* 🔍 Token holder analytics
* 📊 Dashboard integration
* 🔗 Blockchain indexer integration
* 🧾 Swagger / OpenAPI docs
* 🧪 Unit & integration tests

---

## License

MIT License
