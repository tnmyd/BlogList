const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, value) => {
    return sum + value.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0){
    return null
  }
  else if(blogs.length === 1){
    return blogs[0]
  }
  else{
    let favBlog = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
    return favBlog
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}