# Etapa de construcción
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY go.mod go.sum ./

# Descargar dependencias
RUN go mod tidy

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN go build -o main .

# Etapa final
FROM alpine:latest

WORKDIR /root/

# Copiar el binario desde la etapa de construcción
COPY --from=builder /app/main .

# Exponer el puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["./main"]