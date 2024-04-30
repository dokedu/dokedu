package tracing

import (
	"context"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.25.0"
)

type Config struct {
	Enabled  bool   `env:"TRACE_ENABLED"`
	Endpoint string `env:"TRACE_ENDPOINT"`
}

var Tracer = otel.GetTracerProvider().Tracer("backend")

func InitializeTracing(cfg Config) error {
	ctx := context.Background()

	res, err := resource.New(
		ctx,
		resource.WithAttributes(
			// the service name used to display traces in backends
			semconv.ServiceNameKey.String("backend"),
		),
	)
	if err != nil {
		return err
	}

	exporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithInsecure(), otlptracegrpc.WithEndpoint(cfg.Endpoint))
	if err != nil {
		return err
	}

	var sampler sdktrace.Sampler
	if cfg.Enabled {
		sampler = sdktrace.AlwaysSample()
	} else {
		sampler = sdktrace.NeverSample()
	}

	bsp := sdktrace.NewBatchSpanProcessor(exporter)
	traceProvider := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sampler),
		sdktrace.WithResource(res),
		sdktrace.WithSpanProcessor(bsp),
	)

	otel.SetTracerProvider(traceProvider)

	return nil
}
