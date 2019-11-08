# analytics-v2

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

## Creating docker container to deploy

Build the docker image
```
docker build -t [desired-image-name] .
```
Tag the actual release
```
docker tag [desired-image-name] backup.motion-s.com/[name-seen-in-portainer]:[version]
```
Push the docker image to the storage
```
docker push backup.motion-s.com/[name-seen-in-portainer]:[version]
```

### Go to docker.motion-s.com

1. Click Containers on the left
2. Click Add container
3. Set the name you want to see in the list of containers
4. In the field "Image" put ```[name-seen-in-portainer]:[version]```
5. Select the registry "backup.motion-s.com"
6. In Advanced container settings, go to ENV and set the following variables
```$xslt
PORT=Port exposed
TOKEN=Token for the api calls from analytics 
```
7. In Ports configuration -> Port mapping, put in "container" the port that you put in the ENV and in host the port that is going to be visible
8. Hit "Deploy container"

