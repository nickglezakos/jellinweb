#!/usr/bin/env python3
"""Sanitize Postman collection by replacing real credentials with variables."""

import json

with open('api/Jellin.postman_collection.json', 'r') as f:
    content = f.read()

# Order matters: longer/more specific matches first
replacements = [
    ('jdarmen1@gmail.com', '{{newEmail}}'),
    ('jdarmen@gmail.com', '{{email}}'),
    ('admin@bootcorelabs.com', '{{email}}'),
    ('dang@bootcorelabs.com', '{{email}}'),
    ('dimitris@bootcore.io', '{{email}}'),
    ('d.armenakis@intale.com', '{{email}}'),
    ('Production!23', '{{password}}'),
    ('dang.11042025', '{{password}}'),
    ('172*uIB5Lx', '{{currentPassword}}'),
    ('d21c4bc0-f66b-4258-b186-db7fbf688932', '{{activationKey}}'),
    ('+306975468665', '{{phoneNumber}}'),
    ('6975468665', '{{phoneNumberRaw}}'),
    ('123856324', '{{vat}}'),
    ('62407233', '{{otp}}'),
    ('Dimitris (Personal)', '{{tenantName}}'),
    ('Dimitris Armenakis (Postman)', '{{fullName}}'),
    ('Dimitris (Bootcore)', '{{fullName}}'),
]

for old, new in replacements:
    content = content.replace(old, new)

# Verify valid JSON
try:
    json.loads(content)
    with open('api/Jellin.postman_collection.json', 'w') as f:
        f.write(content)
    print('SUCCESS: Postman collection sanitized and valid JSON')
    print(f'Replaced {len(replacements)} credential patterns')
except Exception as e:
    print(f'ERROR: Invalid JSON after sanitization: {e}')