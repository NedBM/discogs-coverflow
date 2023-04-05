import { useEffect, useState, useRef } from 'react'
import { Album, getCollection } from './discogs';
import styled from 'styled-components'

const AlbumsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  perspective: 1500px;
  position: relative;
`;

const AlbumDiv = styled.div<{ selected: boolean; left: boolean; right: boolean }>`
  transform-style: preserve-3d;
  transition: all 0.5s ease;
  cursor: pointer;
  position: absolute;

  ${({ selected }) => selected && 'transform: translateZ(200px);'}
  ${({ left }) => left && 'transform: rotateY(40deg) translateX(-100px);'}
  ${({ right }) => right && 'transform: rotateY(-40deg) translateX(100px);'}
`;

const AlbumImage = styled.img`
  max-width: 200px;
  max-height: 200px;
`;


function App() {
  const [count, setCount] = useState(0)
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAlbumFlipped, setIsAlbumFlipped] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  const updateCoverflow = (selectedIndex: number) => {
    const albumElements = Array.from(document.querySelectorAll('.album'));
    albumElements.forEach((element, index) => {
      element.classList.remove('selected', 'left', 'right');
  
      if (index < selectedIndex) {
        element.classList.add('left');
      } else if (index === selectedIndex) {
        element.classList.add('selected');
      } else {
        element.classList.add('right');
      }
    });
  };

  const handleOrientationChange = () => {
    if (window.innerHeight > window.innerWidth) {
      updateCoverflow(selectedAlbum);
    } else {
      // Revert to original layout if needed.
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const data = await getCollection(token, username);
    setAlbums(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // window.addEventListener('resize', handleOrientationChange);
    // return () => {
    //   window.removeEventListener('resize', handleOrientationChange);
    // };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.target as HTMLElement;
    const center = container.clientWidth / 2;
  
    let selectedIndex: number = 0;
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
              // id="username"
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
    </div>
    {loading ? (
          <p className="text-center mt-4">Loading...</p>
        ) : (
          <AlbumsContainer className="albums-container mt-6" onScroll={handleScroll} ref={containerRef}>
             {albums.map((album, index) => (
        <AlbumDiv
          key={album.id}
          className={`album ${selectedAlbum === index ? 'selected' : ''}`}
          onClick={() => handleAlbumClick(index)}
          selected={selectedAlbum === index}
          left={selectedAlbum > index}
          right={selectedAlbum < index}
        >
            <AlbumImage
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
        </AlbumDiv>
      ))}
          </AlbumsContainer>
        )}
    </div>
  )
}

export default App
