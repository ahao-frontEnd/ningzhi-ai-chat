# ===== Stage 1: builder（装依赖 + 编译 + deploy 生成生产依赖目录）=====
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /repo

# 先 COPY 元数据，利用 Docker 层缓存（依赖不变时跳过 install）
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json apps/server/package.json
COPY apps/web/package.json apps/web/package.json

# 安装全部依赖（含 devDeps，编译需要）
RUN pnpm install --frozen-lockfile

# COPY 源码与编译所需配置
COPY apps/server/src apps/server/src
COPY apps/server/tsconfig.json apps/server/tsconfig.json
COPY apps/server/tsconfig.build.json apps/server/tsconfig.build.json
COPY apps/server/nest-cli.json apps/server/nest-cli.json
COPY tsconfig.json ./tsconfig.json

# 编译 TypeScript -> dist
RUN pnpm --filter @ningzhi-chat/server build

# pnpm deploy：自动剥离 devDeps、扁平化 node_modules，生成可独立运行的部署目录
# --legacy：pnpm v10 起 deploy 默认要求 inject-workspace-packages=true，本包无内部 workspace 依赖，用 --legacy 退回旧行为
RUN pnpm --filter @ningzhi-chat/server deploy --prod /deploy/server --legacy
# 把编译产物放进 deploy 目录
RUN cp -r apps/server/dist /deploy/server/dist

# ===== Stage 2: runner（只装运行时，体积小）=====
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV TZ=Asia/Shanghai

# 复制 deploy 目录（含 package.json + 生产 node_modules + dist）
COPY --from=builder /deploy/server/ ./

# 非 root 用户运行（alpine 自带 node 用户）
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
