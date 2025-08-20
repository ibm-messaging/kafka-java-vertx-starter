# Build stage
FROM maven:3.9.11-ibm-semeru-17-noble AS build

WORKDIR /app
COPY pom.xml .
COPY package.json .
COPY src ./src
COPY ui ./ui

# Build the JAR (this will run frontend-maven-plugin too)
RUN mvn clean package -DskipTests

# Runtime stage
FROM ibm-semeru-runtimes:open-17-jdk

WORKDIR /app
COPY kafka.properties kafka.properties
COPY --from=build /app/target/demo-all.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
