# DemoGDA Project - Detailed PRD

## Project Overview

DemoGDA is a web3 platform that enables:

- Community Owners to create Superfluid Pools and distribute rewards to their community members
- Community Members to collect units from Superfluid Pools and claim rewards

The smart contracts are already built, and this PRD focuses on the webapp implementation using NextJS, shadcn, tailwindcss, and web3 libraries including wagmi, viem, and custom web3 utilities.

## Core Features

### 1. For Community Owner

#### 1.1 Create a Pool

**Location:** `/pools` page  
**Implementation Details:**

- Form with the following fields:
  - Pool Name (string)
  - Description (string)
  - Reward Token (address dropdown of supported tokens)
  - Initial Funding Amount (number)
  - Distribution Rate (number - tokens per second)
- Submit button that calls `createPool` function in the `DemoGDA` contract
- Success/failure notification after transaction
- Redirect to pool details page upon success

**Contract Reference:**

```solidity
// From DemoGDA.sol
function createPool(
  string memory _poolName,
  string memory _poolSymbol
) external returns (uint32 poolId);
```

#### 1.2 Fund a Pool

**Location:** Pool details page within `/pools`  
**Implementation Details:**

**One-off Payment (Airdrop):**

- Form with fields:
  - Amount (number)
- Submit button that calls `airdropDistribution` in the `DemoGDA` contract
- Transaction confirmation modal
- Success/failure notification

**Streamed Payment (Reward Stream):**

- Form with fields:
  - Flow Rate (tokens per second)
  - Duration (optional, calculated from amount and flow rate)
  - Total Amount (optional, calculated from flow rate and duration)
- Submit button that calls `startDistribution` in the `DemoGDA` contract
- Transaction confirmation modal
- Success/failure notification

**Contract References:**

```solidity
// From DemoGDA.sol
function airdropDistribution(uint32 _poolId, uint256 _amount) external;
function streamDistribution(uint256 poolId, uint256 amount, uint256 duration) external;
```

### 2. For Community Member

#### 2.1 List of Pools

**Location:** Home page (`/rewards`)  
**Implementation Details:**

- Table/grid layout of pool cards
- Each card displays:
  - Pool name and description
  - Reward token symbol and icon
  - Current flow rate (tokens per second)
  - User's current units in the pool
  - Total units in the pool
  - Estimated rewards per unit

#### 2.2 Subscribe to a Pool

**Location:** Pool cards on home page and pool details page  
**Implementation Details:**

**Collect Units:**

- Button labeled "Collect Units"
- Modal with input field for number of units to collect
- Submit button that calls appropriate contract function
- Transaction confirmation and success/failure notification

**Decrease Units:**

- Button labeled "Decrease Units"
- Modal with input field for number of units to decrease
- Submit button that calls appropriate contract function
- Transaction confirmation and success/failure notification

**Pool Details Page:**

- Detailed view of pool information
- Historical rewards graph
- Current subscription status
- Estimated rewards calculator

## User Flows

### Community Owner Flow

1. Connect wallet
2. Navigate to `/pools`
3. Create a new pool by filling out the form
4. View created pool details
5. Fund the pool using either one-off payment or streamed payment
6. Monitor pool activity and distribution

### Community Member Flow

1. Connect wallet
2. Browse available pools on home page
3. View details of interesting pools
4. Subscribe to pools by collecting units
5. Monitor rewards across subscribed pools
6. Decrease units or unsubscribe as needed

## Technical Architecture

### File Structure

