# FROM nginx
FROM nginx@sha256:dd2d0ac3fff2f007d99e033b64854be0941e19a2ad51f174d9240dda20d9f534
RUN echo "server {\n  listen 80;\n  root /var/www/html/build;\n  index index.html index.htm;\n  try_files \$uri \$uri/ /index.html?\$query_string;\n}\n" >/etc/nginx/conf.d/default.conf

# Some weird issues with yarn not installing properly from apt-get (https://stackoverflow.com/questions/46013544/yarn-install-command-error-no-such-file-or-directory-install)
RUN apt-get update && apt-get install -y gnupg2 apt-transport-https curl
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" >/etc/apt/sources.list.d/yarn.list

# For updating node
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install -y wget unzip yarn nodejs

COPY . /var/www/html
WORKDIR /var/www/html

RUN yarn install --frozen-lockfile
RUN yarn build
