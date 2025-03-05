# Demo Project PRD

## Project Overview

You are building a web3 platform that allows:

- Community Owners to create Superfluid Pools and distribute rewards to their community.
- Community Members to collect units from a Superfluid Pool and claim rewards.

The team has already built the smart contracts, and you will be developing the webapp using NextJS, shadcn, and tailwindcss. For Web3 interactions, you will use wagmi, viem, and our own web3 libraries.

## Technical Architecture

### Tech Stack

- **Frontend**: React, Next.js, TypeScript
- **Styling**: TailwindCSS, Shadcn/UI
- **Web3 Integration**: Wagmi, Viem, W3M, RainbowKit
- **Smart Contracts**: Solidity, Superfluid, UniswapV4 (already implemented)

### File Structure

```
webapp/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page (/)
│   │   ├── layout.tsx                # Root layout with web3 providers
│   │   ├── pools/
│   │   │   └── page.tsx              # Community owner pools page
│   │   └── rewards/
│   │       └── page.tsx              # Community member rewards page
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn components
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   └── Footer.tsx            # Page footer
│   │   ├── common/
│   │   │   ├── Card.tsx              # Reusable card component
│   │   │   └── ConnectButton.tsx     # Wallet connection button
│   │   ├── pools/
│   │   │   ├── CreatePoolForm.tsx    # Form for creating new pools
│   │   │   ├── FundPoolForm.tsx      # Form for funding pools (airdrop/stream)
│   │   │   └── PoolList.tsx          # List of owned pools
│   │   └── rewards/
│   │       ├── PoolCard.tsx          # Card showing pool details for members
│   │       ├── PoolTable.tsx         # Table listing available pools
│   │       └── UnitActions.tsx       # Collect/decrease units buttons
│   │
│   ├── hooks/
│   │   ├── useContract.ts            # Hook for DemoGDA contract interaction
│   │   ├── usePools.ts               # Hook for managing pools (create, fund)
│   │   └── useRewards.ts             # Hook for member actions (collect, decrease)
│   │
│   ├── context/
│   │   ├── index.tsx                 # Web3 providers already configured
│   │   └── PoolContext.tsx           # Context for pool data management
│   │
│   ├── lib/
│   │   ├── types.ts                  # TypeScript types for pools/rewards
│   │   └── utils.ts                  # Helper functions
│   │
│   └── config/
│       └── contracts.ts              # Contains ABIs and addresses (do not modify)
│
├── components.json                   # shadcn components config
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Core Features

### 1. Landing Page (`src/app/page.tsx`)

**Implementation Details:**

- Create a visually appealing landing page with two primary card sections
- Each card should have:
  - A meaningful icon or illustration
  - A clear headline explaining the user role
  - 2-3 bullet points highlighting benefits
  - A prominent CTA button
- The page should be responsive and optimized for both desktop and mobile views
- Include a navigation header with wallet connection button

**Card Content Guidelines:**

- **Community Owner Card**:
  - Headline: "Create & Fund Reward Pools"
  - Benefits: Easy pool creation, flexible funding options (one-time or streamed), transparent distribution
  - CTA: "Manage Pools" → `/pools`
- **Community Member Card**:
  - Headline: "Collect Rewards from Pools"
  - Benefits: View available pools, collect units, receive streaming rewards
  - CTA: "View Rewards" → `/rewards`

### 2. For Community Owner (`src/app/pools/page.tsx`)

#### 2.1 Create a Pool

**Implementation Details:**

- Use `CreatePoolForm.tsx` component to handle pool creation
- Form should include all parameters required by the `createPool` function in `DemoGDA.sol`
- Input validation should verify all required fields are provided and in correct format
- Display real-time gas estimation before submission
- Show a success message with pool address after creation
- Include error handling for rejected transactions

**Form Fields:**

- Pool Name (optional, for UI only)
- SuperToken address
- Other parameters required by `createPool` function

#### 2.2 Fund a Pool

**Implementation Details:**

- Use `FundPoolForm.tsx` to handle both funding options
- Implement a tab or toggle between "One-off Payment" and "Streamed Payment"
- For each option, provide appropriate fields based on the respective contract functions
- Show the user's token balance and allow them to select up to their maximum available tokens
- Include a confirmation step before submitting transactions
- Add loading states during transaction processing

**One-off Payment Fields:**

- Pool address (selector)
- Amount to distribute
- Distribution parameters according to `airdropDistribution` function

**Streamed Payment Fields:**

- Pool address (selector)
- Flow rate
- Duration (optional, calculated from amount/flow rate)
- Stream parameters according to `startDistribution` function

#### 2.3 Pool Management

**Implementation Details:**

- Implement `PoolList.tsx` to display pools created by the connected wallet
- Each pool entry should show:
  - Pool address
  - SuperToken being used
  - Total amount funded
  - Current state (active/inactive)
  - Active distributions (if any)
- Include options to manage existing pools (add funds, stop distributions)

### 3. For Community Member (`src/app/rewards/page.tsx`)

#### 3.1 List of Pools

**Implementation Details:**

- Use `PoolTable.tsx` to display all available pools in a responsive table format
- Implement filtering options (active pools, highest rewards, etc.)
- Each pool should be represented by a `PoolCard.tsx` component
- Fetch data from the blockchain to display up-to-date information
- Implement pagination if many pools are available

**Pool Card Required Data:**

- Number of units the connected user owns
- Reward token information (from `DemoGDA.superToken`)
- Current flow rate of the pool
- Estimated rewards based on current holdings
- Last update timestamp

#### 3.2 Subscribe to a Pool

**Implementation Details:**

- Implement `UnitActions.tsx` with two primary buttons:
  - "Collect Units" - to increase units in the pool
  - "Decrease Units" - to reduce units in the pool
- Each action should show a modal/form with:
  - Current units owned
  - Input for units to collect/decrease
  - Estimated impact on rewards
  - Confirmation button
- Include transaction status feedback
- Update UI immediately after successful transactions

## Technical Requirements

### Web3 Integration

- Use `useContract.ts` hook to create a reusable interface for all DemoGDA contract interactions
- Leverage the existing web3 providers in `context/index.tsx`
- Handle all common web3 scenarios:
  - Wrong network
  - Transaction approval
  - Transaction success/failure
  - Account switching

### Performance Considerations

- Implement data caching to minimize blockchain calls
- Use optimistic UI updates when appropriate
- Implement proper loading states for all async operations
- Consider using SWR or React Query for data fetching and caching

### Mobile Responsiveness

- All pages and components must be responsive
- Forms should adjust appropriately for mobile input
- Tables should have mobile-friendly alternatives (cards)
- Touch targets should follow accessibility guidelines

## Development Guidelines

- Follow TypeScript best practices with proper type definitions in `src/lib/types.ts`
- Use shadcn/ui components for consistent UI
- Implement proper error handling at all levels
- Add helpful comments for complex web3 interactions
- Don't modify `src/config/contracts.ts` unless absolutely necessary

## Implementation Phases

1. **Setup Phase**

   - Initialize project structure
   - Implement basic navigation and layout

2. **Core Functionality Phase**

   - Implement landing page
   - Create pool creation and funding forms
   - Develop pool listing and unit collection UI

3. **Polish Phase**
   - Add loading states and error handling
   - Optimize mobile experience
   - Implement additional features if time permits

## Additional Notes

The main contract to interact with is `DemoGDA.sol` located in `packages/contracts/src/DemoGDA.sol`. Refer to this contract for all function signatures and parameters required for web3 interactions. The contract address and ABI are provided in `src/config/contracts.ts`.

Note that web3 providers and wallet connection are already configured in `src/context/index.tsx` - there's no need to set these up again.
