export function hostingRules(domain){
  const origin=domain||'';
  return `Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html
${origin?`<IfModule mod_rewrite.c>
RewriteEngine On
# Domínio oficial sem www, com HTTPS.
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} ^www\\.mixalimentos\\.com$ [NC]
RewriteRule ^ ${origin}%{REQUEST_URI} [R=301,L,NE]
# Consolida index.html e a URL de diretório em um só endereço público.
RewriteCond %{THE_REQUEST} \\s/+(.*/)?index\\.html(?:[\\s?]) [NC]
RewriteRule ^(.*)index\\.html$ /$1 [R=301,L,NE]
</IfModule>
`:''}<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/markdown text/html text/css text/plain application/javascript application/json application/xml image/svg+xml
</IfModule>
<IfModule mod_headers.c>
<FilesMatch "\\.(webp|png|jpg|svg|css|js)$">
Header set Cache-Control "public, max-age=604800"
</FilesMatch>
<FilesMatch "\\.(html|md)$">
Header set Cache-Control "no-cache"
</FilesMatch>
Header append Link "</llms.txt>; rel=describedby"
<FilesMatch "\\.md$">
Header set X-Robots-Tag "noindex"
</FilesMatch>
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
AddType text/markdown .md
AddCharset UTF-8 .md .txt
AddType image/webp .webp
AddType image/svg+xml .svg
`;
}
