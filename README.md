## Setup

**Prerequisites:** Docker Desktop.

1.  **Start the application:**
    ```bash
    docker compose up --build
    ```
    This will build images, run database migrations, and seed the initial data automatically.

2.  **Initialize the AI Model (First run only):**
    Run this command to download the model into the container volume:
    ```bash
    docker exec -d game_shop_ollama ollama pull llama3.2
    ```
    *Note: Wait 2-5 minutes for the download to complete before using the chat feature.*

3.  **Access:**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Credentials

The database is auto-seeded with a test account:
*   **Email:** `test@example.com`
*   **Password:** `password123`

## Project Structure

*   `src/`: Backend API and LangGraph Agent logic.
*   `frontend/`: React client application.
*   `payment-service/`: Independent node service using gRPC for transactions.
*   `protos/`: Shared Protocol Buffer definitions.
*   `prisma/`: Database schema and seed script.