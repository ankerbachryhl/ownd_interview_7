const sdk = require('api')('@reservoirprotocol/v1.0#cpy2fla8spifn');
const ethers = require('ethers');
async function main() {
    sdk.auth('demo-api-key');
// milady
    const token = '0x5af0d9827e0c53e4799bb226655a1de152a425a5'
    async function getCheapest(token, exchange) {
        const order =  (await sdk.getOrdersAsksV3({
            contracts: token,
            source: exchange,
            includePrivate: 'false',
            includeMetadata: 'false',
            includeRawData: 'false',
            sortBy: 'price',
            limit: '50',
            accept: '*/*'
        }))?.data?.orders?.[0]
        return `${exchange}: Milady #${order.tokenSetId.slice(49)} listed for ${order.price.amount.decimal} ${order.price.currency.symbol}($${order.price.amount.usd})`
    }

async function getSudo(token) {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: `{"query":"\\n    {\\n      collection(id: \\"${token}\\", ) {\\n        pairs(first: 100, skip: 0, where:{numNfts_gt: 0,type:\\"1\\"} orderBy:spotPrice,orderDirection:asc) {\\n    id\\n    collection {\\n      id\\n    }\\n    owner {\\n      id\\n    }\\n    token {\\n      id\\n      name\\n      symbol\\n      decimals\\n    }\\n    type\\n    assetRecipient\\n    bondingCurve\\n    delta\\n    fee\\n    spotPrice\\n    nftIds\\n\\t\\t\\t\\t\\tnumNfts\\n    ethBalance\\n    tokenBalance\\n    ethVolume}\\n      }\\n    }"}`,}
    let res= (await (await fetch('https://api.thegraph.com/subgraphs/name/zeframlou/sudoswap', options))?.json())
    res = res?.data?.collection?.pairs?.[0]
    return `Sudo: Milady #${res.nftIds} listed for ${res.spotPrice*10**-18} ETH`

}

    console.log(await getCheapest(ethers.utils.getAddress(token), 'opensea.io'))
    console.log(await getCheapest(ethers.utils.getAddress(token), 'looksrare.org'))
    console.log(await getCheapest(ethers.utils.getAddress(token), 'x2y2.io'))
    console.log(await getSudo(token))
}
main();
