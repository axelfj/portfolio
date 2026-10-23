---
title: "Pacman and the search for a path"
summary: "A Python/Pygame maze project exploring A* search, generated maps, and voice-driven interaction."
date: "2019-10-02"
tags: ["Early work", "Python", "A* search", "Pygame"]
category: "games"
sourceAccess: "private"
repoUrl: "https://github.com/axelfj/Pacman-IA"
legacy: true
demoStatus: "live"
demoUrl: "https://axelfernandez.vercel.app/demos/pacman/"
---
## The original project
A desktop exploration of pathfinding in a Pacman-style world. The project combines a generated grid, obstacles, collectible items, and an A* search implementation.

## Browser adaptation · 2026
A playable Pacman-style maze with blue walls, animated characters, pellets, four chasing ghosts, power pellets, score, and three lives. Watch the AI play or switch to manual controls with arrow keys, WASD, and on-screen direction buttons.

The AI uses A* with a Manhattan heuristic and extra costs around active ghosts. An optional route overlay shows its current plan. Ghosts follow corridors, chase different targets, and flee when a power pellet is active. This is a new single-maze interpretation, not an exact port of the commercial arcade rules.

[Play the browser demo](/demos/pacman/).

## Credits and scope
The archive is a fork of JuanEscobar066/Pacman-IA. The original team contributions remain shared; individual implementation ownership is not asserted. Private source, sprites, voice services, and the Python environment are not distributed.

## Historical source
[Original repository](https://github.com/axelfj/Pacman-IA). Access remains restricted.
