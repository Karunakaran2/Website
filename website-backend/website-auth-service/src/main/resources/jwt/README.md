Dev-only RSA key pair for signing JWTs. Replace in production via `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` env paths.

Generate new keys (OpenSSL):

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```
