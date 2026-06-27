FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    NEXTAUTH_SECRET="dummy-build-secret" \
    NEXTAUTH_URL="http://localhost:3000"
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x docker-entrypoint.sh

RUN cat > /app/prisma.config.ts << 'EOF'
import { defineConfig } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: process.env["DATABASE_URL"] },
});
EOF

EXPOSE 3000
CMD ["sh", "docker-entrypoint.sh"]
