FROM node:12 as builder

# Создать директорию app
WORKDIR /site

# Установить зависимости приложения
# Используется символ подстановки для копирования как package.json, так и package-lock.json,
# работает с npm@5+
COPY package.json /site/package.json

RUN npm install
# Используется при сборке кода в продакшене
#RUN npm install --only=production

# Скопировать исходники приложения
COPY . /site

RUN npm run build

FROM nginx:1.16.0-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /site/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]