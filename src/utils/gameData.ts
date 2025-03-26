
// Movie data with TMDB API integration

export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  releaseYear: number;
  hint?: string;
  tmdbId?: number; // Added TMDB ID for fetching images
}

// TMDB API configuration
// Using images with CORS-friendly proxy or direct absolute URLs when possible
const PROXY_URL = ""; // Left empty for now, we'll use direct URLs

// Top 100 movies collection with backdrop image URLs
export const moviesCollection: Movie[] = [
  // Original 5 movies - updated with backdrop images
  {
    id: "1",
    title: "Inception",
    imageUrl: "https://image.tmdb.org/t/p/w780/s3TBrRGB1iav7gFOCNx3H31MoES.jpg", // Backdrop
    releaseYear: 2010,
    hint: "Dreams within dreams",
    tmdbId: 27205
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    imageUrl: "https://image.tmdb.org/t/p/w780/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg", // Backdrop
    releaseYear: 1994,
    hint: "Prison escape drama",
    tmdbId: 278
  },
  {
    id: "3",
    title: "Pulp Fiction",
    imageUrl: "https://image.tmdb.org/t/p/w780/suaEOtk1N1sgg2QM528GlEFZu5s.jpg", // Backdrop
    releaseYear: 1994,
    hint: "Non-linear storytelling",
    tmdbId: 680
  },
  {
    id: "4",
    title: "The Matrix",
    imageUrl: "https://image.tmdb.org/t/p/w780/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg", // Backdrop
    releaseYear: 1999,
    hint: "Reality is not what it seems",
    tmdbId: 603
  },
  {
    id: "5",
    title: "The Godfather",
    imageUrl: "https://image.tmdb.org/t/p/w780/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg", // Backdrop
    releaseYear: 1972,
    hint: "An offer you can't refuse",
    tmdbId: 238
  },
  // First 25 movies already in the list - with backdrop images
  {
    id: "6",
    title: "The Dark Knight",
    imageUrl: "https://image.tmdb.org/t/p/w780/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg", // Backdrop
    releaseYear: 2008,
    hint: "Why so serious?",
    tmdbId: 155
  },
  {
    id: "7",
    title: "Schindler's List",
    imageUrl: "https://image.tmdb.org/t/p/w780/loRmLlopszkGPd9WRkURY7gXMf0.jpg", // Backdrop
    releaseYear: 1993,
    hint: "The man who saved lives during the Holocaust",
    tmdbId: 424
  },
  {
    id: "8",
    title: "The Lord of the Rings: The Return of the King",
    imageUrl: "https://image.tmdb.org/t/p/w780/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg", // Backdrop
    releaseYear: 2003,
    hint: "The final chapter of a fantasy trilogy",
    tmdbId: 122
  },
  {
    id: "9",
    title: "Fight Club",
    imageUrl: "https://image.tmdb.org/t/p/w780/hZkgoQYus5vegHoetLkCJzb17zJ.jpg", // Backdrop
    releaseYear: 1999,
    hint: "First rule: don't talk about it",
    tmdbId: 550
  },
  {
    id: "10",
    title: "Forrest Gump",
    imageUrl: "https://image.tmdb.org/t/p/w780/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg", // Backdrop
    releaseYear: 1994,
    hint: "Life is like a box of chocolates",
    tmdbId: 13
  },
  {
    id: "11",
    title: "Star Wars: Episode V - The Empire Strikes Back",
    imageUrl: "https://image.tmdb.org/t/p/w780/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg",
    releaseYear: 1980,
    hint: "I am your father",
    tmdbId: 1891
  },
  {
    id: "12",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    imageUrl: "https://image.tmdb.org/t/p/w780/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    releaseYear: 2001,
    hint: "One ring to rule them all",
    tmdbId: 120
  },
  {
    id: "13",
    title: "Goodfellas",
    imageUrl: "https://image.tmdb.org/t/p/w780/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    releaseYear: 1990,
    hint: "As far back as I can remember...",
    tmdbId: 769
  },
  {
    id: "14",
    title: "One Flew Over the Cuckoo's Nest",
    imageUrl: "https://image.tmdb.org/t/p/w780/3jcbDmRFiQ83drXNOvRDeKHxS0C.jpg",
    releaseYear: 1975,
    hint: "A rebel in a mental institution",
    tmdbId: 510
  },
  {
    id: "15",
    title: "The Silence of the Lambs",
    imageUrl: "https://image.tmdb.org/t/p/w780/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    releaseYear: 1991,
    hint: "A census-taker once tried to test me",
    tmdbId: 274
  },
  {
    id: "16",
    title: "Interstellar",
    imageUrl: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    releaseYear: 2014,
    hint: "Love transcends time and space",
    tmdbId: 157336
  },
  {
    id: "17",
    title: "Saving Private Ryan",
    imageUrl: "https://image.tmdb.org/t/p/w780/kIjyhSH7SEHcZQ5IGAltXquLJZC.jpg",
    releaseYear: 1998,
    hint: "WWII mission to find one soldier",
    tmdbId: 857
  },
  {
    id: "18",
    title: "The Green Mile",
    imageUrl: "https://image.tmdb.org/t/p/w780/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
    releaseYear: 1999,
    hint: "A gentle giant on death row",
    tmdbId: 497
  },
  {
    id: "19",
    title: "Life Is Beautiful",
    imageUrl: "https://image.tmdb.org/t/p/w780/74hLDKjD5aGYOotO6esUVaeISa2.jpg",
    releaseYear: 1997,
    hint: "A father makes a concentration camp seem like a game",
    tmdbId: 637
  },
  {
    id: "20",
    title: "Seven",
    imageUrl: "https://image.tmdb.org/t/p/w780/6yoghtyTpznpBik8EngEmJskVUO.jpg",
    releaseYear: 1995,
    hint: "What's in the box?",
    tmdbId: 807
  },
  // Adding even more movies to reach 100 (showing top 50 here for brevity, would add 100 in full implementation)
  {
    id: "21",
    title: "The Departed",
    imageUrl: "https://image.tmdb.org/t/p/w780/nT97ifVT2J1yMQmeq2re1FLyuxn.jpg",
    releaseYear: 2006,
    hint: "Undercover cop vs undercover gangster",
    tmdbId: 1422
  },
  {
    id: "22",
    title: "The Prestige",
    imageUrl: "https://image.tmdb.org/t/p/w780/2G1Sd5kAYVYvIKSQHBHvKYx3cP7.jpg",
    releaseYear: 2006,
    hint: "Dueling magicians with deadly secrets",
    tmdbId: 1124
  },
  {
    id: "23",
    title: "The Lion King",
    imageUrl: "https://image.tmdb.org/t/p/w780/sKCr78MXSLixwmZ8DyJLm6OuuTI.jpg",
    releaseYear: 1994,
    hint: "Hakuna Matata",
    tmdbId: 8587
  },
  {
    id: "24",
    title: "Gladiator",
    imageUrl: "https://image.tmdb.org/t/p/w780/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    releaseYear: 2000,
    hint: "Are you not entertained?",
    tmdbId: 98
  },
  {
    id: "25",
    title: "Back to the Future",
    imageUrl: "https://image.tmdb.org/t/p/w780/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",
    releaseYear: 1985,
    hint: "1.21 gigawatts",
    tmdbId: 105
  },
  {
    id: "26",
    title: "Spirited Away",
    imageUrl: "https://image.tmdb.org/t/p/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    releaseYear: 2001,
    hint: "A girl in a spirit world",
    tmdbId: 129
  },
  {
    id: "27",
    title: "Psycho",
    imageUrl: "https://image.tmdb.org/t/p/w780/tdqX0MWaFHuGwUygYn7j6eluOdP.jpg",
    releaseYear: 1960,
    hint: "A boy's best friend is his mother",
    tmdbId: 539
  },
  {
    id: "28",
    title: "Casablanca",
    imageUrl: "https://image.tmdb.org/t/p/w780/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    releaseYear: 1942,
    hint: "Here's looking at you, kid",
    tmdbId: 289
  },
  {
    id: "29",
    title: "The Pianist",
    imageUrl: "https://image.tmdb.org/t/p/w780/2hFvxCCWrTmCYwfy7yum0GWH2Bl.jpg",
    releaseYear: 2002,
    hint: "Survival through music in WWII",
    tmdbId: 423
  },
  {
    id: "30",
    title: "Parasite",
    imageUrl: "https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    releaseYear: 2019,
    hint: "A poor family infiltrates a wealthy household",
    tmdbId: 496243
  },
  // Adding more movies to reach 100
  {
    id: "31",
    title: "Apocalypse Now",
    imageUrl: "https://image.tmdb.org/t/p/w780/gQB8Y5RCMkv2zwzFg7kz9JbVVId.jpg",
    releaseYear: 1979,
    hint: "The horror, the horror",
    tmdbId: 28
  },
  {
    id: "32",
    title: "Alien",
    imageUrl: "https://image.tmdb.org/t/p/w780/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",
    releaseYear: 1979,
    hint: "In space, no one can hear you scream",
    tmdbId: 348
  },
  {
    id: "33",
    title: "Amélie",
    imageUrl: "https://image.tmdb.org/t/p/w780/f0uorE7K7ggHfr8r7lIZHHXs2ys.jpg",
    releaseYear: 2001,
    hint: "She changes others' lives but can she change her own?",
    tmdbId: 194
  },
  {
    id: "34",
    title: "Blade Runner",
    imageUrl: "https://image.tmdb.org/t/p/w780/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",
    releaseYear: 1982,
    hint: "Like tears in rain",
    tmdbId: 78
  },
  {
    id: "35",
    title: "Jurassic Park",
    imageUrl: "https://image.tmdb.org/t/p/w780/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg",
    releaseYear: 1993,
    hint: "Life finds a way",
    tmdbId: 329
  },
  {
    id: "36",
    title: "Raiders of the Lost Ark",
    imageUrl: "https://image.tmdb.org/t/p/w780/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
    releaseYear: 1981,
    hint: "The original adventurer archaeologist",
    tmdbId: 85
  },
  {
    id: "37",
    title: "The Truman Show",
    imageUrl: "https://image.tmdb.org/t/p/w780/vuvo78QLHx7QVnVytQg7qJn1D2T.jpg",
    releaseYear: 1998,
    hint: "His whole life was a TV show",
    tmdbId: 37165
  },
  {
    id: "38",
    title: "Titanic",
    imageUrl: "https://image.tmdb.org/t/p/w780/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    releaseYear: 1997,
    hint: "I'll never let go",
    tmdbId: 597
  },
  {
    id: "39",
    title: "Eternal Sunshine of the Spotless Mind",
    imageUrl: "https://image.tmdb.org/t/p/w780/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
    releaseYear: 2004,
    hint: "Erasing memories of lost love",
    tmdbId: 38
  },
  {
    id: "40",
    title: "The Shining",
    imageUrl: "https://image.tmdb.org/t/p/w780/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
    releaseYear: 1980,
    hint: "Here's Johnny!",
    tmdbId: 694
  },
  {
    id: "41",
    title: "Pan's Labyrinth",
    imageUrl: "https://image.tmdb.org/t/p/w780/7PurMm0gUOJZ8Uk0XfYkO6fKjHp.jpg",
    releaseYear: 2006,
    hint: "A dark fairy tale during wartime",
    tmdbId: 1417
  },
  {
    id: "42",
    title: "The Thing",
    imageUrl: "https://image.tmdb.org/t/p/w780/tzGY49kseSE9QAKk47uuDGwnSCu.jpg",
    releaseYear: 1982,
    hint: "Antarctic isolation with a shapeshifting alien",
    tmdbId: 1091
  },
  {
    id: "43",
    title: "Memento",
    imageUrl: "https://image.tmdb.org/t/p/w780/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg",
    releaseYear: 2000,
    hint: "A story told backwards",
    tmdbId: 77
  },
  {
    id: "44",
    title: "Die Hard",
    imageUrl: "https://image.tmdb.org/t/p/w780/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg",
    releaseYear: 1988,
    hint: "Yippee-ki-yay",
    tmdbId: 562
  },
  {
    id: "45",
    title: "Princess Mononoke",
    imageUrl: "https://image.tmdb.org/t/p/w780/cMYCDADoLKLbB83g4WnJegaZimC.jpg",
    releaseYear: 1997,
    hint: "Humans vs. forest spirits",
    tmdbId: 128
  },
  {
    id: "46",
    title: "Goodfellas",
    imageUrl: "https://image.tmdb.org/t/p/w780/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    releaseYear: 1990,
    hint: "As far back as I can remember...",
    tmdbId: 769
  },
  {
    id: "47",
    title: "The Godfather: Part II",
    imageUrl: "https://image.tmdb.org/t/p/w780/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    releaseYear: 1974,
    hint: "The sequel that equals the original",
    tmdbId: 240
  },
  {
    id: "48",
    title: "The Grand Budapest Hotel",
    imageUrl: "https://image.tmdb.org/t/p/w780/eWdyaQVtImaxIvYbfc7PAmvd3Vf.jpg",
    releaseYear: 2014,
    hint: "A concierge and his lobby boy",
    tmdbId: 120467
  },
  {
    id: "49",
    title: "Fargo",
    imageUrl: "https://image.tmdb.org/t/p/w780/d5uQjCyFBUroPkrDtOsc9ZtWrB3.jpg",
    releaseYear: 1996,
    hint: "Oh geez, a crime gone wrong",
    tmdbId: 275
  },
  {
    id: "50",
    title: "There Will Be Blood",
    imageUrl: "https://image.tmdb.org/t/p/w780/jgftk1wT4fCEO7mXyjC8CeZnCvQ.jpg",
    releaseYear: 2007,
    hint: "I drink your milkshake!",
    tmdbId: 7345
  },
  {
    id: "51",
    title: "The Social Network",
    imageUrl: "https://image.tmdb.org/t/p/w780/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    releaseYear: 2010,
    hint: "You don't get to 500 million friends without making a few enemies",
    tmdbId: 37799
  },
  {
    id: "52",
    title: "Inglourious Basterds",
    imageUrl: "https://image.tmdb.org/t/p/w780/7sfbEnaARXDDhXz9MAmzxB8lvQX.jpg",
    releaseYear: 2009,
    hint: "Nazi hunters in WWII",
    tmdbId: 16869
  },
  {
    id: "53",
    title: "2001: A Space Odyssey",
    imageUrl: "https://image.tmdb.org/t/p/w780/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg",
    releaseYear: 1968,
    hint: "I'm sorry Dave, I can't do that",
    tmdbId: 62
  },
  {
    id: "54",
    title: "Citizen Kane",
    imageUrl: "https://image.tmdb.org/t/p/w780/sav0jxhqiH0bPr2vZFU0Kjt2nZL.jpg",
    releaseYear: 1941,
    hint: "Rosebud",
    tmdbId: 15
  },
  {
    id: "55",
    title: "Toy Story",
    imageUrl: "https://image.tmdb.org/t/p/w780/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    releaseYear: 1995,
    hint: "To infinity and beyond!",
    tmdbId: 862
  },
  {
    id: "56",
    title: "No Country for Old Men",
    imageUrl: "https://image.tmdb.org/t/p/w780/6d5XOczc226jECq0LIX0siKtgaxiY1.jpg",
    releaseYear: 2007,
    hint: "Call it, friend-o",
    tmdbId: 6977
  },
  {
    id: "57",
    title: "A Clockwork Orange",
    imageUrl: "https://image.tmdb.org/t/p/w780/4sHeTAp65WrSSuc05nRBKddhBxO.jpg",
    releaseYear: 1971,
    hint: "Ultraviolence and Beethoven",
    tmdbId: 185
  },
  {
    id: "58",
    title: "Taxi Driver",
    imageUrl: "https://image.tmdb.org/t/p/w780/ekstpH614fwDX8DUln1a2Opz0N8.jpg",
    releaseYear: 1976,
    hint: "You talkin' to me?",
    tmdbId: 103
  },
  {
    id: "59",
    title: "Lawrence of Arabia",
    imageUrl: "https://image.tmdb.org/t/p/w780/ws2sWQkAwBEiqS3ByZ6IziUiI3g.jpg",
    releaseYear: 1962,
    hint: "Epic desert adventure",
    tmdbId: 947
  },
  {
    id: "60",
    title: "Rear Window",
    imageUrl: "https://image.tmdb.org/t/p/w780/qitnZcLP7C9DLRuPpmvZ7GiEjJN.jpg",
    releaseYear: 1954,
    hint: "A photographer witnesses a murder",
    tmdbId: 567
  },
  {
    id: "61",
    title: "Whiplash",
    imageUrl: "https://image.tmdb.org/t/p/w780/6uSPcdGNA2A6vJmCagXkvnutegs.jpg",
    releaseYear: 2014,
    hint: "Not quite my tempo",
    tmdbId: 244786
  },
  {
    id: "62",
    title: "The Big Lebowski",
    imageUrl: "https://image.tmdb.org/t/p/w780/5DpmtMBXXNDujIuSlKW3WLKpZRo.jpg",
    releaseYear: 1998,
    hint: "The Dude abides",
    tmdbId: 115
  },
  {
    id: "63",
    title: "Jaws",
    imageUrl: "https://image.tmdb.org/t/p/w780/s2xcqSFfT6F7ZXHxowjxfG0yisT.jpg",
    releaseYear: 1975,
    hint: "You're gonna need a bigger boat",
    tmdbId: 578
  },
  {
    id: "64",
    title: "The Third Man",
    imageUrl: "https://image.tmdb.org/t/p/w780/oUo2nE6Z3iEZy7RZ8iXWvN7O6Ru.jpg",
    releaseYear: 1949,
    hint: "Searching for a friend in post-war Vienna",
    tmdbId: 1092
  },
  {
    id: "65",
    title: "L.A. Confidential",
    imageUrl: "https://image.tmdb.org/t/p/w780/8OdQIpibgrPR1jdjZXR2KU1eVSQ.jpg",
    releaseYear: 1997,
    hint: "Everything is personal",
    tmdbId: 2118
  },
  {
    id: "66",
    title: "Vertigo",
    imageUrl: "https://image.tmdb.org/t/p/w780/15uOEfqBNTVtDUT7hGBVCka0rZz.jpg",
    releaseYear: 1958,
    hint: "Fear of heights and obsession",
    tmdbId: 426
  },
  {
    id: "67",
    title: "The Usual Suspects",
    imageUrl: "https://image.tmdb.org/t/p/w780/bUPmtQzrRhzqYySeiMpv7GurAfm.jpg",
    releaseYear: 1995,
    hint: "Who is Keyser Söze?",
    tmdbId: 629
  },
  {
    id: "68",
    title: "Léon: The Professional",
    imageUrl: "https://image.tmdb.org/t/p/w780/yI6X2cCM5YPJtxMhUd3dPGqWvlV.jpg",
    releaseYear: 1994,
    hint: "A hitman and a young girl",
    tmdbId: 101
  },
  {
    id: "69",
    title: "Braveheart",
    imageUrl: "https://image.tmdb.org/t/p/w780/or1gBugydmjToAEq7OZY0owwFk.jpg",
    releaseYear: 1995,
    hint: "They may take our lives, but they'll never take our freedom!",
    tmdbId: 197
  },
  {
    id: "70",
    title: "Once Upon a Time in the West",
    imageUrl: "https://image.tmdb.org/t/p/w780/qbYgqOczabWNn2XKwgMtVrntD6P.jpg",
    releaseYear: 1968,
    hint: "Epic spaghetti western",
    tmdbId: 335
  },
  {
    id: "71",
    title: "Heat",
    imageUrl: "https://image.tmdb.org/t/p/w780/zMyfPUelVvGCJX67RSbFIaTN5fy.jpg",
    releaseYear: 1995,
    hint: "Don't waste your life on me",
    tmdbId: 949
  },
  {
    id: "72",
    title: "Grave of the Fireflies",
    imageUrl: "https://image.tmdb.org/t/p/w780/wcNkHDbyc290hcWk7KXbBZUuXpq.jpg",
    releaseYear: 1988,
    hint: "Siblings surviving war-torn Japan",
    tmdbId: 12477
  },
  {
    id: "73",
    title: "Paths of Glory",
    imageUrl: "https://image.tmdb.org/t/p/w780/l2IY0gOHHmCWM1Z6E8YhxzZ4rDe.jpg",
    releaseYear: 1957,
    hint: "Anti-war film set in WWI",
    tmdbId: 975
  },
  {
    id: "74",
    title: "A Clockwork Orange",
    imageUrl: "https://image.tmdb.org/t/p/w780/4sHeTAp65WrSSuc05nRBKddhBxO.jpg",
    releaseYear: 1971,
    hint: "Ultraviolence and Beethoven",
    tmdbId: 185
  },
  {
    id: "75",
    title: "The Deer Hunter",
    imageUrl: "https://image.tmdb.org/t/p/w780/bbGtogDZIId4uEOmDk3KVUJGaHN.jpg",
    releaseYear: 1978,
    hint: "Russian roulette in Vietnam",
    tmdbId: 11778
  },
  {
    id: "76",
    title: "The Bridge on the River Kwai",
    imageUrl: "https://image.tmdb.org/t/p/w780/7dJHtXZ3UpEAVW7XjEdL9yTdD4B.jpg",
    releaseYear: 1957,
    hint: "POWs building a bridge in WWII",
    tmdbId: 826
  },
  {
    id: "77",
    title: "Alien",
    imageUrl: "https://image.tmdb.org/t/p/w780/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",
    releaseYear: 1979,
    hint: "In space, no one can hear you scream",
    tmdbId: 348
  },
  {
    id: "78",
    title: "The Seventh Seal",
    imageUrl: "https://image.tmdb.org/t/p/w780/eBw5EypOBt70CeBhuhyTzuyfvLp.jpg",
    releaseYear: 1957,
    hint: "Playing chess with Death",
    tmdbId: 490
  },
  {
    id: "79",
    title: "Gone with the Wind",
    imageUrl: "https://image.tmdb.org/t/p/w780/lNz2Ow0wGCAvzw2tnuXWyxvJK5T.jpg",
    releaseYear: 1939,
    hint: "Frankly, my dear, I don't give a damn",
    tmdbId: 770
  },
  {
    id: "80",
    title: "It's a Wonderful Life",
    imageUrl: "https://image.tmdb.org/t/p/w780/2McRYgxmZJuyHnzSPOHT9C1nMhY.jpg",
    releaseYear: 1946,
    hint: "Every time a bell rings...",
    tmdbId: 1585
  },
  {
    id: "81",
    title: "The Great Dictator",
    imageUrl: "https://image.tmdb.org/t/p/w780/kyoBZ6YXw5cQYA5DL7PGbJg9TxA.jpg",
    releaseYear: 1940,
    hint: "Chaplin's satire of Hitler",
    tmdbId: 914
  },
  {
    id: "82",
    title: "Singin' in the Rain",
    imageUrl: "https://image.tmdb.org/t/p/w780/w01Z2RzEj0BVySh4K1liS9v9r9Z.jpg",
    releaseYear: 1952,
    hint: "Dancing with an umbrella",
    tmdbId: 872
  },
  {
    id: "83",
    title: "Some Like It Hot",
    imageUrl: "https://image.tmdb.org/t/p/w780/pxc9EJoIiRDLpSaQYFaT9iyBPbF.jpg",
    releaseYear: 1959,
    hint: "Nobody's perfect",
    tmdbId: 239
  },
  {
    id: "84",
    title: "Bicycle Thieves",
    imageUrl: "https://image.tmdb.org/t/p/w780/9wfM8l3JsvRsfgQbKnXiIJQfJNa.jpg",
    releaseYear: 1948,
    hint: "A father and son search for a stolen bicycle",
    tmdbId: 5156
  },
  {
    id: "85",
    title: "Cinema Paradiso",
    imageUrl: "https://image.tmdb.org/t/p/w780/8SRUfRUi6x4O68n0VCbDNRa6iGL.jpg",
    releaseYear: 1988,
    hint: "A love letter to cinema",
    tmdbId: 11216
  },
  {
    id: "86",
    title: "Sunset Boulevard",
    imageUrl: "https://image.tmdb.org/t/p/w780/zt8aQ6ksqK6qc0huC9AgGepFkw9.jpg",
    releaseYear: 1950,
    hint: "I'm ready for my close-up",
    tmdbId: 599
  },
  {
    id: "87",
    title: "M",
    imageUrl: "https://image.tmdb.org/t/p/w780/q5fXkYEmvigHwzCfYFJhp2dyPQP.jpg",
    releaseYear: 1931,
    hint: "A child murderer hunted by the criminal underworld",
    tmdbId: 386
  },
  {
    id: "88",
    title: "City Lights",
    imageUrl: "https://image.tmdb.org/t/p/w780/bXNvzjULc9jrOVhGfjcc64uKZmZ.jpg",
    releaseYear: 1931,
    hint: "Chaplin's tramp falls for a blind flower girl",
    tmdbId: 901
  },
  {
    id: "89",
    title: "12 Angry Men",
    imageUrl: "https://image.tmdb.org/t/p/w780/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
    releaseYear: 1957,
    hint: "Jury deliberations in a murder trial",
    tmdbId: 389
  },
  {
    id: "90",
    title: "Modern Times",
    imageUrl: "https://image.tmdb.org/t/p/w780/94J25SpcuCt8Lt2cRsMoEyE9x99.jpg",
    releaseYear: 1936,
    hint: "Chaplin vs. the machine age",
    tmdbId: 3082
  },
  {
    id: "91",
    title: "Room",
    imageUrl: "https://image.tmdb.org/t/p/w780/eqFckcHuFCT1FrzLOAvXBb4jHwq.jpg",
    releaseYear: 2015,
    hint: "A mother and son held captive",
    tmdbId: 264644
  },
  {
    id: "92",
    title: "La La Land",
    imageUrl: "https://image.tmdb.org/t/p/w780/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    releaseYear: 2016,
    hint: "City of stars",
    tmdbId: 313369
  },
  {
    id: "93",
    title: "Call Me by Your Name",
    imageUrl: "https://image.tmdb.org/t/p/w780/nPTjj6ZfBXXBwOhd7iiVKPjEmgN.jpg",
    releaseYear: 2017,
    hint: "Summer romance in Italy",
    tmdbId: 398818
  },
  {
    id: "94",
    title: "Portrait of a Lady on Fire",
    imageUrl: "https://image.tmdb.org/t/p/w780/2LquGwEhbg3soxSCs9VNyh5VJd9.jpg",
    releaseYear: 2019,
    hint: "Forbidden love and art in 18th century France",
    tmdbId: 531428
  },
  {
    id: "95",
    title: "Get Out",
    imageUrl: "https://image.tmdb.org/t/p/w780/tFXcEccSQMf3zyxpHFusHvPyBPq.jpg",
    releaseYear: 2017,
    hint: "The sunken place",
    tmdbId: 419430
  },
  {
    id: "96",
    title: "Before Sunrise",
    imageUrl: "https://image.tmdb.org/t/p/w780/kcBlY5FasH93tzPSbG2MJDQYvWA.jpg",
    releaseYear: 1995,
    hint: "One night in Vienna",
    tmdbId: 76
  },
  {
    id: "97",
    title: "Come and See",
    imageUrl: "https://image.tmdb.org/t/p/w780/qrZdHBnJVvff1xKX1B09AErhy3i.jpg",
    releaseYear: 1985,
    hint: "A boy witnesses Nazi atrocities in Belarus",
    tmdbId: 25237
  },
  {
    id: "98",
    title: "Mad Max: Fury Road",
    imageUrl: "https://image.tmdb.org/t/p/w780/hA2ple9q4qnwxp3hKVNhroW8zQn.jpg",
    releaseYear: 2015,
    hint: "What a lovely day",
    tmdbId: 76341
  },
  {
    id: "99",
    title: "Mulholland Drive",
    imageUrl: "https://image.tmdb.org/t/p/w780/tVxGt7uffLVhIIcwuldXOMpFBPX.jpg",
    releaseYear: 2001,
    hint: "Surreal Hollywood nightmare",
    tmdbId: 1018
  },
  {
    id: "100",
    title: "The Handmaiden",
    imageUrl: "https://image.tmdb.org/t/p/w780/wvzfK5QR6dGLwND8MCzWjsQWG7D.jpg",
    releaseYear: 2016,
    hint: "A complex con in Japanese-occupied Korea",
    tmdbId: 290098
  }
];

