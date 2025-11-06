
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces', // pakai `jaeger` kalau di docker-compose network
  }),
  serviceName: 'auth-service',
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
