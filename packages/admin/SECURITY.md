# Security Summary

## Vulnerabilities Audit

Last checked: 2026-02-27

### Runtime Dependencies
✅ **No high or critical vulnerabilities** in runtime dependencies

### Development Dependencies
⚠️ **1 high severity** vulnerability in dev dependencies:
- `minimatch` (ReDoS vulnerability) - Used only in ESLint and development tools
- **Impact**: Low - Only affects development environment, not production
- **Mitigation**: Not exploitable in production since ESLint is not included in builds

## Recommendations

1. **Update ESLint dependencies** when newer versions become available
2. **Monitor npm audit** regularly for new vulnerabilities
3. **Change default secrets** in `.env` before deploying to production
4. **Use HTTPS** in production (configure NEXT_PUBLIC_SERVER_URL)
5. **Implement rate limiting** on API endpoints in production
6. **Configure CORS** properly for production environment

## Production Checklist

- [ ] Change `PAYLOAD_SECRET` to a strong random value
- [ ] Use HTTPS URLs in `NEXT_PUBLIC_SERVER_URL`
- [ ] Set up proper database backups
- [ ] Configure email adapter (currently logs to console)
- [ ] Review user authentication settings
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Review file upload limits and allowed types

## Secure Configuration

```env
# Production .env example
PAYLOAD_SECRET=<generate-strong-random-secret>
DATABASE_URL=file:/path/to/production/database.db
NEXT_PUBLIC_SERVER_URL=https://admin.psychcombo.com
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
