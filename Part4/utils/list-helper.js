
const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((currentLikes,blog ) =>
  {return blog.likes + currentLikes }, 0)

  return likes
}

const favoriteBlog = (blogs) => {

  const favorite = blogs.reduce((prevBlog, current) => {
    return prevBlog > current.likes ? prevBlog : current
  })
  return favorite
}

const mostBlogs = (blogs) => {

  const author = blogs.reduce((acc, val) => {
    acc[val.author] = (acc[val.author] || 0) + 1
    return acc
  }, {})
  const bestAuthor = Object.keys(author).reduce((a, b) => author[a] > author[b] ? [a, author[a]] : [b, author[b] ])

  const newAuthor = {
    author: bestAuthor[0],
    blogs: bestAuthor[1]
  }
  return newAuthor
}

const mostLikes = (blogs) => {

  const authors = blogs.map((blog) => blog.author)
  let uniqueAuthors = [...new Set(authors)]

  const authorLikes = uniqueAuthors.map((author) => {
    const blogAuthor = blogs.filter((blog) => blog.author === author)

    const likesCount = blogAuthor.reduce((prevBlog, current) =>
      prevBlog + current.likes, 0
    )

    const amountOfLikesByAuthor = {
      author: author,
      likes: likesCount,
    }

    return amountOfLikesByAuthor
  })

  return authorLikes.reduce((a, b) => (a.likes > b.likes ? a : b))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}