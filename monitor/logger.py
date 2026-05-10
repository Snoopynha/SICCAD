import os
import json
from datetime import datetime

if os.path.exists("/app/shared_data"):
    LOG_PATH = "/app/shared_data/log_geral.json"
else:
    BASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    LOG_PATH = os.path.join(BASE_PATH, "log_geral.json")

os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)


def _load():
    if not os.path.exists(LOG_PATH):
        return []
    with open(LOG_PATH, "r") as f:
        return json.load(f)


def _save(data):
    with open(LOG_PATH, "w") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


def log(tipo: str, mensagem: str, extra: dict = None):
    logs = _load()
    logs.append(
        {
            "timestamp": datetime.utcnow().isoformat(),
            "tipo": tipo,
            "mensagem": mensagem,
            "extra": extra or {},
        }
    )

    _save(logs)
