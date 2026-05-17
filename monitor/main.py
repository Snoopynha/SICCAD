import asyncio
import datetime
import json
from logger import log
import os
from fastapi import FastAPI, requests
from dotenv import load_dotenv
import httpx
import psycopg2
from psycopg2.extras import RealDictCursor

# --- Configurações ---
load_dotenv()
app = FastAPI()

DB = {
    "dbname": os.getenv("DB_DB"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
}

JAVA_API_URL = os.getenv("JAVA_API_URl")


def conectar_banco():
    return psycopg2.connect(**DB)


# --- Métodos auxiliares ---
async def notificar_api(endpoint: str, payload: dict):
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            await client.post(f"{JAVA_API_URL}{endpoint}", json=payload)
    except Exception as e:
        log("ERROR", "Falha ao notificar API Java", {"erro": str(e)})


def detectar_forca_bruta(cursor):
    cursor.execute("""
        UPDATE log_acesso
        SET anomalia = true
        WHERE id IN (
            SELECT id FROM log_acesso
            WHERE sucesso = false
            AND timestamp > NOW() - INTERVAL '10 minutes'
            AND ip_origem IN (
                SELECT ip_origem
                FROM log_acesso
                WHERE sucesso = false
                AND timestamp > NOW() - INTERVAL '10 minutes'
                GROUP BY ip_origem
                HAVING COUNT(*) >= 5
            )
        )
        RETURNING *;
    """)

    return cursor.fetchall()


def detectar_endpoint_suspeito(cursor):
    cursor.execute("""
        UPDATE log_acesso
        SET anomalia = true
        WHERE id IN (
            SELECT id FROM log_acesso
            WHERE endpoint_acessado ILIKE ANY (ARRAY[
                '%admin%', '%.env%', '%backup%', '%wp-login%'
            ])
        )
        RETURNING *;
    """)

    return cursor.fetchall()


def detectar_sessao_anomalia(cursor):
    cursor.execute("""
        UPDATE log_acesso
        SET anomalia = true
        WHERE id IN (
            SELECT id FROM log_acesso
            WHERE timestamp > NOW() - INTERVAL '5 minutes'
            AND ip_origem IN (
                SELECT ip_origem
                FROM log_acesso
                GROUP BY ip_origem
                HAVING COUNT(DISTINCT id_sessao) > 10
            )
        )
        RETURNING *;
    """)

    return cursor.fetchall()


def detectar_violacao_integridade(cursor):
    path = "app/shared_data/blockchain_ledger.json"

    if not os.path.exists(path):
        return []

    with open(path, "r") as file:
        blockchain = json.load(file)

    blockchain_hashes = {
        b.get("hashDoBloco") for b in blockchain if b.get("hashDoBloco")
    }

    cursor.execute("""
        SELECT h.id_evidencia, h.auditoria_corrente_hash, e.id_caso 
        FROM historico_custodia h
        JOIN evidencia e ON h.id_evidencia = e.id;
    """)

    registros = cursor.fetchall()
    violacoes = []

    for r in registros:
        if r["auditoria_corrente_hash"] not in blockchain_hashes:
            violacoes.append(r)

    return violacoes


# --- Loop principal ---
async def vigilante():
    while True:
        conn = None

        try:
            log("INFO", "Iniciando varredura de segurança")

            conn = conectar_banco()
            cursor = conn.cursor(cursor_factory=RealDictCursor)

            # 1. brute force
            brute = detectar_forca_bruta(cursor)
            if brute:
                log("ANOMALIA", "Brute force detectado", {"qtd": len(brute)})

                await notificar_api("/admin", {"mensagem": "Brute force detectado"})

            # 2. endpoints suspeitos
            suspicious = detectar_endpoint_suspeito(cursor)
            if suspicious:
                log(
                    "ALERTA",
                    "Endpoints suspeitos detectados",
                    {"qtd": len(suspicious)},
                )

            # 3. sessão anômala
            sessions = detectar_sessao_anomalia(cursor)
            if sessions:
                log("ALERTA", "Anomalia de sessão detectada")

            # 4. integridade blockchain
            violations = detectar_violacao_integridade(cursor)
            if violations:
                log(
                    "CRITICO",
                    "Violação de integridade detectada",
                    {"qtd": len(violations)},
                )

                for v in violations:
                    await notificar_api(
                        "/caso/{v['id_caso']}",
                        {
                            "idEvidencia": v["id_evidencia"],
                            "mensagem": "Integridade comprometida",
                        },
                    )

            conn.commit()

        except Exception as e:
            log("ERROR", "Erro no vigilante", {"erro": str(e)})

        finally:
            if conn:
                conn.close()

        await asyncio.sleep(60)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(vigilante())


@app.get("/")
def health():
    return {"status": "monitor ativo"}
