FROM nginx:latest

# Create a non-root user
RUN useradd -m -d /home/nginxuser nginxuser

# Set ownership of NGINX directories to the non-root user
RUN chown -R nginxuser:nginxuser /home/nginxuser

# Create directory for static files and set ownership
RUN mkdir -p /home/nginxuser/staticfiles
RUN chown -R nginxuser:nginxuser /home/nginxuser/staticfiles

# Copy static files into the container
COPY ./dist/frontend /home/nginxuser/staticfiles

# Switch to the non-root user
USER nginxuser