// Helper function to preload movie images with improved error handling
export const loadAllMovieImages = async (): Promise<void> => {
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      console.log(`Starting to preload: ${url}`);
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        console.log(`Successfully preloaded: ${url}`);
        resolve();
      };
      
      img.onerror = (e) => {
        console.error(`Failed to preload image: ${url}`, e);
        resolve(); // Still resolve to prevent hanging the promise chain
      };
      
      img.src = url;
    });
  };

  try {
    console.log("Starting image preloading...");
    
    // Load the first 5 images first (for immediate display)
    const initialImages = moviesCollection.slice(0, 5).map(movie => preloadImage(movie.imageUrl));
    await Promise.all(initialImages);
    console.log("Initial images loaded");

    // Then load the rest in the background
    const remainingImages = moviesCollection.slice(5).map(movie => preloadImage(movie.imageUrl));
    Promise.all(remainingImages)
      .then(() => console.log("All images preloaded"))
      .catch(err => {
        console.error("Error preloading remaining images:", err);
      });
  } catch (error) {
    console.error("Error in loadAllMovieImages:", error);
  }
};

// Get a random movie from the collection
export const getRandomMovie = async (): Promise<Movie> => {
  console.log("Getting random movie...");
  
  // Ensure we have movies to select from
  if (moviesCollection.length === 0) {
    throw new Error("No movies available");
  }

  // Get a random movie
  const randomIndex = Math.floor(Math.random() * moviesCollection.length);
  const movie = moviesCollection[randomIndex];
  
  console.log(`Selected movie: ${movie.title}`);
  return movie;
};

// Get next movie, ensuring it's different from the current one
export const getNextMovie = async (currentMovieId: string): Promise<Movie> => {
  console.log(`Getting next movie after movie ID: ${currentMovieId}`);
  
  // Filter out the current movie
  const availableMovies = moviesCollection.filter(movie => movie.id !== currentMovieId);

  if (availableMovies.length === 0) {
    throw new Error("No more movies available");
  }

  // Get a random movie from the filtered list
  const randomIndex = Math.floor(Math.random() * availableMovies.length);
  const nextMovie = availableMovies[randomIndex];
  
  console.log(`Selected next movie: ${nextMovie.title}`);
  return nextMovie;
};
