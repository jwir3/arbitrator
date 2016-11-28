arbitrator
=================
[![Build Status](https://travis-ci.org/jwir3/arbitrator.svg?branch=develop)](https://travis-ci.org/jwir3/arbitrator)

A utility allowing schedules from [ArbiterSports](http://www.arbitersports.com)
to be added to Google Calendar with a minimum of effort.

_arbitrator_, the developers of _arbitrator_, and Glass Tower Studios are in no way related to ArbiterSports, ArbiterOne, or ArbiterPay. Use of this software is conditional on agreement with the license(s) described in LICENSE.md.

## Setup

_arbitrator_ is now a desktop application. You can build the binary for your
platform by following these steps:

1. Install the node package manager.
2. Download the most current release.
3. Run: `npm install && npm run release`.
4. Install the appropriate package from within `dist/`. For OS X, it will be `dist/mac/Arbitrator-2.0.0.dmg`, for linux it will be `dist/linux/Arbitrator-2.0.0.deb`, and for windows it will be `dist/windows/Arbitrator-2.0.0.msi`.

### Using an existing instance

**Note that the current web implementations have been deprecated as of version `2.0.0`. This means they will not be updated, but are still available for use right now.**

There are currently two separate instances set up on glasstowerstudios.com. The first one, the _alpha_ instance, is our most recent deployment, and is thus probably less stable than the _beta_ version. If you're not sure which one to use, you should probably use the _beta_ instance.

To access an instance, navigate your browser to the location described below for that instance. Note that most of the code was tested in Firefox. This doesn't mean it won't work in, say, Chrome, but just keep in mind that there may be unknown bugs in other browsers.

| Version | Web Address |
| -------- | ------------ |
| Beta    | http://arbitrator.glasstowerstudios.com |
| Alpha   | http://alpha.arbitrator.glasstowerstudios.com |

From there, you can follow the instructions for usage below.

## Instructions

**Warning**: _arbitrator_ is designed as a tool to help you manage your game assignments. It's also in active development, meaning that there could be bugs. You should _always_ double-check your game assignments against your Google Calendar if you use _arbitrator_. The developers of _arbitrator_ are in NO WAY RESPONSIBLE for any problems arising out of the use of this product. You are responsible for your own game assignments, and _arbitrator_ is a dumb tool designed to help you with some mundane tasks. Please see the LICENSE.md file for more information on the license agreement of _arbitrator_.

Using _arbitrator_ is pretty simple. Simply copy all of the text in your schedule from ArbiterSports and paste it into the text box in the _arbitrator_ main interface. Then, select the calendar which you want to populate your data to beneath the text entry, and click Submit.

Note that this is somewhat cumbersome at this time. We're working on a way to get an automatic synchronization from ArbiterSports -> Arbitrator, but it's not available yet.

### Preferences

There are a few preferences on the right side that you can configure if you so choose. These are explained below. _All preferences take effect on the next set of data that Arbitrator runs on, so adjusting preferences will not affect games you already migrated to Google Calendar._

#### Group Aliases
_arbitrator_ adds calendar entries with the subject line:
```
[Group] <Position> <Home Team> v. <Away Team Name> (Game Level)
```

The `Group` entry is, by default, whatever was entered into the ArbiterSports group field (which is probably understandable for schedulers, but can sometimes be unintelligible for officials). Once _arbitrator_ has seen a given group abbreviation, it gives you the option to add an alias for that group to make it more understandable.

#### Time Preferences
  * **Minutes Before Start**: Adding a number here allows you to configure how many minutes before the start of the game you want the calendar entry to start at. This is useful if, for example, you want to arrive 30 minutes prior to the start of the game (in order to get ready). Google calendar will then notify you in time so that you arrive at this time, rather than at the start of the game.
  * **Length of Game**: This is a setting that indicates how long games should last within Google calendar. If you have hour-long games, you can set this here, or you can set it for longer if you have games that will likely run longer.
  * **Consecutive Game Threshold**: This is the number of hours between which games will be considered "consecutive", assuming they take place at the same location. This enables _arbitrator_ to not add the start time padding to consecutive games (since it's assumed you're already going to be on site).

#### Location Preferences
In a similar manner to _Group Aliases_, _arbitrator_ will keep track of location fields from ArbiterSports. Unfortunately, since ArbiterSports doesn't have an open API, we can't gather this data directly. Instead, when a new location is seen, you can enter an address for future occurrences of that location. If an address exists for a given location, _arbitrator_ will add that address to the calendar event. If an address does not exist, then the name of the site (taken directly from ArbiterSports) will be added as the location of the calendar event.
