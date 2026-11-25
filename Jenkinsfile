pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    environment {
        APP_NAME = 'hemovida-front-end'
        APP_PORT = '7500'
        GIT_URL = 'https://github.com/RalphMerling/20262M-prj5-hemovida-front-end.git'
        NEXT_PUBLIC_API_URL   = 'http://academico3.rj.senac.br/hemovida/gateway'
        NEXT_PUBLIC_USAR_MOCK = 'true'
    }

    stages {

        stage('Verificar Repositório') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: "${GIT_URL}"]]
                ])
            }
        }

        stage('Instalar Dependências') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'npm ci'
            }
        }

        stage('Compilar Projeto Next') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                sh "docker build -t ${APP_NAME}:${env.BUILD_ID} ."
            }
        }

        stage('Fazer Deploy') {
            steps {
                sh "docker stop ${APP_NAME} || true"
                sh "docker rm ${APP_NAME} || true"
                sh """
                    docker run -d \
                        --name ${APP_NAME} \
                        --restart unless-stopped \
                        -p ${APP_PORT}:80 \
                        ${APP_NAME}:${env.BUILD_ID}
                """
            }
        }
    }

    post {
        success {
            echo 'Deploy do front realizado com sucesso!'
        }
        failure {
            echo 'Houve um erro durante o deploy do front.'
        }
    }
}