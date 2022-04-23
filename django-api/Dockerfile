FROM python:3.9.5-slim-buster

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# required for jre in docker
RUN mkdir /usr/share/man/man1/
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64/

RUN apt-get update \
  && apt-get -y install default-jre-headless netcat gcc \
  && apt-get clean

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt