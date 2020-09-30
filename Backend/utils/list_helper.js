const dummy = (blogs) => {
    return 1;
  }
  

const totalLikes = (blogs) => {
    const totalLikesReducer = (accumulator, initialValue) => accumulator + initialValue
    if(blogs.length === 0)
        return 0
    return blogs.map(blog => blog.likes).reduce(totalLikesReducer)

}

module.exports = {
    dummy,
    totalLikes
  }