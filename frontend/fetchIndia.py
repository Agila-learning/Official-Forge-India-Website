import urllib.request
import re

url = 'https://raw.githubusercontent.com/Samarth-2561/india-svg-map/master/india.svg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    svg = response.read().decode('utf-8')

svg = svg.replace('<svg ', '<svg fill="#FFC107" ')
svg = re.sub(r'fill="[^"]+"', 'fill="#FFC107"', svg)
svg = re.sub(r'stroke="[^"]+"', 'stroke="none"', svg)

with open('public/india-map.svg', 'w', encoding='utf-8') as f:
    f.write(svg)

print('Successfully downloaded and colored india-map.svg from Github')
