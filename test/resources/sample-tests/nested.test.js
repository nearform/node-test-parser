import assert from 'node:assert'
import { describe, it } from 'node:test'

describe('module', () => {
  describe('function', () => {
    describe('behavior', () => {
      it('asserts 1 === 1', t => {
        t.diagnostic('JJJJAJAJSDADS')
        assert.strictEqual(1, 1)
      })

      it('fails', t => {
        t.diagnostic('IIIIOASDASD')
        assert.strictEqual(1, 2)
      })
    })
  })
})
