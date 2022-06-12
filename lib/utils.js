import axios from 'axios'

// export async function fetcher(url) {
//   return axios(url).then((res) => res.results);
// }

// export const fetcher = async (url) => axios.get(url).then((res) => res.data)

export const fetcher = async (url) => axios.get(url).then((res) => res.results)

// export const fetcher = (url) => fetch(url).
//   then((res) => res.json()).then((data) => data.results)
