#Hobby Proj
An automated ping pong scoreboard / leaderboard by Fiachra McDermott, Walter Michelin, and Tong Liu (forked from sidgtl)

App runs on Heroku at [http://hobbyproj.herokuapp.com](http://hobbyproj.herokuapp.com)


The project is functional but you will need a battery to power the Spark Core underneath the ping-pong table. Any portable cell phone charger with a micro-usb plug will work well. See [this one](http://www.amazon.com/Anker-Generation-Astro-mini-Lipstick-Sized/dp/B005X1Y7I2/ref=sr_1_1?ie=UTF8&qid=1440196538&sr=8-1&keywords=portable+charger) for an example. 

#Development
To run locally, do the following: (ensure your config.js file is up to date)

1. gulp (to build front end)
2. NODE_ENV=development npm start (to start the server)

Steps to deploy
---------------
1. create a new local branch 
2. remove the following from the .gitignore: config.js, versions, and built css / js
3. gulp to build your front end
3. git push heroku yourbranch:master (you must have heroku set up locally, and be added as a contributor to the heroku instance)
