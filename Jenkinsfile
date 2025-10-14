pipeline {
  agent any
  environment {
    DOCKER_REGISTRY = "yourdockerhubusername"
    APP = "voting-app"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build images') {
      steps {
        sh "docker build -t ${DOCKER_REGISTRY}/ui:latest ./ui"
        sh "docker build -t ${DOCKER_REGISTRY}/vote:latest ./vote"
        sh "docker build -t ${DOCKER_REGISTRY}/result:latest ./result"
        sh "docker build -t ${DOCKER_REGISTRY}/worker:latest ./worker"
      }
    }
    stage('Push images') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
          sh "echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin"
          sh "docker push ${DOCKER_REGISTRY}/ui:latest"
          sh "docker push ${DOCKER_REGISTRY}/vote:latest"
          sh "docker push ${DOCKER_REGISTRY}/result:latest"
          sh "docker push ${DOCKER_REGISTRY}/worker:latest"
        }
      }
    }
    stage('Deploy to Swarm') {
      steps {
        sh '''
           sed -e 's|build: ./ui|image: ${DOCKER_REGISTRY}/ui:latest|' \
               -e 's|build: ./vote|image: ${DOCKER_REGISTRY}/vote:latest|' \
               -e 's|build: ./result|image: ${DOCKER_REGISTRY}/result:latest|' \
               -e 's|build: ./worker|image: ${DOCKER_REGISTRY}/worker:latest|' \
               docker-compose.yml > /tmp/docker-stack.yml
           docker stack deploy -c /tmp/docker-stack.yml ${APP}
        '''
      }
    }
  }
  post { always { echo "Pipeline finished" } }
}
