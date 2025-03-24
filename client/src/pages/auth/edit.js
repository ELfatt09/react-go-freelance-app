import { useEffect, useState } from 'react'
import { isAuthenticated, getAuthenticatedUser } from '../../auth'
import axios from 'axios'

function Edit() {

      const [username, setUsername] = useState(null)
      const [bio, setBio] = useState(null)
      useEffect(() => {
        if (isAuthenticated()) {
          getAuthenticatedUser().then(u => {
            setUsername(u?.username)
            setBio(u?.bio)
          })
        }
      }, [])

      const handleEdit = (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token');
        axios.put('http://localhost:8080/auth/edit', {
          "Username": username,
          "Bio": bio,
          "PfpPath": null
        }, {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
        window.location.reload();
      }
  return (
    <section className="bg-white dark:bg-gray-900">
  <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update {username} profile</h2>
    <form onSubmit={handleEdit}>
      <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
          <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" defaultValue={username} placeholder="Type product name" onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
          <textarea id="description" rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write a product description here..." onChange={(e) => setBio(e.target.value)} value={bio}></textarea>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
          Update Info
        </button>
      </div>
    </form>
  </div>
</section>
  )
}

export default Edit
