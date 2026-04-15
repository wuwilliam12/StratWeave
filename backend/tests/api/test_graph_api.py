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


def test_create_and_fetch_graph(client: TestClient) -> None:
    token = _register_and_login(client, "graphowner", "graphowner@example.com")
    headers = {"Authorization": f"Bearer {token}"}

    create_response = client.post(
        "/api/graph/",
        headers=headers,
        json={
            "name": "Fight Plan",
            "description": "Round-by-round strategy",
            "is_public": False,
            "nodes": [
                {
                    "id": "n-1",
                    "label": "Start",
                    "node_type": "strategy",
                    "position_x": 0,
                    "position_y": 0,
                }
            ],
            "edges": [],
        },
    )
    assert create_response.status_code == 200
    graph = create_response.json()
    assert graph["name"] == "Fight Plan"
    assert len(graph["nodes"]) == 1

    graph_id = graph["id"]
    fetch_response = client.get(f"/api/graph/{graph_id}", headers=headers)
    assert fetch_response.status_code == 200
    payload = fetch_response.json()
    assert len(payload["nodes"]) == 1
    assert payload["nodes"][0]["label"] == "Start"


def test_private_graph_is_forbidden_for_other_users(client: TestClient) -> None:
    owner_token = _register_and_login(client, "owner", "owner@example.com")
    owner_headers = {"Authorization": f"Bearer {owner_token}"}

    create_response = client.post(
        "/api/graph/",
        headers=owner_headers,
        json={
            "name": "Private Plan",
            "description": None,
            "is_public": False,
            "nodes": [
                {
                    "id": "n-1",
                    "label": "Secret",
                    "node_type": "strategy",
                    "position_x": 0,
                    "position_y": 0,
                }
            ],
            "edges": [],
        },
    )
    assert create_response.status_code == 200
    graph_id = create_response.json()["id"]

    other_token = _register_and_login(client, "other", "other@example.com")
    other_headers = {"Authorization": f"Bearer {other_token}"}

    forbidden_response = client.get(f"/api/graph/{graph_id}", headers=other_headers)
    assert forbidden_response.status_code == 403
