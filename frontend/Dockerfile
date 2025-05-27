# Etapa de build
FROM node:18-alpine AS build-stage
<<<<<<< HEAD

WORKDIR /app

# Corrige problema com certificados SSL ao instalar dependências do sistema
RUN sed -i 's/https/http/' /etc/apk/repositories && \
    apk add --no-cache python3 make g++ && \
    npm cache clean --force

# Instala dependências do projeto
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos e gera o build
COPY . .
RUN ./node_modules/.bin/next build

# Etapa de produção
FROM nginx:1.19.3-alpine AS production-stage

# Copia os arquivos estáticos gerados para o Nginx
COPY --from=build-stage /app/.next/static /usr/share/nginx/html
COPY --from=build-stage /app/public /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
=======
WORKDIR /app

# Corrige repositórios e instala dependências nativas
RUN sed -i 's/https/http/' /etc/apk/repositories && \
    apk add --no-cache python3 make g++

# ⚠️ Desativa verificação de SSL para evitar SELF_SIGNED_CERT_IN_CHAIN
RUN npm config set strict-ssl false

# Instala dependências
COPY package.json ./
RUN npm install

# Copia restante do projeto
COPY . .

# Build
RUN npm run build

# Etapa final com nginx
FROM nginx:1.19.3-alpine AS production-stage
COPY --from=build-stage /app/out /usr/share/nginx/html

EXPOSE 80
>>>>>>> fddded6 (Inclusão backend)
CMD ["nginx", "-g", "daemon off;"]
