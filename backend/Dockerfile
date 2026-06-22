FROM node:20.7-alpine

# Install R, necessary dependencies, and g++
RUN apk update -U && \
    apk --no-cache add R R-dev curl-dev libxml2-dev g++

# Set CRAN mirror
RUN echo 'options(repos = c(CRAN = "https://cran.usk.ac.id/bin/windows/contrib/4.3/"))' > /etc/R/Rprofile.site

# Install R dependencies
RUN R -e "install.packages('shiny', repos = 'https://cran.usk.ac.id/bin/windows/contrib/4.3/')"
RUN R -e "install.packages(c('dplyr', 'ggplot2', 'gapminder'), repos = 'https://cran.usk.ac.id/bin/windows/contrib/4.3/')"

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV PORT=8080
EXPOSE $PORT

CMD ["npm", "start"]
