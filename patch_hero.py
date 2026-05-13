import sys

path = 'frontend/src/components/sections/Hero.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_btn = "window.dispatchEvent(new CustomEvent('open-location-modal'))"
new_btn = "setShowModal(true)"
content = content.replace(old_btn, new_btn)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement successful")
