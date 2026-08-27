import pymupdf  # replaces the deprecated `fitz` alias


MAX_PAGES = 5  # Limit extraction to first 5 pages for demo performance


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract plain text from a PDF given its raw bytes.
    Returns text from the first MAX_PAGES pages only.
    """
    doc = pymupdf.open(stream=file_bytes, filetype="pdf")
    pages_to_read = min(len(doc), MAX_PAGES)
    text_parts = []

    for page_num in range(pages_to_read):
        page = doc[page_num]
        text_parts.append(page.get_text())

    doc.close()
    extracted = "\n".join(text_parts).strip()

    if not extracted:
        return "[No readable text found in this PDF. It may be a scanned image-only PDF.]"

    return extracted
