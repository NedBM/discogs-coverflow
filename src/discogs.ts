import axios, { AxiosResponse } from 'axios';

const createApiClient = (token: string) => {
  return axios.create({
    baseURL: 'https://api.discogs.com/',
    headers: {
      'Authorization': `Discogs token=${token}`,
      'User-Agent': 'discogs_api_cf/1.0'
    }
  });
}

// const createApiClient = (token: string) => {
//   return axios.create({
//     baseURL: 'https://api.discogs.com/',
//     headers: {
//       'Authorization': `Discogs token=${token}`,
//       'From': 'ndnotic@gmail.com', // Replace with your email or other identifier
//       'X-Requested-With': 'XMLHttpRequest',
//     },
//   });
// };

export interface Artist {
  name: string;
}

export interface BasicInformation {
  title: string;
  cover_image: string;
  artists: Artist[];
}

export interface Track {
  title: string;
  position: string;
}

export interface Album {
  id: number;
  basic_information: BasicInformation;
  tracklist: Track[];
}

export async function getCollection(token: string, username: string): Promise<Album[]> {
  try {
    const apiClient = createApiClient(token);

    const response: AxiosResponse<{ releases: any[] }> = await apiClient.get(
      `users/${username}/collection/folders/0/releases?per_page=5`
    );
    console.log("Request headers:", apiClient.defaults.headers);

    const albums = await Promise.all(
      response.data.releases.map(async (release) => {
        const albumResponse = await apiClient.get(release.resource_url);
        const albumData = albumResponse.data;

        return {
          id: release.id,
          basic_information: release.basic_information,
          tracklist: albumData.tracklist
            ? albumData.tracklist.map((track: any) => ({
                title: track.title,
                position: track.position,
                credits: track.extraartists || [],
              }))
            : [],
        };
      })
    );

    return albums;
  } catch (error: any) {
    console.error("Error fetching collection:", error.response?.data || error.message);
    return [];
  }
}