import { useEffect, useState, useRef } from 'react'
import { Album, getCollection } from './discogs'; 


function App() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  const carouselRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await getCollection(token, username);
    setAlbums(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="bg-neutral-900">
       <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-auto h-12 stroke-white w-auto">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
          </svg>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-green-600">Discogs Coverflow</h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-neutral-800 px-4 py-8 shadow sm:rounded-lg sm:px-10 border-neutral-600 border-[1px]">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-md text-green-700">Discogs Username</label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="token" className="block text-md text-green-700">Personal Access Token </label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
                <a 
                href='https://www.discogs.com/settings/developers' target='_blank'
                className="text-green-600 hover:text-green-500 text-sm hover:underline">Get a token</a>
          </div>
          <button 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
            type="submit"
          >
            Load Collection
          </button>
        </form>
      </div>
      </div>
    {loading ? (
          <div role="status" className='text-center my-4'>
          <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className ="sr-only">Loading...</span>
      </div>
        ) : (
          <div
          ref={carouselRef}
          className="flex overflow-x-scroll hide-scrollbar mt-4"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }}
        >
          {albums.map((album, index: number) => (
            <div
              key={album.id}
              className="flex-shrink-0 w-64 m-2 bg-white rounded-md shadow-md"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img
                src={album.basic_information.cover_image}
                alt={album.basic_information.title}
                className="w-full h-64 object-cover rounded-t-md"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold">
                  {album.basic_information.title}
                </h2>
                <p className="text-gray-600">
                  {album.basic_information.artists
                    .map((artist) => artist.name)
                    .join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

export default App
