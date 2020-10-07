import React, { useState } from 'react'
import blogService from '../services/blogs'

const AddBlog = ({message, setMessage, hideBlogOnCreate}) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        blogService.addBlog({
            title,
            author,
            url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
        setMessage('Created a new Blog')
        hideBlogOnCreate()
        setTimeout(() => {
            setMessage('')
        },5000)
    }


    return (
        <>
        <h2>
            create new
        </h2>
        <form onSubmit={handleSubmit}>
            <div>
                title:
                <input 
                    type="text"
                    name="title"
                    value={title}
                    onChange={({target}) => setTitle(target.value)}
                />
            </div>
            <div>
                author:
                <input 
                    type="text"
                    name="author"
                    value={author}
                    onChange={({target}) => setAuthor(target.value)}
                />
            </div>
            <div>
                url:
                <input 
                    type="text"
                    name="url"
                    value={url}
                    onChange={({target}) => setUrl(target.value)}
                />
            </div>
            <button type="submit">
                create
            </button>

            </form>
        </>
    )

}

export default AddBlog;