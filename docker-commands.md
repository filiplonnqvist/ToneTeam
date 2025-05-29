# Normal development cycle - doesn't remove images
cd docker
docker compose -f docker-compose-development.yml down
docker compose -f docker-compose-development.yml up -d --build

# View logs while running
docker compose -f docker-compose-development.yml logs -f

# Remove stopped containers
docker container prune -f

