build:
	docker build -t mars-rovers .

run:
	docker run -it mars-rovers

run-local:
	npm run-script run

test:
	npm run-script test