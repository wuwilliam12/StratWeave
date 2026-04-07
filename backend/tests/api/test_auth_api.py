from fastapi.testclient import TestClient


def test_register_login_and_me_flow(client: TestClient) -> None:
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "alice",
            "email": "alice@example.com",
            "password": "password123",
        },
    )
    assert register_response.status_code == 200
    assert register_response.json()["username"] == "alice"

    login_response = client.post(
        "/api/auth/token",
        data={"username": "alice", "password": "password123"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    assert token

    me_response = client.get(
        "/api/auth/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "alice@example.com"


def test_duplicate_register_rejected(client: TestClient) -> None:
    payload = {
        "username": "bob",
        "email": "bob@example.com",
        "password": "password123",
    }
    first = client.post("/api/auth/register", json=payload)
    second = client.post("/api/auth/register", json=payload)

    assert first.status_code == 200
    assert second.status_code == 400
    assert second.json()["detail"] == "Username or email already registered"
