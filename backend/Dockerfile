FROM python:3.10

WORKDIR /src

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD [ "python", "src/manage.py", "runserver", "0.0.0.0:8000" ]