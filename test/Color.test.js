const { assert } = require('chai')

const Color = artifacts.require('./Color.sol')

require('chai').use(require('chai-as-promised')).should()

contract('Color', (accounts) => {
  let contract

  before(async () => {
    contract = await Color.deployed()
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
      assert.equal(name, 'Color')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'COLOR')
    })

  })

  describe('minting', async () => {

    it('creates and accepts a new token', async () => {
      const result = await contract.mint('#EC058E')
      const balanceOf = await contract.balanceOf(accounts[0])

      // SUCCESS
      assert.equal(balanceOf, 1)
      const event = result.logs[0].args
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
    })
    it('creates and rejects a new token', async () => {
      // FAILURE: cannot mint same color twice
      await contract.mint('#EC058E').should.be.rejected;
    })
  })

  describe('indexing', async () => {
    it('lists colors', async () => {
      // Mint 3 more tokens
      await contract.mint('#5386E4')
      await contract.mint('#FFFFFF')
      await contract.mint('#000000')
      const balanceOf = await contract.balanceOf(accounts[0])

      let color
      let result = []

      assert.equal(balanceOf, 4)

      for (var i = 1; i <= balanceOf; i++) {
        color = await contract.colors(i - 1)
        result.push(color)
      }

      let expected = ['#EC058E', '#5386E4', '#FFFFFF', '#000000']
      assert.equal(result.join(','), expected.join(','))
    })
  })

})
