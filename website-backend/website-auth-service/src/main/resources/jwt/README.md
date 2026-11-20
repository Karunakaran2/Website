Dev-only RSA key pair for signing JWTs. Replace in production via `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` env paths.

Generate a new dev pair with OpenSSL. The service reads PKCS#8 (`BEGIN PRIVATE KEY`) and X.509 (`BEGIN PUBLIC KEY`). `openssl genrsa` writes PKCS#1 (`BEGIN RSA PRIVATE KEY`), which this service cannot load.

```bash
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out private.pem
openssl pkey -in private.pem -pubout -out public.pem
```
