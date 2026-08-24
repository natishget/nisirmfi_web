import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.crawler_service import fetch_urls_from_sitemap, crawl_website

sitemap_url = "https://nisirmfi.com/wp-sitemap-posts-page-1.xml"
print(f"Fetching sitemap from {sitemap_url}:")
urls = fetch_urls_from_sitemap(sitemap_url)
print("Sitemap URLs:", len(urls))
if urls:
    print("First 5 URLs:")
    for u in list(urls)[:5]:
        print(" -", u)

print("\nRunning crawl_website:")
pages = crawl_website(max_pages=3)
print("Pages Crawled:", len(pages))
