from api.routes.auth import create_access_token, get_password_hash, verify_password


def test_password_hash_round_trip() -> None:
    password = "test-password-123"
    hashed = get_password_hash(password)

    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong-password", hashed)


def test_create_access_token_returns_string() -> None:
    token = create_access_token({"sub": "alice"})

    assert isinstance(token, str)
    assert token
