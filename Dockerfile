## Set NodeJS version
ARG NODEJS_VERSION="20"

## Base image for all the stages
FROM node:${NODEJS_VERSION}-slim AS base

ARG USE_CN_MIRROR="true"

ENV DEBIAN_FRONTEND="noninteractive"

RUN \
    # If you want to build docker in China, build with --build-arg USE_CN_MIRROR=true
    if [ "${USE_CN_MIRROR:-false}" = "true" ]; then \
        sed -i "s/deb.debian.org/mirrors.ustc.edu.cn/g" "/etc/apt/sources.list.d/debian.sources"; \
    fi \
    # Add required package & update base package
    && apt update \
    && apt install proxychains-ng -qy \
    # Prepare required package to distroless
    && mkdir -p /distroless/lib /distroless/bin \
    # Copy proxychains to distroless
    && cp /usr/lib/$(arch)-linux-gnu/libproxychains.so.4 /distroless/lib/libproxychains.so.4 \
    && cp /usr/lib/$(arch)-linux-gnu/libdl.so.2 /distroless/lib/libdl.so.2 \
    && cp /usr/bin/proxychains4 /distroless/bin/proxychains \
    # Copy node to distroless
    && cp /usr/lib/$(arch)-linux-gnu/libstdc++.so.6 /distroless/lib/libstdc++.so.6 \
    && cp /usr/lib/$(arch)-linux-gnu/libgcc_s.so.1 /distroless/lib/libgcc_s.so.1 \
    && cp /usr/local/bin/node /distroless/bin/node \
    # Cleanup temp files
    && rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp/*

## Builder image, install all the dependencies and build the app
FROM base AS builder

ARG USE_CN_MIRROR

ENV NEXT_PUBLIC_BASE_PATH=""

# Sentry
ENV NEXT_PUBLIC_SENTRY_DSN="" \
    SENTRY_ORG="" \
    SENTRY_PROJECT=""

# Posthog
ENV NEXT_PUBLIC_ANALYTICS_POSTHOG="" \
    NEXT_PUBLIC_POSTHOG_HOST="" \
    NEXT_PUBLIC_POSTHOG_KEY=""

# Umami
ENV NEXT_PUBLIC_ANALYTICS_UMAMI="" \
    NEXT_PUBLIC_UMAMI_SCRIPT_URL="" \
    NEXT_PUBLIC_UMAMI_WEBSITE_ID=""

# Node
ENV NODE_OPTIONS="--max-old-space-size=8192"

WORKDIR /app

COPY package.json ./
COPY .npmrc ./

RUN \
    # If you want to build docker in China, build with --build-arg USE_CN_MIRROR=true
    if [ "${USE_CN_MIRROR:-false}" = "true" ]; then \
        export SENTRYCLI_CDNURL="https://npmmirror.com/mirrors/sentry-cli"; \
        npm config set registry "https://registry.npmmirror.com/"; \
    fi \
    # Set the registry for corepack
    && export COREPACK_NPM_REGISTRY=$(npm config get registry | sed 's/\/$//') \
    # Enable corepack
    && corepack enable \
    # Use pnpm for corepack
    && corepack use pnpm \
    # Install the dependencies
    && pnpm i \
    # Add sharp dependencies
    && mkdir -p /deps \
    && pnpm add sharp --prefix /deps

COPY . .

# run build standalone for docker version
RUN npm run build:docker

## Application image, copy all the files for production
FROM scratch AS app

COPY --from=builder /app/public /app/public

COPY --from=base /distroless/ /

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone /app/
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /deps/node_modules/.pnpm /app/node_modules/.pnpm

## Production image, copy all the files and run next
FROM busybox:latest

# Copy all the files from app, set the correct permission for prerender cache
COPY --from=app / /

RUN \
    # Add nextjs:nodejs to run the app
    adduser -D -H -h /app -u 1001 nextjs nodejs \
    # Create proxychains configuration directory
    && mkdir -p /etc/proxychains \
    # Set permission for nextjs:nodejs
    && chown -R nextjs:nodejs /app /etc/proxychains

ENV NODE_ENV="production"

# set hostname to localhost
ENV HOSTNAME="0.0.0.0" \
    PORT="3210"

# General Variables
ENV ACCESS_CODE="" \
    API_KEY_SELECT_MODE="" \
    DEFAULT_AGENT_CONFIG="" \
    SYSTEM_AGENT="" \
    FEATURE_FLAGS="" \
    PROXY_URL=""

# Model Variables
ENV \
    # Ai360
    AI360_API_KEY="" \
    # Anthropic
    ANTHROPIC_API_KEY="" ANTHROPIC_PROXY_URL="" \
    # Amazon Bedrock
    AWS_ACCESS_KEY_ID="" AWS_SECRET_ACCESS_KEY="" AWS_REGION="" AWS_BEDROCK_MODEL_LIST="" \
    # Azure OpenAI
    AZURE_API_KEY="" AZURE_API_VERSION="" AZURE_ENDPOINT="" AZURE_MODEL_LIST="" \
    # Baichuan
    BAICHUAN_API_KEY="" \
    # DeepSeek
    DEEPSEEK_API_KEY="" \
    # Fireworks AI
    FIREWORKSAI_API_KEY="" FIREWORKSAI_MODEL_LIST="" \
    # Google
    GOOGLE_API_KEY="" GOOGLE_PROXY_URL="" \
    # Groq
    GROQ_API_KEY="" GROQ_MODEL_LIST="" GROQ_PROXY_URL="" \
    # Minimax
    MINIMAX_API_KEY="" \
    # Mistral
    MISTRAL_API_KEY="" \
    # Moonshot
    MOONSHOT_API_KEY="" MOONSHOT_PROXY_URL="" \
    # Novita
    NOVITA_API_KEY="" NOVITA_MODEL_LIST="" \
    # Ollama
    OLLAMA_MODEL_LIST="" OLLAMA_PROXY_URL="" \
    # OpenAI
    OPENAI_API_KEY="" OPENAI_MODEL_LIST="" OPENAI_PROXY_URL="" \
    # OpenRouter
    OPENROUTER_API_KEY="" OPENROUTER_MODEL_LIST="" \
    # Perplexity
    PERPLEXITY_API_KEY="" PERPLEXITY_PROXY_URL="" \
    # Qwen
    QWEN_API_KEY="" QWEN_MODEL_LIST="" \
    # SiliconCloud
    SILICONCLOUD_API_KEY="" SILICONCLOUD_MODEL_LIST="" SILICONCLOUD_PROXY_URL="" \
    # Spark
    SPARK_API_KEY="" \
    # Stepfun
    STEPFUN_API_KEY="" \
    # Taichu
    TAICHU_API_KEY="" \
    # TogetherAI
    TOGETHERAI_API_KEY="" TOGETHERAI_MODEL_LIST="" \
    # Upstage
    UPSTAGE_API_KEY="" \
    # 01.AI
    ZEROONE_API_KEY="" ZEROONE_MODEL_LIST="" \
    # Zhipu
    ZHIPU_API_KEY="" ZHIPU_MODEL_LIST=""

USER nextjs

EXPOSE 3210/tcp

CMD \
    if [ -n "$PROXY_URL" ]; then \
        # Set regex for IPv4
        IP_REGEX="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$"; \
        # Set proxychains command
        PROXYCHAINS="proxychains -q"; \
        # Parse the proxy URL
        host_with_port="${PROXY_URL#*//}"; \
        host="${host_with_port%%:*}"; \
        port="${PROXY_URL##*:}"; \
        protocol="${PROXY_URL%%://*}"; \
        # Resolve to IP address if the host is a domain
        if ! [[ "$host" =~ "$IP_REGEX" ]]; then \
            nslookup=$(nslookup -q="A" "$host" | tail -n +3 | grep 'Address:'); \
            if [ -n "$nslookup" ]; then \
                host=$(echo "$nslookup" | tail -n 1 | awk '{print $2}'); \
            fi; \
        fi; \
        # Generate proxychains configuration file
        printf "%s\n" \
            'localnet 127.0.0.0/255.0.0.0' \
            'localnet ::1/128' \
            'proxy_dns' \
            'remote_dns_subnet 224' \
            'strict_chain' \
            'tcp_connect_time_out 8000' \
            'tcp_read_time_out 15000' \
            '[ProxyList]' \
            "$protocol $host $port" \
        > "/etc/proxychains/proxychains.conf"; \
    fi; \
    # Run the server
    ${PROXYCHAINS} node "/app/server.js";
