import os
import uvicorn
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

# If you have other custom imports:
from tax_professional.banks.CA_Statement_Analyzer import CABankStatement

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

app = FastAPI(title="Bank Statement Analyzer API")


class BankStatementRequest(BaseModel):
    bank_names: List[str]
    pdf_paths: List[str]
    passwords: Optional[List[str]] = []  # Optional field, defaults to empty list
    start_date: List[str]
    end_date: List[str]
    ca_id: str


@app.post("/analyze-statements/")
async def analyze_bank_statements(request: BankStatementRequest):
    try:
        logger.info(f"Received request with banks: {request.bank_names}")

        # Create a progress tracking function
        def progress_tracker(current: int, total: int, info: str) -> None:
            logger.info(f"{info} ({current}/{total})")

        progress_data = {
            "progress_func": progress_tracker,
            "current_progress": 10,
            "total_progress": 100,
        }

        # Validate passwords length if provided
        if request.passwords and len(request.passwords) != len(request.pdf_paths):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Number of passwords ({len(request.passwords)}) "
                    f"must match number of PDFs ({len(request.pdf_paths)})"
                ),
            )

        logger.info("Initializing CABankStatement")
        # Pass empty list if no passwords
        converter = CABankStatement(
            request.bank_names,
            request.pdf_paths,
            request.passwords if request.passwords else [],
            request.start_date,
            request.end_date,
            request.ca_id,
            progress_data,
        )

        logger.info("Starting extraction")
        result = converter.start_extraction()

        logger.info("Extraction completed successfully")
        return {
            "status": "success",
            "message": "Bank statements analyzed successfully",
            "data": result,
        }

    except Exception as e:
        logger.error(f"Error processing bank statements: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error processing bank statements: {str(e)}"
        )


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if _name_ == "_main_":
    # Optionally use environment variables for host/port. Falls back to "0.0.0.0" and 7500 if none provided.
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "7500"))

    # IMPORTANT: reload=False for production usage
    uvicorn.run("main:app", host=host, port=port, reload=False)