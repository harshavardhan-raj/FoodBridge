# Build stage
FROM node:18-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy the built files from build-stage to nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed, or use default
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Using a standard Nginx config that handles React Router
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
