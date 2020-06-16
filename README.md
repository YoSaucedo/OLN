## ArtistsLiberationFront ERC-721 token contract

![ALF](https://artistunleashed.app/static/media/logo.9a99eea9.png)

### About ALF

This contract is based on [opensea-creatures](https://github.com/ProjectOpenSea/opensea-creatures).

This is a very simple ERC-721 implementation for listing non-fungible digital art tokens on 
compliant marketplaces like [OpenSea](https://opensea.io) and [Rarebits](https://rarebits.io).

Additionally, this tokenContract whitelists the proxy accounts of OpenSea users so that they 
are automatically able to trade the ERC721 item on OpenSea (without having to pay gas for an 
additional approval). On OpenSea, each user has a "proxy" account that they control, and is 
ultimately called by the exchange contracts to trade their items. (Note that this addition 
does not mean that OpenSea itself has access to the items, simply that the users can list them 
more easily if they wish to do so).

Rinkeby: `0xedb1b90ac5152587915ff553c7a0b2358ad2598b`
Mainnet: `0xAEFa27A665d48e19C38437Ba7135c8107BB5928f`

### Node version

Either make sure you're running a version of node compliant with the `engines` requirement in 
`package.json`, or install Node Version Manager [`nvm`](https://github.com/creationix/nvm) and 
run `nvm use` to use the correct version of node.

### User Interface

The frontend application can be run against a local node or ganache-cli, or against compliant 
contracts on any network connected via [MetaMask](https://metamask.io/).

For development in the UI, run:
```
yarn install
yarn start
```

### Deploying contracts to a live network

1. Make sure you copy the latest version of your truffle-compiled contract into `./src/assets/contract.json`
1. You'll need to sign up for [Infura](https://infura.io). and get an API key.
1. Using your API key and the mnemonic for your Metamask wallet (make sure you're 
using a Metamask seed phrase that you're comfortable using for testing purposes), run:
```
export INFURA_KEY="<infura_key>"
export MNEMONIC="<metmask_mnemonic>"
truffle deploy --network rinkeby
```

### Minting tokens

After deploying to the Rinkeby network, there will be a tokenContract on Rinkeby that will be viewable 
on [Rinkeby Etherscan](https://rinkeby.etherscan.io). For example, here is a 
[recently deployed tokenContract](https://rinkeby.etherscan.io/address/0xeba05c5521a3b81e23d15ae9b2d07524bc453561). 
You should set this tokenContract address and the address of your Metamask account as environment variables 
when running the minting script:

```
export OWNER_ADDRESS="<my_address>"
export CONTRACT_ADDRESS="<deployed_contract_address>"
export NETWORK="rinkeby"
node scripts/mint.js
```

## License

MIT © [chris@yutopya.io](http://yutopya.io/)
