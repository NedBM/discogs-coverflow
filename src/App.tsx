import { useEffect, useState, useRef } from 'react'
import { Album, getCollection } from './discogs';

function App() {
  const [count, setCount] = useState(0)
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAlbumFlipped, setIsAlbumFlipped] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const data = await getCollection(token, username);
    setAlbums(data);
    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch with empty token and username
    fetchData();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.target as HTMLElement;
    const center = container.clientWidth / 2;

    let selectedIndex: number | null = null;
    let minDistance = Number.MAX_VALUE;

    container.childNodes.forEach((node, index) => {
      const rect = (node as HTMLElement).getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);

      if (distance < minDistance) {
        minDistance = distance;
        selectedIndex = index;
      }
    });

    setSelectedAlbum(selectedIndex);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && selectedAlbum !== null) {
      setIsAlbumFlipped((prevIsFlipped) => !prevIsFlipped);
    }
  };

  const handleAlbumClick = (index: number) => {
    const container = containerRef.current;
    const album = container?.childNodes[index] as HTMLElement;

    if (album) {
      album.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      setSelectedAlbum(index);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="bg-neutral-900">
       <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-green-600">Discogs Coverflow</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-neutral-800 px-4 py-8 shadow sm:rounded-lg sm:px-10 border-neutral-600 border-[1px]">
                <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-md text-green-700">Discogs Username</label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="token" className="block text-md text-green-700">Personal Access Token </label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <button 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
            type="submit"
          >
            Load Collection
          </button>
        </form>
      </div>
    </div>
    </div>
    {loading ? (
          <p className="text-center mt-4">Loading...</p>
        ) : (
          <div className="albums-container mt-6" onScroll={handleScroll} ref={containerRef}>
             {albums.map((album, index) => (
        <div
          key={album.id}
          className={`album ${selectedAlbum === index ? 'selected' : ''}`}
          onClick={() => handleAlbumClick(index)}
        >
            <img
              src={album.basic_information.cover_image}
              alt={album.basic_information.title}
            />
          <div className="album-info">
            <h2>{album.basic_information.title}</h2>
            <p>
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
  )
}

export default App
