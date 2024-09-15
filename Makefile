.DEFAULT_GOAL = help

BASE_MANIFEST=compose/docker-compose.yml
LOCAL_MANIFEST=compose/docker-compose.local.yml
DEVELOP_MANIFEST=compose/docker-compose.develop.yml
MASTER_MANIFEST=compose/docker-compose.master.yml
PRODUCTION_MANIFEST=compose/docker-compose.production.yml

ENV_DEPLOY=.env
include ${ENV_DEPLOY}
export

export DOCKER_BUILDKIT=true
export COMPOSE_DOCKER_CLI_BUILD=true


---> [ LocalHost ] ------------------------------------------------------------------------> : ## *

config_pnp-frontend_local: ## Validate pnp-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			config

build_pnp-frontend_local: ## Build pnp-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			build

push_pnp-frontend_local: ## Push images pnp-frontend_local
	@echo "Empty job"

pull_pnp-frontend_local: ## Pull images pnp-frontend_local
	@echo "Empty job"

create_pnp-frontend_local: ## Create pnp-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_pnp-frontend_local: ## Drop pnp-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			down

recreate_pnp-frontend_local: drop_pnp-frontend_local create_pnp-frontend_local ## ReCreate pnp-frontend_local

logs_pnp-frontend_local: ## Show logs of pnp-frontend_local
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${LOCAL_MANIFEST} \
			logs \
				--follow


---> [ Develop ] ---------------------------------------------------------------------------> : ## *

config_pnp-frontend_develop: ## Validate pnp-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			config

build_pnp-frontend_develop: ## Build pnp-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			build

push_pnp-frontend_develop: ## Push images pnp-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			push

pull_pnp-frontend_develop: ## Pull images pnp-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			pull

create_pnp-frontend_develop: ## Create pnp-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_pnp-frontend_develop: ## Drop pnp-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			down

recreate_pnp-frontend_develop: drop_pnp-frontend_develop create_pnp-frontend_develop ## ReCreate pnp-frontend_develop

logs_pnp-frontend_develop: ## Show logs of pnp-frontend_develop
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${DEVELOP_MANIFEST} \
			logs \
				--follow


---> [ Master ] ---------------------------------------------------------------------------> : ## *

config_pnp-frontend_master: ## Validate pnp-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			config

build_pnp-frontend_master: ## Build pnp-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			build

push_pnp-frontend_master: ## Push images pnp-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			push

pull_pnp-frontend_master: ## Pull images pnp-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			pull

create_pnp-frontend_master: ## Create pnp-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_pnp-frontend_master: ## Drop pnp-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			down

recreate_pnp-frontend_master: drop_pnp-frontend_master create_pnp-frontend_master ## ReCreate pnp-frontend_master

logs_pnp-frontend_master: ## Show logs of pnp-frontend_master
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${MASTER_MANIFEST} \
			logs \
				--follow


---> [ Production ] ---------------------------------------------------------------------------> : ## *

config_pnp-frontend_production: ## Validate pnp-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			config

build_pnp-frontend_production: ## Build pnp-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			build

push_pnp-frontend_production: ## Push images pnp-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			push

pull_pnp-frontend_production: ## Pull images pnp-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			pull

create_pnp-frontend_production: ## Create pnp-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			up \
				--detach \
				--force-recreate

drop_pnp-frontend_production: ## Drop pnp-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			down

recreate_pnp-frontend_production: drop_pnp-frontend_production create_pnp-frontend_production ## ReCreate pnp-frontend_production

logs_pnp-frontend_production: ## Show logs of pnp-frontend_production
	@docker-compose \
		--env-file ${ENV_DEPLOY} \
		--file ${BASE_MANIFEST} \
		--file ${PRODUCTION_MANIFEST} \
			logs \
				--follow


---> [ System ] ---------------------------------------------------------------------------> : ## *

clean: ## Clean directory
	@find . ! -name . -and \
			! -name .. -and \
			! -name compose -and \
			! -name ".env" -and \
			! -name "Makefile" -and \
			! -name "docker-compose.yml" \
			! -name "docker-compose.*.yml" \
      			-delete

prune_system: ## Prune docker system
	@docker system prune --force

help: ## Show help
	@awk 	'BEGIN {FS = ":.*?## "} \
			/^[a-z A-Z0-9\[\]\<\>_-]+:.*?## / \
			{printf "  \033[36m%-35s\033[0m %s\n", $$1, $$2}' \
				$(MAKEFILE_LIST)
