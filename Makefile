default: test lint build

.PHONY: node_modules
node_modules:
	yarn install

.PHONY: build
build: node_modules
	yarn build

.PHONY: test
test: node_modules
	yarn test

.PHONY: lint
lint: node_modules
	yarn lint

.PHONY: clean
clean:
	rm -rf dist
