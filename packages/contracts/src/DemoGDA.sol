// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import {
    PoolConfig,
    PoolERC20Metadata
} from "@superfluid-finance/ethereum-contracts/contracts/agreements/gdav1/GeneralDistributionAgreementV1.sol";
import {ISuperfluidPool} from
    "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/gdav1/ISuperfluidPool.sol";

import {SafeCast} from "@openzeppelin-v5/contracts/utils/math/SafeCast.sol";

using SuperTokenV1Library for ISuperToken;
using SafeCast for int256;

contract DemoGDA {
    ISuperToken public immutable superToken;

    uint256 public poolCount;

    mapping(uint256 poolId => ISuperfluidPool pool) public pools;

    error PoolDoesNotExist();

    constructor(address _superToken) {
        superToken = ISuperToken(_superToken);
    }

    function airdropDistribution(uint256 poolId, uint256 amount) external {
        superToken.transferFrom(msg.sender, address(this), amount);

        ISuperfluidPool pool = pools[poolId];
        if (address(pool) == address(0)) {
            revert PoolDoesNotExist();
        }
        superToken.distribute(address(this), pool, amount);
    }

    function streamDistribution(uint256 poolId, uint256 amount, uint256 duration) external {
        superToken.transferFrom(msg.sender, address(this), amount);

        ISuperfluidPool pool = pools[poolId];
        if (address(pool) == address(0)) {
            revert PoolDoesNotExist();
        }
        int96 flowRate = int256((amount) / duration).toInt96();
        superToken.distributeFlow(address(this), pool, flowRate);
    }

    function createPool(ISuperToken _superToken, string memory _poolName, string memory _poolSymbol)
        external
        returns (ISuperfluidPool pool)
    {
        PoolConfig memory poolConfig =
            PoolConfig({transferabilityForUnitsOwner: false, distributionFromAnyAddress: true});
        PoolERC20Metadata memory poolERC20Metadata =
            PoolERC20Metadata({name: _poolName, symbol: _poolSymbol, decimals: 18});

        pool = _superToken.createPoolWithCustomERC20Metadata(address(this), poolConfig, poolERC20Metadata);

        pools[poolCount] = pool;
        poolCount++;
    }

    function increasePoolUnits(uint256 _poolId) external {
        ISuperfluidPool pool = pools[_poolId];
        if (address(pool) == address(0)) {
            revert PoolDoesNotExist();
        }
        uint128 units = pool.getUnits(msg.sender);
        pool.updateMemberUnits(msg.sender, units + 1);
    }

    function decreasePoolUnits(uint256 _poolId) external {
        ISuperfluidPool pool = pools[_poolId];
        if (address(pool) == address(0)) {
            revert PoolDoesNotExist();
        }
        uint128 units = pool.getUnits(msg.sender);

        if (units > 0) {
            pool.updateMemberUnits(msg.sender, units - 1);
        }
    }
}
