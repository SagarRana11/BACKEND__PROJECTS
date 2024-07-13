const { test } = require('node:test')
const assert = require('node:assert')
const reverse = require('../utils/list_helper').reverse
const greater = require('../utils/list_helper').greater


test('reverse of a', () => {
    const result = reverse('a')

    assert.strictEqual(result, "a")
})

test('reverse of react', () => {
    const result = reverse('react')

    assert.strictEqual(result, 'tcaer')
})

test('reverse of saippuakauppias', () => {
    const result = reverse('saippuakauppias')

    assert.strictEqual(result, 'saippuakauppias')
})

test('greater between 2 numbers', () => {
    const result = greater(23, 56)

    assert.strictEqual(result, 56)
})