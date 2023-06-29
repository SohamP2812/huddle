FROM openjdk:17
ARG JAR_FILE=api/target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-javaagent:/huddle/newrelic/newrelic.jar", "-jar", "/app.jar", "--spring.profiles.active=prod"]