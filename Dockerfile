FROM maven:3.9.11-eclipse-temurin-21-alpine AS builder

RUN apk add --no-cache nodejs npm

WORKDIR /app
COPY pom.xml pom.xml

RUN mvn -B de.qaware.maven:go-offline-maven-plugin:resolve-dependencies

COPY src src

RUN mvn package -B -P production -DskipTests

FROM eclipse-temurin:21-jdk-alpine AS runtime

COPY --from=builder /app/target/dataset-dashboard.jar /app/dataset-dashboard.jar

WORKDIR /app

RUN addgroup --gid 1001 -S dd && \
    adduser -G dd --shell /bin/false --disabled-password -H --uid 1001 dd && \
    chown dd:dd /app

expose 8080

USER dd

ENTRYPOINT ["java", "-jar", "dataset-dashboard.jar"]
