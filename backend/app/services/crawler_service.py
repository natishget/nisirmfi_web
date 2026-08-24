import urllib.request
import urllib.parse
from html.parser import HTMLParser
import re
import xml.etree.ElementTree as ET
import logging

logger = logging.getLogger(__name__)

# Maximum text length per page (approximately 50KB)
MAX_PAGE_TEXT_LENGTH = 50_000

# Patterns that look like LLM role markers or prompt injection attempts
_INJECTION_PATTERNS = re.compile(
    r'^\s*'
    r'(?:system\s*:|assistant\s*:|user\s*:'
    r'|###\s*(?:instruction|system|override)'
    r'|ignore\s+(?:previous|above|all)\s+instructions'
    r'|you\s+are\s+now\s+'
    r'|forget\s+(?:everything|all|your)'
    r'|disregard\s+(?:previous|above|all))',
    re.IGNORECASE | re.MULTILINE
)


def sanitize_content(text: str) -> str:
    """
    Sanitizes extracted text content for safe use in the RAG pipeline.

    1. Strips any residual HTML tags
    2. Removes invisible unicode characters (zero-width spaces, etc.)
    3. Removes control characters except newline and tab
    4. Strips lines that look like prompt injection attempts
    5. Truncates excessively long content
    """
    if not text:
        return text

    # 1. Strip any residual HTML tags that survived the parser
    text = re.sub(r'<[^>]+>', ' ', text)

    # 2. Remove zero-width and invisible unicode characters
    #    Covers: zero-width space, zero-width non-joiner, zero-width joiner,
    #    left-to-right/right-to-left marks, word joiner, etc.
    text = re.sub(r'[\u200b-\u200f\u2028-\u202f\u2060\ufeff]', '', text)

    # 3. Remove control characters except newline (\n) and tab (\t)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)

    # 4. Strip lines that look like prompt injection / role markers
    lines = text.split('\n')
    clean_lines = []
    for line in lines:
        if not _INJECTION_PATTERNS.match(line):
            clean_lines.append(line)
        else:
            logger.warning(f"Stripped suspicious line from crawled content: {line[:80]}")
    text = '\n'.join(clean_lines)

    # 5. Normalize whitespace again after all cleaning
    text = re.sub(r'\s+', ' ', text).strip()

    # 6. Truncate excessively long content
    if len(text) > MAX_PAGE_TEXT_LENGTH:
        text = text[:MAX_PAGE_TEXT_LENGTH]
        logger.warning(f"Truncated page content to {MAX_PAGE_TEXT_LENGTH} characters")

    return text

APPROVED_DOMAIN = "nisirmfi.com"

class NisirHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.text_content = []
        self.links = set()
        self.in_title = False
        self.in_script_or_style = False
        self.in_nav_or_footer = False

    def handle_starttag(self, tag, attrs):
        tag_lower = tag.lower()
        if tag_lower == "title":
            self.in_title = True
        elif tag_lower in ["script", "style"]:
            self.in_script_or_style = True
        elif tag_lower in ["nav", "footer"]:
            self.in_nav_or_footer = True
        elif tag_lower == "a":
            for name, value in attrs:
                if name.lower() == "href" and value:
                    self.links.add(value)

    def handle_endtag(self, tag):
        tag_lower = tag.lower()
        if tag_lower == "title":
            self.in_title = False
        elif tag_lower in ["script", "style"]:
            self.in_script_or_style = False
        elif tag_lower in ["nav", "footer"]:
            self.in_nav_or_footer = False

    def handle_data(self, data):
        if self.in_title:
            self.title = (self.title + data).strip()
        elif not self.in_script_or_style and not self.in_nav_or_footer:
            cleaned = data.strip()
            if cleaned:
                self.text_content.append(cleaned)

    def get_clean_text(self) -> str:
        # Join text pieces with space, then normalize multiple spaces/newlines
        text = " ".join(self.text_content)
        text = re.sub(r'\s+', ' ', text)
        return text

def is_approved_url(url: str) -> bool:
    try:
        parsed = urllib.parse.urlparse(url)
        netloc = parsed.netloc.lower()
        # strip www. if any
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc == APPROVED_DOMAIN or netloc.endswith("." + APPROVED_DOMAIN)
    except Exception:
        return False

