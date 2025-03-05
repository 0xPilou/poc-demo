# Demo Project PRD

## Project Overview

You are building a web3 platform that allows:

- Community Owners to create Superfluid Pools and distribute rewards to their community.
- Community Members to collect units from a Superfluid Pool and claim rewards.

The team has already built the smart contracts, and you will be building the webapp using NextJS, shadcn, and TailwindCSS. For Web3 interactions, you will use wagmi, viem, and related web3 libraries.

## Technical Architecture

### Tech Stack
- **Frontend Framework**: React, Next.js
- **Styling**: TailwindCSS, Shadcn/UI
- **Web3 Integration**: Wagmi, Viem, RainbowKit, W3M, Reown AppKit
- **Smart Contracts**: Solidity (pre-built)
- **DeFi Integration**: Superfluid, UniswapV4
- **Other**: TypeScript

### File Structure

```
webapp/
├── src/
    ├── app/
    │   ├── page.tsx                      # Landing page (/)
    │   ├── pools/
    │   │   └── page.tsx                  # Community owner page (/pools)
    │   ├── rewards/
    │   │   └── page.tsx                  # Community member page (/rewards)
    │   └── layout.tsx                    # Root layout with providers
    ├── components/
    │   ├── ui/                           # shadcn UI components
    │   ├── landing/
    │   │   ├── owner-card.tsx            # Card for pool owners on landing
    │   │   └── member-card.tsx           # Card for members on landing
    │   ├── pools/
    │   │   ├── create-pool-form.tsx      # Form for creating pools
    │   │   ├── fund-pool-form.tsx        # Form for funding pools
    │   │   └── pool-list.tsx             # List of owner's pools
    │   ├── rewards/
    │   │   ├── pool-card.tsx             # Card component for each pool
    │   │   └── pool-table.tsx            # Table of available pools
    │   └── shared/
    │       └── connect-wallet.tsx        # Wallet connection component
    ├── hooks/
    │   ├── use-demo-gda-contract.ts      # Hook for DemoGDA contract interactions
    │   ├── use-erc20-contract.ts         # Hook for ERC20 token interactions
    │   ├── use-pools.ts                  # Hook for getting/managing pools
    │   └── use-user-units.ts             # Hook for user units in pools
    ├── lib/
    │   └── utils.ts                      # Utility functions
    ├── context/
    │   └── index.tsx                     # Existing Web3 Provider context (already implemented)
    └── config/
        └── contracts.ts                  # Contract addresses and ABIs
```

## Core Features

### 1. Landing Page (`/app/page.tsx`)

#### Description
The landing page serves as the entry point to the application, clearly presenting the two different user journeys.

#### Requirements
- Must be accessible at the root URL path (`/`).
- Must display two prominently styled cards:
  - **Community Owner Card**: Highlights the benefits of creating and managing pools, with a CTA button leading to `/pools`.
  - **Community Member Card**: Explains the benefits of subscribing to pools and earning rewards, with a CTA button leading to `/rewards`.
- Should include a clear value proposition for both user types.
- Must have a responsive design that works well on mobile and desktop.

#### Implementation Details
- Use `owner-card.tsx` and `member-card.tsx` components for each user type.
- Leverage the existing wallet connection functionality from `context/index.tsx`.
- Imagery should demonstrate the respective workflows for each user type.

### 2. Community Owner Features (`/app/pools/page.tsx`)

#### 2.1 Create a Pool

##### Description
Community owners need the ability to deploy new Superfluid pools through an intuitive form interface.

##### Requirements
- Form must collect all required parameters for the `createPool` function in the `DemoGDA` contract.
- Must validate input fields before submission.
- Must show appropriate loading states during transaction processing.
- Must display clear success/error messages after transaction completion.
- Must update the UI to show the newly created pool upon successful creation.

##### Implementation Details
- Use `create-pool-form.tsx` component to implement the form.
- Leverage `use-demo-gda-contract.ts` hook for contract interaction.
- Form should include tooltips explaining each parameter.
- Connect wallet button should be prominently displayed if no wallet is connected.

#### 2.2 Fund a Pool

##### Description
Owners need two methods to fund their pools: one-off payments (airdrops) and continuous streaming payments.

##### Requirements
- Support both funding methods in a user-friendly interface:
  - **One-off payment**: Implement through the `airdropDistribution` function.
  - **Streamed payment**: Implement through the `startDistribution` function.
