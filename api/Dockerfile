FROM python:3.12.1

WORKDIR /app

# Poetryのインストール
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python -
ENV PATH="${PATH}:/opt/poetry/bin"

# 依存パッケージのインストール
COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --no-interaction --no-ansi

COPY ./app .

# ポートのエクスポート
EXPOSE 3333

# アプリケーションの実行
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "3333"]