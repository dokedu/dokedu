import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from '@pulumi/kubernetes'
import * as random from "@pulumi/random";

const config = new pulumi.Config()
const ghcrToken = config.requireSecret("ghcr")

const namespace = new kubernetes.core.v1.Namespace('dokedu-' + pulumi.getStack())


const backendCredentialsPassword = new random.RandomPassword('backend-credentials-password', {length: 32, special: false})
const backendCredentials = new kubernetes.core.v1.Secret('backend-credentials', {
  metadata: {namespace: namespace.metadata.name, labels: {'cnpg.io/reload': 'true'}},
  stringData: {
    username: 'backend',
    password: backendCredentialsPassword.result
  },
  type: 'kubernetes.io/basic-auth'

})

const postgresCluster = new kubernetes.apiextensions.CustomResource('postgres', {
  apiVersion: "postgresql.cnpg.io/v1",
  kind: "Cluster",
  metadata: {
    namespace: namespace.metadata.name,
    name: 'postgres'
  },
  spec: {
    instances: 1,
    managed: {
      roles: [
        {
          name: 'backend',
          ensure: 'present',
          login: true,
          superuser: true,
          passwordSecret: {name: backendCredentials.metadata.name}
        }
      ]
    },
    storage: {
      size: '1Gi'
    }
  }
})

const ghcr = new kubernetes.core.v1.Secret('ghcr', {
  metadata: {namespace: namespace.metadata.name, name: 'ghcr'},
  stringData: {
    '.dockerconfigjson': ghcrToken.apply(token => `{"auths":{"ghcr.io":{"auth":"${token}"}}}`)
  },
  type: 'kubernetes.io/dockerconfigjson'
})

// minio
const minioPvc = new kubernetes.core.v1.PersistentVolumeClaim('backend', {
  metadata: {namespace: namespace.metadata.name, annotations: {"pulumi.com/skipAwait": "true"}},
  spec: {
    accessModes: ["ReadWriteOnce"],
    resources: {
      requests: {
        storage: '1Gi'
      }
    }
  }
})
const minio = new kubernetes.apps.v1.Deployment('minio', {
  metadata: {namespace: namespace.metadata.name, name: 'minio'},
  spec: {
    selector: {matchLabels: {app: 'minio'}},
    replicas: 1,
    template: {
      metadata: {labels: {app: 'minio'}},
      spec: {
        volumes: [{name: 'data', persistentVolumeClaim: {claimName: minioPvc.metadata.name}}],
        containers: [{
          name: 'minio',
          image: 'quay.io/minio/minio:RELEASE.2024-05-01T01-11-10Z',
          ports: [{containerPort: 9000}, {containerPort: 9001}],
          args: ['server', '/data', '--console-address', ':9001'],
          env: [
            {name: 'MINIO_ROOT_USER', value: 'root'},
            {name: 'MINIO_ROOT_PASSWORD', value: 'password'},
          ],
          volumeMounts: [
            {mountPath: '/data', name: 'data'}
          ]
        }]
      }
    }
  }
})

const minioService = new kubernetes.core.v1.Service('minio', {
  metadata: {namespace: namespace.metadata.name},
  spec: {
    ports: [{port: 9000, targetPort: 9000}],
    selector: {app: 'minio'},
  }
}, {dependsOn: [minio]})


// meilisearch
const meilisearch = new kubernetes.apps.v1.Deployment('meilisearch', {
  metadata: {namespace: namespace.metadata.name},
  spec: {
    selector: {matchLabels: {app: 'meilisearch'}},
    replicas: 1,
    template: {
      metadata: {labels: {app: 'meilisearch'}},
      spec: {
        containers: [{
          name: "meilisearch",
          image: 'getmeili/meilisearch:v1.8.0',
          ports: [{containerPort: 7700}],
        }]
      }
    }
  }
})
const meilisearchService = new kubernetes.core.v1.Service('meilisearch', {
  metadata: {namespace: namespace.metadata.name},
  spec: {
    ports: [{port: 7700, targetPort: 7700}],
    selector: {app: 'meilisearch'},
  }
})

