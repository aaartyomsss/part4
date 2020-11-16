const dummy = array => {
    return 1
}

const totalLikes = array => {
    const total = array.reduce((sum, currentPost) => sum + currentPost.likes, 0)

    return total
}

const favoritePost = array => {
    const sortTheArrayByLikes = array.sort((a, b) => b.likes - a.likes)

    return sortTheArrayByLikes[0]
}

const mostBlogs = array => {
    const dummyArray = []
    for (let i = 0; i < array.length; i++) {
        if (dummyArray.length === 0 ) {
            dummyArray.push({
                author: array[i].author,
                blogs: 0
            })
        } else {
            let checkUniquness = true
            dummyArray.forEach(obj => {
                if (obj.author === array[i].author) {
                    checkUniquness = false
                }
            })
            if (checkUniquness) {
                dummyArray.push({
                    author: array[i].author,
                    blogs: 0
                })
            }
        }
    }

    array.forEach(obj => {
        dummyArray.forEach(author => {
            if (author.author === obj.author) {
                author.blogs++
            }
        })
    })

    return dummyArray.sort((a, b) => b.blogs - a.blogs)[0]
}
// TODO Fix this code
const mostLikes = array => {
    const dummyArray = []
    for (let i = 0; i < array.length; i++) {
        if (dummyArray.length === 0 ) {
            dummyArray.push({
                author: array[i].author,
                likes: 0
            })
        } else {
            let checkUniquness = true
            dummyArray.forEach(obj => {
                if (obj.author === array[i].author) {
                    checkUniquness = false
                }
            })
            if (checkUniquness) {
                dummyArray.push({
                    author: array[i].author,
                    likes: 0
                })
            }
        }
    }

    array.forEach(obj => {
        dummyArray.forEach(author => {
            if (author.author === obj.author) {
                author.likes += obj.likes
            }
        })
    })

    return dummyArray.sort((a, b) => b.likes - a.likes)[0]
}

module.exports = {
    dummy,
    totalLikes,
    favoritePost,
    mostBlogs,
    mostLikes
}