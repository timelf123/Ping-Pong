#Hobby Proj

We are now deployed on a heroku instance. To run locally, do the following

1 gulp (to build front end)
2 NODE_ENV=development npm start (to start the server)

#Steps to deploy
1 create a new local branch 
2 remove the following from the .gitignore: config.js, versions, and built css / js
3 git push heroku yourbranch:master (you must have heroku set up locally, and be added as a contributor to the heroku instance)
