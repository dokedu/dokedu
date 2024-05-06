find . -type f -exec sed -i -e "s@__VITE_API_URL__@${API_URL}@g" {} +
caddy run