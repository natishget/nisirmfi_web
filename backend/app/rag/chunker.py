def chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 100
):
    chunks = []

    start = 0
    if chunk_size <= overlap:
        raise ValueError("chunk_size must be greater than overlap")

    while start < len(text):

        end = start + chunk_size

        chunks.append(
            text[start:end]
        )

        start += (
            chunk_size - overlap
        )

    return chunks