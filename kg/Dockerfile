FROM python:3.8-slim

WORKDIR /kg

# Copy your Python app and its dependencies
COPY . /kg

RUN pip install -r requirements.txt

EXPOSE 5005

CMD ["python", "API/app.py"]