from fastapi.testclient import TestClient


def _register_and_login(client: TestClient, username: str, email: str) -> str:
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": username,
            "email": email,
            "password": "password123",
        },
    )
    assert register_response.status_code == 200

    login_response = client.post(
        "/api/auth/token",
        data={"username": username, "password": "password123"},
    )
    assert login_response.status_code == 200
    return login_response.json()["access_token"]


def test_graph_suggest_requires_auth(client: TestClient) -> None:
    response = client.post(
        "/api/ai/graph-suggest",
        json={"sport": "boxing", "mode": "state", "nodes": [], "edges": []},
    )
    assert response.status_code == 401


def test_graph_suggest_returns_payload(client: TestClient) -> None:
    token = _register_and_login(client, "aiuser", "aiuser@example.com")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(
        "/api/ai/graph-suggest",
        headers=headers,
        json={
            "sport": "boxing",
            "mode": "state",
            "nodes": [
                {
                    "id": "n1",
                    "data": {"label": "Lonely", "nodeType": "action"},
                }
            ],
            "edges": [],
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert "summary" in body
    assert "suggestions" in body
    assert "coverage_score" in body
    assert isinstance(body["suggestions"], list)
    assert len(body["suggestions"]) >= 1
