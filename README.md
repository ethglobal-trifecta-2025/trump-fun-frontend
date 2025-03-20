# Trump.fun

A prediction market platform for betting on Trump's social media posts and public actions.

## Features

- Bet on what Trump might say or do next
- Simple user onboarding with embedded wallets (Privy)
- Trump-style prediction markets
- Responsive design with dark mode support

## Tech Stack

- NextJS 15 with App Router
- React 19
- TailwindCSS with shadcn/ui components
- Privy for authentication and embedded wallets
- Base network for blockchain transactions

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/trump-fun.git
cd trump-fun
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env.local` and add your Privy App ID.

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
