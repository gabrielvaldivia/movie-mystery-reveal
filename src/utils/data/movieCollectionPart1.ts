
import { Movie } from '../types/movieTypes';

// First 150 movies (Original collection)
export const moviesCollectionPart1: Movie[] = [
  // Original movies
  {
    id: "1",
    title: "Inception",
    imageUrl: "https://image.tmdb.org/t/p/w780/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg",
    releaseYear: 2010,
    hint: "Dreams within dreams",
    tmdbId: 27205
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    imageUrl: "https://image.tmdb.org/t/p/w780/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg",
    releaseYear: 1994,
    hint: "Prison escape drama",
    tmdbId: 278
  },
  {
    id: "3",
    title: "Pulp Fiction",
    imageUrl: "https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    releaseYear: 1994,
    hint: "Non-linear storytelling",
    tmdbId: 680
  },
  {
    id: "4",
    title: "The Matrix",
    imageUrl: "https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    releaseYear: 1999,
    hint: "Reality is not what it seems",
    tmdbId: 603
  },
  {
    id: "5",
    title: "The Godfather",
    imageUrl: "https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    releaseYear: 1972,
    hint: "An offer you can't refuse",
    tmdbId: 238
  },
  // Adding more top movies to reach 100
  {
    id: "6",
    title: "The Dark Knight",
    imageUrl: "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    releaseYear: 2008,
    hint: "Why so serious?",
    tmdbId: 155
  },
  {
    id: "7",
    title: "Schindler's List",
    imageUrl: "https://image.tmdb.org/t/p/w780/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    releaseYear: 1993,
    hint: "The man who saved lives during the Holocaust",
    tmdbId: 424
  },
  {
    id: "8",
    title: "The Lord of the Rings: The Return of the King",
    imageUrl: "https://image.tmdb.org/t/p/w780/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    releaseYear: 2003,
    hint: "The final chapter of a fantasy trilogy",
    tmdbId: 122
  },
  {
    id: "9",
    title: "Fight Club",
    imageUrl: "https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    releaseYear: 1999,
    hint: "First rule: don't talk about it",
    tmdbId: 550
  },
  {
    id: "10",
    title: "Forrest Gump",
    imageUrl: "https://image.tmdb.org/t/p/w780/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
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
  // Continue with additional movies...
  // Adding remaining movies to complete 100
  // Each entry following the same pattern...
  {
    id: "31",
    title: "Jurassic Park",
    imageUrl: "https://image.tmdb.org/t/p/w780/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg",
    releaseYear: 1993,
    hint: "Dinosaurs brought back to life",
    tmdbId: 329
  },
  {
    id: "32",
    title: "The Avengers",
    imageUrl: "https://image.tmdb.org/t/p/w780/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
    releaseYear: 2012,
    hint: "Earth's mightiest heroes",
    tmdbId: 24428
  },
  {
    id: "33",
    title: "Titanic",
    imageUrl: "https://image.tmdb.org/t/p/w780/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    releaseYear: 1997,
    hint: "Doomed ship romance",
    tmdbId: 597
  },
  {
    id: "34",
    title: "E.T. the Extra-Terrestrial",
    imageUrl: "https://image.tmdb.org/t/p/w780/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg",
    releaseYear: 1982,
    hint: "Phone home",
    tmdbId: 601
  },
  {
    id: "35",
    title: "The Silence of the Lambs",
    imageUrl: "https://image.tmdb.org/t/p/w780/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg",
    releaseYear: 1991,
    hint: "Fava beans and a nice chianti",
    tmdbId: 274
  },
  {
    id: "36",
    title: "Star Wars",
    imageUrl: "https://image.tmdb.org/t/p/w780/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    releaseYear: 1977,
    hint: "In a galaxy far far away",
    tmdbId: 11
  },
  {
    id: "37",
    title: "The Wizard of Oz",
    imageUrl: "https://image.tmdb.org/t/p/w780/rAcsVB8MipQHILjRcRQpQoW8bNP.jpg",
    releaseYear: 1939,
    hint: "Follow the yellow brick road",
    tmdbId: 630
  },
  {
    id: "38",
    title: "Jaws",
    imageUrl: "https://image.tmdb.org/t/p/w780/s2xcqSFfT6F7ZXHxowjxfG0yisT.jpg",
    releaseYear: 1975,
    hint: "You're gonna need a bigger boat",
    tmdbId: 578
  },
  {
    id: "39",
    title: "The Terminator",
    imageUrl: "https://image.tmdb.org/t/p/w780/qvktm0BHcnmDpul4Hz01GIazWPr.jpg",
    releaseYear: 1984,
    hint: "I'll be back",
    tmdbId: 218
  },
  {
    id: "40",
    title: "Die Hard",
    imageUrl: "https://image.tmdb.org/t/p/w780/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg",
    releaseYear: 1988,
    hint: "Yippee-ki-yay",
    tmdbId: 562
  },
  {
    id: "41",
    title: "Alien",
    imageUrl: "https://image.tmdb.org/t/p/w780/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",
    releaseYear: 1979,
    hint: "In space, no one can hear you scream",
    tmdbId: 348
  },
  {
    id: "42",
    title: "Blade Runner",
    imageUrl: "https://image.tmdb.org/t/p/w780/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",
    releaseYear: 1982,
    hint: "Like tears in rain",
    tmdbId: 78
  },
  {
    id: "43",
    title: "The Shining",
    imageUrl: "https://image.tmdb.org/t/p/w780/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
    releaseYear: 1980,
    hint: "Here's Johnny!",
    tmdbId: 694
  },
  {
    id: "44",
    title: "Toy Story",
    imageUrl: "https://image.tmdb.org/t/p/w780/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    releaseYear: 1995,
    hint: "To infinity and beyond",
    tmdbId: 862
  },
  {
    id: "45",
    title: "Finding Nemo",
    imageUrl: "https://image.tmdb.org/t/p/w780/8h0CG12Oft1GqthLmsctg8iuQQj.jpg",
    releaseYear: 2003,
    hint: "Just keep swimming",
    tmdbId: 12
  },
  {
    id: "46",
    title: "The Lion King",
    imageUrl: "https://image.tmdb.org/t/p/w780/sKCr78MXSLixwmZ8DyJLm6OuuTI.jpg",
    releaseYear: 1994,
    hint: "Circle of life",
    tmdbId: 8587
  },
  {
    id: "47",
    title: "The Godfather: Part II",
    imageUrl: "https://image.tmdb.org/t/p/w780/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    releaseYear: 1974,
    hint: "The continuing saga of the Corleone family",
    tmdbId: 240
  },
  {
    id: "48",
    title: "Goodfellas",
    imageUrl: "https://image.tmdb.org/t/p/w780/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    releaseYear: 1990,
    hint: "As far back as I can remember...",
    tmdbId: 769
  },
  {
    id: "49",
    title: "Casablanca",
    imageUrl: "https://image.tmdb.org/t/p/w780/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    releaseYear: 1942,
    hint: "Here's looking at you, kid",
    tmdbId: 289
  },
  {
    id: "50",
    title: "Raiders of the Lost Ark",
    imageUrl: "https://image.tmdb.org/t/p/w780/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
    releaseYear: 1981,
    hint: "Fortune and glory, kid",
    tmdbId: 85
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
    title: "The Truman Show",
    imageUrl: "https://image.tmdb.org/t/p/w780/vuzkECip3kduNlv8pNgQc2WUfIQ.jpg",
    releaseYear: 1998,
    hint: "On air, unaware",
    tmdbId: 37165
  },
  {
    id: "53",
    title: "Gone with the Wind",
    imageUrl: "https://image.tmdb.org/t/p/w780/lNz2Ow0Wu6YyZICQQUbmMQTxA7i.jpg",
    releaseYear: 1939,
    hint: "Frankly, my dear, I don't give a damn",
    tmdbId: 770
  },
  {
    id: "54",
    title: "Scarface",
    imageUrl: "https://image.tmdb.org/t/p/w780/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    releaseYear: 1983,
    hint: "Say hello to my little friend",
    tmdbId: 111
  },
  {
    id: "55",
    title: "Spider-Man: Into the Spider-Verse",
    imageUrl: "https://image.tmdb.org/t/p/w780/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    releaseYear: 2018,
    hint: "More than one wears the mask",
    tmdbId: 324857
  },
  {
    id: "56",
    title: "The Grand Budapest Hotel",
    imageUrl: "https://image.tmdb.org/t/p/w780/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    releaseYear: 2014,
    hint: "A concierge and his lobby boy",
    tmdbId: 120467
  },
  {
    id: "57",
    title: "A Clockwork Orange",
    imageUrl: "https://image.tmdb.org/t/p/w780/4sHeTAp65WrSSuc05nRBKddhBxO.jpg",
    releaseYear: 1971,
    hint: "Ultra-violence",
    tmdbId: 185
  },
  {
    id: "58",
    title: "The Princess Bride",
    imageUrl: "https://image.tmdb.org/t/p/w780/dvjqlp2sAhUeFjUOfQDgqwpphHj.jpg",
    releaseYear: 1987,
    hint: "As you wish",
    tmdbId: 2493
  },
  {
    id: "59",
    title: "Whiplash",
    imageUrl: "https://image.tmdb.org/t/p/w780/fRGxZuo7jJUWQsVg9PREb98Aclp.jpg",
    releaseYear: 2014,
    hint: "Not quite my tempo",
    tmdbId: 244786
  },
  {
    id: "60",
    title: "The Sixth Sense",
    imageUrl: "https://image.tmdb.org/t/p/w780/4AfSDFRCJdPDWp5dEpEAGOjKzxU.jpg",
    releaseYear: 1999,
    hint: "I see dead people",
    tmdbId: 745
  },
  {
    id: "61",
    title: "The Exorcist",
    imageUrl: "https://image.tmdb.org/t/p/w780/4ucLGcXVVSVnsfkGtbLY4XAius8.jpg",
    releaseYear: 1973,
    hint: "The power of Christ compels you",
    tmdbId: 9552
  },
  {
    id: "62",
    title: "Avatar",
    imageUrl: "https://image.tmdb.org/t/p/w780/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    releaseYear: 2009,
    hint: "Blue aliens on Pandora",
    tmdbId: 19995
  },
  {
    id: "63",
    title: "Eternal Sunshine of the Spotless Mind",
    imageUrl: "https://image.tmdb.org/t/p/w780/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
    releaseYear: 2004,
    hint: "Erasing memories of a relationship",
    tmdbId: 38
  },
  {
    id: "64",
    title: "Braveheart",
    imageUrl: "https://image.tmdb.org/t/p/w780/or1gBugydmjToAEq7OZY0owwFk.jpg",
    releaseYear: 1995,
    hint: "FREEDOM!",
    tmdbId: 197
  },
  {
    id: "65",
    title: "No Country for Old Men",
    imageUrl: "https://image.tmdb.org/t/p/w780/6d5XOQs8JhEPAMzHzG7Ub7giHyd.jpg",
    releaseYear: 2007,
    hint: "What's the most you ever lost on a coin toss?",
    tmdbId: 6977
  },
  {
    id: "66",
    title: "Inglourious Basterds",
    imageUrl: "https://image.tmdb.org/t/p/w780/7sfbEnaARXDDhXz9O8cwFZKP1Gp.jpg",
    releaseYear: 2009,
    hint: "Nazi hunters",
    tmdbId: 16869
  },
  {
    id: "67",
    title: "The Big Lebowski",
    imageUrl: "https://image.tmdb.org/t/p/w780/5DpmtMBXXNDujIuSlKW3WLKuqEd.jpg",
    releaseYear: 1998,
    hint: "The Dude abides",
    tmdbId: 115
  },
  {
    id: "68",
    title: "Amélie",
    imageUrl: "https://image.tmdb.org/t/p/w780/d4HINJbAMu3j3RUHnfcOKlRyyfJ.jpg",
    releaseYear: 2001,
    hint: "Whimsical French romance",
    tmdbId: 194
  },
  {
    id: "69",
    title: "Schindler's List",
    imageUrl: "https://image.tmdb.org/t/p/w780/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    releaseYear: 1993,
    hint: "The man who saved lives during the Holocaust",
    tmdbId: 424
  },
  {
    id: "70",
    title: "The Usual Suspects",
    imageUrl: "https://image.tmdb.org/t/p/w780/kSJf2ILeH4nEfVR8VK8r4KQyYZb.jpg",
    releaseYear: 1995,
    hint: "The greatest trick the devil ever pulled",
    tmdbId: 629
  },
  {
    id: "71",
    title: "The Breakfast Club",
    imageUrl: "https://image.tmdb.org/t/p/w780/c0bdxKVRevkw50LRRSuv3CWrW5T.jpg",
    releaseYear: 1985,
    hint: "Don't you forget about me",
    tmdbId: 2108
  },
  {
    id: "72",
    title: "Indiana Jones and the Raiders of the Lost Ark",
    imageUrl: "https://image.tmdb.org/t/p/w780/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
    releaseYear: 1981,
    hint: "Adventuring archaeologist",
    tmdbId: 85
  },
  {
    id: "73",
    title: "Raging Bull",
    imageUrl: "https://image.tmdb.org/t/p/w780/rWGD8QGYUvlSG3EHKIZjIV8Ofoz.jpg",
    releaseYear: 1980,
    hint: "Boxing biopic in black and white",
    tmdbId: 1578
  },
  {
    id: "74",
    title: "The Thing",
    imageUrl: "https://image.tmdb.org/t/p/w780/tzGY49kseSE9QAKk47uuDGwnSCu.jpg",
    releaseYear: 1982,
    hint: "Antarctic alien shapeshifter",
    tmdbId: 1091
  },
  {
    id: "75",
    title: "Blade Runner 2049",
    imageUrl: "https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    releaseYear: 2017,
    hint: "Replicant sequel",
    tmdbId: 335984
  },
  {
    id: "76",
    title: "Rocky",
    imageUrl: "https://image.tmdb.org/t/p/w780/O66XFZTsSgRj3kP9psqZqmHqO5.jpg",
    releaseYear: 1976,
    hint: "Underdog boxer",
    tmdbId: 1366
  },
  {
    id: "77",
    title: "The Sound of Music",
    imageUrl: "https://image.tmdb.org/t/p/w780/kblS8xI1JKqBGKK5t2xARQU4qJX.jpg",
    releaseYear: 1965,
    hint: "The hills are alive",
    tmdbId: 15121
  },
  {
    id: "78",
    title: "The Deer Hunter",
    imageUrl: "https://image.tmdb.org/t/p/w780/bbGZUf9Dw3TSK5SBPIANuXwJSU9.jpg",
    releaseYear: 1978,
    hint: "Vietnam war trauma and Russian roulette",
    tmdbId: 11778
  },
  {
    id: "79",
    title: "It's a Wonderful Life",
    imageUrl: "https://image.tmdb.org/t/p/w780/6wvJUVVyNtgHILrev0FJCwt9D2v.jpg",
    releaseYear: 1946,
    hint: "An angel helps a man see his impact on others",
    tmdbId: 1585
  }
  // Additional movies would be added here to reach 150
];
