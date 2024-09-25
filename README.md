# Phantomicus

> "In ghost hunting, one man's noise is another man's data." - Dr. H. Spookworth

Welcome to Dr. Zaphod Beeblebrox's spirit-infested lab! Armed with your Spook Siphon and a PhD in Paranormal Pest Control, ascend 13 floors to defeat the spectral infestation.

Play: https://js13kgames.com/2024/games/phantomicus

## Overview

Navigate challenging levels:

- Collect Spectral Sparks (gold cubes) to power your Spook Siphon
- Use your powered-up Siphon to capture ghosts and interact with objects
- Find keys to progress through locked doors

## Demo Video

https://github.com/user-attachments/assets/32a791ea-5a4f-4f84-a819-3462b3675434

## User Interface

Watch your UI for crucial info:

- 🏨 Current floor
- ❤️ Health (resets each floor)
- ⚡ Vacuum power (increases with gold cubes)
- 💰 Score
- ⏱️ Time (go fast for bonus points!)

## Controls

- <kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd>: Navigate
- <kbd>SPACE</kbd>: Activate Spook Siphon
- <kbd>R</kbd>: Restart level
- <kbd>M</kbd>: Toggle music

Remember, fear nothing but fear itself... and that slime-dripping ghost behind you. Happy hunting!

## Acknowledgements

- [Kang Seonghoon](https://mearie.org/) for [Roadroller](https://lifthrasiir.github.io/roadroller/)
- [Rob Louie](https://github.com/roblouie) for Roadroller configuration recommendations
- [Salvatore Previti](https://github.com/SalvatorePreviti) for Terser configuration recommendations
- [Brandon Jones](https://toji.dev/) for [glMatrix](https://glmatrix.net/)
- [Nicolas Vanhoren](https://github.com/nicolas-van) for [sonant-x](https://github.com/nicolas-van/sonant-x)
- Title music based on [Luigi's Mansion [Remix]](https://www.youtube.com/watch?v=80hBcnnuyHg) by [Qumu](https://www.qumumusic.com/)
- Game music based on [Dark Hallways (Luigi's Mansion Cover)](https://onlinesequencer.net/776491) by [Traceuse](https://onlinesequencer.net/members/18338)
- [Andrzej Mazur](https://end3r.com/) for organizing js13k

## Retrospective

The compo is done! As part of the js13k game development challenge, I've compiled some thoughts on the development process of Phantomicus. This retrospective aims to share insights and lessons learned with the community.

For context, here are my previous retros, which I may refer to:

- [2018 - Battlegrounds](https://github.com/codyebberson/js13k-battlegrounds#postmortem) - 3D battle royale for the server category
- [2020 - Minipunk](https://github.com/codyebberson/js13k-minipunk#postmortem) - 3D 3rd person action game in cyberpunk voxel world
- [2021 - Callisto](https://github.com/codyebberson/js13k-callisto#retrospective) - 3D top-down action game in outer space
- [2022 - Unavoidable](https://github.com/codyebberson/js13k-unavoidable) - 3D top-down game in hellish underworld / tax authority

The key theme of those past entries:

- Emphasis on 3D visuals
- Emphasis on technical excellence
- Interesting technical demos
- Not necessarily "fun" games

Perhaps continuing those trends, this year's entry is yet another 3D top-down game. In an effort to focus on "fun", I tried to borrow liberally from Luigi's Mansion, because surely Nintendo knows how to make fun games.

### What went well

#### 3D Physics

In the past, I used relatively simplistic arcade physics. This year, I implemented a full 3D rigied body physics system. This was an undertaking, but I'm pleased that I was able to get passable results in a manageable amount of time and code size.

#### FM Synthesis

In past entries, I've used [sonant-x](https://github.com/nicolas-van/sonant-x), [ZzFXM](https://keithclark.github.io/ZzFXM/), and a [pico8 music player](https://github.com/codyebberson/pico8-music). This year, I used a custom FM synthesis engine, derived from sonant-x. FM sytnthesis is fascinating. I'm still a total noob when it comes to creating FM instruments. I found Claude AI and ChatGPT were pretty good at generating instrument definitions after the type definitions were established.

#### Music

Keeping with the Luigi's Mansion theme, I used a remix of the title music and a cover of the game music.

#### Sound Effects

With the new FM synthesis audio system, it was fast, easy, and cheap to add more sound effects. I found this very satisfying, and feel like more unique sound effects is generally a good thing.

### What could have gone better

#### Fun

Fun is still elusive. I suppose the main reason is that "fun" is subjective, and the only real way to know if something is fun is to playtest it with real people. But that means engaging with other people and asking them to play your game, which remains extremely unnatural for a hobby project.

[Poki](https://www.poki.com/) sponsored js13k this year, and offered free game testing services. That was fascinating and deeply humbling. The Poki playtesters are not quite representative of the js13k community, but I believe that the feedback and insights are still valuable. I wish I had done the Poki playtesting earlier in the process, so that I could have had more time to iterate on the feedback.

#### Scope

Scope was a bit too ambitious. I had to cut a lot of features and content. Many level ideas didn't materialize. I think the game is still fun, but it could have been more fun with more content and polish.

### Thoughts for next year

- Start smaller
- No more adventure games
- Game must be playable with mouse-only or touch-only
- Explore new game genres or mechanics for new sources of fun
- Start with a known working formula for fun (Breakout, Bubble Pop, Angry Birds, Flappy Bird, etc)
- Leave plenty of room for UI hints, tips ("Click here to do X" tips), and UI sound effects

### Conclusion

I love js13k. It's a great challenge and a great community. It can certainly be difficult to make the push when life gets busy, but it remains one of my favorite weird hobbies.

## License

MIT
