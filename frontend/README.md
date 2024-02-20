# Coinbase Clone - Frontend

<p align="center">
  A Coinbase clone, is a cryptocurrency investing application that allows users to buy and sell cryptocurrencies listed on the Coinbase exchange.
</p>


## The Overview 🛠

This project was a number of task which involved my self to develop application using the core technologies of python, flask, redis, postgresql, tanstack's react-query, tailwind css, react and typescript with as minimum number as possible of dependency module. As well as to operating using the core technologies of docker, bash script, production deployment, hashicorp consul, microservices, nginx and more. 
This Project took place over 120 working days.
This was both a practicing and learning experience. 


## UI/UX ✨

The UI/UX design heavily inspired by [Coinbase](https://coinbase.com/) expecially explore and dashboard pages.
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

### Front-end ✨

- [React v18](https://facebook.github.io/react/)
- [TypeScript](https://)
- [Tanstack React Query v4](https://reacttraining.com/react-router/web)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router DOM v6](https://reacttraining.com/react-router/web)
- [Vite](https://)
- [echarts](https://) 
- and mini-chart [react-sparklines](https://)

Entry point is at `frontend/src/main.tsx`.


## About the author

- Sapta Rianza [saptaqur@gmail.com](mailto:saptaqur@gmail.com)

I am a self taught developer and have been freelancing for the last ~10 years.
Currently insterested in software engineering and dev-ops cicd workflow.


## Contributing

Contributions are welcome! If you find a bug or have a suggestion for a new feature, please create an issue or submit a pull request.


## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
