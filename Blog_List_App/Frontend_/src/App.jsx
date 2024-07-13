import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/loginForm'
import CreateForm from './components/CreateForm'
import Notification from './components/Notification'
import BlogServices from './services/blogs'





const App = () => {
  const [username , setUsername] = useState('')
  const [password , setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [title , setTitle] = useState('')
  const [author , setAuthor] = useState('')
  const [url , setUrl] = useState('')
  const [errorMessage, setErrorMessage] =useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [createVisible, setCreateVisible] = useState(false)



  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogout =()=>{
    window.localStorage.clear()
    setUser(null)
  }
  console.log("user", user)
  const loginForm = ()=>{
    const hideWhenVisible = {display: loginVisible?'none':''}
    const showWhenVisible = {display:loginVisible?'':'none'}

    return(
      <div>
          <div className='loginDiv' style={hideWhenVisible }>
            <h2>Log in to read the blogs</h2>
            <button onClick={()=>setLoginVisible(true)}>log in</button>
          </div>
          <div style={showWhenVisible}>
           <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} user={user} setUser ={setUser} />
          </div>
       
      </div> 
    )
  }

  const createForm = ()=>{
    const hideWhenVisible = {display: createVisible?'none':''}
    const showWhenVisible = {display:createVisible?'':'none'}

    return(
      <div>
          <div style={hideWhenVisible}>
            
            <button onClick={()=>setCreateVisible(true)}>Create new blog +</button>
          </div>
          <div style={showWhenVisible}>
            <CreateForm 
              title={title} 
              author={author}
              url={url}
              setTitle={setTitle}
              setAuthor={setAuthor}
              setUrl={setUrl} 
              blogs={blogs}
              setBlogs={setBlogs} 
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </div>
       
      </div> 
    )
  }



  return (
    <div>
      {errorMessage !== null && <Notification errorMessage={errorMessage} />}
      
      {user === null 
      ? loginForm() 
      : (
        <> 
          <header>
            <h2>{user.username} logged in </h2>
            <button onClick={handleLogout}>logout</button>
          </header>
          
          <h1>Blogs</h1>
          {createForm()}
          {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />)}

        </>

      )}
     
    </div>
  )
}

export default App