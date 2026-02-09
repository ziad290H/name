FROM nginx:alpine

# Copy ALL HTML files, not just index.html
COPY *.html /usr/share/nginx/html/

# Copy CSS and JS directories
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]