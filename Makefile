NEXT_APP_PORT ?= 3000
JSON_SERVER_PORT ?= 3001
DB_FILE ?= ./mock-data/db.json

.PHONY: all dev json-server next-dev clean install help

all: dev

dev:
	@echo "Starting Next.js development server on port $(NEXT_APP_PORT)..."
	@echo "Starting JSON server on port $(JSON_SERVER_PORT) using ${DB_FILE}."
	yarn concurrently "next dev -p $(NEXT_APP_PORT) --experimental-https" "npx json-server --watch $(DB_FILE) --port $(JSON_SERVER_PORT)"

json-server:
	@echo "Starting JSON server on port $(JSON_SERVER_PORT) using ${DB_FILE}."
	npx json-server --watch $(DB_FILE) --port $(JSON_SERVER_PORT)

next-dev:
	@echo "Starting Next.js development server on port $(NEXT_APP_PORT)..."
	next dev -p $(NEXT_APP_PORT) --experimental-https

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
	@echo "  make all   - Start both Next.js and JSON server"
	@echo "  make dev   - Start development servers"
	@echo "  make json-server  - Start JSON server only"
	@echo "  make next-dev   - Start Next.js development server only"
	@echo "  make clean - Clean build artifacts"
	@echo "  make install   - Install dependencies"
	@echo "  make help   - Show this help message"
	@echo "Environment variables:"
	@echo "  NEXT_APP_PORT   - Port for Next.js app (default: 3000)"
	@echo "  JSON_SERVER_PORT  - Port for JSON server (default: 3001)"
	@echo "  DB_FILE     - JSON file for JSON server (default: db.json)"
