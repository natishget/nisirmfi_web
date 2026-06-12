from app.rag.document_loader import (
    load_markdown_documents
)

from app.rag.chunker import (
    chunk_text
)

def prepare_documents():

    docs = load_markdown_documents()

    all_chunks = []

    for doc in docs:

        chunks = chunk_text(
            doc["content"]
        )

        for chunk in chunks:

            all_chunks.append(
                {
                    "source": doc["filename"],
                    "text": chunk
                }
            )

    return all_chunks