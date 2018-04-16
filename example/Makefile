default: test

.PHONY: node_modules
node_modules:
	make -C ../ build
	yarn install

.PHONY: test
test: node_modules
	yarn test
