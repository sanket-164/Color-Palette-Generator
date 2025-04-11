CONTAINER_NAME := pa-project-backend

IMAGE := sanket164/color-palette-generator:backend
PORT := 5020
CONTAINER_INTERNAL_PORT := 5000

pull-image:
	@docker pull  --platform linux/x86_64 $(IMAGE)

start-backend:
	 @if docker ps -a --format '{{.Names}}' | grep -q "^$(CONTAINER_NAME)$$"; then \
                echo "Starting existing RabbitMQ container..."; \
                docker start $(CONTAINER_NAME); \
        else \
                echo "Creating new RabbitMQ container..."; \
                docker run --name $(CONTAINER_NAME) \
                        -d -p $(PORT):$(CONTAINER_INTERNAL_PORT) \
                        $(IMAGE); \
        fi