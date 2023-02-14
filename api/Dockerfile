FROM umihico/aws-lambda-selenium-python:latest
# https://github.com/umihico/docker-selenium-lambda/blob/main/Dockerfile

RUN pip install fastapi mangum uvicorn webdriver-manager

COPY main.py ./
CMD [ "main.handler" ]
