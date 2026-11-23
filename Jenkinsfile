pipeline {
    agent any

    environment {
        NEXT_PUBLIC_API_URL   = 'http://academico3.rj.senac.br/hemovida/gateway'
        NEXT_PUBLIC_USAR_MOCK = 'true'
    }

    stages {
        stage('Verificar Repositório') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/RalphMerling/20262M-prj5-hemovida-front-end']]
                ])
            }
        }

        stage('Instalar Dependências e Compilar') {
            steps {
                sh 'node -v'
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                sh "docker build -t hemovida-front-end:${env.BUILD_ID} ."
            }
        }

        stage('Fazer Deploy') {
            steps {
                sh 'docker stop hemovida-front-end || true'
                sh 'docker rm -v hemovida-front-end || true'
                sh "docker run -d --name hemovida-front-end --restart unless-stopped -p 7500:80 hemovida-front-end:${env.BUILD_ID}"
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
