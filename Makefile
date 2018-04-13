default: test lint build docs

.PHONY: node_modules
node_modules:
	yarn install

.PHONY: docs
docs: node_modules
	yarn docs

.PHONY: build
build: node_modules
	yarn build

.PHONY: test
test: node_modules build
	yarn test

.PHONY: lint
lint: node_modules
	yarn lint

.PHONY: clean
clean:
	rm -rf dist

.PHONY: release
release: clean test lint build
	test `cat package.json | jq ".version"` = '"${VERSION}"'
	git tag ${VERSION}
	git push
	git push --tags
	yarn publish
