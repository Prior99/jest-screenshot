default: test

.PHONY: node_modules
node_modules:
	make -C ../ build
	rm -rf node_modules
	yarn install

.PHONY: test
test: node_modules
	yarn test
