const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, value) => {
    return sum + value.likes
  }

  let numberOflikes = blogs.reduce(reducer, 0)
  if(blogs.length === 0){
    return 0
  }
  else{
    return numberOflikes
  }
}

module.exports = {
  dummy,
  totalLikes
}