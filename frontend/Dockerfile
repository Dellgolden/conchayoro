# Etapa de build
FROM node:18-alpine AS build-stage

WORKDIR /app

# Corrige problema com certificados SSL e instala dependências nativas
RUN sed -i 's/https/http/' /etc/apk/repositories && \
    apk add --no-cache python3 make g++ && \
    npm config set strict-ssl false && \
    npm cache clean --force

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos e gera o build
COPY . .
RUN npm run build

# Etapa final com nginx
FROM nginx:1.19.3-alpine AS production-stage

# Copia arquivos da build para o Nginx
COPY --from=build-stage /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
