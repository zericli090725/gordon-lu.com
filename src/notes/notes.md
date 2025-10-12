cd /var/www/gordon/api
npm i
export PGHOST=localhost PGUSER=gordon_user PGPASSWORD='StrongPGPass!' PGDATABASE=gordon PGPORT=5432 JWT_SECRET='ChangeThisJWTSecret'
pm2 start server.js --name gordon-api --update-env
pm2 save
pm2 startup systemd   # run the sudo command it prints