def fetch_page(url: str, timeout: int = 5) -> tuple[str, str, set[str]]:
    """
    Fetches a page and returns (title, clean_text, links)
    """
    try:
        headers = {"User-Agent": "FlyBot-Crawler/1.0"}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout) as response:
            content_type = response.info().get_content_type()
            if not content_type or "text/html" not in content_type:
                return "", "", set()
            html_bytes = response.read()
            html_text = html_bytes.decode("utf-8", errors="replace")

        parser = NisirHTMLParser()
        parser.feed(html_text)
        
        # Absolute-ize links
        absolute_links = set()
        for link in parser.links:
            abs_link = urllib.parse.urljoin(url, link)
            # Remove fragment
            parsed_abs = urllib.parse.urlparse(abs_link)
            abs_link = urllib.parse.urlunparse((parsed_abs.scheme, parsed_abs.netloc, parsed_abs.path, '', '', ''))
            if is_approved_url(abs_link):
                absolute_links.add(abs_link)

        clean_text = sanitize_content(parser.get_clean_text())
        return parser.title or url, clean_text, absolute_links
    except Exception as e:
        logger.error(f"Error fetching page {url}: {e}")
        return "", "", set()

def fetch_urls_from_sitemap(sitemap_url: str, timeout: int = 5) -> set[str]:
    urls = set()
    try:
        headers = {"User-Agent": "FlyBot-Crawler/1.0"}
        req = urllib.request.Request(sitemap_url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout) as response:
            xml_bytes = response.read()
        
        root = ET.fromstring(xml_bytes)
        # Handle namespaces
        namespace = ""
        if root.tag.startswith("{"):
            namespace = root.tag.split("}")[0] + "}"
        
        for loc in root.findall(f".//{namespace}loc"):
            if loc.text:
                loc_url = loc.text.strip()
                if is_approved_url(loc_url):
                    if loc_url.endswith(".xml") or "sitemap" in loc_url.lower() and loc_url.split('?')[0].endswith('.xml'):
                        # It's a sub-sitemap! Recursively fetch URLs
                        # Avoid infinite recursion if sub-sitemap points to itself
                        if loc_url != sitemap_url:
                            sub_urls = fetch_urls_from_sitemap(loc_url, timeout)
                            urls.update(sub_urls)
                    else:
                        urls.add(loc_url)
    except Exception as e:
        logger.error(f"Failed to fetch or parse sitemap at {sitemap_url}: {e}")
    return urls


def crawl_website(start_url: str = "https://nisirmfi.com", max_pages: int = 50, max_depth: int = 3) -> list[dict]:
    """
    Crawls approved pages, starting from start_url or its sitemap if found.
    Returns list of dicts with keys: 'url', 'title', 'content'.
    """
    crawled_data = []
    visited = set()
    
    # Try sitemap first
    sitemap_url = urllib.parse.urljoin(start_url, "/sitemap.xml")
    logger.info(f"Checking sitemap at {sitemap_url}")
    sitemap_urls = fetch_urls_from_sitemap(sitemap_url)
    
    if sitemap_urls:
        logger.info(f"Discovered {len(sitemap_urls)} URLs from sitemap.xml")
        to_visit = list(sitemap_urls)[:max_pages]
        for url in to_visit:
            title, content, _ = fetch_page(url)
            if content:
                crawled_data.append({
                    "url": url,
                    "title": title,
                    "content": content
                })
    else:
        logger.info("No sitemap found, falling back to manual crawler")
        # BFS Queue: holds (url, depth)
        queue = [(start_url, 0)]
        visited.add(start_url)
        
        while queue and len(crawled_data) < max_pages:
            url, depth = queue.pop(0)
            if depth > max_depth:
                continue
            
            title, content, links = fetch_page(url)
            if content:
                crawled_data.append({
                    "url": url,
                    "title": title,
                    "content": content
                })
                
                for link in links:
                    if link not in visited:
                        visited.add(link)
                        queue.append((link, depth + 1))
                        
    return crawled_data