- Must check and display current ERC20 token allowance.
- Must prompt for token approval if allowance is insufficient.
- Must show appropriate loading states during transactions.
- Must display real-time updates of pool funding status.

##### Implementation Details
- Use `fund-pool-form.tsx` component with tabs for different funding methods.
- Implement `use-erc20-contract.ts` hook to handle token approvals.
- Display current allowance and remaining balance prominently.
- Include a confirmation step before executing funding transactions.

### 3. Community Member Features (`/app/rewards/page.tsx`)

#### 3.1 List of Pools

##### Description
Community members need a clear view of all available pools they can subscribe to.

##### Requirements
- Display a comprehensive table of all available pools.
- For each pool, show:
  - The number of units owned by the connected user
  - The reward token (reference `SUPER_TOKEN_ADDRESS` in `contracts.ts`)
  - Current flow rate of the pool
  - Any relevant stats about the pool's performance
- Table must be sortable and include pagination if necessary.
- Data should refresh periodically to show real-time updates.

##### Implementation Details
- Implement using `pool-table.tsx` and `pool-card.tsx` components.
- Use `use-pools.ts` hook to fetch and manage pool data.
- Include visual indicators for pools with high flow rates or special promotions.
- Support filtering options to help users find relevant pools.

#### 3.2 Subscribe to a Pool

##### Description
Members need the ability to subscribe to pools and manage their units.

##### Requirements
- Each pool card must include:
  - A button to collect units from the pool with a quantity input
  - A button to decrease units from the pool with a quantity input
- Must validate input to prevent errors during transaction.
- Must show appropriate loading states during transaction processing.
- Must update unit counts in real-time after successful transactions.
- Must display clear explanations of the benefits of increasing units.

##### Implementation Details
- Implement unit management in the `pool-card.tsx` component.
- Use `use-user-units.ts` hook to track and update user units.
- Include confirmation dialogs for unit modifications.
- Display projected reward calculations based on unit count.

## Contract Integration

### Smart Contract Interaction

All smart contract interactions should be encapsulated in custom hooks:

1. **use-demo-gda-contract.ts**:
   - Must provide functions for all `DemoGDA` contract interactions
   - Should handle error cases and transaction states

2. **use-erc20-contract.ts**:
   - Must handle token approvals required before funding pools
   - Should track allowances and balances

### Contract References

- Reference `DEMO_GDA_ABI` and `DEMO_GDA_ADDRESS` from `webapp/src/config/contracts.ts` for all contract interactions.
- For token operations, use the `SUPER_TOKEN_ADDRESS` from the same file.
- Do not modify the contract configuration files unless adding new contract references.

## UI/UX Guidelines

- Use shadcn/UI components for consistent styling and behavior.
- All forms should have appropriate validation and error handling.
- Implement loading states for all blockchain transactions.
- Ensure responsive design works on devices from mobile to desktop.
- Include helpful tooltips explaining web3 concepts where appropriate.
- Leverage the existing wallet connection from `context/index.tsx` across the application.
- Provide clear feedback for successful and failed transactions.

## Cross-cutting Concerns

- **Web3 Provider**: Use the existing `context/index.tsx` provider to handle wallet connections across the application.
- **Error Handling**: Standardize error handling for both UI and blockchain errors.
- **Performance**: Minimize unnecessary re-renders and optimize data fetching.
- **Accessibility**: Ensure all interactive elements are keyboard accessible and screen reader friendly.

## Development Process

1. Set up the Next.js project with the TailwindCSS and shadcn/UI configuration.
2. Implement the shared components and reuse the existing web3 context from `context/index.tsx`.
3. Build the landing page with user journey cards.
4. Implement the pools page with creation and funding capabilities.
5. Implement the rewards page with pool listing and subscription features.
6. Add comprehensive testing for both UI components and contract interactions.
7. Perform end-to-end testing of complete user journeys.

## Repository Structure

The project is structured as a monorepo with the following packages:

```
poc-demo
└── packages
    ├── contracts
    └── webapp
```

- `contracts`: The smart contracts that power the platform (pre-built, no modifications needed).
- `webapp`: The web application you'll be building according to this PRD.

This PRD should give developers a clear understanding of what to build and how to structure the application for optimal maintainability and user experience. The web3 functionality will leverage the existing `ContextProvider` from `context/index.tsx`, which already sets up the WagmiProvider, QueryClientProvider, and Reown AppKit.
