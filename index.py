import os
import mimetypes

# Base directory of the application
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def app(environ, start_response):
    """
    Standard WSGI entrypoint for Vercel Python runtime.
    Serves static files, assets, and falls back to index.html for SPA routing.
    """
    raw_path = environ.get('PATH_INFO', '/').lstrip('/')
    if not raw_path:
        raw_path = 'index.html'

    file_path = os.path.join(BASE_DIR, raw_path)

    # Prevent directory traversal attacks
    if not os.path.abspath(file_path).startswith(BASE_DIR):
        start_response('403 Forbidden', [('Content-Type', 'text/plain')])
        return [b'Forbidden']

    # If it is a directory, look for index.html inside
    if os.path.isdir(file_path):
        file_path = os.path.join(file_path, 'index.html')

    # If file doesn't exist, fallback to index.html (SPA routing)
    if not os.path.isfile(file_path):
        file_path = os.path.join(BASE_DIR, 'index.html')

    try:
        content_type, _ = mimetypes.guess_type(file_path)
        if not content_type:
            if file_path.endswith('.js'):
                content_type = 'application/javascript'
            elif file_path.endswith('.css'):
                content_type = 'text/css'
            elif file_path.endswith('.ics'):
                content_type = 'text/calendar'
            else:
                content_type = 'application/octet-stream'

        # Ensure correct charset for text files
        if content_type.startswith('text/') or content_type == 'application/javascript' or content_type == 'application/json':
            content_type += '; charset=utf-8'

        with open(file_path, 'rb') as f:
            content = f.read()

        headers = [
            ('Content-Type', content_type),
            ('Content-Length', str(len(content))),
            ('Cache-Control', 'public, max-age=3600')
        ]
        start_response('200 OK', headers)
        return [content]
    except Exception as e:
        error_msg = f"Server Error: {str(e)}".encode('utf-8')
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
        return [error_msg]
