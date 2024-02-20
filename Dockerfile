FROM denoland/deno

EXPOSE 8000

WORKDIR /

ADD . /

RUN deno cache app.ts

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "app.ts"]