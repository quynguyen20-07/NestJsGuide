build: 
	docker compose up -d --build 

up: 
	docker compose up -d

up-clean:
	docker compose up -d --build --force-recreate --remove-orphans

stop: 
	docker compose stop

down: 
	docker compose down

exec:
	docker compose exec app sh

seed:	
	docker compose exec app yarn seed

build-dist: 
	docker compose exec app yarn build exit

format:
	docker compose exec app yarn format 

nest-resource:
	nest g resource /modules/$(name)

build-pro:
	docker build \
		--platform linux/x86_64 \
		-f docker/Dockerfile.product \
		-t brand-management \
		.

login:
	aws ecr get-login-password \
    --region ap-southeast-1 \
	| docker login \
    --username AWS \
    --password-stdin 902637028063.dkr.ecr.ap-southeast-1.amazonaws.com

tag-dev:
	docker tag \
		brand-management:latest \
		902637028063.dkr.ecr.ap-southeast-1.amazonaws.com/brand-management-dev:1.6

push-dev:
	docker push \
		902637028063.dkr.ecr.ap-southeast-1.amazonaws.com/brand-management-dev:1.6
tag:
	docker tag \
		brand-management:latest \
		902637028063.dkr.ecr.ap-southeast-1.amazonaws.com/brand-management:3.4

push:
	docker push \
		902637028063.dkr.ecr.ap-southeast-1.amazonaws.com/brand-management:3.4

run:
	docker run \
		--detach \
		--name brand-management-test \
		--env-file .env \
		-p 6002:6002 \
		brand-management:latest
