import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib();
const startingBalance = stdlib.parseCurrency(100);

console.log("Creating a test account creator");

const accCreator = await stdlib.newTestAccount(startingBalance);

console.log("Creator create a testnet NFT");

const theNFT = await stdlib.launchToken(accCreator, "mystic", "NFT", {supply: 3} );
const nftId = theNFT.id;
const minBid = stdlib.parseCurrency(2);
const lenInBlocks = 9;

const params = {nftId, minBid, lenInBlocks};



const ctcCreator = accCreator.contract(backend);
await ctcCreator.participants.Creator({
    getSale: () => {
     console.log("Creator set params of sale", params);   
     return params;
    },
    auctionReady: () => {
        startBidders();
    },
    seeBid: (who, amount) => {
        console.log(`Creator saw that ${stdlib.formatAddress(who)} bid ${stdlib.formatCurrency(amount)}.`);
    },
    showOutcome: (winner, amount) => {
        console.log(`Creator saw that ${stdlib.formatAddress(winner)} won with ${stdlib.formatCurrency(amount)}`);
    }
}
    
);



