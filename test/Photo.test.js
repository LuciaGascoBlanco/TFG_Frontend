const {assert} = require('../dapp/node_modules/chai')
const {BigNumber} = require("../dapp/node_modules/bignumber.js")
const Photo = artifacts.require('./Photo.sol')

require('../dapp/node_modules/chai').use(require('../dapp/node_modules/chai-as-promised')).should()

contract('Photo', (accounts) => {
  let contract
  let BNPrice = new BigNumber("100000000000000000");

  before(async () => {
    contract = await Photo.deployed()
  })

  describe('deploying', async () => {
    it('deploys successfully', async () => {
      const address = accounts[0]
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
      console.log(address)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Photo')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'PHOTO')
    })

  })

  describe('minting', async () => {
    // SUCCESS
    it('creates and accepts a new token', async () => {
      const result = await contract.mint(BNPrice, '#EC058E')
      const balanceOf = await contract.balanceOf(accounts[0])

      assert.equal(balanceOf, 1)
      const event = result.logs[0].args
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
    })

    // FAILURE: cannot mint same photo twice
    it('creates and rejects a new token', async () => {
      await contract.mint('#EC058E').should.be.rejected;
    })
  })

  describe('indexing', async () => {
    // Mint 3 more tokens
    it('lists photos', async () => {
      await contract.mint(BNPrice, '#5386E4')
      await contract.mint(BNPrice, '#FFFFFF')
      await contract.mint(BNPrice, '#000000')
      const balanceOf = await contract.balanceOf(accounts[0])

      let photo
      let result = []

      assert.equal(balanceOf, 4)

      for (var i = 1; i <= balanceOf; i++) {
        photo = await contract.photos(i - 1)
        result.push(photo)
      }

      let expected = ['#EC058E', '#5386E4', '#FFFFFF', '#000000']
      assert.equal(result.join(','), expected.join(','))
    })
  })

})
