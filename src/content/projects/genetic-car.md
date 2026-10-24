---
title: "The beginnings of an evolving car"
summary: "A Processing and Box2D prototype exploring car geometry, a population of candidates, and procedural terrain."
date: "2017-11-20"
tags: ["Early work", "Processing", "Box2D", "Genetic algorithms"]
category: "simulations"
sourceAccess: "public"
repoUrl: "https://github.com/axelfj/genetic-car"
legacy: true
demoStatus: "live"
demoUrl: "https://axelfernandez.vercel.app/demos/evolving-car/"
---
## Original Processing prototype
An academic experiment with randomized body and wheel geometry, a candidate population, and procedural terrain.

## Browser adaptation · 2026
The browser experiment completes an evaluation, tournament-selection, crossover, mutation, and elitism cycle. Twenty-four candidates evolve wheel radius, power, grip, and body parameters. Fitness is distance on a fixed terrain; a seed makes comparisons repeatable. This is a new simplified one-dimensional model, not a Box2D port.

[Open the interactive demo](/demos/evolving-car/).

## Credits and scope
The original README credits Andrés Brenes Maleaño, Axel Fernández Jiménez, and Iván Moisés López Saborio. The original fitness and selection methods were unfinished; the browser evolutionary loop is new work.

## Historical source
[Original repository](https://github.com/axelfj/genetic-car). The archive preserves the earlier project.
