@echo off
start cmd /k "cd frontend && npm run dev"
start cmd /k "cd backend && go run main.go"