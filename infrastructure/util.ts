import * as kubernetes from "@pulumi/kubernetes";
import {Input} from "@pulumi/pulumi";

export function Service(name: string, args: {
  namespace: Input<string>,
  app: Input<string>,
  port: Input<number>,
  targetPort?: Input<number>,
}) {
  return new kubernetes.core.v1.Service(name, {
    metadata: {namespace: args.namespace},
    spec: {
      ports: [{port: args.port, targetPort: args.targetPort ?? args.port}],
      selector: {app: args.app},
    }
  })
}

export function Ingress(name: string, args: {
  namespace: Input<string>,
  host: Input<string>,
  service: {name: Input<string>, port: Input<number>}
}) {
  return new kubernetes.networking.v1.Ingress(name, {
    metadata: {
      namespace: args.namespace,
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
        hosts: [args.host],
        secretName: name + "-tls"
      }],
      rules: [{
        host: args.host,
        http: {
          paths: [{
            pathType: 'Prefix',
            path: "/",
            backend: {
              service: {
                name: args.service.name,
                port: {number: args.service.port}
              }
            }
          }]
        }
      }]
    }
  })
}