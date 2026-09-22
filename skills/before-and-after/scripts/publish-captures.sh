#!/bin/bash
# publish-captures.sh - Upload captures to GitHub and print embeddable markdown.
#
# Usage: ./publish-captures.sh <file> [file...]
#        ./publish-captures.sh --pr <n> <file> [file...]   # also append to the PR body
#
# Uploads each file to GitHub's attachment store, the same place a file dragged
# into a PR description ends up, and prints markdown to paste into a PR body or
# comment. The images render inline, including on a private repo, and nothing is
# committed to the repository.
#
# Requirements: gh CLI authenticated. No extra secret, no workflow, no branch.
#
# This posts to https://uploads.github.com/user-attachments/assets, which is how
# the web UI does it. GitHub has not documented that endpoint, so treat a sudden
# 404 or 422 as the endpoint changing rather than a bug here, and fall back to
# dragging the files into the PR by hand.

set -euo pipefail

PR=""
if [[ "${1:-}" == "--pr" ]]; then
    PR="${2:-}"
    shift 2 || true
    if ! [[ "$PR" =~ ^[0-9]+$ ]]; then
        echo "Error: --pr needs a PR number." >&2
        exit 1
    fi
fi

if [[ $# -eq 0 ]]; then
    echo "Usage: $0 [--pr <n>] <file> [file...]" >&2
    exit 1
fi

command -v gh >/dev/null || { echo "Error: gh CLI not found." >&2; exit 1; }

REPO_ID=$(gh api repos/{owner}/{repo} --jq .id)
TOKEN=$(gh auth token)

content_type() {
    case "${1##*.}" in
        png|PNG)            echo "image/png" ;;
        jpg|jpeg|JPG|JPEG)  echo "image/jpeg" ;;
        gif|GIF)            echo "image/gif" ;;
        webp|WEBP)          echo "image/webp" ;;
        mp4|MP4)            echo "video/mp4" ;;
        mov|MOV)            echo "video/quicktime" ;;
        *)                  echo "application/octet-stream" ;;
    esac
}

declare -a NAMES=() URLS=()

for f in "$@"; do
    [[ -f "$f" ]] || { echo "Error: file not found: $f" >&2; exit 1; }
    name=$(basename "$f")
    ct=$(content_type "$f")

    resp=$(curl -sS -X POST \
        "https://uploads.github.com/user-attachments/assets?name=${name}&content_type=${ct}&repository_id=${REPO_ID}" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Accept: application/json" \
        -H "Content-Type: ${ct}" \
        --data-binary "@${f}")

    url=$(printf '%s' "$resp" | python3 -c 'import sys,json; print(json.load(sys.stdin)["url"])' 2>/dev/null || true)
    if [[ -z "$url" ]]; then
        echo "Error uploading $name. Response:" >&2
        printf '%s\n' "$resp" >&2
        exit 1
    fi

    NAMES+=("$name")
    URLS+=("$url")
    echo "Uploaded $name" >&2
done

# Two files reads as a before/after pair, which is the common case. Any other
# count is listed one per line rather than guessed at.
if [[ ${#URLS[@]} -eq 2 ]]; then
    MARKDOWN="| Before | After |
|:---:|:---:|
| <img src=\"${URLS[0]}\" width=\"420\"> | <img src=\"${URLS[1]}\" width=\"420\"> |"
else
    MARKDOWN=""
    for i in "${!URLS[@]}"; do
        MARKDOWN+="![${NAMES[$i]}](${URLS[$i]})"$'\n'
    done
fi

echo "" >&2
printf '%s\n' "$MARKDOWN"

if [[ -n "$PR" ]]; then
    BODY=$(gh pr view "$PR" --json body -q .body)
    gh pr edit "$PR" --body "$BODY

## Before and after

$MARKDOWN"
    echo "" >&2
    echo "Appended to PR #$PR." >&2
fi