// backend stuff

const backend = new kubernetes.apps.v1.Deployment('backend', {
  metadata: {namespace: namespace.metadata.name, name: 'backend'},
  spec: {
    selector: {matchLabels: {app: 'backend'}},
    replicas: 1,
    template: {
      metadata: {labels: {app: 'backend'}},
      spec: {
        containers: [{
          name: "backend",
          image: 'ghcr.io/felixhromadko/dokedubackend:5',
          ports: [{containerPort: 8080}],
          env: [
            {name: "DB_DSN", value: backendCredentialsPassword.result.apply(pw => `postgres://backend:${pw}@postgres-rw:5432/postgres`)},
            {name: 'MINIO_HOST', value: minioService.metadata.name},
            {name: 'MINIO_PORT', value: '9000'},
            {name: 'MINIO_ACCESS_KEY_ID', value: "root"},
            {name: 'MINIO_SECRET_ACCESS_KEY', value: "root"},
            {name: 'MEILI_HOST', value: meilisearchService.metadata.name.apply(h => `http://${h}:7700`)},
            {name: 'MEILI_API_KEY', value: 'hi'}
          ]
        }],
        imagePullSecrets: [{name: ghcr.metadata.name}]
      }
    }
  }
})
const backendService = new kubernetes.core.v1.Service('backend', {
  metadata: {namespace: namespace.metadata.name},
  spec: {
    ports: [{port: 80, targetPort: 8080}],
    selector: {app: 'backend'},
  }
}, {dependsOn: [backend]})
const backendIngress = new kubernetes.networking.v1.Ingress('backend', {
  metadata: {
    namespace: namespace.metadata.name,
    annotations: {
      'pulumi.com/skipAwait': 'true',
      'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
      'ingress.kubernetes.io/force-ssl-redirect': 'true',
      'kubernetes.io/incress.class': 'contour',
      'kubernetes.io/tls-acme': 'true'
    }
  },
  spec: {
    tls: [{
      hosts: ["dokedu-api.felixhromadko.at"],
      secretName: "backend-tls"
    }],
    rules: [{
      host: 'dokedu-api.felixhromadko.at',
      http: {
        paths: [{
          pathType: 'Prefix',
          path: "/",
          backend: {
            service: {
              name: backendService.metadata.name,
              port: {number: 80}
            }
          }
        }]
      }
    }]
  }
})


// frontend
const frontend = new kubernetes.apps.v1.Deployment('frontend', {
  metadata: {namespace: namespace.metadata.name, name: 'frontend'},
  spec: {
    selector: {matchLabels: {app: 'frontend'}},
    replicas: 1,
    template: {
      metadata: {labels: {app: 'frontend'}},
      spec: {
        containers: [{
          name: "frontend",
          image: 'ghcr.io/felixhromadko/dokedufrontend:4',
          ports: [{containerPort: 80}],
        }],
        imagePullSecrets: [{name: ghcr.metadata.name}]
      }
    }
  }
})
const frontendService = new kubernetes.core.v1.Service('frontend', {
  metadata: {namespace: namespace.metadata.name},
  spec: {
    ports: [{port: 80, targetPort: 80}],
    selector: {app: 'frontend'},
  }
})
const frontendIngress = new kubernetes.networking.v1.Ingress('frontend', {
  metadata: {
    namespace: namespace.metadata.name,
    annotations: {
      'pulumi.com/skipAwait': 'true',
      'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
      'ingress.kubernetes.io/force-ssl-redirect': 'true',
      'kubernetes.io/incress.class': 'contour',
      'kubernetes.io/tls-acme': 'true'
    }
  },
  spec: {
    tls: [{
      hosts: ["dokedu.felixhromadko.at"],
      secretName: "frontend-tls"
    }],
    rules: [{
      host: 'dokedu.felixhromadko.at',
      http: {
        paths: [{
          pathType: 'Prefix',
          path: "/",
          backend: {
            service: {
              name: frontendService.metadata.name,
              port: {number: 80}
            }
          }
        }]
      }
    }]
  }
})