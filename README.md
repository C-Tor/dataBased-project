*Setting up workflow:*
1. Make a clone of this repository on the OSU engr stak folder. Or you could just copy and paste the repository into the stak folder whenever you want to run/test it, but I think it's better to just keep the stak connection open whenever working.
2. Open a bash (or ssh? idk. I use PuTTY) to this directory, then do the command "npm install" to install all the depencencies for the project (express, handlebars, mysql)
3. Modify the contents in the dbcon_example.js file to match your database username and password, then change the filename to just "dbcon.js". This is in .gitignore so it won't be pushed to the github, I think this is more secure for your database info? There's another way to do it with some type of config file but I don't wanna figure that out.
4. Install the DataBASED_NBA_create.sql database creator into your maria db (same mariadb that the dbcon.js connects to).

This is all so it works with the database on the flip servers. Maybe there's a way to host the database locally while working on it but I'm not sure how to do that.

*Running the site:*
1. Type in your ssh "node main.js (port)" instead of (port) make up a random port number.
2. Go to http://flipX.engr.oregonstate.edu:port/, replacing the X in flipX with whatever flip server you're starting the server from and port with whatever port you specified.
