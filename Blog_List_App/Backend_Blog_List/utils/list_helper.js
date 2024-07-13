const reverse = (string) => {
    return string
        .split('')
        .reverse()
        .join("")
}

const greater = (a, b) => {
    return Number(a) > Number(b) ? a : b
}
const average = (array) => {
    const reducer = (sum, item) => {
        return sum + item
    }
    return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length
}
const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}
const favouriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    const favorite = blogs.reduce((prev, current) => {
        return (current.likes > prev.likes) ? current : prev
    })
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    };
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const blogCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1;
        return counts;
    }, {});

    let maxBlogs = 0;
    let topAuthor = '';
    Object.entries(blogCounts).forEach(([author, count]) => {
        if (count > maxBlogs) {
            maxBlogs = count;
            topAuthor = author;
        }
    });

    // Return the result
    return {
        author: topAuthor,
        blogs: maxBlogs
    };
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const blogCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + blog.likes;
        return counts;
    }, {});

    let maxLikes = 0;
    let topAuthor = '';
    Object.entries(blogCounts).forEach(([author, count]) => {
        if (count > maxLikes) {
            maxLikes = count;
            topAuthor = author;
        }
    });

    // Return the result
    return {
        author: topAuthor,
        likes: maxLikes
    };
}


module.exports = {
    reverse,
    average,
    greater,
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}