```
poc-demo
└── packages
    ├── contracts (existing)
    └── webapp
        ├── src
        │   ├── app
        │   │   ├── page.tsx (Home page with pool listing)
        │   │   ├── pools
        │   │   │   ├── page.tsx (Pools management page)
        │   │   │   └── [id]
        │   │   │       └── page.tsx (Individual pool details)
        │   │   └── layout.tsx
        │   ├── components
        │   │   ├── ui (shadcn components)
        │   │   ├── layout
        │   │   │   ├── Header.tsx
        │   │   │   ├── Footer.tsx
        │   │   │   └── Sidebar.tsx
        │   │   ├── pools
        │   │   │   ├── PoolCard.tsx
        │   │   │   ├── PoolList.tsx
        │   │   │   ├── CreatePoolForm.tsx
        │   │   │   ├── FundPoolForm.tsx
        │   │   │   └── CollectUnitsModal.tsx
        │   │   └── common
        │   │       ├── ConnectWallet.tsx
        │   │       ├── TransactionNotification.tsx
        │   │       └── TokenSelector.tsx
        │   ├── config
        │   │   ├── contracts.ts (Contract addresses and ABIs)
        │   │   ├── tokens.ts (Supported tokens)
        │   │   └── chains.ts (Supported networks)
        │   ├── context
        │   │   ├── Web3Context.tsx
        │   │   └── PoolsContext.tsx
        │   ├── hooks
        │   │   ├── usePool.ts
        │   │   ├── usePools.ts
        │   │   ├── useCreatePool.ts
        │   │   ├── useFundPool.ts
        │   │   └── useCollectUnits.ts
        │   └── lib
        │       ├── utils.ts
        │       ├── web3
        │       │   ├── contracts.ts
        │       │   ├── transactions.ts
        │       │   └── providers.ts
        │       └── types.ts
        ├── public
        │   ├── images
        │   └── icons
        └── config files (next.config.js, tailwind.config.js, etc.)
```

### Data Models

#### Pool

```typescript
interface Pool {
  id: number;
  name: string;
  description: string;
  admin: string; // address
  superToken: string; // address
  tokenSymbol: string;
  tokenDecimals: number;
  flowRate: string; // BigNumber
  totalUnits: string; // BigNumber
  createdAt: number; // timestamp
}
```

#### UserPoolData

```typescript
interface UserPoolData {
  poolId: number;
  units: string; // BigNumber
  claimableRewards: string; // BigNumber
  rewardsPerSecond: string; // BigNumber
}
```

## API Integration

### Contract Interactions

The webapp will interact with the `DemoGDA` contract using the following functions:

1. **Read Functions:**

   - `getPool(uint32 poolId)` - Get pool details
   - `getUserUnits(uint32 poolId, address user)` - Get user's units in a pool
   - `getClaimableRewards(uint32 poolId, address user)` - Get user's claimable rewards

2. **Write Functions:**
   - `createPool(...)` - Create a new pool
   - `airdropDistribution(uint32 poolId, uint256 amount)` - One-off funding
   - `startDistribution(uint32 poolId, int96 flowRate)` - Start streamed funding
   - `collectUnits(uint32 poolId, uint128 units)` - Collect units from a pool
   - `decreaseUnits(uint32 poolId, uint128 units)` - Decrease units from a pool

### Event Listeners

The webapp will listen to the following events from the contract:

1. `PoolCreated(uint32 poolId, address admin)`
2. `DistributionStarted(uint32 poolId, int96 flowRate)`
3. `DistributionStopped(uint32 poolId)`
4. `UnitsCollected(uint32 poolId, address user, uint128 units)`
5. `UnitsDecreased(uint32 poolId, address user, uint128 units)`

## UI/UX Guidelines

### Design System

- Use shadcn/ui components for consistent UI
- Follow a dark/light theme with primary color being purple (#8A2BE2)
- Use Tailwind CSS for styling
- Ensure responsive design for mobile, tablet, and desktop

### User Experience

- Wallet connection should be prominent in the header
- Loading states for all transactions
- Clear error messages for failed transactions
- Tooltips for complex concepts
- Real-time updates of pool data without page refresh

## Testing Requirements

- Unit tests for all hooks and utilities
- Integration tests for contract interactions
- E2E tests for critical user flows
- Test on multiple networks (mainnet, testnet)

## Deployment Strategy

- Deploy to Vercel for the frontend
- Support multiple networks (Ethereum, Polygon, etc.)
- Environment-specific configurations

## Performance Considerations

- Optimize contract calls using multicall where possible
- Implement caching for frequently accessed data
- Lazy load components for faster initial page load
- Use SWR or React Query for data fetching and caching

## Security Considerations

- Implement proper input validation
- Use safe math libraries for calculations
- Protect against common web3 vulnerabilities
- Implement transaction confirmation modals

## Accessibility Requirements

- Ensure all components are keyboard navigable
- Provide proper ARIA labels
- Maintain sufficient color contrast
- Support screen readers

## Future Enhancements (Post-MVP)

- Analytics dashboard for pool owners
- Social features for community engagement
- Mobile app version
- Additional reward distribution mechanisms
- Integration with other DeFi protocols
