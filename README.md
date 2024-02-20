# Coinbase Clone - Explore, Buy/Sell Cryptocurrency

A Coinbase clone, is a cryptocurrency investing application that allows users to buy and sell cryptocurrencies listed on the Coinbase exchange.


## The Overview 🛠

This project was a number of task which involved my self to develop application using the core technologies of python, flask, redis, postgresql, tanstack's react-query, tailwind css, react and typescript with as minimum number as possible of dependency module. As well as to operating using the core technologies of docker, bash script, production deployment, hashicorp consul, microservices, nginx and more. 
This Project took place over 120 working days.
This was both a practicing and learning experience. 


## UI/UX ✨

The UI/UX design heavily inspired by [Coinbase](https://www.coinbase.com/explore) expecially explore and dashboard pages.
- The UI has made as close as possible to the Coinbase web application by view and navigating their web application.
- I restricted my self to not inspect any single code on their website. 
- I still dont know what is webfont and color code they used.


## Features ✨

- Secure user authentication using JWT token and BCrypt
- Personal dashboard displaying current asset holdings, transaction history and more
- Personal dashboard displaying identity, profile and more
- Real-time and historical price data in USD and top most used world currency
- Thousands real world active cryptocurrencies available 
- Capability to simulate real time cryptocurrency trades with real time market price
- Line charts display price data over time
- Lightweight and fast application using cache in browser and backend (redis)
- Highly scalable using docker swarm or kubernetes
- Configurable Rate limiter
- In production, dev team can change application config easily and the applications will reload auatomagicaly
- Idempotency order workflow, to avoid user accidentaly pay twice for same order
- Search any cryptocurrencies by string is optimized 
- Heavily responsive design built with Tailwind CSS
- SPA/Single page application (CSR) maybe will switch to SSR in near future for more optimization
- Strongly typed React components with TypeScript
- Cryptocurrencies pagination 
- Cryptocurrencies infinity scroll 


## Tech stack 🛠

### Back-end 💻

- [Flask v2.3](https://flask.palletsprojects.com/)
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/) for authentication and authorization
- [Flask-Bcrypt](https://flask-bcrypt.readthedocs.io/) secure user authentication
- [Flask-Cors](https://flask-cors.readthedocs.io/)
- [gunicorn](https://gunicorn.org/)

- [PostgreSQL](https://www.postgresql.org/)
- [SQLAlchemy](https://github.com/sqlalchemy/sqlalchemy)
- [Redis](https://redis.io/)
- [Celery](https://github.com/celery/celery)
- [Hashicorp Consul](https://www.consul.io/)
- [Nginx](https://www.nginx.com/)
- [SQLite3](https://www.sqlite.org/) Development only

- [CoinMarketCap API](https://pro-api.coinmarketcap.com/)
- [YahooFinance API](https://finance.yahoo.com)
- [OpenExchangeRates API](https://openexchangerates.org/api/)
- [CryptoNews API](https://cryptocurrency-news2.p.rapidapi.com)

The backend is structured using the [Application Factory Pattern](https://flask.palletsprojects.com/en/3.0.x/patterns/appfactories/). The entry point is the `create_app()` method in `run.py` (`wsgi.py` in production).


### Front-end ✨

- [React v18](https://facebook.github.io/react/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tanstack React Query v4](https://tanstack.com/query)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router v6](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Apache ECharts](https://echarts.apache.org/) 
- [react-sparklines](https://www.npmjs.com/package/react-sparklines)

Entry point is at `frontend/src/main.tsx`.


## Production Deployment 💻

- Python >= 3.11 (minimum python version supported is 3.8)
- PostgreSQL >= 16.1 (Production)
- Redis >= 7.2
- Nginx >= 1.25
- Hashicorp Consul 1.17 (optional)
- SQLite3 (Development)
- Recommended to assign TLS certification such as Lets encrypt


## QuickStart:

### Using Docker Compose

Prerequirities:

- `Docker installed on your machine`

```bash
# clone the repo
$ git clone https://github.com/saptarian/coinbase-clone.git
$ cd coinbase-clone

# environtment variable (the defaults are fine enough)
# Api Keys in section 3RD API are required in order to fully functionality 
$ edit `.env.example` and save as `.env`
$ edit `frontend/.env.example` and save as `frontend/.env`

# Note: edit .env to swicth FLASK_ENV variable to 'production' instead 'default'
# in order to use PostgreSQL instead SQLite3 

# configs (the defaults are fine enough)
$ - `app/config.py`
$ - `app/gunicorn.py`
$ - `nginx.conf`
$ - `frontend/nginx.conf`

# Build and start everything:
# - Make sure docker service is running!
# - The first time you run this it's going to take 5-10 minutes depending on your internet connection speed and computer's hardware specs. That's because it's going to download a few Docker images and build the Python + dependencies.
$ docker compose up --build

# once the backend server running:
# - init, migrate and upgrade the database by single command:
$ chmod +x run
$ ./run db_init

# run database generator script:
$ python script/assets_seed_generator.py

# use generated sql file to populate the database:
$ ./run db_seed

# To start the frontend in the same host:
# open another terminal then run this command
$ ./run fe:build
$ ./run fe:run
```

Once it's done building and everything has booted up:
- Access the app at: [http://localhost:8080](http://localhost:8080)
- Check the backend services (flask app, redis, database) by command:
```
$ curl -XGET "http://localhost/up/"
# if everything are set up correctly it will print empty result 
``` 
```bash
# To change env variable directly on running backend e.g.
$ ./run putenv RATE_LIMIT 120
# once success the config on backend app changed, the app will reload and running with new config automatically
```
Look at file `run` for other useful command such as `reup`, `rebuild`, etc

### Running local development without docker

Prerequirities:

- `Python >= 3.11 (minimum python version supported is 3.8)`
- `SQLite3 (for development it's required instead PostgreSQL)`
- `Redis`
- `Nodejs >= v21.6`

```bash
# clone this repo
$ git clone https://github.com/saptarian/coinbase-clone.git
$ cd coinbase-clone

# create virtual environtment
$ python -m venv venv 

# activate virtual environtment (Windows)
$ `venv\\Scripts\\activate`

# activate virtual environtment (*nix system)
$ source venv/bin/activate

# install python requirement modules
$ pip install -r requirements.txt

# environtment variable (the defaults are fine enough)
# Api Keys in section 3RD API is required in order to fully functionality 
$ edit `.env.example` and save as `.env`
$ edit `frontend/.env.example` and save as `frontend/.env`

# configs (the defaults are fine enough)
$ - `app/config.py`
$ - `app/gunicorn.py`
$ - `nginx.conf`
$ - `frontend/nginx.conf`

# database init
$ flask --app run.py db init

# run database migrations
$ flask --app run.py db migrate
$ flask --app run.py db upgrade

# before start backend server, make sure Redis server has running on it's default port

# start flask application server
$ flask --app run.py run

# once the backend server running open new terminal on the same directory 'coinbase-clone'
# generate database seed and provide used port number e.g. 5000
$ python script/assets_seed_generator.py 5000

# use generated sql file to populate the database with accepted real world cyptocurrencies so the assets are ready to user to buy/sell

# open new terminal to start frontend in development mode:
$ cd frontend
$ npm install
$ npm run dev
```

Check the backend services (flask app, redis, database) by command:
```bash
$ curl -XGET http://localhost:5000/up/
# if everything are set up correctly it will print empty result 
``` 


## About the author

Sapta Rianza [saptaqur@gmail.com](mailto:saptaqur@gmail.com)

I am a self taught developer and have been freelancing for the last ~10 years.
Currently insterested in software engineering and DevOps cicd workflow.


## Contributing

Contributions are welcome! If you find a bug or have a suggestion for a new feature, please create an issue or submit a pull request.


## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
