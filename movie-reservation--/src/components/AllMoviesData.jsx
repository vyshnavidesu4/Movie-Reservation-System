// AllMoviesData.js
import { useState } from 'react';

import { images } from './imageImports';
export const generatePosterSVG = (title, color1, color2) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="500" fill="url(#grad)"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
          fill="white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
      ${title.split(' ').slice(0, 2).join(' ')}
    </text>
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)">
      Movie
    </text>
  </svg>`;
};

export const allMovies = [
  // Now Showing Movies
  {
    id: 1,
    title: 'Little Hearts',
    image: images.littleheart,
    rating: '8.5/10',
    votes: '22.4K Votes',
    genre: 'Comedy • Drama',
    language: 'Telugu',
    status: 'now-showing',
    duration: '2h 02m',
    releaseDate: 'September 27, 2025'
  },
  {
    id: 2,
    title: 'Mirai',
    image: images.mirai,
    rating: '8.7/10',
    votes: '18.9K Votes',
    genre: 'Action • Thriller',
    language: 'Telugu,Hindi,Tamil',
    status: 'now-showing',
    duration: '2h 35m',
    releaseDate: 'September 15, 2025'
  },
  {
    id: 3,
    title: 'Maha Avatar Narasimha',
    image: images.narasimhaavatar,
    rating: '9.3/10',
    votes: '15.2K Votes',
    genre: 'Action • Thriller',
    language: 'Tamil,Telugu,Kannada,Malayalam,Hindi ',
    status: 'now-showing',
    duration: '2h 28m',
    releaseDate: 'September 12, 2025'
  },
  {
    id: 4,
    title: 'Kishkindhapuri',
    image: images.kishkindhapuri,
    rating: '8.1/10',
    votes: '12.7K Votes',
    genre: 'Horror • Comedy',
    language: 'Telugu',
    status: 'now-showing',
    duration: '2h 42m',
    releaseDate: 'September 12, 2025'
  },
  {
    id: 5,
    title: 'Lokah',
    image: images.lokah,
    rating: '8.7/10',
    votes: '22.4K Votes',
    genre: 'Adventure • Fantasy',
    language: 'Telugu, Malayalam, Kanada, Tamil',
    status: 'now-showing',
    duration: '2h 15m',
    releaseDate: 'September 15, 2025'
  },
  {
    id: 6,
    title: 'Baby John',
    image: images.babyjohn,
    rating: '9.5/10',
    votes: '110.1K Votes',
    genre: 'Action',
    language: 'Hindi',
    status: 'now-showing',
    duration: '2h 10m',
    releaseDate: 'September 20, 2025'
  },
  {
    id: 7,
    title: 'Eleven',
    image: images.eleven,
    rating: '9.2/10',
    votes: '95.3K Votes',
    genre: 'Action • Drama • Epic',
    language: 'Tamil, Telugu, Hindi, Malayalam,Kannada',
    status: 'now-showing',
    duration: '2h 55m',
    releaseDate: 'September 14, 2025'
  },
  {
    id: 8,
    title: 'Vettaiyan',
    image: images.vettiyaan,
    rating: '8.8/10',
    votes: '45.6K Votes',
    genre: 'Action • Thriller',
    language: 'Tamil',
    status: 'now-showing',
    duration: '2h 38m',
    releaseDate: 'September 22, 2024'
  },
  {
    id: 9,
    title: 'Param Sundari',
    image: images.paramasundari,
    rating: '9.1/10',
    votes: '78.9K Votes',
    genre: 'Romantic • Comedy',
    language: 'Hindi',
    status: 'now-showing',
    duration: '2h 50m',
    releaseDate: 'September 29, 2025'
  },
  {
    id: 10,
    title: 'Ghaati',
    image: images.ghaati,
    rating: '8.6/10',
    votes: '34.2K Votes',
    genre: 'Action • Crime • Drama',
    language: 'Telugu, Malayalam, Hindi, Tamil, Kannada',
    status: 'now-showing',
    duration: '2h 25m',
    releaseDate: 'September 26, 2025'
  },
  // Upcoming Movies
  {
    id: 11,
    title: 'Dancing Dad',
    image: images.dancingdad,
    rating: '9.3/10',
    votes: '89.7K Votes',
    genre: 'Drama',
    language: 'Hindi',
    status: 'now-showing',
    duration: '2h 45m',
    releaseDate: 'September 16, 2025'
  },
  {
    id: 12,
    title: 'OG',
    image: images.og,
    rating: '8.4/10',
    votes: '23.8K Votes',
    genre: 'Action • Crime',
    language: 'Telugu, Hindi, Tamil, Kannada, Malayalam',
    status: 'now-showing',
    duration: '2h 32m',
    releaseDate: 'September 26, 2025'
  },
  {
    id: 13,
    title: '3 BHK',
    image: images.bhk,
    rating: '9.1/10',
    votes: '98.7K Votes',
    genre: 'Drama • Family',
    language: 'Tamil, Telugu',
    status: 'now-showing',
    duration: '2h 55m',
    releaseDate: 'September 16, 2025'

  },
  {
    id: 14,
    title: 'Telusu Kada',
    image: images.telusukada,
    rating: '8.9/10',
    votes: '56.1K Votes',
    genre: 'Romantic  • Comedy',
    language: 'Telugu',
    status: 'upcoming',
    duration: '2h 35m',
    releaseDate: 'October 17, 2025'
  },
  {
    id: 15,
    title: 'Maalik',
    image: images.maalik,
    rating: '8.7/10',
    votes: '42.3K Votes',
    genre: 'Action • Crime • Drama',
    language: 'Hindi',
    status: 'now-showing',
    duration: '2h 40m',
    releaseDate: 'September 23, 2025'
  },
  {
    id: 16,
    title: 'Paradha',
    image: images.paradha,
    rating: '9.4/10',
    votes: '120.5K Votes',
    genre: 'Drama',
    language: 'Telugu, Malayalam',
    status: 'now-showing',
    duration: '3h 10m',
    releaseDate: 'September 22, 2025'
  },
  {
    id: 17,
    title: 'Rajasaab',
    image: images.rajasaab,
    rating: '9.0/10',
    votes: '67.4K Votes',
    genre: 'Romantic • Horror • Comedy',
    language: 'Telugu',
    status: 'upcoming',
    duration: '2h 28m',
    releaseDate: 'October 10, 2025'
  },
  {
    id: 18,
    title: 'Sitaare Zameen Par',
    image: images.sitaarezameenpar,
    rating: '8.8/10',
    votes: '76.3K Votes',
    genre: 'Comedy • Drama',
    language: 'Hindi',
    status: 'upcoming',
    duration: '2h 25m',
    releaseDate: 'October 3, 2025'
  },
  {
    id: 19,
    title: 'Ace',
    image: images.ace,
    rating: '8.9/10',
    votes: '65.2K Votes',
    genre: 'Romantic • Crime • Comedy',
    language: 'Tamil, Telugu',
    status: 'upcoming',
    duration: '2h 45m',
    releaseDate: 'October 4, 2025'
  },
  {
    id: 20,
    title: 'Padakkalam',
    image: images.padakkalam,
    rating: '8.6/10',
    votes: '54.8K Votes',
    genre: 'Comedy • Fantasy • Drama',
    language: 'Hindi, Tamil, Telugu, Kannada',
    status: 'upcoming',
    duration: '2h 30m',
    releaseDate: 'October 15, 2025'
  }
];