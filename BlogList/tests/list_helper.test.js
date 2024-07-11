const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('totalLikes', () => {
    const listWithOneBlog = [{
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    }]


    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })


    // it('when list has no blogs, the favorite should be null', () => {
    //     const result = favoriteBlog(listWithNoBlogs);
    //     assert.strictEqual(result, null);
    // });


})

describe("favouriteBlog test2", () => {
    const listWithMultipleBlogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Another Blog Post',
            author: 'John Doe',
            url: 'https://example.com/blog/another',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17fa',
            title: 'Yet Another Blog Post',
            author: 'Jane Smith',
            url: 'https://example.com/blog/yet-another',
            likes: 15,
            __v: 0
        }
    ];

    test('when list has multiple blogs', () => {
        const result = listHelper.favouriteBlog(listWithMultipleBlogs)
        assert.deepStrictEqual(result, {
            title: 'Yet Another Blog Post',
            author: 'Jane Smith',
            likes: 15
        })
    })

})

describe("MostLikedAuthor test2", () => {
    const listWithMultipleBlogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Another Blog Post',
            author: 'John Doe',
            url: 'https://example.com/blog/another',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17fa',
            title: 'Yet Another Blog Post',
            author: 'Jane Smith',
            url: 'https://example.com/blog/yet-another',
            likes: 15,
            __v: 0
        }
    ];

    test('multiple', () => {
        const result = listHelper.mostBlogs(listWithMultipleBlogs)
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            blogs: 1
        })
    })

})


describe("MostLikedForAnAuthor test3", () => {
    const listWithMultipleBlogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Another Blog Post',
            author: 'Edsger W. Dijkstra',
            url: 'https://example.com/blog/another',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17fa',
            title: 'Yet Another Blog Post',
            author: 'Jane Smith',
            url: 'https://example.com/blog/yet-another',
            likes: 15,
            __v: 0
        }
    ];

    test('most likes for an author', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogs)
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 15
        })
    })

})