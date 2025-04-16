   # Use the official Nginx image
   FROM nginx:alpine

   # Copy the frontend files to the Nginx HTML directory
   COPY ./frontend /usr/share/nginx/html

   # Copy the Nginx configuration file
   COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

   # Expose the port the app runs on
   EXPOSE 80