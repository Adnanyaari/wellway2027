#!/usr/bin/env bash
set -Eeuo pipefail

readonly COMMIT_SHA="${1:?A commit SHA is required}"
readonly APP_ROOT="/home/adnan27/htdocs/wellway.fun"
readonly RELEASES_DIR="${APP_ROOT}/.releases"
readonly RELEASE_DIR="${RELEASES_DIR}/${COMMIT_SHA}"
readonly BUILD_DIR="${RELEASE_DIR}.build-$$"
readonly CURRENT_LINK="${APP_ROOT}/current"
readonly ENV_FILE="${APP_ROOT}/.env.local"
readonly -a PM2=(npm exec --yes --package=pm2@7.0.4 -- pm2)

if [[ ! "${COMMIT_SHA}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Invalid commit SHA" >&2
  exit 1
fi

for required_command in git npm node curl tar; do
  command -v "${required_command}" >/dev/null || {
    echo "Missing command: ${required_command}" >&2
    exit 1
  }
done

[[ -d "${APP_ROOT}/.git" ]] || {
  echo "Expected Git checkout at ${APP_ROOT}" >&2
  exit 1
}
[[ -f "${ENV_FILE}" ]] || {
  echo "Missing production environment file: ${ENV_FILE}" >&2
  exit 1
}

git -C "${APP_ROOT}" fetch --quiet origin main
git -C "${APP_ROOT}" cat-file -e "${COMMIT_SHA}^{commit}"
git -C "${APP_ROOT}" merge-base --is-ancestor "${COMMIT_SHA}" origin/main

mkdir -p "${RELEASES_DIR}"
if [[ ! -d "${RELEASE_DIR}" ]]; then
  cleanup_build() {
    rm -rf -- "${BUILD_DIR}"
  }
  trap cleanup_build EXIT
  mkdir "${BUILD_DIR}"
  git -C "${APP_ROOT}" archive "${COMMIT_SHA}" | tar -x -C "${BUILD_DIR}"
  ln -s "${ENV_FILE}" "${BUILD_DIR}/.env.local"

  cd "${BUILD_DIR}"
  npm ci
  npm run db:generate
  npm run db:validate
  npm run build

  cd "${APP_ROOT}"
  mv "${BUILD_DIR}" "${RELEASE_DIR}"
  trap - EXIT
fi

# Production migrations remain intentionally disabled until the existing
# db-push schema is reconciled with Prisma's migration history and backed up.

previous_release=""
if [[ -L "${CURRENT_LINK}" ]]; then
  previous_release="$(readlink -f "${CURRENT_LINK}")"
fi

ln -sfn "${RELEASE_DIR}" "${CURRENT_LINK}.next"
mv -Tf "${CURRENT_LINK}.next" "${CURRENT_LINK}"

if ! "${PM2[@]}" startOrReload "${CURRENT_LINK}/ecosystem.config.cjs" --update-env || \
  ! curl --fail --silent --show-error --retry 10 --retry-delay 2 --retry-connrefused \
    "http://127.0.0.1:3000/api/health" >/dev/null; then
  if [[ -n "${previous_release}" && -d "${previous_release}" ]]; then
    ln -sfn "${previous_release}" "${CURRENT_LINK}.next"
    mv -Tf "${CURRENT_LINK}.next" "${CURRENT_LINK}"
    "${PM2[@]}" startOrReload "${CURRENT_LINK}/ecosystem.config.cjs" --update-env
  fi
  echo "Deployment failed; restored the previous application release when available" >&2
  exit 1
fi

"${PM2[@]}" save
echo "Deployed ${COMMIT_SHA}"
