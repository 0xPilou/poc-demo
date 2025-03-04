// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import {DemoGDA} from "../src/DemoGDA.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";

/*
SUPER_TOKEN_ADDRESS=0xb75F6aEf9F3BcE91856946bcB15B875ddEc68c2D \
forge script script/Deploy.s.sol:DeployScript --rpc-url ${BASE_RPC_URL} --broadcast --verify -vvv --etherscan-api-key ${BASESCAN_API_KEY}
*/
contract DeployScript is Script {
    DemoGDA public demoGDA;
    ISuperToken public superToken;

    function setUp() public {
        superToken = ISuperToken(vm.envAddress("SUPER_TOKEN_ADDRESS"));
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        demoGDA = new DemoGDA(address(superToken));

        vm.stopBroadcast();

        console.log("DemoGDA deployed at", address(demoGDA));
    }
}
