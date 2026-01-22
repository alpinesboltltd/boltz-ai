NEXT_APP_PORT ?= 3000

.PHONY: dev clean install help

dev:
	@echo "Starting Next.js development server on port $(NEXT_APP_PORT)..."
	yarn concurrently "next dev -p $(NEXT_APP_PORT) --experimental-https"

clean:
	@echo "Cleaning up build artifacts..."
	rm -rf .next node_modules
	@echo "Build artifacts cleaned."

install:
	@echo "Installing dependencies..."
	yarn install
	@echo "Dependencies installed."

help:
	@echo "Makefile commands:"
	@echo "  make dev   - Start development servers"
	@echo "  make clean - Clean build artifacts"
	@echo "  make install   - Install dependencies"
	@echo "  make help   - Show this help message"
	@echo "Environment variables:"
	@echo "  NEXT_APP_PORT   - Port for Next.js app (default: 3000)"
