# sheep-and-crocodile

[![NPM version](https://img.shields.io/npm/v/sheep-and-crocodile.svg)](https://www.npmjs.com/package/sheep-and-crocodile)

Console game for nodejs about a sheep that runs away from a crocodile.

![sheep-and-crocodile](https://raw.githubusercontent.com/saveryanov/sheep-and-crocodile/master/examples/emoji.png)

## Controls and rules

Use **arrows** or **WSAD** buttons to control a sheep (🐑).

Your goal is eat as much clovers (🍀) as you can.

Sheep eats clovers, crocodile (🐊) eats sheep. The crocodile will pursue the sheep until it is eaten by it.

By the way there are some random water on the map. A crocodile can swim, but a sheep does not.

You can exit game by **Q** button.

## Install

You can install it by npm:

```commandline
npm install -g sheep-and-crocodile
```

## Game start

To start a game execute this in command line:

```commandline
sheep_and_crocodile
```

or just:

```commandline
sheepcroc
```

## Params

### --difficulty

You can choose difficulty by using this parameter (from 1 to 3):

```commandline
sheep_and_crocodile --difficulty=1
```

By default difficulty is 1;

### --emoji

If you don't want emoji graphics you can disable it this way:

```commandline
sheep_and_crocodile --emoji=0
```

or just:

```commandline
sheep_and_crocodile --no-emoji
```

And you will see something like this:

![sheep-and-crocodile simple graphics](https://raw.githubusercontent.com/saveryanov/sheep-and-crocodile/master/examples/simple.png)

Where:

* \# - crocodile;
* @ - sheep; 
* $ - clover;
* ~ - water.