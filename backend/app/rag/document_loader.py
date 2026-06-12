from pathlib import Path


def load_markdown_documents(
    knowledge_path: str = "knowledge"
):
    documents = []

    path = Path(knowledge_path)

    for file in path.glob("*.md"):

        content = file.read_text(
            encoding="utf-8"
        )

        documents.append(
            {
                "filename": file.name,
                "content": content
            }
        )

    return documents