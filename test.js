/* test/sample-test.js */
describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* implanta o mercado */
    const Market = await ethers.getContractFactory("NFTMarket") // referencia ao contrato NFTMarket.sol
    const market = await Market.deploy() // espera a implantação do mercado
    await market.deployed()
    const marketAddress = market.address

    /* implanta o contrato NFT*/
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress) // endereço do nft
    await nft.deployed() // espera o implantação do endereço para o constructor
    const nftContractAddress = nft.address // referencia do endereço

    let listingPrice = await market.getListingPrice() // obtem o preço de listagem
    listingPrice = listingPrice.toString()// tranforma o preço em uma string

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')// preço de venda

    /* cria dois tokens */
    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    /* coloca os tokens para venda */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    /* executa venda de token para outro usuário */
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice})

    /* consultar e devolver os itens não vendidos */
    items = await market.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        listingPrice,
        tokenUri,
      }

      let MarketAddress = { marketAddress }

      return [item, MarketAddress]
      
    }))
    console.log('items: ', items)
    
  })
})

//teste: cria uma venda no mercado criando dois nft "not fungible token" apos o processo um nft e vendido
