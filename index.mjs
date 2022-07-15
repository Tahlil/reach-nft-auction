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


let done = false;
const bidders = [];
const startBidders = async () => {
    let bid = minBid;
    const runBidder = async (who) => {
        const inc = stdlib.parseCurrency(Math.random() * 10);
        bid = bid.add(inc);

        const acc = await stdlib.newTestAccount(startingBalance);
        acc.setDebugLabel(who);
        await acc.tokeAccept(nftId);

        bidders.push([who, acc]);
        const ctc = acc.contract(backend, ctcCreator.getInfo());
        const getBal = async () => stdlib.formatCurrency(await stdlib.balanceOf(acc));

        console.log(`${who} decides to bid ${stdlib.formatCurrency(bid)}.`);
        console.log(`${who} balnce before is  ${await getBal()}`);
        try {
            const [ lastBidder, lastBid ] = await ctc.apis.Bidder.bid(bid);
            console.log(`${who} out bid the ${lastBidder} who bid ${stdlib.formatCurrency(lastBid)}.`);
        } catch (err) {
            console.log(`${who} failed to bid because the auction is over`);
        }
        console.log(`${who} balnce after is ${await getBal()}`);
    };

    
};

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



