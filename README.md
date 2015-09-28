# Adlib

## NodeJS based CLI tools for Adlib Museum

This package contains a set of command line tools that allows you to interact
with Adlib data in a flexible, structured and efficient way.

## Requirements

You'll need to install the [Node core package](https://nodejs.org/) which
contains the npm command line tool.

## Installation

1/ Clone/Download this repository to your local machine:

``` bash
$ git clone https://bitbucket.org/netsensei/adlib
```

2/ Install the dependencies

``` bash
$ cd adlib
$ npm install
```

3/ Make the commands globally available in your system:

``` bash
$ npm link
```

Note: you might need to execute `sudo npm link` instead if you are not permitted
to link the commands.

4/ You are ready to start using the command line tools

## Usage

These commands are avialable:

- adlib-convert : Convert an Adlib DAT export to CSV
- adlib-scrape : Convert Adlib DAT file and scrape URL's from VKC.be website
- adlib-resolve : Convert the output of adlib-scrape into a Resolver import file
- adlib-pid : Convert a set of id's as a CSV file into valid PID's

This command wil convert a DAT export file to a CSV formatted data string that
you can save to a CSV file.

## Development

Lin Clark's [Building a simple command line tool with npm](http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm) is a great
introduction to extending this tool with your own commands.

Dependencies on generic packages can be found on [npmjs.com](https://www.npmjs.com/)

